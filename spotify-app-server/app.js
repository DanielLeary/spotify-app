const express = require('express')
const app = express()
const api = require('./API');
/*app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  next();
 });*/
app.use('/api', api);


app.listen(3000, function () {
  console.log('Spotify API server listening on port 3000')
})
