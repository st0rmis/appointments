<template>
  <div>
    <nav v-if="shouldShowPagination">
      <ul>
        <li :class="{ disabled: currentPage === 1 }">
          <a :class="{ disabled: currentPage === 1 }"
          @click="pageClicked( currentPage - 1 )">«</a>
        </li>
        <li v-if="hasFirst" :class="{ active: isActive(1) }">
            <a @click="pageClicked( 1 )">1</a>
        </li>
        <li v-if="hasFirstEllipsis">
          <span>&hellip;</span>
        </li>
        <li v-for="page in pages"
            :key="page"
            :class="{ active: isActive(page), disabled: page === '...' }">
            <a @click="pageClicked(page)">{{ page }}</a>
        </li>
        <li v-if="hasLastEllipsis">
          <span>&hellip;</span>
        </li>
        <li v-if="hasLast" :class="{ active: isActive(totalPages) }">
            <a @click="pageClicked(totalPages)">{{totalPages}}</a>
        </li>
        <li>
          <a :class="{ disabled: currentPage === totalPages }"
              @click="pageClicked( currentPage + 1 )">
              »
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'app-table-pagination',

  props: {
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true }
  },

  computed: {
    pages () {
      return this.totalPages === undefined
        ? []
        : this.pageLinks()
    },

    hasFirst () {
      return this.currentPage >= 4 || this.totalPages < 10
    },

    hasLast () {
      return this.currentPage <= this.totalPages - 3 || this.totalPages > 10
    },

    hasFirstEllipsis () {
      return this.currentPage >= 4 && this.totalPages >= 10
    },

    hasLastEllipsis () {
      return this.currentPage <= this.totalPages - 3 && this.totalPages >= 10
    },

    shouldShowPagination () {
      if (this.totalPages === undefined) {
        return false
      }

      return this.totalPages > 1
    }
  },

  methods: {
    isActive (page) {
      const currentPage = this.currentPage || 1
      return currentPage === page
    },

    pageClicked (page) {
      if (page === '...' ||
        page === this.currentPage ||
        page > this.totalPages ||
        page < 1) {
        return false
      }

      this.$emit('pageChange', page)
    },

    pageLinks () {
      const pages = []

      let left = 2
      let right = this.totalPages

      if (this.totalPages >= 10) {
        left = Math.max(1, this.currentPage - 2)
        right = Math.min(this.currentPage + 2, this.totalPages)
      }

      for (let i = left; i <= right; i++) {
        pages.push(i)
      }

      return pages
    }
  }
}
</script>
