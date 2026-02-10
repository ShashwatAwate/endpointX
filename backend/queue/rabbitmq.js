const amqp = require("amqplib");

let channel;

const VERIFICATION_EXCHANGE = process.env.VERIFICATION_EXCHANGE;
const VERIFICATION_QUEUE_NAME = process.env.VERIFICATION_QUEUE_NAME;

async function getChannel() {
  if (channel) return channel;

  const connection = await amqp.connect(process.env.RABBIT_MQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(VERIFICATION_EXCHANGE, "direct", {
    durable: true,
  });

  await channel.assertQueue(VERIFICATION_QUEUE_NAME, {
    durable: true,
  });

  await channel.bindQueue(
    VERIFICATION_QUEUE_NAME,
    VERIFICATION_EXCHANGE,
    VERIFICATION_QUEUE_NAME
  );

  return channel;
}

async function publishToVerificationQueue(payload) {
  const ch = await getChannel();

  ch.publish(
    VERIFICATION_EXCHANGE,
    VERIFICATION_QUEUE_NAME,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
}

module.exports = { publishToVerificationQueue };
