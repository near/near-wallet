module.exports = {
    BRANCH: process.env.BRANCH,
    CLOUDFLARE_BASE_URL: process.env.CLOUDFLARE_BASE_URL || 'https://content.near-wallet.workers.dev',
    CONTEXT: process.env.CONTEXT,
    DEBUG_BUILD: process.env.DEBUG_BUILD,
    DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL,
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_NETLIFY: process.env.NETLIFY === 'true',
    IS_RENDER: process.env.RENDER === 'true',
    IS_PULL_REQUEST: process.env.IS_PULL_REQUEST === 'true',
    RENDER: process.env.RENDER,
    RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
    RENDER_GIT_COMMIT: process.env.RENDER_GIT_COMMIT,
    REVIEW_ID: process.env.REVIEW_ID,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE
        || (process.env.RENDER && `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`)
        || 'development',
    SHOULD_USE_CLOUDFLARE: process.env.USE_CLOUDFLARE === 'true',
};
