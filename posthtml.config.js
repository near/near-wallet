module.exports = {
    plugins: {
        "posthtml-expressions": {
            locals: {
                WALLET_GA_MEASUREMENT_ID: process.env.WALLET_GA_MEASUREMENT_ID
            }
        }
    }
};
