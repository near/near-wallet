pipeline {
    agent any
    environment {
        // e2e variables
        BANK_ACCOUNT = 'grumby.testnet'
        BANK_SEED_PHRASE = 'canal pond draft confirm cabin hungry pistol light valley frost dress found'
        TEST_ACCOUNT_SEED_PHRASE = 'grant confirm ritual chuckle control leader frame same ride trophy genuine journey'

        // aws configuration
        AWS_REGION = 'us-west-2'

        // s3 buckets
        BUILD_ARTIFACT_BUCKET = 'andy-dev-build-artifacts'
        STATIC_SITE_BUCKET = 'andy-dev-testnet-near-wallet'

        EXPRESSION = "$(echo expression)"
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
                            return sh(returnStdout: true, script: './is-package-affected.sh e2e-tests').trim() == "true"
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
                            return sh(returnStdout: true, script: './is-package-affected.sh frontend').trim() == "true"
                        }
                    }
                    stages {
                        stage('frontend:build') {
                            steps {
                                nodejs(nodeJSInstallationName: 'node14-lts') {
                                    dir("$WORKSPACE/packages/frontend") {
                                        echo "$EXPRESSION"
                                        sh 'yarn install'
                                        sh 'yarn build'
                                        sh 'yarn test'
                                    }
                                }
                            }
                        }
                        stage('frontend:upload-artifact') {
                            steps {
                                withAWS(region: "$AWS_REGION") {
                                    s3Upload(
                                        bucket: "$BUILD_ARTIFACT_BUCKET",
                                        includePathPattern: "*",
                                        path: "frontend/$BRANCH_NAME/$BUILD_NUMBER",
                                        workingDir: "$WORKSPACE/packages/frontend/dist"
                                    )
                                }
                            }
                        }
                        stage('frontend:deploy-artifact') {
                            when {
                                branch 'master'
                            }
                            steps {
                                withAWS(region: "$AWS_REGION") {
                                    s3Copy(
                                        fromBucket: "$BUILD_ARTIFACT_BUCKET",
                                        fromPath: "frontend/$BRANCH_NAME/$BUILD_NUMBER",
                                        toBucket: "$STATIC_SITE_BUCKET",
                                        toPath: ''
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
