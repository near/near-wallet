

const walletNetwork = process.env.WALLET_NETWORK || "testnet";

const testDappPort = process.env.TEST_DAPP_PORT || 3000;
const testDappURL = `http://localhost:${testDappPort}`;


module.exports = {
  walletNetwork,
  testDappPort,
  testDappURL
}