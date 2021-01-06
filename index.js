const express = require('express')
const schemeRouter = require('./api/schemes/scheme-router')

const server = express()
const PORT = process.env.PORT || 8080

server.use(express.json());
server.use('/api/schemes', schemeRouter)

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
