import BN from 'bn.js';

import { wallet } from './wallet';

export const getLatestBlock = () => wallet.connection.provider.block({ finality: 'final' });

export const getLatestGasPrice = async () => {
    const latestBlock = await getLatestBlock();
    return latestBlock.header.gas_price;
};

export const getTotalGasFee = async (gas) => {
    const latestGasPrice = await getLatestGasPrice();
    return new BN(latestGasPrice).mul(new BN(gas)).toString();
};

export const formatTGasToYoctoNEAR = (tGas) => new BN(tGas * 10 ** 12).toString();

