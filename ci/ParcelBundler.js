const fs = require('fs');
const path = require('path');

const Bundler = require('parcel-bundler');

const DIST_PATH = path.join(__dirname, '../dist');
const ENTRY_FILE_PATH = path.join(__dirname, '../src/index.html');
const WASM_PATH = path.join(__dirname, '../src/wasm/');
const SSL_PATH = path.join(__dirname, '../devServerCertificates/');

const IS_RENDER = process.env.RENDER === 'true';
const IS_NETLIFY = process.env.NETLIFY === 'true';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const CLOUDFLARE_BASE_URL = process.env.CLOUDFLARE_BASE_URL || 'https://content.near-wallet.workers.dev';
const SHOULD_USE_CLOUDFLARE = process.env.USE_CLOUDFLARE === 'true';

const enableDebugLogging = !process.env.DEBUG_BUILD ? true : process.env.DEBUG_BUILD === 'true';

class ParcelBundler {
    constructor({
        outDir = DIST_PATH,
        entryPath = ENTRY_FILE_PATH,
        wasmSourcePath = WASM_PATH,
        sslPath = SSL_PATH,
        cloudflareBaseUrl = CLOUDFLARE_BASE_URL,
        shouldUseCloudflare = SHOULD_USE_CLOUDFLARE,
        isDebug = enableDebugLogging,
        isRender = IS_RENDER,
        isNetlify = IS_NETLIFY,
        isDevelopment = IS_DEVELOPMENT,
    } = {}) {
        this.entryPath = entryPath;
        this.outDir = outDir;
        this.wasmSourcePath = wasmSourcePath;
        this.sslPath = sslPath;
        this.isDebug = isDebug;
        this.isRender = isRender;
        this.isNetlify = isNetlify;
        this.isDevelopment = isDevelopment;
        this.cloudflareBaseUrl = cloudflareBaseUrl;
        this.shouldUseCloudflare = shouldUseCloudflare;

        this.debugLog('Environment', {
            isDevelopment,
            isRender,
            isNetlify
        });
    }

    debugLog(...args) {
        this.isDebug && console.log(...args);

    }

    getBaseConfig() {
        return {
            outDir: this.outDir,
            outFile: 'index.html',
            logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
            watch: this.isDevelopment,
            hmr: this.isDevelopment,
            sourceMaps: true,
            detailedReport: false,
            autoInstall: true,
        };

    }

    buildOutputPath(filename) {
        return path.join(this.outDir, filename);
    }

    buildWasmSourcePath(filename) {
        return path.join(this.wasmSourcePath, filename);
    }

    buildSslPath(filename) {
        return path.join(this.sslPath, filename);
    }

    buildCloudflarePath(path) {
        return new URL(path, this.cloudflareBaseUrl).toString();
    }

    composeRenderBuildConfig() {
        const isPullRequestPreview = process.env.IS_PULL_REQUEST === 'true';
        const isTestnet = !isPullRequestPreview;
        const externalUrl = process.env.RENDER_EXTERNAL_URL;

        this.debugLog('Render Environment', {
            isPullRequestPreview,
            isTestnet,
            externalUrl,
        });

        if (isPullRequestPreview) {
            // TODO: Create render PR link
            const prNumber = externalUrl.match(/^http[s]?:\/\/near-wallet-pr-(\d+)\.onrender\.com/g);

            if (!prNumber) {
                throw new Error(`Could not identify PR number from externalURL: ${externalUrl}`);
            }

            return {
                ...this.getBaseConfig(),
                publicUrl: this.buildCloudflarePath(`/render/pr/${prNumber[1]}/`)
            };
        }

        return {
            ...this.getBaseConfig(),
            publicUrl: this.buildCloudflarePath('/render/testnet/')
        };
    }

    composeNetlifyBuildConfig() {
        const buildContext = process.env.CONTEXT; // production | deploy-preview | branch-deploy
        const primeUrl = process.env.DEPLOY_PRIME_URL;
        const pullRequestId = process.env.REVIEW_ID;
        const branchName = process.env.BRANCH;

        this.debugLog('Netlify Environment', {
            buildContext,
            primeUrl,
            branchName,
            pullRequestId,
        });

        switch (buildContext) {
        case 'production':
            // TODO: Create netlify PR deploy preview link
            if (primeUrl.contains('near-wallet-staging')) {
                // Netlify staging is a dedicated deployment using 'master' as the production branch
                return {
                    ...this.getBaseConfig(),
                    publicUrl: this.buildCloudflarePath(`/ntl/staging/${pullRequestId}/`)
                };
            }

            // Netlify production/mainnet is a dedicated deployment using 'stable' as the production branch
            return {
                ...this.getBaseConfig(),
                publicUrl: this.buildCloudflarePath(`/ntl/mainnet/`)
            };

        case 'branch-deploy':
            // TODO: Create netlify branch link
            return {
                ...this.getBaseConfig(),
                publicUrl: this.buildCloudflarePath(`/ntl/branch/${branchName}/`)
            };
        case 'deploy-preview':
            // TODO: Create netlify PR deploy preview link
            return {
                ...this.getBaseConfig(),
                publicUrl: this.buildCloudflarePath(`/ntl/preview/${pullRequestId}/`)
            };
        default:
            throw new Error('Could not identify Netlify build environment');
        }
    }

    composeBundlerConfig() {
        const { isRender, isNetlify, isDevelopment } = this;

        if (isDevelopment || !this.shouldUseCloudflare) {
            return { ...this.getBaseConfig(), publicUrl: '/' };
        }

        if (isNetlify) {
            return this.composeNetlifyBuildConfig(this.baseConfig);
        }

        if (isRender) {
            return this.composeRenderBuildConfig(this.baseConfig);
        }

        console.error('Could not identify build environment', { isRender, isNetlify, isDevelopment });
        throw new Error('Unknown environment for build');
    }

    initializeBundlerInstance() {
        const bundlerConfig = this.composeBundlerConfig();

        this.debugLog('entryPath', this.entryPath);
        this.debugLog('bundlerConfig', bundlerConfig);
        this.bundler = new Bundler(this.entryPath, bundlerConfig);
        this.bundler.on('bundled', (bundle) => {
            fs.copyFileSync(this.buildWasmSourcePath('multisig.wasm'), this.buildOutputPath('multisig.wasm'));
            fs.copyFileSync(this.buildWasmSourcePath('main.wasm'), this.buildOutputPath('main.wasm'));
        });

        return this.bundler;
    }

    async bundle() {
        const { isDevelopment } = this;

        if (isDevelopment) {
            // FIXME: Why does HMR not work with this configuration?
            // Watch mode with custom dev SSL certs
            await this.bundler.serve(undefined, {
                cert: this.buildSslPath('primary.crt'),
                key: this.buildSslPath('private.pem')
            });
        } else {
            await this.bundler.bundle();
        }
    }
}

module.exports = ParcelBundler;