pipeline {
    agent any
    environment {
        // frontend variables
        FRONTEND_TESTNET_STAGING_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist_testnet_staging"
        FRONTEND_TESTNET_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist_testnet"
        FRONTEND_MAINNET_STAGING_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist_mainnet_staging"
        FRONTEND_MAINNET_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist_mainnet"

        // aws configuration
        AWS_CREDENTIALS = 'aws-credentials-password'
        AWS_REGION = 'us-west-2'
        TESTNET_AWS_ROLE = credentials('testnet-assumed-role')
        TESTNET_AWS_ACCOUNT_ID = credentials('testnet-mnw-account-id')
        MAINNET_AWS_ROLE = credentials('mainnet-assumed-role')
        MAINNET_AWS_ACCOUNT_ID = credentials('mainnet-mnw-account-id')

        // s3 buckets
        TESTNET_PR_PREVIEW_STATIC_SITE_BUCKET = credentials('testnet-pr-previews-static-website')
        TESTNET_STAGING_STATIC_SITE_BUCKET = credentials('testnet-staging-static-website')
        TESTNET_STATIC_SITE_BUCKET = credentials('testnet-static-website')
        MAINNET_PR_PREVIEW_STATIC_SITE_BUCKET = credentials('mainnet-pr-previews-static-website')
        MAINNET_STAGING_STATIC_SITE_BUCKET = credentials('mainnet-staging-static-website')
        MAINNET_STATIC_SITE_BUCKET = credentials('mainnet-static-website')

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
        stage('packages:prebuild') {
            failFast true

            parallel {
                stage('frontend:prebuild') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' }
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh 'yarn install --frozen-lockfile'
                        }
                    }
                }
            }
        }

        stage('packages:cleaned') {
            steps {
                milestone(100)
            }
        }

        stage('packages:test') {
            failFast true

            when {
                expression { env.BUILD_FRONTEND == 'true' }
            }
            parallel {
                stage('frontend:prebuild:testnet-staging') {
                    environment {
                        NEAR_WALLET_ENV = 'testnet_STAGING'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh 'yarn test'
                        }
                    }
                }

                stage('frontend:prebuild:testnet') {
                    environment {
                        NEAR_WALLET_ENV = 'testnet'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh 'yarn test'
                        }
                    }
                }

                stage('frontend:prebuild:mainnet-staging') {
                    environment {
                        NEAR_WALLET_ENV = 'mainnet_STAGING'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh 'yarn test'
                        }
                    }
                }

                stage('frontend:prebuild:mainnet') {
                    environment {
                        NEAR_WALLET_ENV = 'mainnet'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh 'yarn test'
                        }
                    }
                }
            }
        }

        stage('packages:tested') {
            steps {
                milestone(200)
            }
        }

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

                // build frontend bundles
                stage('frontend:bundle:testnet-staging') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' };
                        not { branch 'stable' }
                    }
                    environment {
                        NEAR_WALLET_ENV = 'testnet_STAGING'
                        REACT_APP_ACCOUNT_HELPER_URL = 'https://preflight-api.kitwallet.app'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh "yarn bundle --outDir=$FRONTEND_TESTNET_STAGING_BUNDLE_PATH"
                        }
                    }
                }

                stage('frontend:bundle:testnet') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' };
                        branch 'master'
                    }
                    environment {
                        NEAR_WALLET_ENV = 'testnet'
                        REACT_APP_ACCOUNT_HELPER_URL = 'https://testnet-api.kitwallet.app'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh "yarn bundle --outDir=$FRONTEND_TESTNET_BUNDLE_PATH"
                        }
                    }
                }

                stage('frontend:bundle:mainnet-staging') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' };
                        not { branch 'stable' }
                    }
                    environment {
                        NEAR_WALLET_ENV = 'mainnet_STAGING'
                        REACT_APP_ACCOUNT_HELPER_URL = 'https://staging-api.kitwallet.app'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh "yarn bundle --outDir=$FRONTEND_MAINNET_STAGING_BUNDLE_PATH"
                        }
                    }
                }

                stage('frontend:bundle:mainnet') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' };
                        anyOf { branch 'master' ; branch 'stable' }
                    }
                    environment {
                        NEAR_WALLET_ENV = 'mainnet'
                        REACT_APP_ACCOUNT_HELPER_URL = 'https://api.kitwallet.app'
                    }
                    steps {
                        dir("$WORKSPACE/packages/frontend") {
                            sh "yarn bundle --outDir=$FRONTEND_MAINNET_BUNDLE_PATH"
                        }
                    }
                }
            }
        }

        stage('packages:built') {
            steps {
                milestone(300)
            }
        }

        stage('packages:deploy') {
            stages {
                stage('frontend:deploy') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' }
                    }
                    stages {
                        stage('frontend:deploy:pr-previews') {
                            failFast true

                            when {
                                not { anyOf { branch 'master' ; branch 'stable' } };
                                expression { env.CHANGE_TARGET != "" }
                            }

                            parallel {
                                stage('frontend:deploy:testnet-pr-preview') {
                                    steps {
                                        withAWS(
                                            region: env.AWS_REGION,
                                            credentials: env.AWS_CREDENTIALS,
                                            role: env.TESTNET_AWS_ROLE,
                                            roleAccount: env.TESTNET_AWS_ACCOUNT_ID
                                        ) {
                                            s3Upload(
                                                bucket: "$TESTNET_PR_PREVIEW_STATIC_SITE_BUCKET/$CHANGE_ID",
                                                includePathPattern: "*",
                                                path: '',
                                                workingDir: env.FRONTEND_TESTNET_STAGING_BUNDLE_PATH
                                            )
                                        }
                                    }
                                }

                                stage('frontend:deploy:mainnet-pr-preview') {
                                    when {
                                        not { anyOf { branch 'master' ; branch 'stable' } };
                                        expression { env.CHANGE_TARGET != "" }
                                    }
                                    steps {
                                        withAWS(
                                            region: env.AWS_REGION,
                                            credentials: env.AWS_CREDENTIALS,
                                            role: env.MAINNET_AWS_ROLE,
                                            roleAccount: env.MAINNET_AWS_ACCOUNT_ID
                                        ) {
                                            s3Upload(
                                                bucket: "$MAINNET_PR_PREVIEW_STATIC_SITE_BUCKET/$CHANGE_ID",
                                                includePathPattern: "*",
                                                path: '',
                                                workingDir: env.FRONTEND_MAINNET_STAGING_BUNDLE_PATH
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        stage('frontend:deployed:pr-previews') {
                            steps {
                                milestone(401)
                            }
                        }

                        stage('frontend:deploy:testnet-staging') {
                            when {
                                branch 'master'
                            }
                            steps {
                                milestone(402)
                                withAWS(
                                    region: env.AWS_REGION,
                                    credentials: env.AWS_CREDENTIALS,
                                    role: env.TESTNET_AWS_ROLE,
                                    roleAccount: env.TESTNET_AWS_ACCOUNT_ID
                                ) {
                                    s3Upload(
                                        bucket: env.TESTNET_STAGING_STATIC_SITE_BUCKET,
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_TESTNET_STAGING_BUNDLE_PATH
                                    )
                                }
                            }
                        }

                        stage('frontend:deploy:testnet') {
                            when {
                                branch 'master'
                            }
                            steps {
                                milestone(403)
                                withAWS(
                                    region: env.AWS_REGION,
                                    credentials: env.AWS_CREDENTIALS,
                                    role: env.TESTNET_AWS_ROLE,
                                    roleAccount: env.TESTNET_AWS_ACCOUNT_ID
                                ) {
                                    s3Upload(
                                        bucket: env.TESTNET_STATIC_SITE_BUCKET,
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_TESTNET_BUNDLE_PATH
                                    )
                                }
                            }
                        }

                        stage('frontend:deploy:mainnet-staging') {
                            when {
                                branch 'master'
                            }
                            steps {
                                milestone(404)
                                withAWS(
                                    region: env.AWS_REGION,
                                    credentials: env.AWS_CREDENTIALS,
                                    role: env.MAINNET_AWS_ROLE,
                                    roleAccount: env.MAINNET_AWS_ACCOUNT_ID
                                ) {
                                    s3Upload(
                                        bucket: env.MAINNET_STAGING_STATIC_SITE_BUCKET,
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_MAINNET_STAGING_BUNDLE_PATH
                                    )
                                }
                            }
                        }

                        stage('frontend:deploy:mainnet') {
                            when {
                                branch 'stable'
                            }
                            steps {
                                milestone(405)
                                input(message: 'Deploy to mainnet?')
                                milestone(406)
                                withAWS(
                                    region: env.AWS_REGION,
                                    credentials: env.AWS_CREDENTIALS,
                                    role: env.MAINNET_AWS_ROLE,
                                    roleAccount: env.MAINNET_AWS_ACCOUNT_ID
                                ) {
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
    post {
        always {
            cleanWs(
                disableDeferredWipeout: true,
                deleteDirs: true
            )
        }
    }
}
