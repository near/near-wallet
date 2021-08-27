const express = require("express");
const path = require("path");

const { getDefaultConfig } = require("../utils/account");

const app = express();

app.use(express.static(__dirname));

app.get("/configData.json", function (req, res) {
    res.json({
        DEFAULT_NEAR_CONFIG: getDefaultConfig(),
        BANK_ACCOUNT: process.env.BANK_ACCOUNT,
    });
});

app.get("/near-api-js.min.js", function (req, res) {
    res.sendFile(
        path.join(
            __dirname,
            "../node_modules/near-api-js/dist/near-api-js.min.js"
        )
    );
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

module.exports = app;
