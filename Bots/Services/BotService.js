
const { MessageEmbed } = require('discord.js');
const pagination = require('discord.js-pagination')

class BotService {
  static display(msgContent, msg) {
    try {
      return msg.channel.send(msgContent)
    } catch(e) {
      console.error(e.message)
    }
  }

  static reply(msgContent, msg) {
    try {
      return msg.reply(msgContent)
    } catch(e) {
      console.error(e.message)
    }
  }

  static paginate(embeds, msg) {
    try {
      const pages = embeds.map(page => {
        return new MessageEmbed(page)
      })

      return pagination(msg, pages)
    } catch(e) {
      console.error(e.message)
    }
  }

  static embed(embeds, msg) {
    const embed = new MessageEmbed(embeds)
    return msg.channel.send(embed)
  }

  static autoDelete(embeds, msg, server, type) {
    try {
      const embed = new MessageEmbed(embeds)
      const bomb = msg.channel.send(embed)
      
      bomb 
        .then(result => {
          if(!!server.autoDeleteMessage[type]) {
            server.autoDeleteMessage[type].delete()
          }
          server.autoDeleteMessage[type] = result
        })
        .catch(err => {
          console.log("Error while sending message: ", err.message)
        })
  
      return bomb
    } catch(e) {
      console.error(e.message)
    }
  }

  static paginateAutoDelete(embeds, msg, server, type) {
    try {
      const pages = embeds.map(page => {
        return new MessageEmbed(page)
      })

      const bomb = pagination(msg, pages)

      bomb 
        .then(result => {
          if(!!server.autoDeleteMessage[type]) {
            server.autoDeleteMessage[type].delete()
          }
          server.autoDeleteMessage[type] = result
        })
        .catch(err => {
          console.log("Error while sending message: ", err.message)
        })

      return bomb
    } catch(e) {
      console.error(e.message)
    }
  }
}

module.exports = BotService