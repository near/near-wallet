import Analytics from 'analytics-node';

import { IS_MAINNET } from '../../config';
import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet';

let segment = null;

export const initSegment = () => {
    if (segment) {
        return; // already initialized
    }
  
    const segmentKey = IS_MAINNET
        ? '3EUjxEBOReF6AWiwz1sAXhdyhn38x2a0'
        : 'DSgndJjJhdaQ2GXTKf3VaZzXwDrJyj2d';

    try {
        segment = new Analytics(segmentKey);
    } catch (e) {
        console.error(e);
    }
};

export const recordWalletMigrationEvent = (eventLabel, properties = {}) => {
    if (!segment) {
        return;
    }
    try {
        const accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID);
        segment.track({
            userId: accountId,
            event: eventLabel,
            properties,
        });
    } catch (e) {
        console.error(e);
    }
};

export const recordWalletMigrationState = (traits = {}) => {
    if (!segment) {
        return;
    }
    try {
        const accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID);
        segment.identify({
            userId: accountId,
            traits: {
                ...traits,
                userAgent: navigator?.userAgent || 'Unknown',
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const flushEvents = () => {
    if (!segment) {
        return;
    }
    return segment.flush();
};
