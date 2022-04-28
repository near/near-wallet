import BN from 'bn.js';
import sha256 from 'js-sha256';
import { Account, Connection, InMemorySigner, KeyPair } from 'near-api-js';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { BinaryReader } from 'near-api-js/lib/utils/serialize';

import { USE_INDEXER_SERVICE } from '../../../../features';
import {
    ACCOUNT_HELPER_URL,
    LOCKUP_ACCOUNT_ID_SUFFIX,
    MIN_BALANCE_FOR_GAS,
    REACT_APP_USE_TESTINGLOCKUP,
} from '../config';
import { listStakingDeposits } from '../services/indexer';
import StakingFarmContracts from '../services/StakingFarmContracts';
import { WalletError } from './walletError';

// TODO: Should gas allowance be dynamically calculated
export const LOCKUP_MIN_BALANCE_OLD = new BN(parseNearAmount('35'));
export const LOCKUP_MIN_BALANCE = new BN(parseNearAmount('3.5'));
const LOCKUP_CONTRACT_CODE_HASH_PR_MAP = {
    // Mapping of all PR #s that change lockup_contract.wasm on https://github.com/near/core-contracts to code_hashes
    '9j5n82GyE1fkc4jm85V3uBHTYbn93DwPRGGkrsLQWUaW': 16,
    'BadiRegnoDgvjDBMqnq7whiRHoKE46gtT27kbYsJVvMP': 52,
    'G7t5rWNeRXpgvYcQoSQdPfvWL5pUdrZffsNanVTSedKQ': 60,
    '7jdaTDyAWNuWSVtLNN3fH2sSCq12F8SLcvXcyEa6pxJA': 70,
    'GCK4k18aUyAbQNLGGFpbDkJ726SSyi8HZb7CH4tDmwHm': 89,
    '5FNwsNzPKw1jiPn8onmifVEypBKqT3SBbHTyPSnmToq1': 94,
    '7286f6VhhjF6gKqZppQbf8ZeXCaXU7Mqu4ESA7JsuuAe': 96,
    '3kVY9qcVRoW3B5498SMX6R3rtSLiCdmBzKs7zcnzDJ7Q': 106,
    'Cw7bnyp4B6ypwvgZuMmJtY6rHsxP2D4PC8deqeJ3HP7D': 136,
    '3kSoLAJpMjyHtG1s45YBbAM4vXwgGj5vFAJ4AQWcwCN9': 151
};

const BASE_GAS = new BN('25000000000000');

export function decorateWithLockup(account) {
    // TODO: Use solution without hacky mix-in inheritance
    // TODO: Looks like best if near-api-js allows to specify transaction middleware

    let decorated = {...account, wrappedAccount: account, signAndSendTransaction, getAccountBalance, transferAllFromLockup, deleteLockupAccount };
    decorated.__proto__ = account.__proto__;
    return decorated;
}

async function signAndSendTransaction(signAndSendTransactionOptions) {
    const { available: balance } = await this.wrappedAccount.getAccountBalance();
    const { actions } = signAndSendTransactionOptions;

    // TODO: Extract code to compute total cost of transaction
    const total = actions.map((action) => action?.transfer?.deposit || action?.functionCall?.deposit)
        .filter((deposit) => !!deposit)
        .map((str) => new BN(str))
        .reduce((a, b) => a.add(b), new BN('0'));

    const missingAmount = total.sub(new BN(balance)).add(new BN(MIN_BALANCE_FOR_GAS));
    const lockupAccountId = getLockupAccountId(this.accountId);
    if (missingAmount.gt(new BN(0)) && (await accountExists(this.connection, lockupAccountId))) {
        console.warn('Not enough balance on main account, checking lockup account', lockupAccountId);    
        await this.transferAllFromLockup(missingAmount);
    }

    return await this.wrappedAccount.signAndSendTransaction.call(this, signAndSendTransactionOptions);
}

async function deleteLockupAccount(lockupAccountId) {
    console.info('Destroying lockup account to claim remaining funds', lockupAccountId);
    const newKeyPair = KeyPair.fromRandom('ed25519');
    await this.wrappedAccount.functionCall({
        contractId: lockupAccountId,
        methodName: 'add_full_access_key',
        args: {
            new_public_key: newKeyPair.publicKey.toString(),
        },
        gas: BASE_GAS.mul(new BN(2)),
    });

    const tmpKeyStore = new InMemoryKeyStore();
    await tmpKeyStore.setKey(this.connection.networkId, lockupAccountId, newKeyPair);
    const tmpConnection = new Connection(this.connection.networkId, this.connection.provider, new InMemorySigner(tmpKeyStore));
    const lockupAccount = new Account(tmpConnection, lockupAccountId);
    await lockupAccount.deleteAccount(this.accountId);
}

