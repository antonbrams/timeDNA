
const app	= require('http')
	.createServer((req, res) => res.end('hi'))
	.listen(8020)
const io    = require('socket.io')(app)
let getList = require('./src/get.js')

io.sockets.on('connection', socket => {
	console.log('[Socket.io] connected...')
	socket.on('disconnect', () => console.log('[Socket.io] ...disconnected'))
	socket.on('request', data => {
		console.log('request getted')
		getList(data, response => {
			console.log('response')
			socket.emit('response', response)
		})
	})
})

console.log('[App end]'.gray)
