import * as amounts from './amounts';

describe('amounts', () => {
    test('should correctly format to yoctoNEAR', () => {
        expect(amounts.toNear(0)).toBe('0');
        expect(amounts.toNear(1)).toBe('1000000000000000000000000');
        expect(amounts.toNear(2.1)).toBe('2100000000000000000000000');
        expect(amounts.toNear(0.1)).toBe('100000000000000000000000');
        expect(amounts.toNear(0.000000000000000000000001)).toBe('1');
    });

    test('should correctly format from yoctoNEAR', () => {
        expect(amounts.nearTo(0)).toBe('0.00');
        expect(amounts.nearTo(1000000000000000000000000n)).toBe('1.00');
        expect(amounts.nearTo(2000000000000000000000000n)).toBe('2.00');
        expect(amounts.nearTo(10000000000000000000000n)).toBe('0.01');
        expect(amounts.nearTo(11000000000000000000000n, 3)).toBe('0.011');
        expect(amounts.nearTo(100000000000000000000n, 4)).toBe('0.0001');
        expect(amounts.nearTo(1)).toBe('0.00');
    });

    test('should correctly format token amount', () => {
        expect(amounts.formatTokenAmount('329607', 6)).toBe('0.33');
        expect(amounts.formatTokenAmount('329607', 6, 6)).toBe('0.329607');
        expect(amounts.formatTokenAmount('1441951941493024720139950', 24)).toBe('1.44');
        expect(amounts.formatTokenAmount('1441951941493024720139950', 24, 3)).toBe('1.442');
        expect(amounts.formatTokenAmount('1000000000000000000000000', 24)).toBe('1.00');
        expect(amounts.formatTokenAmount('1000000000000000000000000', 24, 4)).toBe('1.0000');
    });

    test('should correctly parse token amount', () => {
        expect(amounts.parseTokenAmount('0.000000000000000000000001', 24)).toBe('1');
        expect(amounts.parseTokenAmount('0.000000000000000000000001', 24, 1)).toBe('1.0');
        expect(amounts.parseTokenAmount('1.44195194149302472013995', 24)).toBe('1441951941493024720139950');
        expect(amounts.parseTokenAmount('1.44195194149302472013995', 24, 3)).toBe('1441951941493024720139950.000');
    });

    test('should correctly remove trailing zeros', () => {
        expect(amounts.removeTrailingZeros('1')).toBe('1');
        expect(amounts.removeTrailingZeros('1.1')).toBe('1.1');
        expect(amounts.removeTrailingZeros('1.10')).toBe('1.1');
        expect(amounts.removeTrailingZeros('1.101')).toBe('1.101');
        expect(amounts.removeTrailingZeros('0.1')).toBe('0.1');
        expect(amounts.removeTrailingZeros('1.0000000000000000000000000001')).toBe('1.0000000000000000000000000001');
        expect(amounts.removeTrailingZeros('1.100000000000000000000000000')).toBe('1.1');
        expect(amounts.removeTrailingZeros('1.00000000000000000000000000')).toBe('1');
    });

    test('should correctly decrease amount by percent', () => {
        expect(amounts.decreaseByPercent(100, 10)).toBe('90');
        expect(amounts.decreaseByPercent(250, 10)).toBe('225');
        expect(amounts.decreaseByPercent(930, 40)).toBe('558');
        expect(amounts.decreaseByPercent(42.2, 15.4)).toBe('36');
        expect(amounts.decreaseByPercent(0.000079630313987476842385, 0.1, 10)).toBe('0.0000795507');
        expect(amounts.decreaseByPercent(0.000079630313987476842385, 0.1, 18)).toBe('0.000079550683673489');
    });

    test('should correctly cut specified amount of decimal places if necessary', () => {
        expect(amounts.toSignificantDecimals(1)).toBe('1');
        expect(amounts.toSignificantDecimals(100)).toBe('100');
        expect(amounts.toSignificantDecimals(100, 3)).toBe('100');
        expect(amounts.toSignificantDecimals('1000000000000000000000000000000000000000000', 3)).toBe('1000000000000000000000000000000000000000000');
        expect(amounts.toSignificantDecimals(1.100000000000000)).toBe('1.1');
        expect(amounts.toSignificantDecimals(1.1, 3)).toBe('1.1');
        expect(amounts.toSignificantDecimals(1.00005, 2)).toBe('1.00005');
        expect(amounts.toSignificantDecimals(1.12345, 2)).toBe('1.12');
        expect(amounts.toSignificantDecimals(1.0123456789, 4)).toBe('1.01234');
        expect(amounts.toSignificantDecimals(0.000050000, 6)).toBe('0.00005');
        expect(amounts.toSignificantDecimals(0.000050003, 6)).toBe('0.000050003');
        expect(amounts.toSignificantDecimals(1.1234567, 6)).toBe('1.123456');
        expect(amounts.toSignificantDecimals(1.001234567, 6)).toBe('1.00123456');
        expect(amounts.toSignificantDecimals(1.000000123456, 6)).toBe('1.000000123456');
        expect(amounts.toSignificantDecimals(1.000000123456000, 6)).toBe('1.000000123456');
        expect(amounts.toSignificantDecimals(1.0000001234, 6)).toBe('1.0000001234');
        expect(amounts.toSignificantDecimals('1.000000000000000000000000000000000012345678', 4)).toBe('1.00000000000000000000000000000000001234');
        expect(amounts.toSignificantDecimals('1.000000000000000000000000000000000012345678')).toBe('1.000000000000000000000000000000000012');
    });

    test('should correctly get specified percent from the amount', () => {
        expect(amounts.getPercentFrom(100, 100)).toBe('100');
        expect(amounts.getPercentFrom(100, 10)).toBe('10');
        expect(amounts.getPercentFrom(100, 60)).toBe('60');
        expect(amounts.getPercentFrom(100, 0)).toBe('0');
        expect(amounts.getPercentFrom(5, 10)).toBe('0.5');
        expect(amounts.getPercentFrom(1, 0.3)).toBe('0.003');
        expect(amounts.getPercentFrom(1, 0.003)).toBe('0.00003');
    });

    test('should correctly validate amount', () => {
        expect(amounts.isValidAmount(0.9)).toBe(true);
        expect(amounts.isValidAmount(1.123)).toBe(true);
        expect(amounts.isValidAmount(123)).toBe(true);
        expect(amounts.isValidAmount(0.9, 1)).toBe(true);
        expect(amounts.isValidAmount(1, 1)).toBe(true);
        expect(amounts.isValidAmount(0.0000001, 1, 7)).toBe(true);
        expect(amounts.isValidAmount(0.000000000000000000000001, 1)).toBe(true);
        expect(amounts.isValidAmount('0.', 1)).toBe(true);
        expect(amounts.isValidAmount(0., 1)).toBe(true);
        expect(amounts.isValidAmount('')).toBe(true);
        expect(amounts.isValidAmount('', 1)).toBe(true);

        expect(amounts.isValidAmount(1.1, 1)).toBe(false);
        expect(amounts.isValidAmount(0.0000001, 1, 6)).toBe(false);
        expect(amounts.isValidAmount(0.0000000000000000000000001, 1)).toBe(false);
        expect(amounts.isValidAmount('a', 1)).toBe(false);
        expect(amounts.isValidAmount('0.a', 1)).toBe(false);
    });

    test('should correctly separate integer part with commas', () => {
        expect(amounts.integerPartWithCommaSeparators('')).toBe('');
        expect(amounts.integerPartWithCommaSeparators('12')).toBe('12');
        expect(amounts.integerPartWithCommaSeparators('0.01')).toBe('0.01');
        expect(amounts.integerPartWithCommaSeparators('12.12')).toBe('12.12');
        expect(amounts.integerPartWithCommaSeparators('3123.12')).toBe('3,123.12');
        expect(amounts.integerPartWithCommaSeparators('123123.12')).toBe('123,123.12');
        expect(amounts.integerPartWithCommaSeparators('123123123.12')).toBe('123,123,123.12');
    });

    test('should correctly format balance', () => {
        expect(amounts.formatBalance('0')).toBe('0');
        expect(amounts.formatBalance('1')).toBe('0.1');
        expect(amounts.formatBalance('1', 2)).toBe('0.01');
        expect(amounts.formatBalance('1', 4)).toBe('0.0001');
        expect(amounts.formatBalance('1', 24)).toBe('0.000000000000000000000001');
        expect(amounts.formatBalance('1000000000000000000000000', 24)).toBe('1');
        expect(amounts.formatBalance('10000000000000000000000000000000000', 24)).toBe('10000000000');
        expect(amounts.formatBalance('123456', 4)).toBe('12.3456');
        expect(amounts.formatBalance('123456', 3)).toBe('123.456');
        expect(amounts.formatBalance('329607', 6)).toBe('0.329607');
        expect(amounts.formatBalance('1441951941493024720139950', 24)).toBe('1.44195194149302472013995');
    });
});

