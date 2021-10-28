const testDapp = require("./testDapp/server");
const { testDappPort } = require("./utils/config");

module.exports = async () => {
    const testDappServer = await testDapp.listen(testDappPort, () => {
        console.log(`Test dapp started and Listening on port ${testDappPort}`);
    });
    return async () => {
        await testDappServer.close();
    };
};
