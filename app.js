if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1)
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
    })
  }
}

function HttpPromise () {
  /**
   * Helper for http calls
   * @param method
   * @param url
   * @param data
   * @returns {Promise}
   */
  function makeRequest (method, url, data) {
    var data = data || ''
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest()
      req.open(method, url)

      req.onload = function () {
        if (req.status == 200) {
          resolve(req.response)
        } else {
          reject(Error(req.statusText))
        }
      }
      req.onerror = function () {
        reject(Error('Something went wrong ... '))
      }
      console.log(String.format('Requsting: {0}', url))
      req.send(data)
    })
  }
  this.makeRequest = makeRequest
}

console.log('HI THERE')

// // usage example
var http = new HttpPromise()
var server = 'euw'

// for tier, replace with summoner id found here:
// https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/BelgianPrepperTV?api_key=RGAPI-34738506-E210-4270-A572-0902DF40980D
var summonerID = '23492511' // Arphan V2
var summonerName = 'BelgianPrepperTV'

var summonerLevelURI = 'https://{0}.api.pvp.net/api/lol/{0}/v1.4/summoner/by-name/{1}?api_key=RGAPI-34738506-E210-4270-A572-0902DF40980D'
var summonerTierURI = 'https://{0}.api.pvp.net/api/lol/{0}/v2.5/league/by-summoner/{1}/entry?api_key=RGAPI-34738506-E210-4270-A572-0902DF40980D'

var summonerLevelMessage = 'Current Summoner Level: {0}'
var summonerTierMessage = 'Current Rank - {0} {1}'

// SUMMONER LEVEL REQUEST
http.makeRequest('GET', String.format(summonerLevelURI, server, summonerName)).then(
  function (response) {
    var res = JSON.parse(response)

    document.getElementById('summonerLevelText')
      .innerText = String.format(summonerLevelMessage, res.belgianpreppertv.summonerLevel)
  },
  function (error) {
    document.getElementById('summonerLevelText')
      .innerText = 'Summoner Level Not Found'
  })

// SUMMONER TIER REQUEST
http.makeRequest('GET', String.format(summonerTierURI, server, summonerID)).then(
  function (response) {
    var res = JSON.parse(response)
    var base = res['23492511'][0]
    var tier = base.tier
    var division = base.entries[0].division
    var lp = base.entries[0].leaguePoints

    var final = String.format(
      'Current Rank: {0} - Division {1} - LP: {2}',
      tier, division, lp)

    document.getElementById('summonerTierText')
      .innerText = String.format(final)
  },
  function (error) {
    document.getElementById('summonerLevelText')
      .innerText = 'Summoner Level Not Found'
  })
