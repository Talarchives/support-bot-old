# Support Bot
A Discord Support Bot...

# Things to do before starting
### Run `npm i`
Duh.

### Make `.env` file
The `.env` file currently requires:
```js
TOKEN=token_here
mongoUri=mongo_uri_here
```

### Configure `./src/config.json`
Configure `config.json`.
```json
{
  "mainGuild": "main_guild_id",
  "color": "0xFFAC33",
  "prefix": "?",
  "presence": {
      "activity": { "name": "someone", "type": "WATCHING" },
      "status": "online"
  },
  "startPresence": {
    "status": "idle",
    "activity": {
      "name": "a loading game ⏳",
      "type": "COMPETING"
    }
  },
  "bins": [
    "https://hastebin.com",
    "https://starb.in",
    "https://haste.red-panda.red/",
    "https://paste.hep.gg/",
    "https://haste.rauf.wtf/"
  ]
}
```
