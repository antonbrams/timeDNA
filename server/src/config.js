
import main from 'require-main-filename'

module.exports = {
	root : main().split('/').slice(0, -1).join('/'),
	genPath (file) {return `${this.root}/server/model/${file}.txt`},
	units : [
		31540000000,
		2628000000,
		86400000,
		3600000,
		60000,
		1000
	]
}
