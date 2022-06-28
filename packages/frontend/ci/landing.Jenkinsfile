pipeline {
    agent any
    environment {
        MAINNET_AWS_ROLE = credentials('mainnet-assumed-role')
        MAINNET_AWS_ACCOUNT_ID = credentials('mainnet-mnw-account-id')
        LANDING_PAGE_BUCKET = credentials('landing-page-bucket')
    }
    stages {
        stage('upload') {
            when {
                branch 'master'
            }
            steps {
                sh "rm sonar-project.properties && rm -rf .git*"
                withAWS(
                    region: 'us-west-2',
                    credentials: 'aws-credentials-password',
                    role: env.MAINNET_AWS_ROLE,
                    roleAccount: env.MAINNET_AWS_ACCOUNT_ID
                ) {
                    sh "aws s3 sync . s3://$LANDING_PAGE_BUCKET --delete"
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
