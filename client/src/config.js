
import {Vector3, Color} from 'three'

export default {
	// params
	range      : 300,
	camSpeed   : .05,
	fadeSpeed  : .1,
	labelScale : .0007,
	dotScale   : .02,
	depth	   : 1, // goes from year(0) -> seconds(5)
	// colors
	bg    : new Color(`hsl(200,  10%,   7%)`),
	base  : new Color(`hsl(200,   5%,  40%)`),
	start : new Color(`hsl(200,   5%, 100%)`),
	now   : new Color(`hsl(200, 100%,  60%)`),
	high  : new Color(`hsl(335, 100%,  50%)`),
	// debug
	debug : 0
}

export let world = {
	x : new Vector3(1,0,0),
	y : new Vector3(0,1,0),
	z : new Vector3(0,0,1)
}

export let levels = [
	{
		label  : 'FullYear',
		spread : .00000002,
		scale  : 2000, 
		ms     : 31540000000
	},{
		label  : 'Month', 
		radius : 400,
		scale  : 400,
		ms     : 2628000000
	},{
		label  : 'Date', 
		radius : 150, 
		scale  : 150, 
		ms     : 86400000
	},{
		label  : 'Hours', 
		radius : 38,
		scale  : 38, 
		ms     : 3600000
	},{
		label  : 'Minutes', 
		radius : 10, 
		scale  : 10,
		ms     : 60000
	},{
		label  : 'Seconds', 
		radius : 1, 
		scale  : 1,
		ms	   : 1000
	}
]

// add dynamic variables
levels.forEach(level => {
	let dynamic = {
		time : {
			size : 0, // ms
			flat : 0, // ms
			unix : 0, // ms
			date : new Date(0), // date
			loop : false, // bool
		},
		space : {
			y : world.y, // up vector
			z : world.z, // forward vector
			p : new Vector3(0,0,0), // position
			a : levels[0].spread, // arch in radians
		},
		points : {}, // points
		// draw graph
		graph : null
	}
	for (let i in dynamic) 
		if (!level[i]) level[i] = dynamic[i]
})

