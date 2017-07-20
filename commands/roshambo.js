/*  roshambo.js by David Jerome @GlassToeStudio - GlassToeStudio@gmail.com

    19 July, 2017
    https://github.com/GlassToeStudio
    http://glasstoestudio.weebly.com/
    https://twitter.com/GlassToeStudio

    ------------------------------------------------------------------------
    Play a game of paper, rock, scissors with the bot.
    Input is received from user by the !roshambo <arg> command.
    Bot randomly selects a play.
    Results are return and displayed in the message channel.

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
const mojiMoves = [' ✊', ' ✋', ' ✌']
const scores = [[0, 0, 1],
                [1, 0, 0],
                [0, 1, 0]]

Confax.registerCommand('roshambo', 'default', (message, bot) => {
  let userMove = message.content.toLowerCase()
  if (userMove.includes('rock') || userMove.lastIndexOf('r') === 0 || userMove.includes('✊')) {
    userMove = 'rock'
  } else if (userMove.includes('paper') || userMove.lastIndexOf('p') === 0 || userMove.includes('✋')) {
    userMove = 'paper'
  } else if (userMove.includes('scissors') || userMove.lastIndexOf('s') === 0 || userMove.includes('✌')) {
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
  /*
  This could simply display the result of the bot move, and let the user
  figure our if he/she won or lost.
  */
  let winner
  if (scores[userIndex][botIndex] > scores[botIndex][userIndex]) {
    winner = message.author + ' **Wins!**'
  } else if (scores[userIndex][botIndex] < scores[botIndex][userIndex]) {
    winner = Confax.bot.user + ' **Wins!**'
  } else {
    winner = '**Its a draw!**'
  }
  /*
  Could also show an emoji of the move
  */
  let userMoji = mojiMoves[userIndex]
  let botMoji = mojiMoves[botIndex]
  return PrintResults(winner, userMove, botMove, userMoji, botMoji)
}

/**
 * Return the results in string for sending as a message to the channel.
 * @param  {string} winner
 * @param  {string} userMove
 * @param  {string} botMove
 */
function PrintResults (winner, userMove, botMove, userMoji, botMoji) {
  return 'played ' + userMove + userMoji + '.\n' + Confax.bot.user +
         ' played ' + botMove + botMoji + '.\n' + winner
}
