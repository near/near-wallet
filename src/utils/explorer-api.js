import { Wampy } from 'wampy'
import { wallet, ACCOUNT_HELPER_URL } from './wallet'

const WAMP_NEAR_EXPLORER_URL = process.env.WAMP_NEAR_EXPLORER_URL || 'wss://near-explorer-wamp.onrender.com/ws'
const WAMP_NEAR_EXPLORER_TOPIC_PREFIX = process.env.WAMP_NEAR_EXPLORER_TOPIC_PREFIX || 'com.nearprotocol.testnet.explorer'

const wamp = new Wampy(WAMP_NEAR_EXPLORER_URL, { realm: 'near-explorer' })

export const queryExplorer = (sql, params) => new Promise((resolve, reject) => wamp.call(
    `${WAMP_NEAR_EXPLORER_TOPIC_PREFIX}.select`,
    [ sql, params ],
    {
        onSuccess(dataArr) {
            resolve(dataArr[0]);
        },
        onError(...args) {
            console.log(args)
            reject(args);
        }
    }
));

export async function getTransactions(accountId) {
    if (!accountId) return {}

    const txs = await fetch(`${ACCOUNT_HELPER_URL}/account/${accountId}/activity`).then((res) => res.json())

    return {
        [accountId]: txs.map((t, i) => ({
            ...t,
            kind: t.action_kind.split('_').map(s => s.substr(0, 1) + s.substr(1).toLowerCase()).join(''),
            block_timestamp: parseInt(t.block_timestamp.substr(0, 13), 10),
            hash_with_index: t.action_index + ':' + t.hash,
            checkStatus: !(i && t.hash === txs[i - 1].hash)
        }))
    }
}



export const transactionExtraInfo = (hash, signer_id) => wallet.connection.provider.sendJsonRpc('tx', [hash, signer_id])

