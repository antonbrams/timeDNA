
import getList from './get'

const {ipcMain} = require('electron')
ipcMain.on('request', (event, data) => {
	console.log('request getted')
	getList(data, response => {
		console.log('response')
		event.sender.send('response', response)
	})
})
// const app	= require('http')
// 	.createServer((req, res) => res.end('hi'))
// 	.listen(8020)
// const io    = require('socket.io')(app)
// io.sockets.on('connection', socket => {
// 	console.log('[Socket.io] connected...')
// 	socket.on('disconnect', () => console.log('[Socket.io] ...disconnected'))
// 	socket.on('request', data => {
// 		console.log('request getted')
// 		getList(data, response => {
// 			console.log('response')
// 			socket.emit('response', response)
// 		})
// 	})
// })
