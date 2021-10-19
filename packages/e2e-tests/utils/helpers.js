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

module.exports = {
    generateNUniqueRandomNumbersInRange,
    getKeyPairFromSeedPhrase,
};
