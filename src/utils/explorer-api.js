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
                    transactions.block_hash, 
                    transactions.block_timestamp
                FROM 
                    transactions
                WHERE 
                    signer_id = :accountId 
                    OR receiver_id = :accountId
                ORDER BY block_timestamp DESC
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
    
    await Promise.all(
        tx.map(async t => {
        const actions = await new Promise((resolve, reject) => wamp.call(
            'com.nearprotocol.testnet.explorer.select',
            [
                `SELECT actions.action_type as kind, 
                        actions.action_args as args
                FROM actions
                WHERE actions.transaction_hash = :hash
                ORDER BY actions.action_index`,
                  {
                    hash: t.hash
                  }
            ],
            {
                onSuccess(dataArr) {
                    resolve(dataArr[0])
                },
                onError(err) {
                    reject(err);
                }
            }
            ))
        t.actions = actions.map(action => {
              if (typeof action === "string") {
                return { [action]: {} };
              }
            return {
                [action.kind]: JSON.parse(action.args)
            };
            });
        })
    )
    return tx
}
