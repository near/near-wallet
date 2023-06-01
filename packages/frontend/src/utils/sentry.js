const Sentry = require('@sentry/browser');

const { SENTRY_DSN, SENTRY_RELEASE } = require('../config');

function sanitizeUrl(url) {
    if (!url) {
        return url;
    }

    return encodeURI(decodeURI(url)
        .split('#')[0]
        .replace(/(?:\w{3,12} ){11}(?:\w{3,12})/gi, 'REDACTED')
        .replace(/(ed25519:)?[\w\d]{65,}/gi, 'REDACTED'));
}

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

            event.request.url = sanitizeUrl(event.request.url);
            if (event.request.headers?.Referer) {
                event.request.headers.Referer = sanitizeUrl(event.request.headers.Referer);
            }
            event.breadcrumbs = event.breadcrumbs && event.breadcrumbs.map((breadcrumb) => ({
                ...breadcrumb,
                ...(breadcrumb.data && {
                    data: {
                        ...breadcrumb.data,
                        url: sanitizeUrl(breadcrumb.data?.url),
                    }
                }),
            }));

            return event;
        },
        beforeBreadcrumb(breadcrumb) {
            if (breadcrumb.category === 'navigation') {
                let { from, to } = breadcrumb.data;
                if (from.includes('recover-with-link') || to.includes('recover-with-link')) {
                    delete breadcrumb.data;
                }

                ([from, to] = [from, to].map(sanitizeUrl));
                breadcrumb.data.from = from;
                breadcrumb.data.to = to;
            }
            return breadcrumb;
        }
    });
};

// NOTE: This module needs to be Node.js compatible as it's used in scripts
module.exports = { initSentry };
