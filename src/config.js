
export let levels = [
	/* dynamic hidden params {
		size, 
		flat, 
		loop, 
		up, 
		forward, 
		arch
	}*/
	{
		label  : 'FullYear',
		spread : .000001, 
		flip   : 1, 
		scale  : 7, 
		range  : 130000000000
	},{
		label  : 'Month', 
		radius : 21175, 
		flip   : 1, 
		scale  : 1, 
		range  : 100000000000,
		format : [
			'Januar', 'Februar', 'March', 'April', 
			'Mai', 'June', 'July', 'August', 
			'September', 'October', 'November', 'December'
		] 
	},{
		label  : 'Date', 
		radius : 6652, 
		flip   : 0, 
		scale  : .3, 
		range  : 30000000000,
		format : [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
			'Thursday', 'Friday', 'Saturday'
		] 
	},{
		label  : 'Hours', 
		radius : 1741, 
		flip   : 0, 
		scale  : .05, 
		range  : 1300000000
	},{
		label  : 'Minutes', 
		radius : 364, 
		flip   : 0, 
		scale  : .01, 
		range  : 23000000
	},{
		label  : 'Seconds', 
		radius : 95, 
		flip   : 0, 
		scale  : .002, 
		range  : 400000
	}
]