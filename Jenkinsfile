pipeline {
    agent {
        docker {
            image 'docker:24.0.2'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        // Defina a URL do seu repositório Git
        GIT_REPO_URL = 'https://github.com/danielcasanova12/docker-topicos.git'
        // Defina a branch principal do seu repositório
        GIT_BRANCH = 'main' // ou 'master'
        // Seu e-mail para notificações
        RECIPIENT_EMAIL = 'snaxofc10@gmail.com'
    }

    triggers {
        // Gatilho diário às 2h da manhã (UTC)
        cron '0 2 * * *'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out repository...'
                git branch: env.GIT_BRANCH, url: env.GIT_REPO_URL
            }
        }

        stage('Build and Deploy api1') {
            steps {
                script {
                    echo 'Building and deploying api1...'
                    // Parar e remover o container existente do serviço 'api1'
                    sh 'docker-compose stop api1 || true'
                    sh 'docker-compose rm -f api1 || true'
                    // Remover a imagem Docker do serviço 'api1'
                    sh 'docker rmi api1 || true'
                    // Fazer o build da nova imagem para o serviço 'api1'
                    sh 'docker-compose build api1'
                    // Subir o novo container do serviço 'api1' em modo detached
                    sh 'docker-compose up -d api1'
                }
            }
        }

        stage('Build and Deploy orchard_api') {
            steps {
                script {
                    echo 'Building and deploying orchard_api...'
                    // Parar e remover o container existente do serviço 'orchard_api'
                    sh 'docker-compose stop orchard_api || true'
                    sh 'docker-compose rm -f orchard_api || true'
                    // Remover a imagem Docker do serviço 'orchard_api'
                    sh 'docker rmi orchard_api || true'
                    // Fazer o build da nova imagem para o serviço 'orchard_api'
                    sh 'docker-compose build orchard_api'
                    // Subir o novo container do serviço 'orchard_api' em modo detached
                    sh 'docker-compose up -d orchard_api'
                }
            }
        }

        stage('Build and Deploy frontend') {
            steps {
                script {
                    echo 'Building and deploying frontend...'
                    // Parar e remover o container existente do serviço 'frontend'
                    sh 'docker-compose stop frontend || true'
                    sh 'docker-compose rm -f frontend || true'
                    // Remover a imagem Docker do serviço 'frontend'
                    sh 'docker rmi frontend || true'
                    // Fazer o build da nova imagem para o serviço 'frontend'
                    sh 'docker-compose build frontend'
                    // Subir o novo container do serviço 'frontend' em modo detached
                    sh 'docker-compose up -d frontend'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            // Envia e-mail de notificação
            mail (
                to: env.RECIPIENT_EMAIL,
                subject: "Jenkins Build Notification: ${currentBuild.fullDisplayName}",
                body: "Build Status: ${currentBuild.currentResult}\n\nCheck console output at: ${env.BUILD_URL}"
            )
        }
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}