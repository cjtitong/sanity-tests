pipeline {
    agent {
        docker { 
            image 'mcr.microsoft.com/playwright:focal'  // Official Playwright image
            args '-u root:root'                          // Run as root to avoid permission issues
        }
    }

    environment {
        TESTINY_API_KEY = credentials('TESTINY_API_KEY')
        TESTINY_PROJECT_ID = credentials('TESTINY_PROJECT_ID')
        TESTINY_TEST_RUN_ID = credentials('TESTINY_TEST_RUN_ID')
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/cjtitong/sanity-tests.git']]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Sanity Tests') {
            steps {
                sh 'npx playwright test --headed=false --reporter=html'
            }
        }

        stage('Upload Results to Testiny') {
            steps {
                sh 'node scripts/upload-to-testiny.js'
            }
        }
    }

    post {
        always {
            // Archive Playwright report for reference
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // JUnit results if you generate XML reports
            junit 'test-results/**/*.xml'
        }
    }
}
