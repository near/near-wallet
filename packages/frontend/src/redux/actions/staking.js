import { createAsyncThunk } from '@reduxjs/toolkit';
import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';
import { createActions } from 'redux-actions';

import {
    REACT_APP_USE_TESTINGLOCKUP,
    STAKING_GAS_BASE,
    FARMING_CLAIM_GAS,
    FARMING_CLAIM_YOCTO,
    LOCKUP_ACCOUNT_ID_SUFFIX,
    FT_MINIMUM_STORAGE_BALANCE_LARGE
} from '../../config';
import { fungibleTokensService } from '../../services/FungibleTokens';
import { listStakingPools } from '../../services/indexer';
import StakingFarmContracts from '../../services/StakingFarmContracts';
import { getLockupAccountId, getLockupMinBalanceForStorage } from '../../utils/account-with-lockup';
import { showAlert } from '../../utils/alerts';
import {
    MAINNET,
    getValidatorRegExp,
    getValidationVersion,
    FARMING_VALIDATOR_VERSION,
    TESTNET
} from '../../utils/constants';
import { setStakingAccountSelected } from '../../utils/localStorage';
import {
    STAKING_AMOUNT_DEVIATION,
    MIN_DISPLAY_YOCTO,
    ZERO,
    EXPLORER_DELAY,
    ACCOUNT_DEFAULTS,
    getStakingDeposits,
    lockupMethods,
    updateStakedBalance,
    signAndSendTransaction,
    stakingMethods,
    shuffle
} from '../../utils/staking';
import { wallet } from '../../utils/wallet';
import { WalletError } from '../../utils/walletError';
import {
    selectAccountId,
    selectAccountSlice
} from '../slices/account';
import { selectAllAccountsByAccountId } from '../slices/allAccounts';
import {
    selectStakingAccountsMain,
    selectStakingMainAccountId,
    selectStakingLockupAccountId,
    selectStakingAccountsLockup,
    selectStakingAllValidators,
    selectStakingAllValidatorsLength,
    selectStakingContract,
    selectStakingCurrentAccountAccountId,
    selectStakingCurrentAccountbyAccountId,
    selectStakingFindContractByValidatorId,
    selectStakingLockupId
} from '../slices/staking';
import { actions as tokensActions } from '../slices/tokens';
import { getBalance } from './account';

const { fetchToken } = tokensActions;

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount
        }
    },
    Account,
    Contract
} = nearApiJs;

