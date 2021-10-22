const fetch = require("node-fetch");

const { getKeyPairFromSeedPhrase } = require("../utils/helpers");
const nearApiJsConnection = require("../utils/connectionSingleton");

const createAccountWithHelper = async (accountId, seedPhrase) => {
    const { publicKey } = getKeyPairFromSeedPhrase(seedPhrase);
    await fetch(`${nearApiJsConnection.config.helperUrl}/account`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            newAccountId: accountId,
            newAccountPublicKey: publicKey.toString(),
        }),
    }).then((res) => res.json());
};

module.exports = {
    createAccountWithHelper,
};
