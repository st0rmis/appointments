<template>
  <div>
    Reset password
    <form @submit.prevent="resetPassword">
      <div>
        <input type="password"
        v-model="form.password"
        @blur="$v.form.password.$touch()"
        placeholder="Password">
        <template v-if="$v.form.password.$error">
          <span v-if="!$v.form.password.required">This field is required</span>
          <span v-if="!$v.form.password.minLength">The password must be at least 6 characters long</span>
        </template>
      </div>

      <button :disabled="loading">Reset password</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'auth-reset-password',
  data () {
    return {
      form: {
        password: ''
      },
      serverMessage: ''
    }
  },
  validations: {
    form: {
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
    resetPassword () {
      this.serverMessage = ''
      this.$v.form.$touch()

      if (!this.$v.form.$invalid) {
        const code = this.$route.query.oobCode
        if (!code) {
          this.serverMessage = 'Wrong token'
          return
        }

        this.$store.dispatch('auth/confirmNewPassword', { code: code, password: this.form.password })
          .then(() => {
            this.$router.push({ name: 'login' })
          })
          .catch((response) => {
            this.serverMessage = response.message
          })
      }
    }
  }
}
</script>
