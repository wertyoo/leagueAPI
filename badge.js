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
      req.send(data)
    })
  }
  this.makeRequest = makeRequest
}

// optional
var server = 'euw'
var summonerName = 'robodt'

// globals
var http = new HttpPromise()
var summonerID = ''
var level = ''
var tier = ''
var division = ''
var badge = new Image()
var summonerLevelURI = 'https://{0}.api.pvp.net/api/lol/{0}/v1.4/summoner/by-name/{1}?api_key=RGAPI-34738506-E210-4270-A572-0902DF40980D'
var summonerTierURI = 'https://{0}.api.pvp.net/api/lol/{0}/v2.5/league/by-summoner/{1}/entry?api_key=RGAPI-34738506-E210-4270-A572-0902DF40980D'

function getLevel () {
  http.makeRequest('GET', String.format(summonerLevelURI, server, summonerName)).then(
    function (response) {
      var res = JSON.parse(response)
      summonerName = summonerName.toLowerCase()
      summonerID = res[summonerName].id

      if (res[summonerName].summonerLevel < 30)
        badge.src = 'assets/img/unranked.png'
      else
        getTier()
    },
    function (error) {
      console.error('Please check username and server!')
    })
}

function getTier () {
  // SUMMONER TIER REQUEST
  http.makeRequest('GET', String.format(summonerTierURI, server, summonerID)).then(
    function (response) {
      var res = JSON.parse(response)
      var base = res[summonerID][0]

      tier = base.tier.toLowerCase()
      badge.src = String.format('assets/img/{0}.png', tier)
    },
    function (error) {
      badge.src = 'assets/img/unranked.png'
    })
}

getLevel()

document.getElementById('badgeHolder').appendChild(badge)
