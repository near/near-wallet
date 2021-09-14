const fetch = require("node-fetch");

const fetchAsBuffer = (url) => fetch(url).then((a) => a.buffer());

const fetchLinkdropContract = () =>
    fetchAsBuffer(
        "https://github.com/near/near-linkdrop/raw/63a4d0c4acbc2ffcf865be2b270c900bea765782/res/linkdrop.wasm"
    );

module.exports = { fetchLinkdropContract };
