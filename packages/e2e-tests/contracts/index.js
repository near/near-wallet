const fetch = require("node-fetch");
const { CONTRACT_WASM_URLS } = require("../constants");

const fetchAsBuffer = (url) => fetch(url).then((a) => a.buffer());

const fetchLinkdropContract = () => fetchAsBuffer(CONTRACT_WASM_URLS.LINKDROP);

module.exports = { fetchLinkdropContract };
