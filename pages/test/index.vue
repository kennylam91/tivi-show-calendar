<template>
  <div>
    <client-only>
      <div class="authentification">
        <h2>VueJS + Google Calendar Example</h2>
        Authentification
        <button v-if="!authorized" @click="handleAuthClick">Sign In</button>
        <button v-if="authorized" @click="handleSignoutClick">Sign Out</button>
      </div>
      <hr>
      <button v-if="authorized" @click="addEvent">Add Event</button>
      <div v-if="authorized && items" class="item-container">
        <pre v-html="items" />
      </div>
    </client-only>
  </div>
</template>
<script>

// // Client ID and API key from the Developer Console
// const CLIENT_ID = '375119189242-jfso1bg6anfeukb8vh9diprduaid363g.apps.googleusercontent.com'
// const API_KEY = 'AIzaSyBUCDsjbkQ8AV6ps4jGfIp7BeB4BNjswcs'
// // Array of API discovery doc URLs for APIs used by the quickstart
// const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
// const SCOPES = 'https://www.googleapis.com/auth/calendar'

export default {
  data() {
    return {
      items: undefined,
      api: undefined,
      authorized: false
    }
  },
  mounted() {
    // document.addEventListener('onload', this.handleClientLoad)
  },
  methods: {
    // handleClientLoad() {
    //   debugger
    //   gapi.load('client:auth2', this.initClient)
    // },
    handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        this.authorized = true
      })
    },
    // initClient() {
    //   gapi.client.init({
    //     apiKey: API_KEY,
    //     clientId: CLIENT_ID,
    //     discoveryDocs: DISCOVERY_DOCS,
    //     scope: SCOPES
    //   }).then(_ => {
    //     // Listen for sign-in state changes.
    //     gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
    //   })
    // },
    updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        // listUpcomingEvents()
        this.authorized = true
      }
    },
    handleSignoutClick(event) {
      Promise.resolve(gapi.auth2.getAuthInstance().signOut())
        .then(_ => {
          this.authorized = false
        })
    },
    addEvent() {
      var event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': new Date(2020, 5, 7, 0, 0, 0, 0),
          'timeZone': 'Etc/GMT+7'
        },
        'end': {
          'dateTime': new Date(2020, 5, 8, 0, 0, 0, 0),
          'timeZone': 'Etc/GMT+7'
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          { 'email': 'lpage@example.com' },
          { 'email': 'sbrin@example.com' }
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            { 'method': 'email', 'minutes': 24 * 60 },
            { 'method': 'popup', 'minutes': 10 }
          ]
        }
      }

      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      })

      request.execute(function(event) {
        console.log('Event created: ' + event.htmlLink)
      })
    }
  }
}
</script>

