
import {
	Scene, PerspectiveCamera, WebGLRenderer, 
	Color, Group, ArrowHelper, GridHelper, Vector3, AxisHelper
} from 'three'

import {
	OrbitControls, 
	DeviceOrientationControls, 
	StereoEffect
} from 'vr'

import config, {world} from './config'
import Stats from 'stats-js'

// stats
let stats = new Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.left 	= '10px'
stats.domElement.style.top 		= '10px'

// vr Mode
let vrMode = window.location.hash == '#vr'

// renderer
let renderer = new WebGLRenderer({antialias : true})
document.body.appendChild(renderer.domElement)

// camera
export let camera = new PerspectiveCamera(75, 1, 0.1, 10000)
let distance = 1
camera.position.set(distance, distance, distance)
export let controls = new OrbitControls(camera, renderer.domElement)

// camera scene
export let scene = new Scene()
scene.background = config.bg

// show world coordinates
let helpers = new Group()
for (let i in world) helpers.add(new ArrowHelper(
	world[i], new Vector3(), 1, {x: 'red', y: 'green', z: 'blue'}[i]))
helpers.add(new GridHelper(1000, 1000))
if (config.debug) scene.add(helpers)

// keyboard events
document.addEventListener('keypress', e => {
	if (e.key == 'D') {
		config.debug = !config.debug
		scene[config.debug? 'add': 'remove'](helpers)
		document.body[config.debug? 'appendChild': 'removeChild'](stats.domElement)
		e.preventDefault()
	}
	if (e.key == 'f') {
		let r = document.body
			 if (r.requestFullscreen)       r.requestFullscreen()
		else if (r.msRequestFullscreen)     r.msRequestFullscreen()
		else if (r.mozRequestFullScreen)    r.mozRequestFullScreen()
		else if (r.webkitRequestFullscreen) r.webkitRequestFullscreen()
	}
})

// VR setup
if (vrMode) {
	var effect = new StereoEffect(renderer)
	controls   = new DeviceOrientationControls(camera)
}

// update loop
export let loop = callback => {
	let animate = () => {
		if (config.debug) stats.begin()
		callback()
		controls.update()
		if (vrMode)
			effect.render(scene, camera)
		else
			renderer.render(scene, camera)
		if (config.debug) stats.end()
		requestAnimationFrame(animate)
	}
	animate()
}

// set size of renderer
let resize = e => {
	let w = window.innerWidth
	let h = window.innerHeight
	camera.aspect = w/h
	camera.updateProjectionMatrix()
	if (vrMode)
		effect.setSize(w, h)
	else
		renderer.setSize(w, h)
}
resize()
window.addEventListener('resize', resize)
