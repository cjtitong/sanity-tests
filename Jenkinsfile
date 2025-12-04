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
        PIPELINE_NAME = "${env.JOB_NAME}"
        BRANCH_NAME = "${env.GIT_BRANCH}"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        SHORT_COMMIT = ""
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    sh 'git config --global --add safe.directory $WORKSPACE'

                    SHORT_COMMIT = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
                    env.SHORT_COMMIT = SHORT_COMMIT

                    
                    def timestamp = new Date().format("yyyyMMdd-HHmmss")
                    env.TEST_RUN_NAME = "${env.PIPELINE_NAME}-${env.BRANCH_NAME}-#${env.BUILD_NUMBER}-${env.SHORT_COMMIT}-${timestamp}"
                    echo "Testiny Test Run Name: ${env.TEST_RUN_NAME}"
                }
            }
        }

        stage('Install Dependencies') {
            steps { sh 'npm ci' }
        }

        stage('Run Sanity Tests') {
            steps { sh 'npx playwright test' }
        }

        stage('Upload Results to Testiny') {
            when { expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') } }
            steps {
                script {
                    if (fileExists('testiny-reporter.js')) {
                        
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
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            junit 'test-results/results.xml'
        }
    }
}
