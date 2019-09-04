<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Profilis</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form @submit.prevent="updateProfile">
                            <v-text-field prepend-icon="email"
                                          v-model="auth.email"
                                          type="email"
                                          disabled
                                          placeholder="El.paštas">
                            </v-text-field>
                            <v-text-field
                                    v-model="auth.name"
                                    prepend-icon="person"
                                    placeholder="Vardas">
                            </v-text-field>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" type="submit">Išsaugoti</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-btn v-on:click="enable" color="success">Įjungti pranešimus</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from '@/plugins/firebase'

export default {
  name: 'user-profile',
  data () {
    return {
      deferredPrompt: null
    }
  },
  computed: {
    ...mapGetters({
      'auth': 'auth/authUser'
    })
  },

  methods: {
    updateProfile () {
      let userId = this.auth.id
      this.$store.dispatch('user/updateUserProfile', {
        id: userId,
        name: this.auth.name
      })
    },
    prompt () {
      console.log('promptas')
      this.deferredPrompt.prompt()
      this.deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt')
          } else {
            console.log('User dismissed the A2HS prompt')
          }
          this.deferredPrompt = null
        })
    },
    configurePushSub () {
      if (!('serviceWorker' in navigator))
        return

      let reg
      navigator.serviceWorker.ready
        .then((swreg) => {
          reg = swreg
          return swreg.pushManager.getSubscription()
        })
        .then((sub) => {
          if (sub === null) {
            let vapidPublicKey = 'BLzfVgKaI6k_YRWtGfNmlnY3SSjTFjMXkD22lQZuB96mIoJ01F39oOzExQ2UlfQkUc2A2Imlmx9XJxBjteO6qlM'
            let convertedPublicKey = this.urlBase64ToUint8Array(vapidPublicKey)
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedPublicKey
            })
          } else {
            // we have
          }
        })
        .then((newSub) => {
          let stringify = JSON.parse(JSON.stringify(newSub))
          return db.collection('subscriptions').doc().set(stringify)
        })
        .then((res) => {
          this.displayNotification()
        })
        .catch((err) => {
          console.log('CONFPUSHERR', err)
        })
    },
    enable () {
      if ('Notification' in window) {
        console.log('requesting permissions')
        Notification.requestPermission((result) => {
          console.log('Userchoice', result)
          if (result !== 'granted')
            console.log('NOT GRANTED')
          else
            this.configurePushSub()
          // this.displayNotification()
        })
      }
    },
    displayNotification () {
      console.log('displaying notification!!!!')
      if ('serviceWorker' in navigator) {
        let options = {
          body: 'Nuo šiol gausite pranešimus!',
          icon: './img/icons/android-chrome-192x192.png',
          image: './img/icons/android-chrome-512x512.png',
          vibrate: [100, 50, 200],
          badge: './img/icons/android-chrome-192x192.png',
          tag: 'confirm-notification'
        }
        navigator.serviceWorker.ready
          .then((swreg) => {
            swreg.showNotification('Pranešimai užprenumeruoti!', options)
          })
      }
    },
    urlBase64ToUint8Array (base64String) {
      let padding = '='.repeat((4 - base64String.length % 4) % 4)
      let base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
      let rawData = window.atob(base64)
      let outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }
  },

  mounted: function () {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallpromptas worked')
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e
      return false
    })

    window.addEventListener('appinstalled', (event) => {
      console.log('installed')
    })
  },
}
</script>
