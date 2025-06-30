const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('report_queue', { durable: true });
    console.log('Conectado ao RabbitMQ e fila report_queue assertada.');
  } catch (error) {
    console.error('Erro ao conectar ao RabbitMQ:', error);
    setTimeout(connectRabbitMQ, 5000); // Tenta reconectar após 5 segundos
  }
}

function sendToQueue(queueName, message) {
  if (!channel) {
    console.error('Canal RabbitMQ não está disponível. Mensagem não enviada:', message);
    return;
  }
  try {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Mensagem enviada para ${queueName}:`, message);
  } catch (error) {
    console.error('Erro ao enviar mensagem para a fila:', error);
  }
}

function getChannel() {
  return channel;
}

module.exports = {
  connectRabbitMQ,
  sendToQueue,
  getChannel,
};