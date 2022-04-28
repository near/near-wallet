import { Account, Connection } from 'near-api-js';

import { FARMING_VALIDATOR_VERSION, getValidationVersion, MAINNET, TESTNET } from '../utils/constants';
import {
    NETWORK_ID,
    NODE_URL
} from '../config';

// Staking Farm Contract
// https://github.com/referencedev/staking-farm/
export default class StakingFarmContracts {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = new Account(
        Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: {
                type: "JsonRpcProvider",
                args: { url: NODE_URL + "/" },
            },
            signer: {}
        }),
        "dontcare"
    );

    static getFarms({ contractName, from_index, limit }) {
        return this.viewFunctionAccount.viewFunction(
            contractName,
            'get_farms',
            { from_index, limit }
        );
    }

    static getPoolSummary({ contractName }) {
        return this.viewFunctionAccount.viewFunction(
            contractName,
            'get_pool_summary'
        );
    }

    static getUnclaimedRewards({ contractName, account_id, farm_id }) {
        return this.viewFunctionAccount.viewFunction(
            contractName,
            'get_unclaimed_reward',
            { account_id, farm_id }
        );
    }

    static getFarmListWithUnclaimedRewards = async ({ contractName, account_id, from_index, limit }) => {
        const farms = await StakingFarmContracts.getFarms({ contractName, from_index, limit });
        return Promise.all(
            farms.map(({ token_id, farm_id, active }) =>
                StakingFarmContracts.getUnclaimedRewards({ contractName, account_id, farm_id })
                .catch(() => '0')
                .then((balance) => ({
                    token_id,
                    balance,
                    farm_id,
                    active,
                }))
            )
        );
    }

    static isFarmingValidator(accountId) {
        return (
            getValidationVersion(
                NODE_URL.indexOf(MAINNET) > -1 ? MAINNET : TESTNET,
                accountId
            ) === FARMING_VALIDATOR_VERSION
        );
    }

    static hasUnclaimedRewards = async ({
        contractName,
        account_id,
        from_index,
        limit,
    }) => {
        return (
            StakingFarmContracts.isFarmingValidator(contractName) &&
            (await StakingFarmContracts.getFarmListWithUnclaimedRewards({
                contractName,
                account_id,
                from_index,
                limit,
            }).then(
                (farmListWithBalance) =>
                    farmListWithBalance.filter(({ balance }) => +balance > 0)
                        .length > 0
            ))
        );
    };
}
