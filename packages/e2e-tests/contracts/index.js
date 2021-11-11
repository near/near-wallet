const fetch = require("node-fetch");
const { CONTRACT_WASM_URLS } = require("../constants");

const fetchAsBuffer = (url) => fetch(url).then((a) => a.buffer());

const fetchLinkdropContract = () => fetchAsBuffer(CONTRACT_WASM_URLS.LINKDROP);

const fetchLockupContract = ({ v2Wasm } = {}) => fetchAsBuffer(CONTRACT_WASM_URLS[v2Wasm ? "LOCKUP_V2" : "LOCKUP"]);

module.exports = { fetchLinkdropContract, fetchLockupContract };
