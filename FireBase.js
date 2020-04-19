import * as firebase from 'firebase'
// import firestore from 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyDibiKCzy27CCE-J5_ncb1imwzYqK9-L_Q',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'https://console.firebase.google.com/u/0/project/vipstay-637a2/database/firestore/data~2Ftodos~2Ftodo',
  projectId: 'vipstay-637a2',
  storageBucket: 'YOUR_STORAGE_BUCKET'
}
firebase.initializeApp(config)

const programCollection = firebase.firestore().collection('programs')

export { firebase, programCollection }
