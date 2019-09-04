<template>
  <th
    @click="clicked"
    role="columnheader"
    :aria-sort="ariaSort"
    :aria-disabled="ariaDisabled">
    {{ label }}
  </th>
</template>

<script>
export default {
  name: 'app-table-column-header',

  props: {
    column: { type: Object, required: true },
    sort: { type: Object, required: false }
  },

  computed: {
    ariaDisabled () {
      if (!this.column.isSortable()) {
        return 'true'
      }

      return false
    },

    ariaSort () {
      if (!this.column.isSortable()) {
        return false
      }

      if (this.column.show !== this.sort.fieldName) {
        return 'none'
      }

      return this.sort.order === 'asc' ? 'ascending' : 'descending'
    },

    label () {
      if (this.column.label === null) {
        return this.column.show
      }

      return this.column.label
    }
  },

  methods: {
    clicked () {
      if (this.column.isSortable()) {
        this.$emit('click', this.column)
      }
    }
  }
}
</script>
