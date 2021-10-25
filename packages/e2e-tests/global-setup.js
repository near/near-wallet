const { BN } = require("bn.js");
const { formatNearAmount } = require("near-api-js/lib/utils/format");
const testDapp = require("./testDapp/server");
const { getBankAccount } = require("./utils/account");
const { testDappPort } = require("./utils/config");

module.exports = async () => {
    const { total: bankStartBalance } = await getBankAccount().then((acc) => acc.getUpdatedBalance());
    process.env.bankStartBalance = bankStartBalance;
    const testDappServer = await testDapp.listen(testDappPort, () => {
        console.log(`Test dapp started and Listening on port ${testDappPort}`);
    });
    return async () => {
        if (process.env.bankStartBalance) {
            const { total: bankEndBalance } = await getBankAccount().then((acc) => acc.getUpdatedBalance());
            const amountSpent = new BN(process.env.bankStartBalance).sub(new BN(bankEndBalance)).toString();
            console.log(`Amount spent in test run: ${formatNearAmount(amountSpent)} Ⓝ`);
        }
        await testDappServer.close();
    };
};
