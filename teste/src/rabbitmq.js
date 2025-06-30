const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await conn.createChannel();
    await channel.assertQueue('reports_queue', { durable: true });
    console.log(`Conectado ao RabbitMQ e fila 'reports_queue' assertada.`);
  } catch (error) {
    console.error('Erro ao conectar ao RabbitMQ:', error);
    // Tentar reconectar após um tempo
    setTimeout(connectRabbitMQ, 5000);
  }
}

function publishToQueue(queueName, data) {
  if (!channel) {
    console.error('Canal RabbitMQ não disponível. Tentando reconectar...');
    connectRabbitMQ(); // Tenta reconectar se o canal não estiver disponível
    return;
  }
  try {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
    console.log(`Mensagem enviada para a fila ${queueName}:`, data);
  } catch (error) {
    console.error(`Erro ao publicar mensagem na fila ${queueName}:`, error);
  }
}

module.exports = { connectRabbitMQ, publishToQueue };
