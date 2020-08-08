/*  cryptohistory.js by @GlassToeStudio - GlassToeStudio@gmail.com

    16 September, 2017
    https://github.com/GlassToeStudio
    http://glasstoestudio.weebly.com/
    https://twitter.com/GlassToeStudio

    ------------------------------------------------------------------------
    Return current price of a given crypto-currency in $US

    The command uses the API from: http://www.coincap.io/
    The API can be found here: https://github.com/CoinCapDev/CoinCap.io
    The API request can be found here: http://coincap.io/history/1day/<coin>
*/

const GlassBot = require('../bot.js')
const request = require('request')
const username = process.env.PLOTLY_USER_NAME
const plotlyapikey = process.env.PLOTLY_API_KEY
const plotly = require('plotly')(username, plotlyapikey)
const currencySymbolMap = require('../map')

var lay
var trace1
var trace2

GlassBot.registerCommand('cryptohistory', 'default', (message, bot) => {
  message.reply('**This api has been updated and this command no longer functions.**')
  let histories = [365, 180, 90, 30, 7, 1]
  let xAxis = []
  let yAxis = []
  let historyData
  let msg = (message.content.toUpperCase()).split(' ')
  let coin = msg[0]
  let hist = msg[1]
  lay = {}
  trace1 = {}
  // console.log('_____________')
  // console.log('Coin : ' + coin)
  // console.log('History : ' + hist)

  // No history argument was provided
  if (hist === undefined) hist = 1

  hist = parseInt(hist)
  // Check that history is an integer if not, create a temp var to see if history arg was privded first.
  if (isNaN(hist)) {
    let tempCoin = parseInt(coin)
    if (isNaN(tempCoin)) {
      console.log('TempCoin is not an int : ' + tempCoin)
      hist = '1'
    } else {
      coin = msg[1]
      hist = tempCoin
    }
  }

  for (let i = 0; i < histories.length; i++) {
    if (hist >= histories[i]) {
      hist = histories[i]
      break
    }
  }

  let address = 'http://coincap.io/history/' + hist + 'day/' + coin
  request(address, function (error, response, body) {
    if (error) { return ('Something went wrong ¯\\_(ツ)_/¯ ') }
    try {
      historyData = JSON.parse(body)
      let price = historyData.price
      for (let i = 0; i < price.length; i++) { // Last element is the current time/price.
        xAxis.push(UnixToDate(historyData.price[i][0], hist))
        // xAxis.push(historyData.price[i][0]) // time // TODO: format time output in chartconfig.json
        yAxis.push(historyData.price[i][1]) // price
      }
    } catch (error) { return ('<:doggo:328259712963313665>' + ' Not a valid crypto-currency, try BTC, ETH, or LTC.') }

    let yMin = Math.min(...yAxis)
    let yMax = Math.max(...yAxis)
    let current = historyData.price[historyData.price.length - 1][1]
    let height = ((yMax - yMin) * 0.20) + yMax

    trace1 = GlassBot.chartConfig.trace1
    trace2 = GlassBot.chartConfig.trace2
    lay = GlassBot.chartConfig.lay
    // changeColor(255, 64, 64)
    // xAxis.splice(xAxis.length - 1, 0, null)
    // yAxis.splice(yAxis.length - 1, 0, yMin)
    trace1.x = xAxis
    trace1.y = yAxis
    trace2.x = [xAxis[0], xAxis[xAxis.length - 1]]
    trace2.y = [current, current]
    trace1.name = coin
    // Create the chart layout and axis names
    lay.title = '<b>' + coin + ' ' + hist + ' Day History</b>'
    lay.yaxis.range[0] = yMin
    lay.yaxis.range[1] = height
    lay.xaxis.range[1] = xAxis.length - 1
    lay.annotations[0].text = 'Current: ' + getSymbolFromCurrency('USD') + parseFloat(current).toLocaleString('en-IN', { maximumSignificantDigits: 10, minimumFractionDigits: 2 })
    lay.annotations[1].text = 'Low: ' + getSymbolFromCurrency('USD') + parseFloat(yMin).toLocaleString('en-IN', { maximumSignificantDigits: 10, minimumFractionDigits: 2 })
    lay.annotations[2].text = 'High: ' + getSymbolFromCurrency('USD') + parseFloat(yMax).toLocaleString('en-IN', { maximumSignificantDigits: 10, minimumFractionDigits: 2 })

    // Set our data and graph options
    let graphOptions = {layout: lay, fileopt: 'overwrite', filename: 'Crytpo_History'}

    // Create the chart and plot our data
    plotly.plot([trace1, trace2], graphOptions, function (err, msg) {
      if (err) {
        console.log(err)
        return
      }
      let graphLocation = msg.url + '.png'

      message.channel.send({ embed: {
        'title': coin + ' ' + hist + ' Day History',
        'color': 55807,
        'file': graphLocation
      }})
    })
  })
}, ['hist', 'history', 'hsit', 'chart'], 'Show time series price data for a given currency.', '<crypto-currency ticker> Example: Bitcoin = BTC')

