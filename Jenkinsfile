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
        TESTNET_AWS_ROLE_ACCOUNT = credentials('testnet-assumed-role-account')

        // s3 buckets
        TESTNET_PR_PREVIEW_STATIC_SITE_BUCKET = credentials('testnet-pr-previews-static-website')
        TESTNET_STAGING_STATIC_SITE_BUCKET = credentials('testnet-staging-static-website')
        TESTNET_STATIC_SITE_BUCKET = credentials('testnet-static-website')

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

            parallel {
                stage('frontend:prebuild:testnet-staging') {
                    when {
                        expression { env.BUILD_FRONTEND == 'true' }
                    }
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
                    when {
                        expression { env.BUILD_FRONTEND == 'true' }
                    }
                    environment {
                        NEAR_WALLET_ENV = 'testnet'
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
                        expression { env.BUILD_E2E == 'true' };
                        anyOf { branch 'master' ; branch 'stable' }
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
                        expression { env.BUILD_FRONTEND == 'true' }
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
                        expression { env.BUILD_FRONTEND == 'true' }
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
                        stage('frontend:deploy:testnet-pr-preview') {
                            when {
                                not { anyOf { branch 'master' ; branch 'stable' } };
                                expression { env.CHANGE_TARGET != "" }
                            }
                            steps {
                                milestone(401)
                                withAWS(
                                    region: env.AWS_REGION,
                                    credentials: env.AWS_CREDENTIALS,
                                    role: env.TESTNET_AWS_ROLE,
                                    roleAccount: env.TESTNET_AWS_ROLE_ACCOUNT
                                ) {
                                    s3Upload(
                                        bucket: "$TESTNET_PR_PREVIEW_STATIC_SITE_BUCKET/$CHANGE_ID",
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_TESTNET_BUNDLE_PATH
                                    )
                                }
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
                                    roleAccount: env.TESTNET_AWS_ROLE_ACCOUNT
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
                                input(message: 'Deploy to testnet?')
                                milestone(404)
                                withAWS(
                                    region: env.AWS_REGION,
                                    credentials: env.AWS_CREDENTIALS,
                                    role: env.TESTNET_AWS_ROLE,
                                    roleAccount: env.TESTNET_AWS_ROLE_ACCOUNT
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