export const { staking } = createActions({
    STAKING: {
        CLEAR_STATE: null,
        GET_ACCOUNTS: null,
        STAKE: {
            LOCKUP: [
                async (lockupId, amount, contract, validatorId) => {
                    const selectedValidatorId = await contract.get_staking_pool_account_id();
                    if (validatorId !== selectedValidatorId) {
                        if (selectedValidatorId !== null) {
                            await signAndSendTransaction({
                                receiverId: lockupId,
                                actions: [
                                    functionCall('unselect_staking_pool', {}, STAKING_GAS_BASE, '0')
                                ],
                            });
                        }
                        await signAndSendTransaction({
                            receiverId: lockupId,
                            actions: [
                                functionCall(
                                    'select_staking_pool',
                                    { staking_pool_account_id: validatorId },
                                    STAKING_GAS_BASE * 3,
                                    '0'
                                ),
                            ],
                        });
                    }
                    return await signAndSendTransaction({
                        receiverId: lockupId,
                        actions: [
                            functionCall(
                                'deposit_and_stake',
                                { amount },
                                STAKING_GAS_BASE * 5,
                                '0'
                            ),
                        ],
                    });
                },
                () => showAlert({ onlyError: true })
            ],
            ACCOUNT: [
                async (validatorId, amount, accountId, contract) => {
                    const result = await signAndSendTransaction({
                        receiverId: validatorId,
                        actions: [
                            functionCall('deposit_and_stake', {}, STAKING_GAS_BASE * 5, amount)
                        ],
                    });
                    // wait for chain/explorer to index results
                    await new Promise((r) => setTimeout(r, EXPLORER_DELAY));
                    await updateStakedBalance(validatorId, accountId, contract);
                    return result;
                },
                () => showAlert({ onlyError: true })
            ],
        },
        UNSTAKE: {
            LOCKUP: [
                async (lockupId, amount) => {
                    if (amount) {
                        return await signAndSendTransaction({
                            receiverId: lockupId,
                            actions: [
                                functionCall('unstake', { amount }, STAKING_GAS_BASE * 5, '0')
                            ],
                        });
                    }
                    return await signAndSendTransaction({
                        receiverId: lockupId,
                        actions: [
                            functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
                        ],
                    });
                },
                () => showAlert({ onlyError: true })
            ],
            ACCOUNT: [
                async (validatorId, amount, accountId, contract) => {
                    let result;
                    if (amount) {
                        result = await signAndSendTransaction({
                            receiverId: validatorId,
                            actions: [
                                functionCall('unstake', { amount }, STAKING_GAS_BASE * 5, '0')
                            ],
                        });
                    } else {
                        result = await signAndSendTransaction({
                            receiverId: validatorId,
                            actions: [
                                functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
                            ],
                        });
                    }
                    // wait for explorer to index results
                    await new Promise((r) => setTimeout(r, EXPLORER_DELAY));
                    await updateStakedBalance(validatorId, accountId, contract);
                    return result;
                },
                () => showAlert({ onlyError: true })
            ],
        },
        WITHDRAW: {
            LOCKUP: [
                async (lockupId, amount) => {
                    let result;
                    if (amount) {
                        result = await signAndSendTransaction({
                            receiverId: lockupId,
                            actions: [
                                functionCall('withdraw_from_staking_pool', { amount }, STAKING_GAS_BASE * 5, '0')
                            ],
                        });
                    } else {
                        result = await signAndSendTransaction({
                            receiverId: lockupId,
                            actions: [
                                functionCall('withdraw_all_from_staking_pool', {}, STAKING_GAS_BASE * 7, '0')
                            ],
                        });
                    }
                    if (result === false) {
                        throw new WalletError('Unable to withdraw pending balance from validator', 'staking.noWithdraw');
                    }
                    return result;
                },
                () => showAlert()
            ],
            ACCOUNT: [
                async (validatorId, amount) => {
                    let result;
                    if (amount) {
                        result = await signAndSendTransaction({
                            receiverId: validatorId,
                            actions: [
                                functionCall('withdraw', { amount }, STAKING_GAS_BASE * 5, '0')
                            ],
                        });
                    } else {
                        result = await signAndSendTransaction({
                            receiverId: validatorId,
                            actions: [
                                functionCall('withdraw_all', {}, STAKING_GAS_BASE * 7, '0')
                            ],
                        });
                    }
                    if (result === false) {
                        throw new WalletError('Unable to withdraw pending balance from validator', 'staking.noWithdraw');
                    }
                    // wait for explorer to index results
                    await new Promise((r) => setTimeout(r, EXPLORER_DELAY));
                    return result;
                },
                () => showAlert()
            ],
        },
        UPDATE_ACCOUNT: async (balance, validators, accountId, validatorDepositMap) => {
            let totalUnstaked = new BN(balance.balanceAvailable);
            if (totalUnstaked.lt(new BN(STAKING_AMOUNT_DEVIATION))) {
                totalUnstaked = ZERO.clone();
            }
            let totalStaked = ZERO.clone();
            let totalUnclaimed = ZERO.clone();
            let totalAvailable = ZERO.clone();
            let totalPending = ZERO.clone();

            await Promise.all(validators.map(async (validator, i) => {
                try {
                    const total = new BN(await validator.contract.get_account_total_balance({ account_id: accountId }));
                    if (total.lte(ZERO)) {
                        validator.remove = true;
                        return;
                    }

                    // try to get deposits from explorer
                    const deposit = new BN(validatorDepositMap[validator.accountId] || '0');
                    validator.staked = await validator.contract.get_account_staked_balance({ account_id: accountId });

                    // rewards (lifetime) = total - deposits
                    validator.unclaimed = total.sub(deposit).toString();
                    if (!deposit.gt(ZERO) || new BN(validator.unclaimed).lt(MIN_DISPLAY_YOCTO)) {
                        validator.unclaimed = ZERO.clone().toString();
                    }

                    validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id: accountId }));
                    if (validator.unstaked.gt(MIN_DISPLAY_YOCTO)) {
                        const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id: accountId });
                        if (isAvailable) {
                            validator.available = validator.unstaked.toString();
                            totalAvailable = totalAvailable.add(validator.unstaked);
                        } else {
                            validator.pending = validator.unstaked.toString();
                            totalPending = totalPending.add(validator.unstaked);
                        }
                    }

                    totalStaked = totalStaked.add(new BN(validator.staked));
                    totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed));
                    const networkId = wallet.connection.provider.connection.url.indexOf(MAINNET) > -1 ? MAINNET : TESTNET;

                    validator.version = getValidationVersion(networkId, validator.accountId);
                } catch (e) {
                    if (e.message.indexOf('cannot find contract code') === -1) {
                        console.warn('Error getting data for validator', validator.accountId, e);
                    }
                }
            }));
            
            // TODO: calculate APY

            return {
                accountId,
                validators: validators.filter((v) => !v.remove),
                selectedValidator: null,
                totalUnstaked: totalUnstaked.toString(),
                totalStaked: totalStaked.toString(),
                totalUnclaimed: (totalUnclaimed.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalUnclaimed).toString(),
                totalPending: totalPending.toString(),
                totalAvailable: (totalAvailable.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalAvailable).toString(),
            };
        },
        UPDATE_LOCKUP: async (contract, account_id, exAccountId, accountId, validators) => {
            // use MIN_LOCKUP_AMOUNT vs. actual storage amount
            const deposited = new BN(await contract.get_known_deposited_balance());
            const { code_hash } = await contract.account.state();
            let totalUnstaked = new BN(await contract.get_owners_balance())
                .add(new BN(await contract.get_locked_amount()))
                .sub(getLockupMinBalanceForStorage(code_hash))
                .sub(deposited);

            // minimum displayable for totalUnstaked 
            if (totalUnstaked.lt(new BN(parseNearAmount('0.002')))) {
                totalUnstaked = ZERO.clone();
            }

            // validator specific
            const selectedValidator = await contract.get_staking_pool_account_id();
            if (!selectedValidator) {
                return {
                    ...ACCOUNT_DEFAULTS,
                    accountId: account_id,
                    totalUnstaked: totalUnstaked.toString(),
                    mainAccountId: exAccountId
                };
            }
            let validator = validators.find((validator) =>
                validator.accountId === selectedValidator
            );

            let totalStaked = ZERO.clone();
            let totalUnclaimed = ZERO.clone();
            let totalAvailable = ZERO.clone();
            let totalPending = ZERO.clone();
            let total;
            const minimumUnstaked = new BN('100'); // 100 yocto

            try {
                total = new BN(await validator.contract.get_account_total_balance({ account_id }));
                if (total.gt(ZERO)) {
                    validator.staked = await validator.contract.get_account_staked_balance({ account_id });
                    validator.unclaimed = total.sub(deposited).toString();
                    validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id }));
                    if (validator.unstaked.gt(minimumUnstaked)) {
                        const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id });
                        if (isAvailable) {
                            validator.available = validator.unstaked.toString();
                            totalAvailable = totalAvailable.add(validator.unstaked);
                        } else {
                            validator.pending = validator.unstaked.toString();
                            totalPending = totalPending.add(validator.unstaked);
                        }
                    }
                } else {
                    validator.remove = true;
                }
                totalStaked = totalStaked.add(new BN(validator.staked || ZERO.clone()));
                totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed || ZERO.clone()));
            } catch (e) {
                if (e.message.indexOf('cannot find contract code') === -1) {
                    console.warn('Error getting data for validator', validator.accountId, e);
                }
            }

            return {
                mainAccountId: exAccountId,
                accountId: account_id,
                validators: !validator.remove ? [validator] : [],
                selectedValidator,
                totalBalance: total.toString(),
                totalUnstaked: totalUnstaked.toString(),
                totalStaked: totalStaked.toString(),
                totalUnclaimed: totalUnclaimed.toString(),
                totalPending: totalPending.toString(),
                totalAvailable: totalAvailable.toString(),
            };
        },
        UPDATE_CURRENT: null,
        GET_LOCKUP: [
            async ({ accountId }) => {
                let lockupId;
                if (REACT_APP_USE_TESTINGLOCKUP && accountId.length < 64) {
                    lockupId = `testinglockup.${accountId}`;
                } else {
                    lockupId = getLockupAccountId(accountId);
                }

                let contract;
                try {
                    await (await new Account(wallet.connection, lockupId)).state();
                    contract = await new Contract(await wallet.getAccount(accountId), lockupId, { ...lockupMethods });
                } catch (e) {
                    return;
                }

                return { contract, lockupId, accountId };
            },
            ({ accountId, isOwner }) => ({ accountId, isOwner })
        ],
        GET_VALIDATORS: async (accountIds, accountId) => {
            const { current_validators, next_validators, current_proposals } = await wallet.connection.provider.validators();
            const currentValidators = shuffle(current_validators).map(({ account_id }) => account_id);
            if (!accountIds) {
                const rpcValidators = [...current_validators, ...next_validators, ...current_proposals].map(({ account_id }) => account_id);

                const networkId = wallet.connection.provider.connection.url.indexOf(MAINNET) > -1 ? MAINNET : TESTNET;
                const allStakingPools = await listStakingPools();
                const prefix = getValidatorRegExp(networkId);
                accountIds = [...new Set([...rpcValidators, ...allStakingPools])]
                    .filter((v) => v.indexOf('nfvalidator') === -1 && (v.match(prefix) || v == 'linear-protocol.testnet'));
            }

            const currentAccount = await wallet.getAccount(accountId);

            return (await Promise.all(
                accountIds.map(async (account_id) => {
                    try {
                        const contract = new Contract(currentAccount, account_id, stakingMethods);
                        const validator = {
                            accountId: account_id,
                            active: currentValidators.includes(account_id),
                            contract
                        };
                        const fee = validator.fee = await validator.contract.get_reward_fee_fraction();
                        fee.percentage = +(fee.numerator / fee.denominator * 100).toFixed(2);
                        const networkId = wallet.connection.provider.connection.url.indexOf(MAINNET) > -1 ? MAINNET : TESTNET;

                        validator.version = getValidationVersion(networkId, validator.accountId);
                        return validator;
                    } catch (e) {
                        console.warn('Error getting fee for validator %s: %s', account_id, e);
                    }
                })
            )).filter((v) => !!v);
        }
    }
});

