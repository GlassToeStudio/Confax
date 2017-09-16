const GlassBot = require('../bot.js')
const math = require('mathjs')

GlassBot.registerCommand('math', 'default', (message, bot) => {
  let result
  try {
    result = math.eval(message.content)
  } catch (error) {
    console.log('Failed math calculation ' + message.content + '\nError: ' + error.stack)
    return 'Error while evaluating the math expression.'
  } finally {
    if (isNaN(parseFloat(result))) {
      return 'Invalid Calculation Expression'
    } else {
      return '**Result:** ' + result
    }
  }
}, ['calculate', 'calc', 'calculator'], 'Calculate a math expression', '<expression>')
