<template>
  <td>
    <div v-if="false">
        <slot></slot>
    </div>
  </td>
</template>

<script>
export default {
  name: 'app-table-column',

  props: {
    show: { required: false, type: String },
    label: { default: null, type: String },
    dataType: { default: 'string', type: String },
    sortable: { default: true, type: Boolean },
    sortBy: { default: null },
    formatter: { default: v => v, type: Function },
    hidden: { default: false, type: Boolean }
  }
}
</script>
