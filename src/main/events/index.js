const files = require.context('.', false, /\.(js|ts)$/)
const events = {}
files.keys().forEach(key => {
  if (key === './index.js') return
  events[key.replace(/(\.\/|\.(js|ts))/g, '')] = files(key).default
})

export default events
