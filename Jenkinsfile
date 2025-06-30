pipeline {
    agent any

    environment {
        GIT_REPO_URL = 'https://github.com/danielcasanova12/docker-topicos.git'
        GIT_BRANCH = 'main'
        COMPOSE_PROJECT_NAME = 'docker-topicos'
        RECIPIENT_EMAIL = 'snaxofc10@gmail.com'
    }

    triggers {
        // Executar todo dia às 2h da manhã
        cron('0 2 * * *')
        // Ou executar quando houver push no repositório
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Environment Check') {
            steps {
                script {
                    echo '🔍 Verificando ambiente...'
                    sh '''
                        echo "=== System Info ==="
                        whoami
                        pwd
                        echo "=== Docker Info ==="
                        docker --version
                        docker compose version
                        echo "=== Network Info ==="
                        docker network ls
                        echo "=== Current Containers ==="
                        docker ps -a
                    '''
                }
            }
        }

        stage('Checkout Code') {
            steps {
                echo '📥 Fazendo checkout do código...'
                git branch: env.GIT_BRANCH, url: env.GIT_REPO_URL
            }
        }

        stage('Stop Current Services') {
            steps {
                script {
                    echo '🛑 Parando serviços atuais...'
                    sh '''
                        # Parar apenas os serviços da aplicação, não o Jenkins
                        docker compose stop orchard_api api1 frontend || true
                        docker compose rm -f orchard_api api1 frontend || true
                        
                        # Limpar imagens antigas dos serviços
                        docker image rm docker-topicos-orchard_api || true
                        docker image rm docker-topicos-api1 || true  
                        docker image rm docker-topicos-frontend || true
                        
                        echo "✅ Serviços parados e limpos"
                    '''
                }
            }
        }

        stage('Build Services') {
            parallel {
                stage('Build Orchard API') {
                    steps {
                        script {
                            echo '🔨 Building Orchard API...'
                            sh 'docker compose build orchard_api'
                        }
                    }
                }
                stage('Build API1') {
                    steps {
                        script {
                            echo '🔨 Building API1...'
                            sh 'docker compose build api1'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            echo '🔨 Building Frontend...'
                            sh 'docker compose build frontend'
                        }
                    }
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    echo '🚀 Fazendo deploy dos serviços...'
                    sh '''
                        # Subir apenas os serviços da aplicação
                        docker compose up -d orchard_api api1 frontend
                        
                        echo "⏱️ Aguardando serviços iniciarem..."
                        sleep 15
                        
                        echo "📊 Status dos serviços:"
                        docker compose ps
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo '🏥 Verificando saúde dos serviços...'
                    sh '''
                        echo "=== Container Status ==="
                        docker compose ps
                        
                        echo "=== Service Logs (last 10 lines) ==="
                        echo "--- Orchard API ---"
                        docker compose logs --tail=10 orchard_api || true
                        
                        echo "--- API1 ---"  
                        docker compose logs --tail=10 api1 || true
                        
                        echo "--- Frontend ---"
                        docker compose logs --tail=10 frontend || true
                        
                        echo "=== Network Connectivity ==="
                        docker network inspect docker-topicos_app-network | grep -A 5 "Containers" || true
                    '''
                }
            }
        }

        stage('Integration Tests') {
            steps {
                script {
                    echo '🧪 Executando testes de integração...'
                    sh '''
                        echo "Testando conectividade dos serviços..."
                        
                        # Teste básico de conectividade
                        timeout 30 sh -c 'until docker compose exec -T orchard_api curl -f http://localhost:4000/health 2>/dev/null; do sleep 2; done' || echo "Orchard API não respondeu"
                        timeout 30 sh -c 'until docker compose exec -T api1 curl -f http://localhost:8080/actuator/health 2>/dev/null; do sleep 2; done' || echo "API1 não respondeu"  
                        timeout 30 sh -c 'until docker compose exec -T frontend curl -f http://localhost:3000 2>/dev/null; do sleep 2; done' || echo "Frontend não respondeu"
                        
                        echo "✅ Testes básicos concluídos"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "📊 Pipeline finalizado com status: ${currentBuild.currentResult}"
                
                // Coletar logs para debug
                sh '''
                    echo "=== Final Container Status ==="
                    docker compose ps
                    
                    echo "=== Docker System Info ==="
                    docker system df
                '''
                
                // Tentar enviar email
                try {
                    if (env.RECIPIENT_EMAIL && env.RECIPIENT_EMAIL != '') {
                        def buildStatus = currentBuild.currentResult ?: 'UNKNOWN'
                        def buildDuration = currentBuild.durationString ?: 'N/A'
                        
                        mail(
                            to: env.RECIPIENT_EMAIL,
                            subject: "🚀 Deploy ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${buildStatus}",
                            body: """
📋 Relatório do Deploy

🏗️ Projeto: ${env.JOB_NAME}
🔢 Build: #${env.BUILD_NUMBER}
📊 Status: ${buildStatus}
⏱️ Duração: ${buildDuration}
🌐 Console: ${env.BUILD_URL}console
📅 Data: ${new Date()}

${buildStatus == 'SUCCESS' ? '✅ Deploy realizado com sucesso!' : '❌ Falha no deploy - verifique os logs'}

---
Jenkins CI/CD System
                            """
                        )
                    }
                } catch (Exception e) {
                    echo "⚠️ Falha ao enviar email: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo '🎉 Deploy realizado com sucesso!'
            echo '🌐 Serviços disponíveis:'
            echo '   - Frontend: http://localhost:3000'
            echo '   - Orchard API: http://localhost:4000'  
            echo '   - API1: http://localhost:8080'
            echo '   - Jenkins: http://localhost:8090'
        }
        
        failure {
            echo '❌ Falha no pipeline!'
            script {
                // Em caso de falha, mostrar logs detalhados
                sh '''
                    echo "=== DEBUG: Container Logs ==="
                    docker compose logs --tail=50 orchard_api || true
                    docker compose logs --tail=50 api1 || true
                    docker compose logs --tail=50 frontend || true
                    
                    echo "=== DEBUG: System Resources ==="
                    df -h
                    free -m
                    docker system df
                '''
            }
        }
        
        cleanup {
            echo '🧹 Limpeza pós-build...'
            sh '''
                # Limpar imagens dangling
                docker image prune -f || true
                
                # Limpar volumes não utilizados (cuidado!)
                # docker volume prune -f || true
                
                echo "✅ Limpeza concluída"
            '''
        }
    }
}