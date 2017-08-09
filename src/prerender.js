

import {
	CanvasTexture, Mesh, CustomBlending, 
	LinearFilter, Vector3, Face3, Geometry, 
	MeshFaceMaterial, MeshBasicMaterial, Vector2,
	PlaneBufferGeometry
} from 'three'

import {params} from './config.js'

export let makeText = (() => {
	// canvas settings
	let cv          = document.createElement(`canvas`)
	let ct          = cv.getContext(`2d`)
	cv.height       = 32
	cv.width        = 3000
	ct.font         = `25px Helvetica`
	ct.textAlign    = `left`
	ct.textBaseline = `middle`
	ct.fillStyle 	= `#${params.base.getHexString()}`
	// canvas rendering
	let h = cv.height / 2
	let textureMap = {digits:[], month:[], day:[]}
	let left 	   = 0
	let generate = string => {
		ct.fillText(string, left, h)
		let out = {left, width : ct.measureText(string).width}
		left += out.width
		return out
	}
	// numbers
	for (let i = 0; i < 10; i ++) textureMap.digits.push(generate(i))
	// month
	let month = `Januar Februar March April Mai June July August September October November December`
		.split(' ')
		.forEach(i => textureMap.month.push(generate(i)))
	// day
	let day = `Sunday Monday Tuesday Wednesday Thursday Friday Saturday`
		.split(' ')
		.forEach(i => textureMap.day.push(generate(` ${i}`)))
	// create huge texture
	let texture		  = new CanvasTexture(cv)
	texture.minFilter = LinearFilter
	let material 	  = new MeshBasicMaterial({
		map         : texture,
		transparent : true,
		blending    : CustomBlending,
		alphaTest   : 0.1
	})
	let scale  = 25
	let height = h * scale
	// generate mesh
	return query => {
		let left = 30
		let f    = 0
		var geometry = new Geometry()
		// start
		geometry.vertices.push(
			new Vector3(left * scale,-height,0),
			new Vector3(left * scale, height,0))
		// generate other sequences
		let make = letter => {
			let w = letter.width
			let l = letter.left  / cv.width
			let r = w / cv.width + l
			left += w
			geometry.vertices.push(
				new Vector3(left * scale,-height,0), 
				new Vector3(left * scale, height,0))
			geometry.faces.push(
				new Face3(f,f+2,f+1), 
				new Face3(f+2,f+3,f+1))
			geometry.faceVertexUvs[0].push([
				new Vector2(l,0), 
				new Vector2(r,0), 
				new Vector2(l,1)
			],[
				new Vector2(r,0), 
				new Vector2(r,1), 
				new Vector2(l,1)])
			f += 2
		}
		// for numbers
		if ('digit' in query) query.digit.toString().split('')
			.forEach(n => make(textureMap.digits[parseInt(n)]))
		if ('month' in query) make(textureMap.month[query.month])
		if ('day' in query) make(textureMap.day[query.day])
		return new Mesh(geometry, material.clone())
	}
})()

export let makeCircle = (() => {
	let cv    = document.createElement(`canvas`)
	let ct    = cv.getContext(`2d`)
	cv.height = 32
	cv.width  = 32
	let colors = {
		base  : {color: params.base}, 
		start : {color: params.start}, 
		now   : {color: params.now}}
	for (let i in colors) {
		ct.clearRect(0, 0, cv.width, cv.height)
		ct.beginPath()
		ct.arc(cv.width/2, cv.height/2, cv.width/2, 0, 2 * Math.PI)
		ct.fillStyle = `#${colors[i].color.getHexString()}`
		ct.fill()
		colors[i].material = new MeshBasicMaterial({
			map         : new CanvasTexture(ct.getImageData(0,0,cv.width, cv.height)),
			transparent : true,
			blending    : CustomBlending,
			alphaTest   : 0.1
		})
	}
	return () => {return {
		mesh : new Mesh(new PlaneBufferGeometry(600, 600), colors.base.material),
		setColor (color) {this.mesh.material = colors[color].material}
	}}
})()