function getSymbolFromCurrency (currencyCode) {
  if (typeof currencyCode !== 'string') return undefined
  var code = currencyCode.toUpperCase()
  if (!currencySymbolMap.hasOwnProperty(code)) return undefined
  return currencySymbolMap[code]
}

function changeColor (red, green, blue) {
  // "rgb(0, 217, 255)",
  red = getRandomInt(0, 255)
  green = getRandomInt(0, 255)
  blue = getRandomInt(0, 255)

  let newColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')'
  trace1.line.color = newColor
  lay.titlefont.color = newColor
  lay.yaxis.linecolor = newColor
  lay.yaxis.zerolinecolor = newColor
  lay.yaxis.tickfont.color = newColor
  lay.xaxis.linecolor = newColor
  lay.xaxis.zerolinecolor = newColor
  lay.xaxis.tickfont.color = newColor
  // Min Max and Current values
  lay.annotations[0].font.color = newColor
  lay.annotations[1].font.color = newColor
  lay.annotations[2].font.color = newColor
  // Rectangles
  newColor = 'rgba(0, 231, 255, 0)'
  lay.shapes[0].line.color = newColor
  lay.shapes[1].line.color = newColor
  lay.shapes[2].line.color = newColor
  // "rgba(0, 231, 255, 0.28)",
  red = getRandomInt(0, 255)
  green = getRandomInt(0, 255)
  blue = getRandomInt(0, 255)
  newColor = 'rgba(' + red + ', ' + green + ', ' + blue + ', 0.28)'
  trace1.fillcolor = newColor
  // Rectangles
  newColor = 'rgba(0, 231, 255, 0)'
  lay.shapes[0].fillcolor = newColor
  lay.shapes[1].fillcolor = newColor
  lay.shapes[2].fillcolor = newColor
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Takes a UNIX time stamp (in milliseconds) and converts to
 * yyyy mm dd hh mm AM/PM
 * @param  {number} unixTimeStamp
 * @param  {number} history in days
 */
function UnixToDate (timestamp, hist) {
  let d = new Date(timestamp) // Convert the passed timestamp to milliseconds
  let yyyy = d.getFullYear()
  let mm = ('0' + (d.getMonth() + 1)).slice(-2)  // Months are zero based. Add leading 0.
  let dd = ('0' + d.getDate()).slice(-2) // Add leading 0.
  let hh = d.getHours()
  let h = hh
  let min = ('0' + d.getMinutes()).slice(-2) // Add leading 0.
  let ampm = 'AM'
  let time

  if (hh > 12) {
    h = hh - 12
    ampm = 'PM'
  } else if (hh === 12) {
    h = 12
    ampm = 'PM'
  } else if (hh === 0) {
    h = 12
  }

  if (hist !== 1) time = dateDict[mm] + ' - ' + dd + ', ' + h + ':' + min + ' ' + ampm
  else time = h + ':' + min + ' ' + ampm
  return time
}

const dateDict = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
}
