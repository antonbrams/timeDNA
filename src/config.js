
/* dynamic hidden params {
	size, 
	flat, 
	loop, 
	up, 
	forward, 
	arch,
	matrix
}*/
	
export let levels = [
	{
		label  : 'FullYear',
		spread : .000001, 
		flip   : 0, 
		scale  : 7, 
		ms     : 31540000000
	},{
		label  : 'Month', 
		radius : 21175,
		flip   : 0,
		scale  : 1,
		ms     : 2628000000,
		format : [
			'Januar', 'Februar', 'March', 'April', 
			'Mai', 'June', 'July', 'August', 
			'September', 'October', 'November', 'December'
		]
	},{
		label  : 'Date', 
		radius : 6652, 
		flip   : 1, 
		scale  : .3, 
		ms     : 86400000,
		format : [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
			'Thursday', 'Friday', 'Saturday'
		] 
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