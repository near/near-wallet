pipeline {
    agent any
    stages {
        stage('Package Builds') {
            failFast true
            parallel {
                stage('e2e-tests') {
                    when {
                        expression {
                            String e2eAffected = sh(returnStdout: true, script: './is-package-affected.sh e2e-tests')
                            return e2eAffected.trim() == "true"
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
                            String frontendChanged = sh(returnStdout: true, script: './is-package-affected.sh frontend')
                            return frontendChanged.trim() == "true"
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
