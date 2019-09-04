<template>
  <div>
    <a href="#" @click.prevent="logout">Logout</a>
    <router-link :to="{ name: 'users' }">Users list</router-link>
    <router-link :to="{ name: 'home' }">Home list</router-link>
    <br>
    <router-link :to="{ name: 'events' }">Event list</router-link>
    App layout
    <br>
    <button v-on:click="prompt">ADD</button>
    <br>
    <button v-on:click="enable">ENABLE</button>
    <br>
    <slot/>
  </div>
</template>

<script>
import { db } from '../plugins/firebase'
export default {
  data () {
    return {
      deferredPrompt: null
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push({ name: 'login' })
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
          body: 'You successfully subscribed! THank YI!',
          icon: './img/icons/android-chrome-192x192.png',
          image: './img/icons/android-chrome-512x512.png',
          vibrate: [100, 50, 200],
          badge: './img/icons/android-chrome-192x192.png',
          tag: 'confirm-notification'
        }
        navigator.serviceWorker.ready
          .then((swreg) => {
            swreg.showNotification('SUCCESSFULLY YES!', options)
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
  beforeRouteEnter() {
    console.log(this.deferredPrompt)
  }
}
</script>
