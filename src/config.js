
import {Vector3, Color} from 'three'

export let params = {
	range : 300,
	bg    : new Color(`hsl(205,  10%,   7%)`),
	base  : new Color(`hsl(205,   5%,  40%)`),
	start : new Color(`hsl(205,   5%, 100%)`),
	now   : new Color(`hsl(205, 100%,  50%)`)
}

export let world = {
	x : new Vector3(1,0,0),
	y : new Vector3(0,1,0),
	z : new Vector3(0,0,1)
}

export let levels = [
	{
		label  : 'FullYear',
		spread : .000001,
		arch   : .000001,
		flip   : 0, 
		scale  : 7, 
		ms     : 31540000000
	},{
		label  : 'Month', 
		radius : 21175,
		flip   : 0,
		scale  : 1,
		ms     : 2628000000
	},{
		label  : 'Date', 
		radius : 6652, 
		flip   : 1, 
		scale  : .3, 
		ms     : 86400000
	},{
		label  : 'Hours', 
		radius : 1741, 
		flip   : 1,
		scale  : .05, 
		ms     : 3600000
	},{
		label  : 'Minutes', 
		radius : 364, 
		flip   : 1, 
		scale  : .01, 
		ms     : 60000
	},{
		label  : 'Seconds', 
		radius : 95, 
		flip   : 1,
		scale  : .002, 
		ms	   : 1000
	}
]

// add dynamic variables
levels.forEach(level => {
	let dynamic = {
		// time
		size : 0, // ms
		flat : 0, // ms
		time : 0, // ms
		date : new Date(0), // date
		loop : false, // bool
		// space
		x	 : world.x, // left vector
		y    : world.y, // up vector
		z    : world.z, // forward vector
		p    : new Vector3(0,0,0), // position
		arch : 0, // in radians
	// cache
		points : {} // points
	}
	for (let i in dynamic) 
		if (!level[i]) level[i] = dynamic[i]
})

