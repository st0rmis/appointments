<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap justify-center>
      <v-flex xs10 v-for="event in events" :key="event.id">
        <v-card color="pink lighten-5" class="brown--text text--darken-4">
          <v-layout :class="{'column': $vuetify.breakpoint.xs}">
            <v-flex xs4 :class="{'align-self-center': !$vuetify.breakpoint.xs}">
              <v-img v-if="event.imageUrl !== ''" :src="event.imageUrl" height="200px" contain>
              </v-img>
                <v-img v-else src="https://scontent.fplq1-1.fna.fbcdn.net/v/t1.0-9/46485905_2012937312105509_1523180417467809792_n.png?_nc_cat=101&_nc_ht=scontent.fplq1-1.fna&oh=8d05f0d040e769ee41e78fcf4c5c2c81&oe=5D5A31FF" height="200px" contain>
              </v-img>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div :class="{'headline': !$vuetify.breakpoint.xs, 'subheading': $vuetify.breakpoint.xs}">{{ event.name }}</div>
                  <div>Vieta: {{ event.location }}</div>
                  <div>Kaina: {{ event.type }}</div>
                  <div>{{ event.description }}</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions>
            <v-layout
                    align-center
                    justify-end
                    wrap
                    :class="{'column': $vuetify.breakpoint.xs}"
            >
                <v-flex>
                  <v-icon class="mr-1"> today </v-icon><span class="subheading mr-2">{{ event.date }}</span>
                </v-flex>
               <v-flex>
                   <v-icon class="mr-1"> watch_later </v-icon><span class="subheading mr-2">{{ event.time_from }} - {{ event.time_to }}</span>
               </v-flex>
                <v-flex>
                  <v-icon class="mr-1"> face </v-icon><span class="subheading mr-2">{{ generateLimits(event) }}</span>
                </v-flex>
              <v-spacer></v-spacer>
                <v-flex>
                  <v-btn v-if="auth && event.eventRegistered.length !== event.limit && !event.eventRegistered.includes(auth.id)" flat color="success" @click="registerToEvent(event.id)"><v-icon left light>person_add</v-icon>Registruotis</v-btn>
                  <v-btn v-else-if="auth && event.eventRegistered.length !== event.limit" flat color="error" @click="unregisterFromEvent(event.id)"><v-icon left light>remove_circle_outline</v-icon>Atšaukti</v-btn>
                </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',

  computed: {
    ...mapGetters({
      'auth': 'auth/authUser',
      'events': 'event/list',
      'loading': 'event/loading'
    }),

    showRegister () {
      return this.auth
    }
  },

  async created () {
    await this.$store.dispatch('auth/initAuth')
    this.$store.dispatch('event/getAllEvents')
  },

  methods: {
    generateLimits (event) {
      return event.eventRegistered.length + ' / ' + event.limit
    },

    registerToEvent (id) {
      let userId = this.auth.id
      this.$store.dispatch('event/register', {
        eventId: id,
        userId: userId
      })
        .then(() => {
         setTimeout(() => {
           this.$store.dispatch('event/getAllEvents')
         }, 400)
        })
    },

    unregisterFromEvent (id) {
      let userId = this.auth.id
      this.$store.dispatch('event/unregister', {
        eventId: id,
        userId: userId
      })
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch('event/getAllEvents')
          }, 400)
        })
    }
  }
}
</script>
