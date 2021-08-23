const { getDefaultConfig } = require("../../utils/account");

class LoginPage {
    constructor(page) {
        this.page = page;
    }
    async addNearApiJs() {
        await this.page.addScriptTag({
            url: "https://cdn.jsdelivr.net/npm/near-api-js@0.42.0/dist/near-api-js.js",
        });
    }
    async navigate(dappURL) {
        await this.page.goto(dappURL);
        await this.addNearApiJs();

        const defaultConfig = getDefaultConfig();
        await this.page.evaluate(
            async ([bankAccount, defaultConfig]) => {
                const config = {
                    ...defaultConfig,
                    keyStore:
                        new nearApi.keyStores.BrowserLocalStorageKeyStore(),
                };
                const near = await nearApi.connect(config);
                const wallet = new nearApi.WalletConnection(near);
                await wallet.requestSignIn(bankAccount);
            },
            [process.env.BANK_ACCOUNT, defaultConfig]
        );
    }
    async initializeNearWalletConnection() {
        await this.addNearApiJs();
        const defaultConfig = getDefaultConfig();
        await this.page.evaluate(
            async ([defaultConfig]) => {
                const config = {
                    ...defaultConfig,
                    keyStore:
                        new nearApi.keyStores.BrowserLocalStorageKeyStore(),
                };
                const near = await nearApi.connect(config);
                new nearApi.WalletConnection(near);
            },
            [defaultConfig]
        );
    }
    async allowAccess() {
        await this.page.click(`button:text-matches('allow', 'i')`);
    }
    async denyAccess() {
        await this.page.click(`button:text-matches('deny', 'i')`);
    }
}

module.exports = { LoginPage };
