const { RENDER, RENDER_GIT_COMMIT, SENTRY_AUTH_TOKEN, SENTRY_RELEASE } = require('../config/settings');

if (RENDER && SENTRY_AUTH_TOKEN) {
    const { execSync } = require('child_process');

    const system = (command) => {
        let result = execSync(command);
        if (Buffer.isBuffer(result)) {
            result = result.toString('utf-8');
        }
        console.log(result);
    };

    system(`node_modules/.bin/sentry-cli releases files ${SENTRY_RELEASE} upload-sourcemaps dist/`);
    system(`node_modules/.bin/sentry-cli releases set-commits ${SENTRY_RELEASE} --commit "near/near-wallet@${RENDER_GIT_COMMIT}"`);
    system(`node_modules/.bin/sentry-cli releases finalize ${SENTRY_RELEASE}`);
}
