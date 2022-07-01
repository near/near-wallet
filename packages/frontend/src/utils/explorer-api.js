import { listRecentTransactions } from '../services/indexer';
import { wallet } from './wallet';

export async function getTransactions({ accountId }) {
    if (!accountId) {
        return {};
    }

    const txs = await listRecentTransactions(accountId);

    return txs.map((t, i) => ({
        ...t,
        kind: t.action_kind.split('_').map((s) => s.substr(0, 1) + s.substr(1).toLowerCase()).join(''),
        block_timestamp: parseInt(t.block_timestamp.substr(0, 13), 10),
        hash_with_index: t.action_index + ':' + t.hash,
        checkStatus: !(i && t.hash === txs[i - 1].hash)
    }));
}

export const transactionExtraInfo = ({ hash, signer_id }) => wallet.connection.provider.sendJsonRpc('tx', [hash, signer_id]);
