<template>
  <div>
    <div class="authentification">
      <h2>VueJS + Google Calendar Example</h2>
      Authentification
      <button v-if="!authorized" @click="handleAuthClick">Sign In</button>
      <button v-if="authorized" @click="handleSignoutClick">Sign Out</button>
    </div>
    <hr>
    <button v-if="authorized" @click="getData">Get Data</button>
    <div v-if="authorized && items" class="item-container">
      <pre v-html="items" />
    </div>

  </div>
</template>
<script>

// Client ID and API key from the Developer Console
const CLIENT_ID = '375119189242-jfso1bg6anfeukb8vh9diprduaid363g.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBUCDsjbkQ8AV6ps4jGfIp7BeB4BNjswcs'
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

export default {
  data() {
    return {
      items: undefined,
      api: undefined,
      authorized: false
    }
  },
  mounted() {
    document.addEventListener('onload', this.handleClientLoad)
  },
  methods: {
    handleClientLoad() {
      gapi.load('client:auth2', this.initClient)
    },
    handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        this.authorized = true
      })
    },
    initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(_ => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)
      })
    },
    getData() {
      gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }).then(response => {
        console.log(response)
      })
    },
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
    }
  },
  head: {
    script: [
      { src: 'https://apis.google.com/js/api.js' }
    ]
  }
}
</script>

