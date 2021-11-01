pipeline {
    agent any
    environment {
        BANK_ACCOUNT = 'grumby.testnet'
        BANK_SEED_PHRASE = 'canal pond draft confirm cabin hungry pistol light valley frost dress found'
        TEST_ACCOUNT_SEED_PHRASE = 'grant confirm ritual chuckle control leader frame same ride trophy genuine journey'
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
                                        sh 'yarn install'
                                        sh 'yarn build'
                                        sh 'yarn test'
                                    }
                                }
                                withAWS(region: 'us-west-2') {
                                    s3Upload(
                                        bucket: 'andy-dev-build-artifacts',
                                        includePathPattern: "*",
                                        path: "$BUILD_NUMBER",
                                        workingDir: "$WORKSPACE/packages/frontend/dist/*"
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
