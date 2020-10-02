require('dotenv').config
var express = require('express')
var path = require('path')
var cors = require('cors')
var logger = require('morgan')

var indexRouter = require('./routes')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

const port = process.env.PORT || 5000
app.listen(5000, () => {
	console.log(`Listing on port ${port}`)
})