export async function transferAllFromLockup(missingAmount) {
    let lockupAccountId = getLockupAccountId(this.accountId);
    if (!(await this.wrappedAccount.viewFunction(lockupAccountId, 'are_transfers_enabled'))) {
        await this.wrappedAccount.functionCall({
            contractId: lockupAccountId,
            methodName: 'check_transfers_vote',
            gas: BASE_GAS.mul(new BN(3)),
        });
    }

    const poolAccountId = await this.wrappedAccount.viewFunction(lockupAccountId, 'get_staking_pool_account_id');
    if (poolAccountId) {
        await this.wrappedAccount.functionCall({
            contractId: lockupAccountId,
            methodName: 'refresh_staking_pool_balance',
            gas: BASE_GAS.mul(new BN(3)),
        });
    }

    let liquidBalance = new BN(await this.wrappedAccount.viewFunction(lockupAccountId, 'get_liquid_owners_balance'));

    if (missingAmount && !liquidBalance.gt(missingAmount)) {
        throw new WalletError('Not enough tokens.', 'signAndSendTransactions.notEnoughTokens');
    }
    
    if (liquidBalance.gt(new BN(0))) {
        console.info('Attempting to transfer from lockup account ID:', lockupAccountId);
        await this.wrappedAccount.functionCall({
            contractId: lockupAccountId,
            methodName: 'transfer',
            args: {
                // NOTE: Move all the liquid tokens to minimize transactions in the long run
                amount: liquidBalance.toString(),
                receiver_id: this.wrappedAccount.accountId,
            },
            gas: BASE_GAS.mul(new BN(2)),
        });
    }

    const lockedBalance = new BN(await this.wrappedAccount.viewFunction(lockupAccountId, 'get_locked_amount'));
    if (lockedBalance.eq(new BN(0))) {
        const stakingPoolBalance = await this.wrappedAccount.viewFunction(lockupAccountId, 'get_known_deposited_balance');
        const hasUnclaimedTokenRewards =
            poolAccountId &&
            (await StakingFarmContracts.hasUnclaimedRewards({
                contractName: poolAccountId,
                account_id: lockupAccountId,
                from_index: 0,
                limit: 300,
            }));
        if (!new BN(stakingPoolBalance).eq(new BN(0)) || hasUnclaimedTokenRewards) {
            throw new WalletError('Staking pool balance detected.', 'lockup.transferAllWithStakingPoolBalance');
        }

        if (poolAccountId) {
            await this.wrappedAccount.functionCall({
                contractId: lockupAccountId,
                methodName: 'unselect_staking_pool',
                gas: BASE_GAS.mul(new BN(2)),
            });
        }

        await this.deleteLockupAccount(lockupAccountId);
    }
}

// TODO: Refactor into near-api-js
async function accountExists(connection, accountId) {
    try {
        await new Account(connection, accountId).state();
        return true;
    } catch (error) {
        if (error.toString().indexOf('does not exist while viewing') !== -1) {
            return false;
        }
        throw error;
    }
}

export function getLockupAccountId(accountId) {
    if (REACT_APP_USE_TESTINGLOCKUP && accountId.length < 64) {
        return `testinglockup.${accountId}`;
    }
    return sha256(Buffer.from(accountId)).substring(0, 40) + '.' + LOCKUP_ACCOUNT_ID_SUFFIX;
}

function subtractReservedForGas(balance) {
    const availableBalance = new BN(balance).sub(new BN(MIN_BALANCE_FOR_GAS));
    return availableBalance.isNeg() ? '0' : availableBalance.toString();
}

export function getLockupMinBalanceForStorage(code_hash) {
    return LOCKUP_CONTRACT_CODE_HASH_PR_MAP[code_hash] <= 151 ? LOCKUP_MIN_BALANCE_OLD : LOCKUP_MIN_BALANCE;
}

