<template>
<v-container fluid fill-height>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Prisijungimas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
          <v-form @submit.prevent="login">
          <v-card-text>
            <v-text-field prepend-icon="email" type="email"
                          v-model="form.email"
                          @blur="$v.form.email.$touch()"
                          placeholder="El.paštas">
            </v-text-field>
              <template v-if="$v.form.email.$error || serverMessage">
                <span v-if="serverMessage">{{ serverMessage }}</span>
                <span v-if="!$v.form.email.required">Šis laukelis privalomas</span>
                <span v-else-if="!$v.form.email.email">Blogas adresas</span>
              </template>
            <v-text-field id="password" prepend-icon="lock" type="password"
                          v-model="form.password"
                          @blur="$v.form.password.$touch()"
                          placeholder="Password">
            </v-text-field>
              <template v-if="$v.form.password.$error">
                <span v-if="!$v.form.password.required">Šis laukelis privalomas</span>
                <span v-if="!$v.form.password.minLength">Slaptažodžio ilgis turi turėti bent 6 simbolius</span>
              </template>
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :disabled="loading">Pirmyn</v-btn>
        </v-card-actions>
          </v-form>
      </v-card>
<!--      <v-btn color="primary" :to="{name: 'passwordForgot'}">Forgot password?</v-btn>-->
<!--      <v-btn color="primary" :to="{name: 'register'}">Dont have account? Register!</v-btn>-->
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'auth-login',
  data () {
    return {
      form: {
        email: '',
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
    login () {
      this.serverMessage = ''
      this.$v.form.$touch()

      if (!this.$v.form.$invalid) {
        this.$store.dispatch('auth/login', {
          email: this.form.email,
          password: this.form.password
        })
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
