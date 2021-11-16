pipeline {
    agent any
    environment {
        // e2e variables
        BANK_ACCOUNT = 'grumby.testnet'
        BANK_SEED_PHRASE = 'canal pond draft confirm cabin hungry pistol light valley frost dress found'
        TEST_ACCOUNT_SEED_PHRASE = 'grant confirm ritual chuckle control leader frame same ride trophy genuine journey'

        // frontend variables
        FRONTEND_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist"
        FRONTEND_TESTNET_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist_testnet"
        FRONTEND_MAINNET_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist_mainnet"

        // aws configuration
        AWS_REGION = 'us-west-2'

        // s3 buckets
        BUILD_ARTIFACT_BUCKET = 'andy-dev-build-artifacts'
        TESTNET_STATIC_SITE_BUCKET = 'andy-dev-testnet-near-wallet'
        MAINNET_STATIC_SITE_BUCKET = 'andy-dev-mainnet-near-wallet'
        E2E_ARTIFACT_PATH = "$BRANCH_NAME/$CHANGE_ID/e2e-tests"
        FRONTEND_ARTIFACT_PATH = "$BRANCH_NAME/$CHANGE_ID/frontend"

        // package building configuration
        AFFECTED_PACKAGES = 'frontend'.split()
        /* TODO enable once nx is implemented
        AFFECTED_PACKAGES = """${sh(
            returnStdout: true,
            script: 'npx nx affected:apps --plain'
        )}""".trim().split()
        */

        BUILD_E2E = AFFECTED_PACKAGES.contains('e2e-tests')
        BUILD_FRONTEND = AFFECTED_PACKAGES.contains('frontend')
    }
    stages {
        // parallelize builds and tests for modified packages
        stage('packages:build') {
            // if any of the parallel stages for package builds fail, mark the entire pipeline as failed
            failFast true

            // execute package-specific stages in parallel
            parallel {
                // build end-to-end testing package
                stage('e2e-tests') {
                    when {
                        expression { env.BUILD_E2E == 'true' }
                    }
                    stages {
                        stage('e2e-tests:build') {
                            steps {
                                dir("$WORKSPACE/packages/e2e-tests") {
                                    sh 'yarn install'
                                    sh 'yarn test'
                                }
                            }
                        }
                    }
                }

                // build frontend package
                stage('frontend') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' }
                    }
                    stages {
                        stage('frontend:build') {
                            stages {
                                stage('frontend:build:testnet') {
                                    when {
                                        not { branch 'stable' }
                                    }
                                    environment {
                                        TOKEN_CONTRACTS = 'meta.pool.testnet'
                                    }
                                    steps {
                                        dir("$WORKSPACE/packages/frontend") {
                                            sh 'yarn install'
                                            sh 'yarn build'
                                            sh 'yarn test'
                                            sh "rm -rf $FRONTEND_TESTNET_BUNDLE_PATH"
                                            sh "mv $FRONTEND_BUNDLE_PATH $FRONTEND_TESTNET_BUNDLE_PATH"
                                        }
                                    }
                                }
                                stage('frontend:build:mainnet') {
                                    when {
                                        branch 'stable'
                                    }
                                    steps {
                                        dir("$WORKSPACE/packages/frontend") {
                                            sh 'yarn install'
                                            sh 'yarn build'
                                            sh 'yarn test'
                                            sh "mv $FRONTEND_BUNDLE_PATH $FRONTEND_TESTNET_BUNDLE_PATH"
                                        }
                                    }
                                }
                            }
                        }
                        stage('frontend:artifact:pull-request') {
                            when {
                                not { anyOf { branch 'master' ; branch 'stable' } }
                            }
                            steps {
                                withAWS(region: env.AWS_REGION) {
                                    s3Upload(
                                        bucket: env.BUILD_ARTIFACT_BUCKET,
                                        includePathPattern: "*",
                                        path: env.FRONTEND_ARTIFACT_PATH,
                                        workingDir: env.FRONTEND_TESTNET_BUNDLE_PATH
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('e2e-tests') {
            stages {
                stage('e2e-tests:deploy') {
                    when {
                        allOf {
                            branch 'master'
                            expression { env.BUILD_E2E == 'true' }
                        }
                    }
                    steps {
                        echo 'TODO - deploy e2e-tests'
                    }
                }
                stage('e2e-tests:run') {
                    steps {
                        echo 'TODO - trigger e2e-tests'
                    }
                }
            }
        }
        stage('packages:deploy') {
            stages {
                stage('frontend:deploy') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' }
                    }
                    stages {
                        stage('frontend:deploy:testnet') {
                            when {
                                branch 'master'
                            }
                            steps {
                                withAWS(region: env.AWS_REGION) {
                                    s3Upload(
                                        bucket: env.TESTNET_STATIC_SITE_BUCKET,
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_TESTNET_BUNDLE_PATH
                                    )
                                }
                            }
                        }
                        stage('frontend:deploy:mainnet') {
                            when {
                                branch 'stable'
                            }
                            steps {
                                input(message: 'Deploy to mainnet?')
                                withAWS(region: env.AWS_REGION) {
                                    s3Upload(
                                        bucket: env.MAINNET_STATIC_SITE_BUCKET,
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_MAINNET_BUNDLE_PATH
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
