import { parseTokenAmount } from '../../utils/amounts';
import * as utils from './utils';

const token0 = {
    id: 'wrap.testnet',
    decimals: 24,
};
const token1 = {
    id: 'usdc.fakes.testnet',
    decimals: 18,
};
const pool0 = {
    total_fee: 20, // 0.2%
    token_account_ids: [token1.id, token0.id],
    amounts: [
        parseTokenAmount(2_000_000, token1.decimals),
        parseTokenAmount(1_000, token0.decimals),
    ],
};

describe('Ref Finance utils', () => {
    test('should correctly calculate fee multiplier', () => {
        expect(utils.getFeeMultiplier(30)).toBe('0.997');
        expect(utils.getFeeMultiplier(300)).toBe('0.97');
        expect(utils.getFeeMultiplier(300.1)).toBe('0.96999');
        expect(utils.getFeeMultiplier(300.2)).toBe('0.96998');
        expect(utils.getFeeMultiplier(3_000)).toBe('0.7');
        expect(utils.getFeeMultiplier(5_000)).toBe('0.5');
        expect(utils.getFeeMultiplier(utils.FEE_DIVISOR)).toBe('0');
        expect(utils.getFeeMultiplier(utils.FEE_DIVISOR + 1)).toBe('0');
        expect(utils.getFeeMultiplier(0)).toBe('1');
        expect(utils.getFeeMultiplier(-1)).toBe('1');
    });

    test('should correctly format total fee percent', () => {
        expect(utils.formatTotalFeePercent(1)).toBe('0.01');
        expect(utils.formatTotalFeePercent(10)).toBe('0.1');
        expect(utils.formatTotalFeePercent(30)).toBe('0.3');
        expect(utils.formatTotalFeePercent(30.5)).toBe('0.305');
        expect(utils.formatTotalFeePercent(300)).toBe('3');
        expect(utils.formatTotalFeePercent(300.8)).toBe('3.008');
        expect(utils.formatTotalFeePercent(3_000)).toBe('30');
        expect(utils.formatTotalFeePercent(utils.FEE_DIVISOR)).toBe('100');
        expect(utils.formatTotalFeePercent(utils.FEE_DIVISOR + 1)).toBe('100');
        expect(utils.formatTotalFeePercent(-1)).toBe('0');
        expect(utils.formatTotalFeePercent(0)).toBe('0');
    });

    test('should correctly calculate output amount for swap', () => {
        expect(
            utils.getAmountOut({
                pool: pool0,
                tokenInId: token0.id,
                tokenInDecimals: token0.decimals,
                amountIn: 10,
                tokenOutId: token1.id,
                tokenOutDecimals: token1.decimals,
            })
        ).toBe('19762.767579556033000000');

        expect(
            utils.getAmountOut({
                // increase fee to 2%
                pool: { ...pool0, total_fee: 200 },
                tokenInId: token0.id,
                tokenInDecimals: token0.decimals,
                amountIn: 10,
                tokenOutId: token1.id,
                tokenOutDecimals: token1.decimals,
            })
        ).toBe('19409.784115666470000000');

        expect(
            utils.getAmountOut({
                pool: pool0,
                tokenInId: token1.id,
                tokenInDecimals: token1.decimals,
                amountIn: 10_000,
                tokenOutId: token0.id,
                tokenOutDecimals: token0.decimals,
            })
        ).toBe('4.965223534562533000000000');
    });

    test('should correctly calculate price impact percentage', () => {
        expect(
            utils.getPriceImpactPercent({
                pool: pool0,
                tokenInId: token1.id,
                tokenInDecimals: token1.decimals,
                amountIn: 10_000,
                tokenOutId: token0.id,
                tokenOutDecimals: token0.decimals,
            })
        ).toBe('0.5');

        expect(
            utils.getPriceImpactPercent({
                pool: pool0,
                tokenInId: token1.id,
                tokenInDecimals: token1.decimals,
                amountIn: 100_000,
                tokenOutId: token0.id,
                tokenOutDecimals: token0.decimals,
            })
        ).toBe('4.75');

        expect(
            utils.getPriceImpactPercent({
                pool: pool0,
                tokenInId: token0.id,
                tokenInDecimals: token0.decimals,
                amountIn: 5,
                tokenOutId: token1.id,
                tokenOutDecimals: token1.decimals,
            })
        ).toBe('0.5');

        expect(
            utils.getPriceImpactPercent({
                pool: pool0,
                tokenInId: token0.id,
                tokenInDecimals: token0.decimals,
                amountIn: 50,
                tokenOutId: token1.id,
                tokenOutDecimals: token1.decimals,
            })
        ).toBe('4.75');

        expect(
            utils.getPriceImpactPercent({
                pool: pool0,
                tokenInId: token0.id,
                tokenInDecimals: token0.decimals,
                amountIn: 0.00001,
                tokenOutId: token1.id,
                tokenOutDecimals: token1.decimals,
            })
        ).toBe('0');
    });
});
