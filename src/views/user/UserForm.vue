<template>
  <div>
    User list
    <br>
    <app-table
      v-if="!loading"
      :data="users"
      :rows-per-page="10"
      :sort-default="{
        fieldName: 'name',
        order: 'asc'
      }">
        <app-table-column show="name" label="Name"></app-table-column>
        <app-table-column show="email" label="Email"></app-table-column>
        <app-table-column show="createdAt" label="Created At"></app-table-column>
        <app-table-column label="Actions" :sortable="false">
          <template v-slot="row">
              <a :href="`#${row.name}`">Edit</a>
          </template>
        </app-table-column>
    </app-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'user-list',

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
