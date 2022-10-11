import { EXPLORER_URL } from '../config';

export function openNewWindow(url) {
    window.open(url, '_blank');
}

export function openTransactionInExplorer(hash) {
    openNewWindow(`${EXPLORER_URL}/transactions/${hash}`);
}
