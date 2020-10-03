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

app.use((error, req, res, next) => {
	console.log(error)
	const status = error.statusCode
	const message = error.message
	const data = error.data
	res.status(status).json({
		message,
		data,
	})
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Listing on port ${port}`)
})
