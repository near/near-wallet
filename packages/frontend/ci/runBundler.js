const ParcelBundler = require('./ParcelBundler');

async function runBundler() {
    const bundler = new ParcelBundler();

    bundler.initializeBundlerInstance();

    await bundler.bundle();
}

runBundler().catch(() => process.exit(1));