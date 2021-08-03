import BN from 'bn.js';

import { 
    formatNearAmount,
    showInYocto,
    formatWithCommas
} from './balance';

const contextZero = '0';
const contextZeroBN = new BN(0);
const contextTiny = '123456';
const contextSmall = "1"+"0".repeat(19);
const contextBig = "1234567"+"0".repeat(21);

/* formatNearAmount */

test('formatNearAmount when given 0', () => {
    expect(formatNearAmount(contextZero)).toBe('0');
});

test('formatNearAmount when given new BN(0)', () => {
    expect(formatNearAmount(contextZeroBN)).toBe('0');
});

test('formatNearAmount when given tiny raw amount', () => {
    expect(formatNearAmount(contextTiny)).toBe('< 0.00001');
});

test('formatNearAmount when given small raw amount', () => {
    expect(formatNearAmount(contextSmall)).toBe('0.00001');
});

test('formatNearAmount when given large raw amount', () => {
    expect(formatNearAmount(contextBig)).toBe('1,234.567');
});

/* showInYocto */

test('showInYocto when given 0', () => {
    expect(showInYocto(contextZero)).toBe('0 yoctoNEAR');
});

test('showInYocto when given new BN(0)', () => {
    expect(showInYocto(contextZeroBN)).toBe('0 yoctoNEAR');
});

test('showInYocto when given tiny raw amount', () => {
    expect(showInYocto(contextTiny)).toBe('123,456 yoctoNEAR');
});

test('showInYocto when given small raw amount', () => {
    expect(showInYocto(contextSmall)).toBe('10,000,000,000,000,000,000 yoctoNEAR');
});

test('showInYocto when given large raw amount above threshold', () => {
    expect(showInYocto(contextBig)).toBe('');
});

/* formatWithCommas */

test('formatWithCommas when given 0', () => {
    expect(formatWithCommas(contextZero)).toBe('0');
});

test('formatWithCommas when given tiny raw amount', () => {
    expect(formatWithCommas(contextTiny)).toBe('123,456');
});

test('formatWithCommas when given small raw amount', () => {
    expect(formatWithCommas(contextSmall)).toBe('10,000,000,000,000,000,000');
});

test('formatWithCommas when given large raw amount above threshold', () => {
    expect(formatWithCommas(contextBig)).toBe('1,234,567,000,000,000,000,000,000,000');
});