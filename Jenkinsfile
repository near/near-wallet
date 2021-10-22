pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                sh 'rm -rf near-wallet'
                echo $NVM_DIR
            }
        }
        stage('Build') {
            steps {
                sh 'git clone https://github.com/andy-haynes/near-wallet.git'
                sh 'cd near-wallet'
                sh 'yarn build'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
