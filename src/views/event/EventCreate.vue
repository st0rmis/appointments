<template>
  <v-container>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="pink lighten-5" class="elevation-12 brown--text text--darken-4">
            <v-card-title>
              <h3>Kurti naują skelbimą</h3>
            </v-card-title>
            <v-card-text>
              <form @submit.prevent="createEvent">
                <v-layout row>
                  <v-flex>
                    <v-text-field
                            name="name"
                            label="Pavadinimas"
                            id="name"
                            box
                            required
                            light
                            v-model="form.name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                                v-model="form.date"
                                label="Data"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="form.date" @input="menu = false" locale="lt"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-spacer></v-spacer>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-dialog
                            ref="dialog"
                            v-model="modal"
                            :return-value.sync="form.time_from"
                            persistent
                            lazy
                            full-width
                            width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                                v-model="form.time_from"
                                label="Nuo.."
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                              v-if="modal"
                              v-model="form.time_from"
                              format="24hr"
                              locale="lt"
                              full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(form.time_from)">OK</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-dialog
                            ref="dialog2"
                            v-model="modal2"
                            :return-value.sync="form.time_to"
                            persistent
                            lazy
                            full-width
                            width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                                v-model="form.time_to"
                                label="Iki.."
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                              v-if="modal2"
                              v-model="form.time_to"
                              format="24hr"
                              full-width
                              locale="lt"
                      >
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal2 = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog2.save(form.time_to)">OK</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex>
                    <v-slider
                            light
                            :min="1"
                            :max="20"
                            v-model="form.limit"
                            thumb-color="red"
                            thumb-label="always"
                            label="Limitas"
                    ></v-slider>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-text-field
                            light
                            name="location"
                            label="Vieta"
                            id="location"
                            required
                            box
                            v-model="form.location"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-text-field
                            name="type"
                            light
                            label="Kaina"
                            id="type"
                            required
                            box
                            v-model="form.type"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-text-field
                            name="imageUrl"
                            label="Nuotraukos URL"
                            id="imageUrl"
                            light
                            box
                            v-model="form.imageUrl"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-textarea
                            name="description"
                            label="Aprašymas"
                            id="description"
                            light
                            box
                            v-model="form.description"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-btn :disabled="!formIsValid" type="submit" class="primary">Kurti</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-card-text>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'event-create',

  data () {
    return {
      form: {
        name: '',
        type: '',
        location: '',
        imageUrl: '',
        description: '',
        date: new Date().toISOString().substr(0, 10),
        time_from: null,
        time_to: null,
        limit: 5
      },
      serverMessage: '',
      menu: false,
      modal: false,
      modal2: false
    }
  },

  computed: {
    ...mapGetters({
      'loading': 'event/loading'
    }),
    formIsValid () {
      return this.form.name !== '' &&
        this.form.location !== '' &&
        this.form.description !== '' &&
        this.form.type !== ''
    }
  },

  methods: {
    createEvent () {
      this.serverMessage = ''

      this.$store.dispatch('event/createEvent', this.form)
        .then(() => {
          this.$router.push({ name: 'events' })
          this.$store.dispatch('event/getUserEvents')
        })
        .catch((response) => {
          this.serverMessage = response.message
        })
    }
  }

}
</script>
