import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  onAuthStateChanged (success, error) {
    return firebase
      .auth()
      .onAuthStateChanged(success, error)
  },

  register (email, password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
  },

  authUserId () {
    return firebase.auth().currentUser.uid
  },

  login (email, password) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
  },

  logout () {
    return firebase
      .auth()
      .signOut()
  },

  sendPasswordResetEmail (email) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
  },

  confirmNewPassword (code, password) {
    return firebase.auth().confirmPasswordReset(code, password)
  }
}
