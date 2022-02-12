const ParcelBundler = require('./ParcelBundler');

async function runBundler() {
    const args = process.argv
        .slice(2)
        .map((arg) => arg.replace('--', ''))
        .reduce((argMap, param) => {
            const [key, value] = param.split('=');
            argMap[key] = value;
            return argMap;
        }, {});

    const bundler = new ParcelBundler(args);

    bundler.initializeBundlerInstance();

    await bundler.bundle();
}

runBundler();