const requireModule = require.context('.', false, /\.js$/)
let routes = []

requireModule.keys().forEach((fileName) => {
  if (fileName === './index.js') return

  routes = [...routes, ...requireModule(fileName).default]
})

export default routes
