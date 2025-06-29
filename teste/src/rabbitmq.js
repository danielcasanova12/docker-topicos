const amqp = require('amqplib');

let channel;
const QUEUE = 'orchard-events';

async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
}

function publish(message) {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
}

module.exports = { connect, publish };
