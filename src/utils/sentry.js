const Sentry = require('@sentry/browser');

const SENTRY_RELEASE = process.env.SENTRY_RELEASE ||
    (process.env.RENDER &&
        `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`)
    || 'development';

const initSentry = () => Sentry.init({
    dsn: "https://75d1dabd0ab646329fad8a3e7d6c761d@o398573.ingest.sentry.io/5254526",
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

// NOTE: This module needs to be Node.js compatible as it's used in scripts
module.exports = { SENTRY_RELEASE, initSentry };