async function getAccountBalance(limitedAccountData = false) {
    const balance = await this.wrappedAccount.getAccountBalance();

    if (limitedAccountData) {
        return {
            ...balance,
            balanceAvailable: subtractReservedForGas(balance.available),
        };
    }

    let stakingDeposits;
    if (USE_INDEXER_SERVICE) {
        stakingDeposits = await listStakingDeposits(this.accountId);
    } else {
        stakingDeposits = await fetch(ACCOUNT_HELPER_URL + '/staking-deposits/' + this.accountId).then((r) => r.json());
    }
    let stakedBalanceMainAccount = new BN(0);
    await Promise.all(
        stakingDeposits.map(async ({ validator_id }) => {
            const validatorBalance = new BN(await this.wrappedAccount.viewFunction(validator_id, 'get_account_total_balance', { account_id: this.accountId }));
            stakedBalanceMainAccount = stakedBalanceMainAccount.add(validatorBalance);
        })
    );

    // TODO: Should lockup contract balance be retrieved separately only when needed?
    let lockupAccountId = getLockupAccountId(this.accountId);
    console.log('lockupAccountId', lockupAccountId);
    try {
        const lockupAccount = new Account(this.connection, lockupAccountId);
        const lockupBalance = await lockupAccount.getAccountBalance();
        const {
            lockupAmount,
            releaseDuration,
            transferInformation,
            lockupTimestamp,
            lockupDuration,
            terminationWithdrawnTokens,
            vestingInformation
        } = await viewLockupState(this.connection, lockupAccountId);

        const dateNowBN = new BN(Date.now()).mul(new BN('1000000'));

        const { transfer_poll_account_id, transfers_timestamp } = transferInformation;
        let transfersTimestamp = transfer_poll_account_id ? await this.viewFunction(transfer_poll_account_id, 'get_result') : transfers_timestamp;
        let areTransfersEnabled = !!transfersTimestamp;
        transfersTimestamp = transfersTimestamp || (Date.now() * 1000000).toString();
        const { code_hash: lockupContractCodeHash } = await lockupAccount.state();

        const hasBrokenTimestamp = LOCKUP_CONTRACT_CODE_HASH_PR_MAP[lockupContractCodeHash] < 136;

        const startTimestampBN = BN.max(
            new BN(transfersTimestamp).add(new BN(lockupDuration || 0)),
            new BN(lockupTimestamp || 0)
        );

        let lockedAmount;
        if (startTimestampBN.lte(dateNowBN)) {
            const releaseDurationBN = new BN(releaseDuration || '0');
            const endTimestamp = (hasBrokenTimestamp ? new BN(transfersTimestamp) : startTimestampBN).add(releaseDurationBN);
            const timeLeft = BN.max(new BN(0), endTimestamp.sub(dateNowBN));

            const unreleasedAmount = dateNowBN.lte(endTimestamp)
                ? startTimestampBN.lte(dateNowBN)
                    ? new BN(lockupAmount).mul(timeLeft).div(releaseDurationBN)
                    : new BN(lockupAmount)
                : new BN('0');

            let unvestedAmount = new BN('0');

            if (vestingInformation) {
                if (vestingInformation.unvestedAmount) {
                    unvestedAmount = vestingInformation.unvestedAmount;
                } else if (vestingInformation.vestingStart) {
                    if (dateNowBN.lt(vestingInformation.vestingCliff)){
                        unvestedAmount = new BN(lockupAmount);
                    } else if (dateNowBN.gte(vestingInformation.vestingEnd)) {
                        unvestedAmount = new BN(0);
                    } else {
                        let timeLeft = vestingInformation.vestingEnd.sub(dateNowBN);
                        let totalTime = vestingInformation.vestingEnd.sub(
                            vestingInformation.vestingStart
                        );
                        unvestedAmount = new BN(lockupAmount).mul(timeLeft).div(totalTime);
                    }
                }
            }

            lockedAmount = BN.max(unreleasedAmount.sub(new BN(terminationWithdrawnTokens)), unvestedAmount);
        } else {
            lockedAmount = new BN(lockupAmount).sub(
                new BN(terminationWithdrawnTokens)
            );
        }

        let totalBalance = new BN(lockupBalance.total);
        let stakedBalanceLockup = new BN(0);
        const stakingPoolLockupAccountId = await this.wrappedAccount.viewFunction(lockupAccountId, 'get_staking_pool_account_id');
        let hasUnclaimedTokenBalance = stakingPoolLockupAccountId && await StakingFarmContracts.hasUnclaimedRewards({
            contractName: stakingPoolLockupAccountId,
            account_id: lockupAccountId,
            from_index: 0,
            limit: 300,
        });
        if (stakingPoolLockupAccountId) {
            stakedBalanceLockup = new BN(await this.wrappedAccount.viewFunction(stakingPoolLockupAccountId,
                'get_account_total_balance', { account_id: lockupAccountId }));
            totalBalance = totalBalance.add(stakedBalanceLockup);
        }
        
        const ownersBalance = totalBalance.sub(lockedAmount);

        // if acc is deletable (nothing locked && nothing stake) you can transfer the whole amount ohterwise get_liquid_owners_balance
        const isAccDeletable = lockedAmount.isZero() && stakedBalanceLockup.isZero() && !hasUnclaimedTokenBalance;
        const MIN_BALANCE_FOR_STORAGE = getLockupMinBalanceForStorage(lockupContractCodeHash);
        const liquidOwnersBalanceTransfersEnabled = isAccDeletable
            ? new BN(lockupBalance.total)
            : BN.min(ownersBalance, new BN(lockupBalance.total).sub(new BN(MIN_BALANCE_FOR_STORAGE)));
        const liquidOwnersBalance = areTransfersEnabled ? liquidOwnersBalanceTransfersEnabled : new BN(0);

        const available = BN.max(new BN(0), new BN(balance.available).add(new BN(liquidOwnersBalance)).sub(new BN(MIN_BALANCE_FOR_GAS)));

        return {
            ...balance,
            balanceAvailable: subtractReservedForGas(balance.available),
            available,
            ownersBalance,
            liquidOwnersBalance,
            lockedAmount,
            total: new BN(balance.total).add(new BN(lockedAmount)).add(new BN(ownersBalance)).add(stakedBalanceMainAccount).toString(),
            totalBalance,
            stakedBalanceLockup: stakedBalanceLockup,
            lockupAccountId,
            stakedBalanceMainAccount,
            lockupReservedForStorage: MIN_BALANCE_FOR_STORAGE
        };
    } catch (error) {
        if (error.message.match(/ccount ".+" doesn't exist/) || error.message.includes('does not exist while viewing') || error.message.includes('cannot find contract code for account')) {
            return {
                ...balance,
                balanceAvailable: subtractReservedForGas(balance.available),
                total: new BN(balance.total).add(stakedBalanceMainAccount).toString(),
                stakedBalanceMainAccount,

            };
        }
        throw error;
    }
}

function readOption(reader, f) {
    let x = reader.readU8();
    if (x === 1) {
        return f();
    }
    return null;
}

// NOTE: Taken from account-lookup project
// TODO: Client-library for lockup?
async function viewLockupState(connection, lockupAccountId) {
    const result = await connection.provider.sendJsonRpc('query', {
        request_type: 'view_state',
        finality: 'final',
        account_id: lockupAccountId,
        prefix_base64: Buffer.from('STATE', 'utf-8').toString('base64'),
    });
    let value = Buffer.from(result.values[0].value, 'base64');
    let reader = new BinaryReader(value);
    let owner = reader.readString();
    let lockupAmount = reader.readU128().toString();
    let terminationWithdrawnTokens = reader.readU128().toString();
    let lockupDuration = reader.readU64().toString();
    let releaseDuration = readOption(reader, () => reader.readU64().toString());
    let lockupTimestamp = readOption(reader, () => reader.readU64().toString());
    let tiType = reader.readU8();
    let transferInformation;
    if (tiType === 0) {
        transferInformation = {
            transfers_timestamp: reader.readU64()
        };
    } else {
        transferInformation = {
            transfer_poll_account_id: reader.readString()
        };
    }
    let vestingType = reader.readU8();
    let vestingInformation = null;
    if (vestingType === 1) {
        vestingInformation = { VestingHash: reader.readArray(() => reader.readU8()) };
    } else if (vestingType === 2) {
        let vestingStart = reader.readU64();
        let vestingCliff = reader.readU64();
        let vestingEnd = reader.readU64();
        vestingInformation = { vestingStart, vestingCliff, vestingEnd };
    } else if (vestingType === 3) {
        let unvestedAmount = reader.readU128();
        let terminationStatus = reader.readU8();
        vestingInformation = { unvestedAmount, terminationStatus };
    } else {
        vestingInformation = 'TODO';
    }
    return {
        owner,
        lockupAmount,
        terminationWithdrawnTokens,
        lockupDuration,
        releaseDuration,
        lockupTimestamp,
        transferInformation,
        vestingInformation,
    };
}
