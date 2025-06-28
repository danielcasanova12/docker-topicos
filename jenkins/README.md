# Jenkins Pipelines

Este diretório contém exemplos de pipelines para automatizar a construção e
publicação dos serviços Docker deste projeto. Cada arquivo `Jenkinsfile-*`
corresponde a um job que deve ser configurado no Jenkins.

Os jobs executam as seguintes etapas:

1. Clonam o repositório;
2. Removem eventuais containers e imagens existentes da aplicação;
3. Fazem o `build` da imagem descrita no `Dockerfile`;
4. Criam um novo container com a imagem gerada;
5. Inicializam o container.

Cada pipeline possui ainda um gatilho diário (cron) e envia e-mails de sucesso
ou falha ao final da execução. Para que o envio funcione, configure no Jenkins
um servidor SMTP válido e altere a variável `EMAIL_RECIPIENT` em cada script.

## Arquivos

- `Jenkinsfile-frontend` – pipeline do serviço `frontend`;
- `Jenkinsfile-orchard_api` – pipeline da API localizada em `teste/`;
- `Jenkinsfile-api1` – pipeline do serviço em `advanced-topics/`.

Adapte as URLs de repositório e demais parâmetros de acordo com o ambiente.
