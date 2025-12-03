pipeline {
    agent {
        kubernetes {
            label 'playwright-agent'
            defaultContainer 'node'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: mcr.microsoft.com/playwright:focal  # Official Playwright image
    command:
    - cat
    tty: true
"""
        }
    }

    environment {
        TESTINY_API_KEY = credentials('TESTINY_API_KEY')
        TESTINY_PROJECT_ID = credentials('TESTINY_PROJECT_ID')
        TESTINY_TEST_RUN_ID = credentials('TESTINY_TEST_RUN_ID')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Sanity Tests') {
            steps {
                // Playwright reads headless mode from config
                sh 'npx playwright test --reporter=html,junit'
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
            // Archive HTML reports for reference
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Record JUnit XML results for Jenkins
            junit 'test-results/**/*.xml'
        }
    }
}
