import BN from 'bn.js';
import { isEmpty, some } from 'lodash';
import { createSelector } from 'reselect';

import { selectStakingCurrentAccountAccountId, selectValidatorsFarmData } from '../slices/staking';
import {
    selectTokensFiatValueUSD,
    selectTokenWhiteList,
} from '../slices/tokenFiatValues';
import { selectContractsMetadata } from '../slices/tokensMetadata';

const collectFarmingData = (args) => {
    try {
        if (some(args, isEmpty)) return [];

        const {
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist,
            accountId
        } = args;
        const filteredFarms = Object.values(validatorsFarmData)
            .reduce((acc, {farmRewards}) => [...acc, ...(farmRewards?.[accountId] || [])], []);

        const collectedBalance = filteredFarms.reduce((acc, farm) => ({
            ...acc,
            [farm.token_id]: new BN(acc[farm.token_id])
                .add(new BN(farm.balance))
                .toString()
        }), {});

        return Object.keys(collectedBalance).map((tokenId) => ({
            balance: collectedBalance[tokenId],
            isWhiteListed: tokenWhitelist.includes(tokenId),
            fiatValueMetadata: tokenFiatValues[tokenId],
            onChainFTMetadata: contractMetadataByContractId[tokenId],
            contractName: tokenId,
        }));
    } catch (error) {
        console.error(
            'Error during collecting available for claim data',
            error
        );
        return [];
    }
};

const selectCollectedAvailableForClaimData = createSelector(
    [
        selectValidatorsFarmData,
        selectContractsMetadata,
        selectTokensFiatValueUSD,
        selectTokenWhiteList,
        selectStakingCurrentAccountAccountId
    ],
    (
        validatorsFarmData,
        contractMetadataByContractId,
        tokenFiatValues,
        tokenWhitelist,
        accountId
    ) => {
        return collectFarmingData({
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist,
            accountId
        });
    }
);

export const selectCollectedAvailableForClaimDataByAccountId = createSelector(
    [
        selectValidatorsFarmData,
        selectAllContractMetadata,
        selectTokensFiatValueUSD,
        selectTokenWhiteList,
        (state, accountId) => accountId
    ],
    (
        validatorsFarmData,
        contractMetadataByContractId,
        tokenFiatValues,
        tokenWhitelist,
        accountId
    ) => {
        return collectFarmingData({
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist,
            accountId
        });
    }
);

export const selectHasAvailableForClaimForAccountId = createSelector(
    [selectCollectedAvailableForClaimDataByAccountId],
    (farmData) =>
        farmData.filter((tokenData) => +tokenData.balance > 0).length > 0
);

export default selectCollectedAvailableForClaimData;
