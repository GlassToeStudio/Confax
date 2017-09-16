const GlassBot = require('../bot.js')
const bot = GlassBot.bot
const config = GlassBot.config
const commands = GlassBot.commands

bot.on('message', (message) => {
  let cmd
  let cmdType
  if (message.author.id === config.botID) {
  //  This is the bot speaking
  } else if (message.author.bot) {
  //  This is the bot speaking
  } else {
    message.content = message.content.toLowerCase()
    for (let loopCmdType in commands) {
      for (let loopCmd in commands[loopCmdType]) {
        if (message.content.lastIndexOf(config.prefix + loopCmd, 0) === 0 || message.content.lastIndexOf(loopCmd + config.suffix, 0) === 0) {
          message.content = message.content.replace(config.prefix + loopCmd, '')
          message.content = message.content.replace(loopCmd + config.suffix, '')
          cmd = loopCmd
          cmdType = loopCmdType
          break
        } else {
          let aliases = commands[loopCmdType][loopCmd].aliases
          for (let i = 0; i < aliases.length; i++) {
            let alias = aliases[i]
            if (message.content.lastIndexOf(config.prefix + alias, 0) === 0 || message.content.lastIndexOf(alias + config.suffix, 0) === 0) {
              message.content = message.content.replace(config.prefix + alias, '')
              message.content = message.content.replace(alias + config.suffix, '')
              cmd = loopCmd
              cmdType = loopCmdType
              break
            }
          }
        }
      }
    }
    message.content = message.content.indexOf(' ') === 0 ? message.content.substring(1) : message.content
    if (cmd !== null) {
      if (cmdType === 'master') {
        if (!(config.masters).includes(message.author.id)) {
          message.reply("You don't have enough permissions to execute this command.")
          return
        }
      } else if (cmdType === 'moderator') {
        let accepted = ['Bot Commander', 'Moderator']
        let isMod
        let roles = message.guild.member(message.author.id).roles.array()
        for (let i = 0; i < roles.length; i++) {
          if (accepted.includes(roles[i].name)) {
            isMod = true
            break
          }
        }
        if (!isMod) {
          message.reply("You don't have enough permissions to execute this command.")
          return
        }
      } else if (cmdType === 'dm') {
        if (message.channel.type === 'dm') {
          console.log(message.author.username + ' - ' + message.content)
        } else {
          return
        }
      }
      try {
        var result = commands[cmdType][cmd].process(message, bot)
      } catch (error) {
        console.log('An Error occured, but so what ;) : ' + error.stack)
      }
      if (result) {
        if (cmdType === 'dm') {
          message.author.send(result)
        } else {
          message.reply(result)
        }
      }
    }
  }
})
