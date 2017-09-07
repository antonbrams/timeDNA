
import {levels} from './config'
import io from 'socket.io-client'

let socket = io('http://localhost:8020')
socket.on('connect', () => console.log('[Socket.io] connected...'))

socket.on('response', data => {
	for (let depth in data)
		for (let unix in data[depth])
			levels[depth].points[unix]
				.setValue(data[depth][unix])
})

let timeout = null
let request = []

export let requestData = (unix, depth) => {
	request.push([depth, unix])
	if (timeout) clearTimeout(timeout)
	timeout = setTimeout(() => {
		socket.emit('request', request)
		request = []
	}, 100)
}
