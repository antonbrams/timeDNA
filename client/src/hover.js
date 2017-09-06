
import {
	Vector3, Raycaster, 
	SphereGeometry, MeshBasicMaterial, Mesh, 
	Points, PointsMaterial, Geometry,
	Math as math
} from 'three'

import {camera, scene} from './render'
import config, {levels} from './config'

// draw label
var cv    = document.createElement(`canvas`)
var ct    = cv.getContext(`2d`)
cv.id	  = `info`
cv.width  = window.innerWidth
cv.height = window.innerHeight
document.body.appendChild(cv)

cv.style.position = `absolute`
cv.style.top      = `0px`
cv.style.left     = `0px`

let top	          = 105
let padding		  = 20
ct.textAlign      = `left`
ct.textBaseline   = `top`

let showLabel = (number, coord) => {
	cv.classList.add('visible')
	ct.clearRect(0,0, cv.width, cv.height)
	let value = Math.round(math
		.mapLinear(number, 0, 1, -10, 40) * 100) / 100
	// draw label
	ct.save()
		ct.translate(coord.x + 100, coord.y - 200)
		// value
		ct.font         = `lighter 100px Helvetica`
		ct.fillStyle    = `white`
		let offset 		= ct.measureText(value)
		ct.fillText(value, padding, 0)
		// liter
		ct.font         = `bold 30px Helvetica`
		ct.fillStyle    = `#${config.base.getHexString()}`
		ct.fillText(`°Celsius`, padding, top + 5)
		// vertical line
		ct.beginPath()
		ct.strokeStyle = `#${config.base.getHexString()}`
		ct.lineWidth   = 1
		ct.moveTo(offset.width + padding * 2, top)
		ct.lineTo(0, top)
		ct.stroke()
	ct.restore()
	// draw line
	ct.save()
		ct.translate(coord.x + 100, coord.y - 200)
		ct.beginPath()
		ct.strokeStyle = `#${config.base.getHexString()}`
		ct.lineWidth   = 1
		ct.moveTo(0, top)
		ct.lineTo(-100, 200)
		ct.stroke()
	ct.restore()
}

let hideLabel = () => {
	cv.classList.remove('visible')
}

// hover states
let sphere = null
let onHover = p => {
	sphere = new Mesh(
		new SphereGeometry(levels[config.depth].scale * .02, 10, 10),
		new MeshBasicMaterial({color: config.now}))
	let a = p.valueToCoords()
	sphere.position.set(a.x, a.y, a.z)
	scene.add(sphere)
	// point line
	var projection = p.valueToCoords().clone()
	projection.project(camera)
	projection.x = Math.round(( projection.x + 1) * window.innerWidth  / 2)
	projection.y = Math.round((-projection.y + 1) * window.innerHeight / 2)
	showLabel(p.value, projection)
}

let onUnhover = p => {
	scene.remove(sphere)
	hideLabel()
	sphere = null
}

// ray caster and debouncer
let hovered = null
document.body.addEventListener('mousemove', e => {
	let found 	  = null
	let raycaster = new Raycaster()
	let mouse     = new Vector3(
		 e.clientX / window.innerWidth  * 2 - 1,    // x
	    -e.clientY / window.innerHeight * 2 + 1, 1) // y
	raycaster.setFromCamera(mouse, camera)
	for (let i in levels[config.depth].points) {
		let p = levels[config.depth].points[i]
		let intersects = []
		p.group.children[2].raycast(raycaster, intersects)
		if (intersects.length > 0) {
			if (hovered != p && !hovered) hovered = p
			found = true
		}
	}
	if (!found && hovered) {
		onUnhover(hovered)
		hovered = null
	}
})

document.body.addEventListener('mousedown', e => {
	if (hovered && !sphere) {
		onHover(hovered)
		hovered = null
	}
})
