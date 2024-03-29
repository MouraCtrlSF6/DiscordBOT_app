require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const Arcana = require('./Bots/Arcana.js')

const Servers = require('./Services/Servers.js')
const { display } = require('./Bots/Services/BotService.js')
const { BOT_TOKEN } = process.env

const client = new Discord.Client()

async function loadServers() {
  const { data: { data } } = await Servers.listAll()
  const servers = data.map((server) => {
    return {
      "id": server.guild_id,
      "name": server.name,
      "dispatcher": null,
      "connection": null,
      "queueList": [], 
      "currentId": 0,
      "streamOptions": {
        "seek": 0,
        "volume": 1
      },
      "loops": {},
      "searchOptions": [],
      "autoDeleteMessage": {
        "playing": null,
        "added": null,
        "options": null,
      },
    }
  })

  return new Promise((resolve, reject) => {
    fs.writeFile('./Bots/Server/Servers.json', JSON.stringify(servers), (err) => {
      if(err) {
        console.error("Error on saving servers: ", err.message)
        reject(err)
      }
      console.log(`Logged in as ${client.user.tag}!`);
      resolve()
    })
  })
}

client.on('guildCreate', async (guild) => {
  try {
    await Servers.join({
      guild_id: guild.id,
      name: guild.name
    })

    await loadServers()
    console.log('Joined: ', guild.name)
  } catch(e) {
    console.error(e.message)
  }
})

client.on('guildDelete', async (guild) => {
  try {
    await Servers.leave(guild.id)
    console.log('Left ', guild.name)
  } catch(e) {
    console.error(e.message)
  }
})

client.on('ready', async () => {
  await loadServers()
});
  
client.on('message', async (msg) => {
  try {
    if(!msg.content.startsWith('--') || client.user.id === msg.author.id) 
      return;
      
    const arcana = new Arcana(client, msg, msg.guild.id)
    const feedback = await arcana.exec()
    display(feedback, msg)
  } catch(e) {
    console.error(e.message)
    display(e.message, msg)
  } 
});

client.login(BOT_TOKEN);