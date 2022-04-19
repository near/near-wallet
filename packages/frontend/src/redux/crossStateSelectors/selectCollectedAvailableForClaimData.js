import BN from 'bn.js';
import { isEmpty, some } from 'lodash';
import { createSelector } from 'reselect';

import { selectValidatorsFarmData } from '../slices/staking';
import {
    selectTokensFiatValueUSD,
    selectTokenWhiteList,
} from '../slices/tokenFiatValues';
import { selectAllContractMetadata } from '../slices/tokens';

const collectFarmingData = (args) => {
    try {
        if (some(args, isEmpty)) return [];

        const {
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist,
        } = args;
        const filteredFarms = Object.values(validatorsFarmData)
            .reduce((acc, {farmRewards}) => [...acc, ...farmRewards], []);

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

export default createSelector(
    [
        selectValidatorsFarmData,
        selectAllContractMetadata,
        selectTokensFiatValueUSD,
        selectTokenWhiteList,
    ],
    (
        validatorsFarmData,
        contractMetadataByContractId,
        tokenFiatValues,
        tokenWhitelist
    ) => {
        return collectFarmingData({
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist
        });
    }
);
