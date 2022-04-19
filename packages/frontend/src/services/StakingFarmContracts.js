import {
    wallet
} from '../utils/wallet';

// Staking Farm Contract
// https://github.com/referencedev/staking-farm/
export default class StakingFarmContracts {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare');

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
}
