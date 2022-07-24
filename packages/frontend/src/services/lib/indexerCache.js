import Cache from '../../utils/cache';

export default class IndexerCache extends Cache {
    static DB_VERSION = 1;
    static STORE_NAME = 'IndexerCache';
    static INDEX_NAME = 'Kind';

    static LIKELY_NFT_KEY = 'likelyNFTs';
    static LIKELY_TOKENS_KEY = 'likelyTokens';
    static UPDATE_REQUEST_INTERVAL = 1000 * 60 * 5;

    constructor() {
        super(
            IndexerCache.DB_VERSION,
            IndexerCache.STORE_NAME,
            IndexerCache.INDEX_NAME
        );
    }

    onCreateScheme = (open) => {
        const store = open.result.createObjectStore(
            IndexerCache.STORE_NAME,
            {
                keyPath: 'id',
                autoIncrement: true
            }
        );

        store.createIndex(
            IndexerCache.INDEX_NAME, ['account.id', 'account.kind'],
            {
                unique: true
            }
        );
    }

    _getRecord(accountId, kind) {
        return new Promise(async (resolve, reject) => {
            const store = await this.getIndexStore();
            const query = store.get([accountId, kind]);

            query.onsuccess = (e) => {
                resolve(e.target.result);
            };

            query.onerror = (e) => {
                reject(null);
            };
        });
    }

    async _addRecord(accountId, kind, data) {
        const store = await this.getObjectStore();

        const item = {
            account: {
                id: accountId,
                kind
            },
            data
        };

        store.add(item, IDBCursor.primaryKey);
    }

    async _updateRecord(accountId, kind, data) {
        return new Promise(async (resolve) => {
            const store = await this.getObjectStore();

            store.openCursor().onsuccess = (e) => {
                const cursor = event.target.result;

                if (cursor) {
                    const { account } = cursor.value;
                    const found = account.id === accountId
                        && account.kind === kind;

                    if (found) {
                        const updateData = cursor.value;
                        updateData.data = data;
                        const request = cursor.update(updateData);

                        request.onsuccess = resolve;
                    } else {
                        cursor.continue();
                    }
                }
            };
        });
    }

    _shouldUpdate(lastTimestamp = 0) {
        const time = new Date().getTime();

        return time - lastTimestamp >= IndexerCache.UPDATE_REQUEST_INTERVAL;
    }

    /**
     * The main idea is to save the indexer from searching through the entire history of the blockchain.
     * Each next request, we send the last timestamp, while accumulating data on the client.
     */
    async accumulate(accountId, kind, updater) {
        const record = await this._getRecord(accountId, kind);
        try {
            const lastTimestamp = record?.data?.timestamp;

            if (this._shouldUpdate(lastTimestamp)) {
                const response = await updater(lastTimestamp);
                const prev = record?.data?.list || [];

                const onlyUniqValues = new Set(response.concat(prev));
                const updated = {
                    timestamp: new Date().getTime(),
                    list: Array.from(onlyUniqValues),
                };

                if (Boolean(record)) {
                    await this._updateRecord(accountId, kind, updated);
                } else {
                    await this._addRecord(accountId, kind, updated);
                }

                return updated.list;
            }
        } catch (e) {
            console.error(e);
        }

        return record.data?.list;
    }
}
