// express class
var express = require('express')
// express instance
var app = express()
// hogan
var hogan = require('hogan-express')
// hogan html
app.engine('html', hogan)
// views dir, but we don't use it
app.set('views', __dirname + '/')
// listen to 3000
app.set('port', process.env.PORT || 3000)
// public dir
app.use(express.static(__dirname + '/public'))
// get index html
app.get('*', function(req, res){
  res.render('index.html')
})
// log
console.log('Listening at localhost:' + app.get('port'))
// listen
app.listen(app.get('port'))
