const Sentry = require('@sentry/browser');

const { SENTRY_DSN, SENTRY_RELEASE } = require('../config');

const initSentry = () => {
    if (!SENTRY_DSN) {
        return;
    }

    Sentry.init({
        dsn: SENTRY_DSN,
        release: SENTRY_RELEASE,
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

// NOTE: This module needs to be Node.js compatible as it's used in scripts
module.exports = { initSentry };
