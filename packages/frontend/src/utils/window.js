import CONFIG from '../config';

export function openNewWindow(url) {
    window.open(url, '_blank');
}

export function openTransactionInExplorer(hash) {
    openNewWindow(`${CONFIG.EXPLORER_URL}/transactions/${hash}`);
}
