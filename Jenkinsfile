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
        TEST_RUN_ID = "ATR-15" // Your internal test run ID
        PIPELINE_NAME = "${env.JOB_NAME}" // Jenkins pipeline name
        BRANCH_NAME = "${env.GIT_BRANCH}" // Git branch
        BUILD_NUMBER = "${env.BUILD_NUMBER}" // Jenkins build number
        SHORT_COMMIT = "" // Will be set in checkout stage
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Mark workspace as safe for Git to avoid dubious ownership error
                    sh 'git config --global --add safe.directory $WORKSPACE'

                    // Get short commit hash (7 chars)
                    SHORT_COMMIT = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
                    env.SHORT_COMMIT = SHORT_COMMIT

                    // Generate Testiny test run name
                    env.TEST_RUN_NAME = "${env.TEST_RUN_ID} - ${env.PIPELINE_NAME} - ${env.BRANCH_NAME} - #${env.BUILD_NUMBER} - ${env.SHORT_COMMIT}"
                    echo "Testiny Test Run Name: ${env.TEST_RUN_NAME}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Sanity Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Upload Results to Testiny') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                script {
                    if (fileExists('testiny-reporter.js')) {
                        // Pass the generated test run name to the reporter
                        sh "node testiny-reporter.js --testRunName='${env.TEST_RUN_NAME}'"
                    } else {
                        echo "Testiny reporter script not found, skipping upload."
                    }
                }
            }
        }
    }

    post {
        always {
            // Archive Playwright HTML reports
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Record JUnit XML results for Jenkins
            junit 'test-results/results.xml'
        }
    }
}
