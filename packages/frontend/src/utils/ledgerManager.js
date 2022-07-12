import { createClient, getSupportedTransport, setDebugLogging } from 'near-ledger-js';

setDebugLogging(false);

window.Buffer = Buffer; // Exists due to `bs58` import

class LedgerManager {
    constructor() {
        this.available = false;
        this.disconnectHandler = (...args) => this.handleDisconnect(...args);
    }

    handleDisconnect(reason) {
        console.log('ledger disconnected', reason);
        this.setLedgerAvailableStatus(false);
    }

    setLedgerAvailableStatus(status) {
        this.available = status;
    }

    disconnectLedger() {
        if (this.transport) {
            if (this.transport.close) {
                console.log('Closing transport');
                try {
                    this.transport.close();
                } catch (e) {
                    console.warn('Failed to close existing transport', e);
                } finally {
                    this.transport.off('disconnect', this.disconnectHandler);
                }
            }
            delete this.transport;
            delete this.client;
            this.setLedgerAvailableStatus(false);
        }
    }

    async connectLedger(disconnectFunction) {
        this.transport = await this.createTransport();
        this.transport.on('disconnect', () => {
            disconnectFunction();
            this.disconnectHandler();
        });

        this.client = await this.createClient(this.transport);

        this.setLedgerAvailableStatus(true);
    }

    async initialize(disconnectFunction) {
        this.disconnectLedger();
        await this.connectLedger(disconnectFunction);
    }

    createClient(...args) {
        return createClient(...args);
    }

    async createTransport() {
        const transport = await getSupportedTransport();
        transport.setScrambleKey('NEAR');
        return transport;
    }
}

export const ledgerManager = new LedgerManager();
