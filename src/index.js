console.info(`Process started at: ${new Date().toUTCString()}`)
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/main/bot.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();

const express = require('express');
const app = express();
const port = 6969;

app.get('/', (_, res) => res.send('How are you doing!'));

app.listen(port, () => console.log(`Listening at port: ${port}`));