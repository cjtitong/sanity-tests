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
    image: mcr.microsoft.com/playwright:v1.57.0-noble
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
                // Playwright will generate HTML and JUnit reports
                sh 'npx playwright test --reporter=html,junit --output=test-results'
            }
        }

        stage('Upload Results to Testiny') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                script {
                    if (fileExists('testiny-reporter.js')) {
                        sh 'node testiny-reporter.js'
                    } else {
                        echo "Testiny reporter script not found, skipping upload."
                    }
                }
            }
        }
    }

    post {
        always {
            // Archive HTML reports
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Record JUnit XML results for Jenkins
            junit 'test-results/*.xml'
        }
    }
}
