pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo "already Initted"
//                 sh 'rm -rf near-wallet'
            }
        }
        stage('Build') {
            steps {
//                 sh 'git clone https://github.com/andy-haynes/near-wallet.git'
                sh 'cd near-wallet'
                nodejs(nodeJSInstallationName: 'node14') {
                    sh 'yarn build'
                }
            }
        }
        stage('Test') {
            steps {
                nodejs(nodeJSInstallationName: 'node14') {
                    sh 'yarn test'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
