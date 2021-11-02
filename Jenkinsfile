pipeline {
    agent any
    environment {
        // e2e variables
        BANK_ACCOUNT = 'grumby.testnet'
        BANK_SEED_PHRASE = 'canal pond draft confirm cabin hungry pistol light valley frost dress found'
        TEST_ACCOUNT_SEED_PHRASE = 'grant confirm ritual chuckle control leader frame same ride trophy genuine journey'

        // frontend variables
        FRONTEND_BUNDLE_PATH = "$WORKSPACE/packages/frontend/dist"

        // aws configuration
        AWS_REGION = 'us-west-2'

        // s3 buckets
        BUILD_ARTIFACT_BUCKET = 'andy-dev-build-artifacts'
        STATIC_SITE_BUCKET = 'andy-dev-testnet-near-wallet'
        PRODUCTION_ARTIFACT_PATH = "frontend/$BRANCH_NAME/$BUILD_NUMBER"
        PULL_REQUEST_ARTIFACT_PATH = "frontend/$BRANCH_NAME"

        // package building configuration
        AFFECTED_PACKAGES = 'frontend'.split()
        /* TODO enable once nx is implemented
        AFFECTED_PACKAGES = """${sh(
            returnStdout: true,
            script: 'npx affected:apps --plain'
        )}""".trim().split()
        */

        BUILD_E2E = AFFECTED_PACKAGES.contains('e2e-tests')
        BUILD_FRONTEND = AFFECTED_PACKAGES.contains('frontend')
    }
    triggers {
        pollSCM('')
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
                        expression {
                            return env.BUILD_E2E == 'true'
                        }
                    }
                    stages {
                        stage('e2e-tests:build') {
                            steps {
                                nodejs(nodeJSInstallationName: 'node14-lts') {
                                    dir("$WORKSPACE/packages/e2e-tests") {
                                        sh 'yarn install'
                                        sh 'yarn test'
                                    }
                                }
                            }
                        }
                    }
                }

                // build frontend package
                stage('frontend') {
                    when {
                        expression {
                            return env.BUILD_FRONTEND == 'true'
                        }
                    }
                    stages {
                        stage('frontend:build') {
                            steps {
                                nodejs(nodeJSInstallationName: 'node14-lts') {
                                    dir("$WORKSPACE/packages/frontend") {
                                        sh 'yarn install'
                                        sh 'yarn build'
                                        sh 'yarn test'
                                    }
                                }
                            }
                        }
                        stage('frontend:upload-artifact') {
                            stages {
                                stage('frontend:upload-PR-artifact') {
                                    when {
                                        not {
                                            anyOf {
                                                branch 'master'; branch 'stable'
                                            }
                                        }
                                    }
                                    steps {
                                        withAWS(region: env.AWS_REGION) {
                                            s3Upload(
                                                bucket: env.BUILD_ARTIFACT_BUCKET,
                                                includePathPattern: "*",
                                                path: env.PULL_REQUEST_ARTIFACT_PATH,
                                                workingDir: env.FRONTEND_BUNDLE_PATH
                                            )
                                        }
                                    }
                                }
                                stage('frontend:upload-production-artifact') {
                                    when {
                                        anyOf {
                                            branch 'master'; branch 'stable'
                                        }
                                    }
                                    steps {
                                        withAWS(region: env.AWS_REGION) {
                                            s3Upload(
                                                bucket: env.BUILD_ARTIFACT_BUCKET,
                                                includePathPattern: "*",
                                                path: env.PRODUCTION_ARTIFACT_PATH,
                                                workingDir: env.FRONTEND_BUNDLE_PATH
                                            )
                                        }
                                    }
                                }
                            }
                        }
                        stage('frontend:deploy-artifact') {
                            when {
                                anyOf {
                                    branch 'master'; branch 'stable'
                                }
                            }
                            steps {
                                withAWS(region: env.AWS_REGION) {
                                    s3Upload(
                                        bucket: env.STATIC_SITE_BUCKET,
                                        includePathPattern: "*",
                                        path: '',
                                        workingDir: env.FRONTEND_BUNDLE_PATH
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
