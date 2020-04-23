import * as firebase from 'firebase'
// import firestore from 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyAEjGoktV1437wxbCnlpmL6RNZEuAM3kC4',
  authDomain: 'my-tv-schedule.firebaseapp.com',
  databaseURL: 'https://my-tv-schedule.firebaseio.com',
  projectId: 'my-tv-schedule',
  storageBucket: 'my-tv-schedule.appspot.com'
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export { firebase }
