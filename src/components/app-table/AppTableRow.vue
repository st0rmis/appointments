<template>
  <tr>
    <app-table-cell
      v-for="column in visibleColumns"
      :key="column.id"
      :row="row"
      :column="column"
    ></app-table-cell>
  </tr>
</template>

<script>
import AppTableCell from './AppTableCell'

export default {
  name: 'app-table-row',

  props: {
    columns: { type: Array, required: true },
    row: { type: Object, required: true }
  },

  components: {
    AppTableCell
  },

  computed: {
    visibleColumns () {
      return this.columns.filter(column => !column.header)
    }
  }
}
</script>
