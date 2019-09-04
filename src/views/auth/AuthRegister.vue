<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registracija</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field prepend-icon="email"
                            v-model="form.email"
                            @blur="$v.form.email.$touch()"
                            type="email"
                            placeholder="El.paštas">
              </v-text-field>
                <template v-if="$v.form.email.$error || serverMessage">
                  <span v-if="serverMessage">{{ serverMessage }}</span>
                  <span v-if="!$v.form.email.required">Šis laukelis privalomas</span>
                  <span v-else-if="!$v.form.email.email">Blogas adresas</span>
                </template>
              <v-text-field
                v-model="form.name"
                @blur="$v.form.name.$touch()"
                prepend-icon="person"
                placeholder="Vardas">
              </v-text-field>
                <template v-if="$v.form.name.$error || serverMessage">
                  <span v-if="!$v.form.name.required">Šis laukelis privalomas</span>
                </template>
              <v-text-field prepend-icon="lock" name="password" type="password"
                v-model="form.password"
                @blur="$v.form.password.$touch()"
                placeholder="Slaptažodis">
              </v-text-field>
              <template v-if="$v.form.password.$error">
                <span v-if="!$v.form.password.required">Šis laukelis privalomas</span>
                <span v-if="!$v.form.password.minLength">Slaptažodžio ilgis turi turėti bent 6 simbolius</span>
              </template>
             <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disable="loading" type="submit">Pirmyn</v-btn>
             </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'auth-register',
  data () {
    return {
      form: {
        email: '',
        name: '',
        password: ''
      },
      serverMessage: ''
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      name: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  computed: {
    ...mapGetters({
      'loading': 'auth/loading'
    })
  },
  methods: {
    register () {
      this.serverMessage = ''
      this.$v.form.$touch()

      if (!this.$v.form.$invalid) {
        this.$store.dispatch('auth/register', this.form)
          .then(() => {
            this.$router.push({ name: 'home' })
          })
          .catch((response) => {
            this.serverMessage = response.message
          })
      }
    }
  }
}
</script>