const handleGetAccounts = () => async (dispatch, getState) => {
    await dispatch(handleGetLockup());

    const accounts = [{
        accountId: wallet.accountId,
        ...selectStakingAccountsMain(getState())
    }];

    if (selectStakingLockupId(getState())) {
        accounts.push({
            accountId: selectStakingLockupId(getState()),
            ...selectStakingAccountsLockup(getState())
        });
    }

    return await dispatch(staking.getAccounts(accounts));
};

export const handleGetLockup = (externalAccountId) => async (dispatch, getState) => {
    try {
        await dispatch(staking.getLockup({
            accountId: externalAccountId || selectAccountId(getState()),
            isOwner: !externalAccountId || externalAccountId === selectAccountId(getState())
        }));
    } catch (e) {
        if (!/No contract for account/.test(e.message)) {
            throw e;
        }
    }
};

export const handleStakingUpdateAccount = (recentlyStakedValidators = [], exAccountId) => async (dispatch, getState) => {
    const { accountId, balance } = exAccountId
        ? selectAllAccountsByAccountId(getState(), { accountId: exAccountId })
        : selectAccountSlice(getState());

    const validatorDepositMap = await getStakingDeposits(accountId);

    if (!selectStakingAllValidatorsLength(getState())) {
        await dispatch(staking.getValidators(null, accountId));
    }

    const validators = selectStakingAllValidators(getState())
        .filter((validator) => Object.keys(validatorDepositMap).concat(recentlyStakedValidators).includes(validator.accountId))
        .map((validator) => ({ ...validator }));

    await dispatch(staking.updateAccount(balance, validators, accountId, validatorDepositMap));
};

