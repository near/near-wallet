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
            `SELECT 
                    hash, signer_id, receiver_id, block_hash, 
                    block_timestamp, action_type as kind, action_args as args
            from 
                (SELECT hash, signer_id,  receiver_id, block_hash,  block_timestamp
                    FROM  transactions
                    WHERE  signer_id = :accountId OR receiver_id = :accountId
                    ORDER BY block_timestamp DESC
                    LIMIT :offset ,:count) as transactions
                    LEFT JOIN actions ON actions.transaction_hash = transactions.hash
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
    
    return tx
}
