/*  rohsambo.js by David Jerome @GlassToeStudio - GlassToeStudio@gmail.com

    19 July, 2017
    https://github.com/GlassToeStudio
    http://glasstoestudio.weebly.com/
    https://twitter.com/GlassToeStudio

    ------------------------------------------------------------------------
    Play a game of paper, rock, scissors with the bot.
    Input is receied from user by the !roshambo <arg> command.
    Bot randonly selects a play.
    Resutls are return and displayed in the message channel.

    Usage:
      !roshambo (rock or r, paper or p, scissors or s)

    Example:
      !roshambo rock

      @USER, played rock.
      @BOT played scissors.
      @USER Wins!
    ------------------------------------------------------------------------
*/

const Confax = require('../bot.js')
const moves = ['rock', 'paper', 'scissors']
const scores = [[0, 0, 1],
                [1, 0, 0],
                [0, 1, 0]]

Confax.registerCommand('roshambo', 'default', (message, bot) => {
  let userMove = message.content.toLowerCase()
  if (userMove.includes('rock') || userMove.lastIndexOf('r') === 0) {
    userMove = 'rock'
  } else if (userMove.includes('paper') || userMove.lastIndexOf('p') === 0) {
    userMove = 'paper'
  } else if (userMove.includes('scissors') || userMove.lastIndexOf('s') === 0) {
    userMove = 'scissors'
  } else {
    return message + ' is not a valid play.\n\n `Please use: \'Paper\', \'Rock\', or \'Scissors\'`'
  }
  return Roshambo(message, userMove, moves.indexOf(userMove))
}, moves, 'Play Rock-Paper-Scissors! !roshambo rock', '[]')

/**
 * Calculate Bot move, Check for winner, return results to send to channel.
 * @param  {string[]} message
 * @param  {string} userMove
 * @param  {number} userIndex
 */
function Roshambo (message, userMove, userIndex) {
  let botIndex = Math.floor(Math.random() * 3)
  return DetermineWinner(message, userMove, userIndex, moves[botIndex], botIndex)
}

/**
 * Check if User or Bot wins, else its a draw.
 * @param  {string[]} message
 * @param  {string} userMove
 * @param  {number} userIndex
 * @param  {string} botMove
 * @param  {number} botIndex
 */
function DetermineWinner (message, userMove, userIndex, botMove, botIndex) {
  let winner
  if (scores[userIndex][botIndex] < scores[botIndex][userIndex]) {
    winner = message.author + ' **Wins!**'
  } else if (scores[userIndex][botIndex] > scores[botIndex][userIndex]) {
    winner = Confax.bot.user + ' **Wins!**'
  } else {
    winner = '**Its a draw!**'
  }
  return PrintResults(winner, userMove, botMove)
}

/**
 * Return the results in string for sending as a message to the channel.
 * @param  {string} winner
 * @param  {string} userMove
 * @param  {string} botMove
 */
function PrintResults (winner, userMove, botMove) {
  return 'played ' + userMove + '.\n' + Confax.bot.user +
         ' played ' + botMove + '.\n' + winner
}
