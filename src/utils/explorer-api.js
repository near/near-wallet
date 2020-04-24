import { Wampy } from 'wampy'
import { wallet } from './wallet'

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
                    transactions.block_hash, 
                    transactions.block_timestamp, 
                    actions.action_type as kind, 
                    actions.action_args as args,
                    actions.action_index || ':' || transactions.hash as hash_with_index
                FROM 
                    transactions
                LEFT JOIN actions ON actions.transaction_hash = transactions.hash
                WHERE 
                    transactions.signer_id = :accountId 
                    OR transactions.receiver_id = :accountId
                ORDER BY 
                    block_timestamp DESC
                LIMIT 
                    :offset, :count
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
    
    return tx.map((t, i) => ({
        ...t,
        checkStatus: !(i && t.hash === tx[i - 1].hash)
    }))
}

export const transactionExtraInfo = (hash, signer_id) => wallet.connection.provider.sendJsonRpc('tx', [hash, signer_id])
