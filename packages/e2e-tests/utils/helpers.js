const { KeyPair } = require("near-api-js");
const { parseSeedPhrase } = require("near-seed-phrase");
const assert = require("assert");
const { random } = require("lodash");

const generateNUniqueRandomNumbersInRange = ({ from, to }, n) => {
    assert(n <= Math.abs(from - to) + 1, "Range needs to have at least N unique numbers");
    const nums = new Set();
    while (nums.size !== n) {
        nums.add(random(from, to));
    }
    return [...nums];
};

function getKeyPairFromSeedPhrase(seedPhrase) {
    return KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey);
}

function generateTestAccountId() {
    return `twa-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}`;
}

function getTestAccountSeedPhrase(testAccountId) {
    return `${testAccountId} ${process.env.TEST_ACCOUNT_SEED_PHRASE}`;
}

function getWorkerAccountId(workerIndex) {
    return `w${workerIndex}-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}.${process.env.BANK_ACCOUNT}`;
}

function getWorkerAccountRegex(workerIndex) {
    return new RegExp(`w${workerIndex}-[0-9]+-[0-9]+.${process.env.BANK_ACCOUNT}`);
}

function bnComparator(a, b) {
    if (a.lt(b)) {
        return -1;
    } else if (a.eq(b)) {
        return 0;
    } else {
        return 1;
    }
}

module.exports = {
    generateNUniqueRandomNumbersInRange,
    getKeyPairFromSeedPhrase,
    generateTestAccountId,
    getTestAccountSeedPhrase,
    getWorkerAccountId,
    bnComparator,
    getWorkerAccountRegex
};
