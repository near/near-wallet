import Cache from '../../utils/cache';

export class IndexerCache extends Cache {
    static DB_VERSION = 1;
    static STORE_NAME = 'IndexerCache';
    static INDEX_NAME = 'Kind';

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
            IndexerCache.INDEX_NAME, [
                'account.id',
                'account.kind',
            ],
            {
                unique: true
            }
        );
    }

    _getRecord(accountId, kind) {
        return new Promise(async (resolve, reject) => {
            const store = await this.getIndexStore();
            const query = store.get([accountId, kind]);

            query.onsuccess = (event) => {
                resolve(event.target.result);
            };

            query.onerror = reject;
        });
    }

    _addRecord(accountId, kind, data) {
        return new Promise(async (resolve) => {
            const store = await this.getObjectStore();

            const item = {
                account: {
                    id: accountId,
                    kind,
                },
                data
            };

            const request = store.add(item, IDBCursor.primaryKey);
            request.onsuccess = resolve;
        });
    }

    async _updateRecord(accountId, kind, data) {
        return new Promise(async (resolve) => {
            const store = await this.getObjectStore();

            store.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    const { account } = cursor.value;
                    const isFound = account.id === accountId
                        && account.kind === kind;

                    if (isFound) {
                        const updatedData = cursor.value;
                        updatedData.data = data;
                        const request = cursor.update(updatedData);

                        request.onsuccess = resolve;
                    } else {
                        cursor.continue();
                    }
                }
            };
        });
    }

    _shouldUpdate(lastTimestampNs = 0, timeoutNs) {
        const timeNs = new Date().getTime() * 1000000;

        return timeNs - lastTimestampNs >= timeoutNs;
    }

    /**
     * The main idea is save the contract-helper from searching through the entire history of the blockchain.
     * Each next request, we send the last timestamp, while accumulating data on the client.
     */
    async accumulate({
        accountId,
        kind,
        updater,
        timeoutNs
    }) {
        const record = await this._getRecord(accountId, kind);

        try {
            let shouldRestart = false;
            const lastTimestamp = parseInt(record?.data?.timestamp || 0, 10);

            if (this._shouldUpdate(lastTimestamp, timeoutNs)) {
                let { version, lastBlockTimestamp, list = [] } = await updater(lastTimestamp);

                const prev = record?.data?.list || [];

                const onlyUniqValues = new Set(list.concat(prev));
                const updated = {
                    timestamp: lastBlockTimestamp,
                    list: Array.from(onlyUniqValues),
                    version,
                };

                if (Boolean(record)) {
                    // If the version is updated on the helper
                    // we should rescan from the beginning of the blockchain
                    const isVersionChanged = version !== record.data.version;
                    if (isVersionChanged) {
                        record.timestamp = 0;
                        shouldRestart = true;
                    }

                    await this._updateRecord(accountId, kind, updated);
                } else {
                    await this._addRecord(accountId, kind, updated);
                }

                if (shouldRestart) {
                    return this.accumulate({
                        accountId,
                        kind,
                        updater,
                        timeoutNs
                    });
                }

                return updated.list;
            }
        } catch (e) {
            // Updater request or IndexedDB can throw Error
            console.error(e);
        }

        return record.data?.list || [];
    }
}

const cache = new IndexerCache();
cache.open();

export default cache;
