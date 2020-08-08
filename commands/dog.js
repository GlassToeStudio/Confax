const Confax = require('../bot.js')
const request = require('request')

Confax.registerCommand('dog', 'default', (message) => {
  request('http://random.dog/woof', function (error, response, body) {
    if (error) {
      //  error is always null, but put this here for jstandard: (Expected error to be handled.)
      message.channel.send('No doggo for you.')
      return
    }
    message.channel.send(`http://random.dog/${body}`).catch(err => console.error(err.stack))
  })
}, ['doggo'], 'Get a random dog picture', '[]')
