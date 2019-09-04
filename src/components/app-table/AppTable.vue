<template>
  <div>
    <table v-if="!loader">
      <thead>
        <tr>
          <app-table-column-header
            v-for="column in columns"
            :key="column.show"
            :sort="sort"
            :column="column"
            @click="changeSorting"
          ></app-table-column-header>
        </tr>
      </thead>
      <tbody>
        <app-table-row
          v-for="row in displayedRows"
          :key="row.vueTableComponentInternalRowId"
          :row="row"
          :columns="columns"
        ></app-table-row>
      </tbody>
    </table>

    <div style="display:none;">
      <slot></slot>
    </div>

    <app-table-pagination
      v-if="showPagination"
      :totalPages="totalPages"
      :currentPage="currentPage"
      @pageChange="pageChange">
    </app-table-pagination>
  </div>
</template>

<script>
import Column from './classes/Column'
import Row from './classes/Row'

import AppTableColumnHeader from './AppTableColumnHeader'
import AppTableRow from './AppTableRow'
import AppTablePagination from './AppTablePagination'

export default {
  name: 'app-table',

  components: {
    AppTableColumnHeader,
    AppTableRow,
    AppTablePagination
  },

  props: {
    data: { type: Array, required: true },
    sortDefault: { type: Object, required: false },
    rowsPerPage: { type: Number, required: false },
    loader: { type: Boolean, default: false, required: false },
    showPagination: { type: Boolean, default: true, required: false }
  },

  data () {
    return {
      columns: [],
      rows: [],
      sort: {
        fieldName: '',
        order: ''
      },
      currentPage: 1
    }
  },

  created () {
    this.sort = this.sortDefault
  },

  mounted () {
    const columnComponents = this.$scopedSlots.default()
      .filter(column => column.componentInstance)
      .map(column => column.componentInstance)

    this.columns = columnComponents.map(
      column => new Column(column)
    )

    columnComponents.forEach(columnComponent => {
      Object.keys(columnComponent.$options.props).forEach(
        prop => columnComponent.$watch(prop, () => {
          this.column = columnComponents.map(
            column => new Column(column)
          )
        })
      )
    })

    this.mapDataToRows()
  },

  computed: {
    totalPages () {
      const totalRows = this.data.length
      return Math.ceil(totalRows / this.rowsPerPage)
    },

    displayedRows () {
      if (this.sort.fieldName === '') {
        return this.rows
      }

      if (this.columns.length === 0) {
        return this.rows
      }

      const sortColumn = this.getColumn(this.sort.fieldName)

      if (!sortColumn) {
        return this.rows
      }

      return this.rows
        .slice()
        .sort(sortColumn.getSortPredicate(this.sort.order, this.columns))
        .filter((row, index) => {
          let start = (this.currentPage - 1) * this.rowsPerPage
          let end = this.currentPage * this.rowsPerPage
          if (index >= start && index < end) return true
        })
    }
  },

  methods: {
    pageChange (page) {
      this.currentPage = page
      this.mapDataToRows()
    },

    mapDataToRows () {
      const data = this.data

      let rowId = 0

      this.rows = data
        .map(rowData => {
          rowData.vueTableComponentInternalRowId = rowId++
          return rowData
        })
        .map(rowData => new Row(rowData, this.columns))
    },

    changeSorting (column) {
      if (this.sort.fieldName !== column.show) {
        this.sort.fieldName = column.show
        this.sort.order = 'asc'
      } else {
        this.sort.order = (this.sort.order === 'asc' ? 'desc' : 'asc')
      }
    },

    getColumn (columnName) {
      return this.columns.find(column => column.show === columnName)
    }
  }
}
</script>
