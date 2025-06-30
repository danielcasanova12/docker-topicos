const amqp = require('amqplib');

async function sendMessage() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    const queue = 'task_queue';
    const message = process.argv[2] || 'Hello from Node.js!';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`[x] Sent '${message}'`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Error sending message:', error);
    process.exit(1);
  }
}

sendMessage();