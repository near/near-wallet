import throttle from 'lodash.throttle';

import { Mixpanel } from '../mixpanel';

function runOncePerHourMax(functionToRun) {
    return throttle(
        functionToRun,
        1000 * 60 * 60, //  1 hour in ms
        { leading: true, trailing: false }
    );
}

export const reportUiActiveMixpanelThrottled = runOncePerHourMax(() => {
    return Mixpanel.track('ui is active');
});