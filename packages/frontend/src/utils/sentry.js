import * as Sentry from '@sentry/browser';

import CONFIG from '../config';

const initSentry = () => {
    if (!CONFIG.SENTRY_DSN) {
        return;
    }

    Sentry.init({
        dsn: CONFIG.SENTRY_DSN,
        release: CONFIG.SENTRY_RELEASE,
        beforeSend(event) {
            if (event.request.url.includes('recover-with-link')) {
                delete event.request.url;
            }
            return event;
        },
        beforeBreadcrumb(breadcrumb) {
            if (breadcrumb.category === 'navigation' &&
                (breadcrumb.data.from.includes('recover-with-link') ||
                    breadcrumb.data.to.includes('recover-with-link'))) {
                delete breadcrumb.data;
            }
            return breadcrumb;
        }
    });
};

export default initSentry;
