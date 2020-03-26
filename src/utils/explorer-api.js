import { Wampy } from 'wampy'

const WAMP_NEAR_EXPLORER_URL = process.env.WAMP_NEAR_EXPLORER_URL || 'wss://near-explorer-wamp.onrender.com/ws'
const WAMP_NEAR_EXPLORER_TOPIC_PREFIX = process.env.WAMP_NEAR_EXPLORER_TOPIC_PREFIX || 'com.nearprotocol.testnet.explorer'

const wamp = new Wampy(WAMP_NEAR_EXPLORER_URL, { realm: 'near-explorer' })

export async function getTransactions(accountId = '') {
    if (!this.accountId) return null
    if (!accountId) accountId = this.accountId

    const tx = await new Promise((resolve, reject) => wamp.call(
        `${WAMP_NEAR_EXPLORER_TOPIC_PREFIX}.select`,
        [
            `
                SELECT 
                    transactions.hash,
                    transactions.signer_id, 
                    transactions.receiver_id, 
                    transactions.actions, 
                    transactions.block_hash, 
                    blocks.timestamp as blockTimestamp
                FROM 
                    transactions
                LEFT JOIN blocks ON blocks.hash = transactions.block_hash
                WHERE 
                    signer_id = :accountId 
                    OR receiver_id = :accountId
                ORDER BY blocks.height DESC
                LIMIT :offset, :count
            `,
            { accountId, offset: 0, count: 5 }
        ],
        {
            onSuccess(dataArr) {
                resolve(dataArr[0])
            },
            onError(err) {
                reject(err);
            }
        }
    ));
    return tx.map((t) => ({
        ...t,
        actions: JSON.parse(t.actions)
    }))
}
