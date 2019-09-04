<template>
  <div>
    Forgot password?
    <div v-if="!passwordSent">
      <form @submit.prevent="forgotPassword">
        <div>
          <input type="email"
          v-model="form.email"
          @blur="$v.form.email.$touch()"
          placeholder="Email">
          <template v-if="$v.form.email.$error || serverMessage">
            <span v-if="serverMessage">{{ serverMessage }}</span>
            <span v-if="!$v.form.email.required">This field is required</span>
            <span v-else-if="!$v.form.email.email">This in not a valid email address</span>
          </template>
        </div>

        <button :disabled="loading">Send reset link</button>
      </form>
    </div>
    <div v-else>
      Your password sent to {{ form.email }}.
      Please check your email and click reset link
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'vauth-password-forgot',
  data () {
    return {
      passwordSent: false,
      form: {
        email: ''
      },
      serverMessage: ''
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  computed: {
    ...mapGetters({
      'loading': 'auth/loading'
    })
  },
  methods: {
    forgotPassword () {
      this.serverMessage = ''
      this.$v.form.$touch()

      if (!this.$v.form.$invalid) {
        this.$store.dispatch('auth/sendPasswordResetLink', this.form)
          .then(() => {
            this.passwordSent = true
          })
          .catch((response) => {
            this.serverMessage = response.message
          })
      }
    }
  }
}
</script>
