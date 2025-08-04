pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_IMAGE_NAME = "hardik0005/pendown"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out the source code from SCM."
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                echo "Installing dependencies and running tests."
                sh 'npm install'
                
                // Debugging jest.config.ts
                echo 'Verifying content of jest.config.ts:'
                sh 'cat jest.config.ts'

                sh 'npm test'
            }
        }

        stage('Build Application') {
            steps {
                withCredentials([
                    string(credentialsId: 'db-connection-string', variable: 'DATABASE_URL'),
                    string(credentialsId: 'jwt-secret-key', variable: 'JWT_SECRET')
                ]) {
                    sh 'npx prisma generate'
                    sh 'npm run build'
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {

                    echo "Building Docker image ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"

                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER} ${DOCKER_IMAGE_NAME}:latest"
                    
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }
    }
    
    post {
        always {
            echo "Cleaning workspace after build."
            cleanWs()
        }
    }
}