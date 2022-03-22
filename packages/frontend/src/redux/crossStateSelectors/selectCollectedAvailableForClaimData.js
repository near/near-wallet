import BN from 'bn.js';
import { isEmpty } from 'lodash';
import { createSelector } from 'reselect';

import { selectValidatorsFarmData } from '../slices/staking';
import {
    selectTokensFiatValueUSD,
    selectTokenWhiteList,
} from '../slices/tokenFiatValues';
import { selectAllContractMetadata } from '../slices/tokens';

const collectFarmingData = (...args) => {
    try {
        if (args.some((el) => isEmpty(el))) return [];

        const [
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist,
        ] = args;
        const filteredFarms = Object.keys(validatorsFarmData)
            .reduce((acc, validatorId) => {
                return [...acc, ...validatorsFarmData[validatorId].farmRewards];
            }, [])
            .filter((farm) => farm.active && +farm.balance > 0);

        const collectedBalance = filteredFarms.reduce((acc, farm) => {
            const tokenId = farm.token_id;
            if (acc[tokenId]) {
                return {
                    ...acc,
                    [tokenId]: new BN(acc[tokenId].balance)
                        .add(new BN(farm.balance))
                        .toString(),
                };
            }

            return {
                ...acc,
                [tokenId]: new BN(farm.balance).toString(),
            };
        }, {});

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
        return collectFarmingData(
            validatorsFarmData,
            contractMetadataByContractId,
            tokenFiatValues,
            tokenWhitelist
        );
    }
);
