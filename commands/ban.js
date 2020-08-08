const Confax = require('../bot.js')

Confax.registerCommand('ban', 'moderator', (message, bot) => {
  let mention = message.mentions.users.first()
  let banPerms = message.guild.member(bot.user).hasPermission('BAN_MEMBERS')
  if (!mention) {
    return 'Please mention the user you wish to ban.'
  } else {
    if (!banPerms) {
      return 'GlassBot doesn\'t have enough permissions to ban any user.'
    } else {
      let bannable = message.guild.member(mention).bannable
      if (!bannable) {
        return mention + ' isn\'t bannable.'
      } else {
        message.guild.ban(mention)
        return mention + ' has been banned.'
      }
    }
  }
}, [], 'Ban a user from the server', '<mention>')
