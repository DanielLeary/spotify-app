const express = require('express')
const app = express()
const api = require('./API');

app.use('/api', api);


app.listen(3000, function () {
  console.log('Spotify API server listening on port 3000')
})
