<template>
  <v-layout justify-center>
    <v-flex xs12 sm10 md10>
      <v-toolbar flat color="white">
        <v-toolbar-title>Vartotojai</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Keisti rolę</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field disabled v-model="editedItem.name" label="Vardas"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field disabled v-model="editedItem.email" label="El.paštas"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-select
                      :items="roleItems"
                      label="Rolė"
                      v-model="editedItem.role"
                      item-text="label"
                      item-value="name"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Atgal</v-btn>
              <v-btn color="blue darken-1" flat @click="save">Saugoti</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
              rows-per-page-text="Įrašų per puslapį"
        :headers="headers"
        :items="users"
        class="elevation-1"
      >
        <template v-slot:items="users">
          <td class="text-xs-left">{{ users.item.name }}</td>
          <td class="text-xs-left">{{ users.item.email }}</td>
          <td class="text-xs-left">{{ users.item.role }}</td>
          <td class="text-xs-right">
            <v-icon
              small
              class="mr-2"
              @click="editItem(users.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(users.item)"
            >
              delete
            </v-icon>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'user-list',
  data () {
    return {
      roleItems: [
        { name: 'admin', label: 'Administratorius' },
        { name: 'creator', label: 'Kūrėjas' },
        { name: 'guest', label: 'Svečias' }
      ],
      headers: [
        { text: 'Vardas', value: 'name' },
        { text: 'El.paštas', value: 'email' },
        { text: 'Rolė', value: 'role' },
        { text: 'Veiksmai', sortable: false, align: 'right' }
      ],
      dialog: false,
      initialize: false,
      defaultItem: {
        id: null,
        name: '',
        email: 0,
        role: 0
      },
      editedItem: {}
    }
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      confirm('Ar tikrai?') && this.users.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
        this.$store.dispatch('user/updateUser', { id: this.editedItem.id, role: this.editedItem.role })
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    }
  },

  computed: {
    ...mapGetters({
      'users': 'user/list',
      'loading': 'user/loading'
    })
  },

  created () {
    this.$store.dispatch('user/getAllUsers')
  },

  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('user/clear')
    next()
  },

  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('user/getAllUsers')
    next()
  }
}
</script>
