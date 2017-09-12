const GlassBot = require('../bot.js')
const bot = GlassBot.bot

bot.on('ready', () => {
  bot.user.setGame('!help to get started.')
  bot.user.setStatus('online')
  console.log('GlassBot Seeks Bad Code!')
})

bot.on('reconnecting', () => {
  bot.user.setGame('!help to get started.')
  bot.user.setStatus('online')
  console.log('GlassBot has reconnected to Discord.')
})

bot.login(process.env.BOT_TOKEN)
