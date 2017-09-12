
const fs  = require('fs')

module.exports = {
	set (env ) {
		return fs.writeFile('./dev/env.js', `module.exports = '${env}'`, 
			err => console.log)
	},
	is (env) {
		env = env.split(' ')
		for (var i = 0; i < env.length; i ++)
			if (process.argv[2].split('.').indexOf(env[i]) == -1) return false
		return true
	}
}
