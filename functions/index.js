const functions = require('firebase-functions');
const admin = require('firebase-admin')
const webpush = require('web-push')

let serviceAccount = require("./fbkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL
});

exports.createSubscription = functions.firestore
  .document('events/{eventId}')
  .onCreate((snap, context) => {
    console.log('context: ', context, 'snapData: ', snap.data())
    const newValue = snap.data()

    webpush.setVapidDetails(
      process.env.VUE_APP_VAPID_EMAIL,
      process.env.VUE_APP_VAPID_KEY1,
      process.env.VUE_APP_VAPID_KEY2,
    )

    return admin.firestore().collection('subscriptions').get()
      .then(subs => {
        subs.forEach(sub => {
          let pushConfig = sub.data()
          delete pushConfig.expirationTime
          console.log('pushConfig: ', pushConfig)
          let message = 'New entry created - ' + newValue.name
          // eslint-disable-next-line promise/no-nesting
          webpush.sendNotification(pushConfig, JSON.stringify({title: 'New entry!', content: message}))
            .catch((err) => {
              console.log(err)
            })
        })
        return true
      })
      .catch((err) => {
        console.log('Firebase Admin Collection Error: ', err)
      })
  })
