import * as rudderanalytics from 'rudder-sdk-js';

import { IS_MAINNET } from '../../config';
import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet';

export let rudderAnalyticsReady = false;
const DATA_PLANE_URL = 'https://nearpavelsqp.dataplane.rudderstack.com';

export const initAnalytics = () => {
    return new Promise((resolve) => {
        if (rudderAnalyticsReady) {
            return;
        }
      
        const rudderAnalyticsKey = IS_MAINNET
            ? '2RPBJoVn6SRht1E7FnPEZLcpNVh'
            : '2RPBBhH1Dka2bYG6HKQmvkzNUdz';
    
        rudderanalytics.load(rudderAnalyticsKey, DATA_PLANE_URL);
        rudderanalytics.ready(() => {
            rudderAnalyticsReady = true;
            resolve();
        }); 
    });
};

export const recordWalletMigrationEvent = (eventLabel, properties = {}) => {
    if (!rudderAnalyticsReady) {
        return;
    }

    try {
        const accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID);
        rudderanalytics.track(eventLabel, { ...properties, userId: accountId });
    } catch (e) {
        console.error(e);
    }
};

export const recordWalletMigrationState = (traits = {}, fallBackAccountId) => {
    if (!rudderAnalyticsReady) {
        return;
    }

    try {
        const accountId = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || fallBackAccountId;
        rudderanalytics.identify(
            accountId,
            {
                ...traits,
                userAgent: navigator?.userAgent || 'Unknown',
            },
        );
    } catch (e) {
        console.error(e);
    }
};

export const resetUserState = () => {
    if (!rudderAnalyticsReady) {
        return;
    }
    return rudderanalytics.reset();
};
