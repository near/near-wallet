if (process.env.RENDER) {
    const { SENTRY_RELEASE } = require('../src/utils/sentry');
    const { execSync } = require('child_process');

    const system = (command) => {
        let result = execSync(command);
        if (Buffer.isBuffer(result)) {
            result = result.toString('utf-8');
        }
        console.log(result);
    };

    system(`node_modules/.bin/sentry-cli releases files ${SENTRY_RELEASE} upload-sourcemaps dist/`);
    system(`node_modules/.bin/sentry-cli releases set-commits --auto ${SENTRY_RELEASE}`);
    system(`node_modules/.bin/sentry-cli releases finalize ${SENTRY_RELEASE}`);
}
