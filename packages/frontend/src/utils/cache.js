export default class Cache {
    static CACHE_DB_NAME = 'Cache';

    constructor(
        version = 1,
        storeName = 'unknown',
        indexName = 'unknown'
    ) {
        this.dbVersion = version;
        this.dbPromise = null;
        this.storeName = storeName;
        this.indexName = indexName;
    }

    onCreateScheme = Function.prototype;
    onSuccess = Function.prototype;

    _checkDbOpened() {
        if (this.dbPromise) {
            return;
        }

        throw Error('IndexedDB should be opened');
    }

    _createSchemeDelegate(open) {
        return () => {
            this.onCreateScheme(open);
        };
    }

    async getObjectStore(access = 'readwrite') {
        this._checkDbOpened();
        const db = await this.dbPromise;
        const tx = db.transaction(this.storeName, access);

        return tx.objectStore(this.storeName);
    }

    async getIndexStore(access = 'readwrite') {
        const store = await this.getObjectStore();

        return store.index(this.indexName);
    }

    open() {
        const indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;

        this.dbPromise = new Promise((resolve, reject) => {
            try {
                const open = indexedDB.open(Cache.CACHE_DB_NAME, this.dbVersion);
                open.onupgradeneeded = this._createSchemeDelegate(open);
                open.onsuccess = () => {
                    this.onSuccess(open.result);
                    resolve(open.result);

                    return;
                };

                open.onerror = reject;
            } catch (e) {
                reject(e);
            }
        });
    }

    async close() {
        this._checkDbOpened();
        const db = await this.dbPromise;
        db.close();
    }
}
