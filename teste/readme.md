Productivity API (Com GraphQL e MongoDB)
Esta API gerencia dados de produtividade de pomares (Harvest, Productivity, SensorData e Report). A seguir, instruções para rodar tanto localmente quanto dentro de containers Docker.

1. Estrutura do Projeto
pgsql
Copiar código
teste/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── package.json
├── package-lock.json
├── src/
│   ├── index.js
│   ├── graphql/
│   │   ├── typeDefs.js
│   │   └── resolvers.js
│   └── models/
│       ├── Harvest.js
│       ├── Productivity.js
│       ├── SensorData.js
│       └── Report.js
└── README.md
2. Pré-requisitos
Node.js (v16+ recomendado)

npm (v8+)

MongoDB (local ou URL de acesso ao MongoDB Atlas)

Docker e Docker Compose (para rodar via containers)

3. Configuração de Variáveis de Ambiente
Crie um arquivo chamado .env na raiz com o seguinte conteúdo:

env
Copiar código
PORT=4000
MONGODB_URI=mongodb://localhost:27017/orchard_db
PORT: porta em que a API escutará (padrão: 4000).

MONGODB_URI: URI do MongoDB.

Se estiver rodando um Mongo local, use mongodb://localhost:27017/nome_do_banco.

Caso use Mongo Atlas, algo como mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority.

4. Rodando Localmente
Clone este repositório (caso ainda não o tenha):

bash
Copiar código
git clone https://github.com/seu-usuario/seu-repositorio.git
cd teste
Instale as dependências:

bash
Copiar código
npm install
Verifique o arquivo .env:

Confirme que MONGODB_URI aponta para um Mongo válido.

Confirme que PORT seja 4000 (ou outro valor de sua escolha).

Inicie o servidor:

bash
Copiar código
npm run dev
Você deverá ver, no console:

bash
Copiar código
✔ MongoDB conectado
Servidor rodando em http://localhost:4000/graphql
Abra o GraphQL Playground:
Navegue até http://localhost:4000/graphql.

Teste Queries / Mutations:

Para verificar se está ativo:

graphql
Copiar código
query {
  __typename
}
Para criar um Harvest:

graphql
Copiar código
mutation {
  createHarvest(input: {
    orchardId: "ID_DO_POMAR",
    date: "2025-06-05T00:00:00.000Z",
    quantityKg: 1200.5,
    notes: "Colheita inicial"
  }) {
    id
    orchardId
    date
    quantityKg
    notes
  }
}
Outras operações seguem a mesma estrutura descrita no código.

5. Rodando com Docker Compose
5.1. Pré-requisitos para Docker
Docker Desktop (Windows/Mac) ou Docker Engine + Docker Compose (Linux).

Verifique se o Docker está rodando:

bash
Copiar código
docker version
5.2. Arquivos de configuração
Dockerfile (API Node):

dockerfile
Copiar código
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY . .

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
docker-compose.yml:

yaml
Copiar código
version: '3.8'

services:
  mongo:
    image: mongo:6.0
    container_name: mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: orchard_api
    restart: unless-stopped
    environment:
      MONGODB_URI: "mongodb://mongo:27017/orchard_db"
      PORT: 4000
    ports:
      - "4000:4000"
    depends_on:
      - mongo

volumes:
  mongo_data:
.dockerignore:

lua
Copiar código
node_modules
npm-debug.log
.git
.gitignore
.env
5.3. Subir os containers
Abra o terminal na raiz do projeto (onde está o docker-compose.yml).

Execute:

bash
Copiar código
docker-compose up --build
Se quiser rodar em segundo plano:

bash
Copiar código
docker-compose up -d --build
Aguarde até ver, nos logs do serviço api, algo como:

less
Copiar código
✔ MongoDB conectado
Servidor rodando em http://0.0.0.0:4000/graphql
Verifique containers em execução:

bash
Copiar código
docker ps
Você deverá ver duas linhas:

python-repl
Copiar código
CONTAINER ID   IMAGE       COMMAND                  ...   PORTS                      NAMES
...            mongo:6.0   "docker-entrypoint.s…"   ...   0.0.0.0:27017->27017/tcp   mongo
...            teste-api   "node src/index.js"      ...   0.0.0.0:4000->4000/tcp     orchard_api
Teste a API no host:
Abra no navegador ou terminal:

bash
Copiar código
http://localhost:4000/graphql
Ou via curl:

bash
Copiar código
curl --request POST \
  --header 'Content-Type: application/json' \
  --url http://localhost:4000/graphql \
  --data '{"query":"query { __typename }"}'
6. Exemplos de Uso via cURL
Query (harvests)
bash
Copiar código
curl --request POST \
  --header 'Content-Type: application/json' \
  --url http://localhost:4000/graphql \
  --data '{"query":"query { harvests { id orchardId date quantityKg notes } }"}'
Mutation (createHarvest)
bash
Copiar código
curl --request POST \
  --header 'Content-Type: application/json' \
  --url http://localhost:4000/graphql \
  --data '{"query":"mutation { createHarvest(input: { orchardId: \"ID_DO_POMAR\", date: \"2025-06-05T00:00:00.000Z\", quantityKg: 1200.5, notes: \"Colheita via curl\" }) { id orchardId date quantityKg notes } }"}'
Demais operações
createProductivity

createSensorData

createReport

updateHarvest, updateProductivity, updateSensorData, updateReport

deleteHarvest, deleteProductivity, deleteSensorData, deleteReport

Basta usar a mesma estrutura, ajustando o nome da operação e os campos. Consulte o schema em src/graphql/typeDefs.js para ver os campos disponíveis.

7. Possíveis Ajustes e Melhorias
Paginação/Filtros: adicionar argumentos (e.g. limit, offset) nas queries de listas.

Autenticação/Autorização: incluir JWT no contexto do ApolloServer e restrições em resolvers.

Validações: usar joi ou similar para validar input antes de salvar no Mongo.

Ambiente de produção: configurar variáveis seguras e separar arquivos de configuração.

Monitoramento: adicionar logs ou serviço de métricas (Prometheus, Grafana etc.).

Pronto!
Agora você tem a API configurada para rodar tanto localmente (com Node & MongoDB instalados) quanto dentro de containers Docker (via docker-compose). Basta seguir as instruções acima para subir e testar suas queries/mutations JSON via GraphQL.