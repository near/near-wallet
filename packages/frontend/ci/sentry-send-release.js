const Config = require('./config');

if (Config.RENDER && Config.SENTRY_AUTH_TOKEN) {
    const { execSync } = require('child_process');

    const system = (command) => {
        let result = execSync(command);
        if (Buffer.isBuffer(result)) {
            result = result.toString('utf-8');
        }
        console.log(result);
    };

    system(`node_modules/.bin/sentry-cli releases files ${Config.SENTRY_RELEASE} upload-sourcemaps dist/`);
    system(`node_modules/.bin/sentry-cli releases set-commits ${Config.SENTRY_RELEASE} --commit "near/near-wallet@${Config.RENDER_GIT_COMMIT}"`);
    system(`node_modules/.bin/sentry-cli releases finalize ${Config.SENTRY_RELEASE}`);
}
