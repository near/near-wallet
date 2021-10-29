pipeline {
    agent any
    stages {
        stage('Package Builds') {
            failFast true
            parallel {
                stage('e2e-tests') {
                    when {
                        expression {
                            Boolean e2eChanged = sh(returnStdout: true, script: './is-package-affected.sh e2e-tests')
                            echo "e2e changed? $e2eChanged"
                            return e2eChanged
                        }
                    }
                    stages {
                        stage('Build') {
                            steps {
                                nodejs(nodeJSInstallationName: 'node14-lts') {
                                    dir("$WORKSPACE/packages/e2e-tests") {
                                        sh 'pwd'
                                        sh 'yarn install'
                                        sh 'yarn test'
                                    }
                                }
                            }
                        }
                    }
                }
                stage('frontend') {
                    when {
                        expression {
                            Boolean frontendChanged = sh(returnStdout: true, script: './is-package-affected.sh frontend')
                            echo "frontend changed? $frontendChanged"
                            return frontendChanged
                        }
                    }
                    stages {
                        stage('Build') {
                            steps {
                                echo 'doing it anyway'
                                nodejs(nodeJSInstallationName: 'node14-lts') {
                                    dir("$WORKSPACE/packages/frontend") {
                                        sh 'yarn install'
                                        sh 'yarn build'
                                        sh 'yarn test'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
