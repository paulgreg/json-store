const app = require('./app')
const settings = require('./settings.json')

const port = process.env.PORT || settings.port || 3000

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
