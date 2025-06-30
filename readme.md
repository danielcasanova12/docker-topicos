docker-compose down -v




docker run -d -p 8080:8080 -p 50000:50000 \
    -v jenkins_home:/var/jenkins_home \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --name jenkins jenkins/jenkins:lts



docker-compose up --build


npx https://github.com/google-gemini/gemini-cli