const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
const keepAlive = require('./server')

const TOKEN = process.env['TOKEN']
const MONGODB_URI = process.env['MONGODB_URI']

const { Intents } = DiscordJS

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ]
})

client.on('ready', () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    showWarns: false,
    mongoUri: (MONGODB_URI)
  })
})




keepAlive()
client.login(TOKEN)
