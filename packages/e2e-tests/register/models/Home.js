const { getKeyPairFromSeedPhrase } = require("../../utils/helpers");

class HomePage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/`);
    }
    async clickCreateAccount() {
        await this.page.click(`data-test-id=landingPageCreateAccount`);
    }
    async clickSendButton() {
        await this.page.click(`data-test-id=balancesTab.send`);
    }
    async loginWithKeyPairLocalStorage(accountId, keyPair) {
        const serializedKeyPair = keyPair.toString();
        await this.page.evaluate(
            async ([accountId, serializedKeyPair]) => {
                window.localStorage.setItem(
                    `nearlib:keystore:${accountId}:default`,
                    serializedKeyPair
                );
                window.localStorage.setItem(
                    `_4:wallet:active_account_id_v2`,
                    accountId
                );
                window.localStorage.setItem(
                    `_4:wallet:accounts_v2`,
                    JSON.stringify({ [accountId]: true })
                );
            },
            [accountId, serializedKeyPair]
        );
    }
    async loginWithSeedPhraseLocalStorage(accountId, seedPhrase) {
        await this.loginWithKeyPairLocalStorage(
            accountId,
            getKeyPairFromSeedPhrase(seedPhrase)
        );
    }
}
module.exports = { HomePage };
