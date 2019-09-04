export default {
  name: 'app-table-cell',

  functional: true,

  props: {
    column: { type: Object, required: true },
    row: { type: Object, required: true }
  },

  render (createElement, { props }) {
    const data = {}

    if (props.column.template) {
      return createElement('td', data, props.column.template(props.row.data))
    }

    data.domProps = {}
    data.domProps.innerHTML = props.column.formatter(props.row.getValue(props.column.show), props.row.data)

    return createElement('td', data)
  }
}
