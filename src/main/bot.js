const
  client = require('./client'),
  mongoose = require('mongoose');

client.info('Connecting to database...')
mongoose.connect(process.env.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => client.info('Connected to Database.'));

let shard = 'Shard N/A:';
client.once('shardReady', async (shardId) => {
  shard = `Shard ${shardId}:`;
  client.info(shard, `Ready as ${client.user.tag}!`);
});

client
  .on('error', err => client.error(shard, 'Client error:', err))
  .on('warn', info => client.warn(shard, 'Warning:', info))
  .on('rateLimit', rateLimitInfo => client.warn(shard, 'Rate limited:', JSON.stringify(rateLimitInfo)))
  .on('shardResume', (_, replayedEvents) => client.info(shard, `Resumed. ${replayedEvents} event(s) replayed.`))
  .on('shardReconnecting', () => client.warn(shard, 'Reconnecting.'))
  .on('shardDisconnected', closeEvent => client.warn(shard, 'Disconnected:', closeEvent))
  .on('shardError', err => client.error(shard, 'Error:', err))
  .login(process.env.TOKEN).then(() => client.info('Logged in'));