export const handleStakingUpdateLockup = (exAccountId) => async (dispatch, getState) => {
    const contract = selectStakingContract(getState());
    const lockupId = selectStakingLockupId(getState());
    const accountId = selectAccountId(getState());

    const validators = selectStakingAllValidators(getState()).map((validator) => ({
        ...validator
    }));

    await dispatch(staking.updateLockup(contract, lockupId, exAccountId, accountId, validators));
};

export const handleStakingAction = (action, validatorId, amount) => async (dispatch, getState) => {
    const accountId = selectStakingMainAccountId(getState());
    const currentAccountId = selectStakingCurrentAccountAccountId(getState());

    const isLockup = currentAccountId.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`);

    if (amount && amount.length < 15) {
        amount = parseNearAmount(amount);
    }
    if (isLockup) {
        const contract = selectStakingContract(getState());
        const lockupId = selectStakingLockupId(getState());
        await dispatch(staking[action].lockup(lockupId, amount, contract, validatorId));
    } else {
        const contract = selectStakingFindContractByValidatorId(getState(), { validatorId });
        await dispatch(staking[action].account(validatorId, amount, accountId, contract));
    }

    await dispatch(getBalance());
    await dispatch(updateStaking(currentAccountId, [validatorId]));
};

export const updateStaking = (currentAccountId, recentlyStakedValidators) => async (dispatch, getState) => {
    await dispatch(handleGetAccounts());
    const accountId = selectStakingMainAccountId(getState());
    const lockupId = selectStakingLockupAccountId(getState());

    await dispatch(staking.getValidators(null, accountId));

    await dispatch(handleStakingUpdateAccount(recentlyStakedValidators));
    if (lockupId) {
        await dispatch(handleStakingUpdateLockup());
    }

    let currentAccount = selectStakingCurrentAccountbyAccountId(getState(), { accountId: currentAccountId });
    
    if (!currentAccount) {
        currentAccount = selectStakingCurrentAccountbyAccountId(getState(), { accountId });
        setStakingAccountSelected(accountId);
    }

    dispatch(staking.updateCurrent({ currentAccount }));
};

export const handleUpdateCurrent = (accountId) => async (dispatch, getState) => {
    let currentAccount = selectStakingCurrentAccountbyAccountId(getState(), { accountId });
    dispatch(staking.updateCurrent({ currentAccount }));
};

export const getValidatorFarmData = createAsyncThunk('staking/getValidatorFarmData', async ({ validator, accountId }, { dispatch }) => {
    if (validator?.version !== FARMING_VALIDATOR_VERSION || !accountId) {
        return;
    }

    const poolSummary = await validator.contract.get_pool_summary();

    const farmList = await StakingFarmContracts.getFarmListWithUnclaimedRewards({
        contractName: validator.contract.contractId,
        account_id: accountId,
        from_index: 0,
        limit: 300,
    });

    try {
        await Promise.all(farmList.map(({ token_id }) => dispatch(fetchToken({ contractName: token_id }))));
    } catch (error) {
        console.error(error);
    }

    const farmData = {
        poolSummary: {...poolSummary},
        farmRewards: {[accountId]: farmList},
    };

    return {
        validatorId: validator.accountId,
        farmData
    };
});

export const claimFarmRewards = (validatorId, token_id) => async (dispatch, getState) => {
    try {
        const accountId = selectStakingMainAccountId(getState());
        const currentAccountId = selectStakingCurrentAccountAccountId(getState());
        const isLockup = currentAccountId.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`);

        const validators = selectStakingAllValidators(getState());
        const validator = { ...validators.find((validator) => validator?.accountId === validatorId)};

        const storageAvailable = await fungibleTokensService.isStorageBalanceAvailable({ 
            contractName: token_id,
            accountId: accountId
        });
        if (!storageAvailable) {
            try {
                const account = await wallet.getAccount(accountId);
                await fungibleTokensService.transferStorageDeposit({
                    account,
                    contractName: token_id,
                    receiverId: accountId,
                    storageDepositAmount: FT_MINIMUM_STORAGE_BALANCE_LARGE
                });
            } catch (e) {
                console.warn(e);
                throw e;
            }
        }

        const args = { token_id };

        if (isLockup) {
            const lockupId = selectStakingLockupId(getState());
            args.delegator_id = lockupId;
        }

        return validator.contract.claim(args, FARMING_CLAIM_GAS, FARMING_CLAIM_YOCTO);
    } catch (error) {
        throw error;
    }
    
};
