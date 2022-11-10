const Big = require("big.js");

function formatAmount(amount, decimals) {
    return Big(amount).div(Big(10).pow(decimals)).toFixed();
}

function parseAmount(amount, decimals) {
    return Big(amount).times(Big(10).pow(decimals)).toFixed();
}

module.exports = {
    formatAmount,
    parseAmount,
};
