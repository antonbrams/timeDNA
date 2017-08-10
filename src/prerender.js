

import {
	CanvasTexture, Mesh, LinearFilter, Vector3, Face3, Geometry, 
	MeshBasicMaterial, Vector2, PlaneBufferGeometry
} from 'three'

import {params} from './config.js'

export let makeText = (() => {
	// canvas settings
	let cv          = document.createElement(`canvas`)
	let ct          = cv.getContext(`2d`)
	cv.height       = 64
	cv.width        = 6000
	ct.font         = `50px Arial`
	ct.fillStyle 	= `white`
	ct.textBaseline = `middle`
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
		alphaMap	: texture,
		transparent : true
	})
	let scale  = 13
	let height = h * scale
	// generate mesh
	return query => {
		let left = 50
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
	cv.height = 128
	cv.width  = 128
	ct.beginPath()
	ct.arc(cv.width/2, cv.height/2, cv.width/2-4, 0, 2 * Math.PI)
	ct.fillStyle = `white`
	ct.fill()
	let material = new MeshBasicMaterial({
		alphaMap	: new CanvasTexture(cv),
		transparent : true
	})
	return () => new Mesh(
		new PlaneBufferGeometry(600, 600), 
		material.clone())
})()