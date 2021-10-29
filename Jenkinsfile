pipeline {
    agent any
    stages {
        stage('Package Builds') {
            failFast true
            parallel {
                stage('e2e-tests') {
                    when {
                        expression {
                            return sh(returnStdout: true, script: './is-package-affected.sh e2e-tests').trim() == "true"
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
                            return sh(returnStdout: true, script: './is-package-affected.sh frontend').trim() == "true"
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
