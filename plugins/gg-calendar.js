// Client ID and API key from the Developer Console
const CLIENT_ID = '375119189242-jfso1bg6anfeukb8vh9diprduaid363g.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBUCDsjbkQ8AV6ps4jGfIp7BeB4BNjswcs'
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

gapi.load('client:auth2', initClient)
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(_ => {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
  })
}
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    listUpcomingEvents()
    console.log('sign in')
  }
}
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items

    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        var event = events[i]
        var when = event.start.dateTime
        if (!when) {
          when = event.start.date
        }
      }
    }
  })
}
