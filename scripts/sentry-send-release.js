if (process.env.RENDER) {
    const { SENTRY_RELEASE } = require('../src/utils/sentry');
    const { execSync } = require('child_process');
    console.log(execSync(`node_modules/.bin/sentry-cli releases set-commits --auto ${SENTRY_RELEASE}`));
}
