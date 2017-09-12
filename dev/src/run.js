
const {spawn} = require('child_process')
const colors  = require('colors')

// bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite
let last = ''
module.exports = (label, color, cmd, onClose) => {
	cmd = cmd.replace(/(\n|\s)+/igm, ' ').split(' ')
	let process = spawn(cmd.shift(), cmd.concat('--color'))
	let print = data => {
		let space = new Array(label.length).fill(' ').join('')
		let lines = data.toString().split('\n').map((line, i) => {
			let l = last != label? label: space
			last = label
			return `${` ${l} `[color]} ${line}`})
		lines.pop()
		console.log(lines.join('\n'))}
	process.stdout.on('data', print)
	process.stderr.on('data', print)
	if (onClose) process.on('close', onClose)
	return process
}
