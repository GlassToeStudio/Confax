const GlassBot = require('../bot.js')

GlassBot.registerCommand('cat', 'default', (message) => {
  let options = {
    host: 'aws.random.cat',
    path: '/meow'
  }

  GlassBot.getHTTP(options).then(body => {
    body = JSON.parse(body)
    message.channel.send(body.file).catch(err => console.error(err.stack))
  })
}, ['kitty'], 'Get a random cat picture', '[]')
