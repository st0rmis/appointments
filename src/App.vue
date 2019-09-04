<template>
  <v-app style="
    background: #F8BBD0;
    background: -webkit-linear-gradient(to right, #F8BBD0, #FFCDD2);
    background: linear-gradient(to right, #F8BBD0, #FFCDD2);
  ">
    <v-navigation-drawer app temporary v-model="sideNav" class="red lighten-3 brown--text text--darken-5" light>
        <v-img max-height="150px" :src="require('./assets/logo-tg.png')">
        </v-img>
      <v-list>
          <v-list-tile to="/" tag="span"> <v-list-tile-action> <v-icon> home </v-icon> </v-list-tile-action>
            <v-list-tile-content>
              Pradinis
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/event/create" tag="span" v-if="authUser && (authUser.role === 'admin' || authUser.role === 'creator')" > <v-list-tile-action> <v-icon> add </v-icon> </v-list-tile-action>
              <v-list-tile-content>
                  Kurti
              </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/event/list" tag="span" v-if="authUser && (authUser.role === 'admin' || authUser.role === 'creator')" > <v-list-tile-action> <v-icon> edit </v-icon> </v-list-tile-action>
              <v-list-tile-content>
                  Keisti
              </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/user/profile" tag="span" v-if="authUser" > <v-list-tile-action> <v-icon> perm_identity </v-icon> </v-list-tile-action>
              <v-list-tile-content>
                  Profilis
              </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/user/list" tag="span" v-if="authUser && authUser.role === 'admin'" > <v-list-tile-action> <v-icon> people_outline </v-icon> </v-list-tile-action>
              <v-list-tile-content>
                  Vartotojai
              </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/auth/login" tag="span" v-if="!authUser" > <v-list-tile-action> <v-icon> lock_open </v-icon> </v-list-tile-action>
              <v-list-tile-content>
                  Prisijungti
              </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/auth/register" tag="span" v-if="!authUser" > <v-list-tile-action> <v-icon> person_add </v-icon> </v-list-tile-action>
              <v-list-tile-content>
                  Registruotis
              </v-list-tile-content>
          </v-list-tile>

        <v-list-tile tag="span" @click.prevent="logout" v-if="authUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Atsijungti</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app absolute class="pink lighten-3 brown--text text--darken-5" dark>
      <v-toolbar-side-icon
        @click.stop="sideNav = !sideNav"
        class="hidden-md-and-up"
      ></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">
          <v-flex >
              <img style="width: 140px; padding-top: 8px" src="./assets/logo-tg.png">
          </v-flex>
<!--          <v-img src="https://scontent.fplq1-1.fna.fbcdn.net/v/t1.0-9/46485905_2012937312105509_1523180417467809792_n.png?_nc_cat=101&_nc_ht=scontent.fplq1-1.fna&oh=8d05f0d040e769ee41e78fcf4c5c2c81&oe=5D5A31FF"></v-img>-->
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat to="/"> <v-icon left>home</v-icon> Pradinis </v-btn>
          <v-btn flat to="/event/create" v-if="authUser && (authUser.role === 'admin' || authUser.role === 'creator')"> <v-icon left>add</v-icon> Kurti </v-btn>
          <v-btn flat to="/event/list" v-if="authUser && (authUser.role === 'admin' || authUser.role === 'creator')"> <v-icon left>edit</v-icon> Keisti </v-btn>
          <v-btn flat to="/user/profile" v-if="authUser"> <v-icon left>perm_identity</v-icon> Profilis </v-btn>
          <v-btn flat to="/user/list" v-if="authUser && authUser.role === 'admin'"> <v-icon left>people</v-icon> Vartotojai </v-btn>
          <v-btn flat to="/auth/login" v-if="!authUser"><v-icon left>lock_open</v-icon>Prisijungti</v-btn>
          <v-btn flat to="/auth/register" v-if="!authUser"><v-icon left>person_add</v-icon>Registruotis</v-btn>
          <v-btn flat @click.prevent="logout" v-if="authUser"><v-icon left>exit_to_app</v-icon>Atsijungti</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      sideNav: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    ...mapState('auth', ['authUser']),

    routeLoaded () {
      return !!this.$route.name
    }
  }
}
</script>
