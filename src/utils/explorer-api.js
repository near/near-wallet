import autobahn from 'autobahn-browser'

const WAMP_NEAR_EXPLORER_URL = process.env.WAMP_NEAR_EXPLORER_URL || 'wss://near-explorer-wamp.onrender.com/ws'

async function connectWamp(wamp) {
   try {
      return await new Promise((resolve, reject) => {
         wamp.onopen = session => resolve(session)
         wamp.onclose = reason => reject(reason)
         wamp.open()
      });
   } catch (error) {
      throw new Error(`Connection failure`)
   }
}

export async function getTransactions(accountId = '') {
   if (!this.accountId) return null
   if (!accountId) accountId = this.accountId

   const wamp = new autobahn.Connection({
      realm: 'near-explorer',
      transports: [
         {
            url: WAMP_NEAR_EXPLORER_URL,
            type: 'websocket'
         }
      ],
      retry_if_unreachable: true,
      max_retries: Number.MAX_SAFE_INTEGER,
      max_retry_delay: 10
   })

   const wampSession = await connectWamp(wamp)
   if (!wampSession) return

   try {
      const tx = await wampSession.call(
         'com.nearprotocol.testnet.explorer.select',
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
         ]
      )
      return tx.map((t) => ({
         ...t,
         actions: JSON.parse(t.actions)
      }))
   } catch (error) {
      throw new Error(`Failed to call the query function`)
   } finally {
      wamp.close()
   }
}
