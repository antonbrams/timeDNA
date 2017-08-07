
import {
	Scene, PerspectiveCamera, WebGLRenderer, 
	Color, Group, ArrowHelper, GridHelper, Vector3, AxisHelper
} from 'three'
// import {OrbitControls, DeviceOrientation, StereoEffect} from 'vr'
import {OrbitControls} from 'vr'
import {world} from './config'

let vp = {x: window.innerWidth, y: window.innerHeight}

// renderer
let renderer = new WebGLRenderer({antialias : true})
renderer.setSize(vp.x, vp.y)
document.body.appendChild(renderer.domElement)

// camera
export let camera   = new PerspectiveCamera(75, vp.x/vp.y, 1, 1000000)
export let controls = new OrbitControls(camera, renderer.domElement)
let distance 		= 10000
camera.position.set(distance, distance, distance)

// camera scene
export let scene = new Scene()
scene.background = new Color(`hsl(205,10%,10%)`)

// show world coordinates
let toggle  = true
let helpers = new Group()
for (let i in world) helpers.add(new ArrowHelper(
	world[i], new Vector3(), 100000,
	{x: 'red', y: 'green', z: 'blue'}[i]))
helpers.add(new GridHelper(1000000, 100))
document.addEventListener('keyup', e => {
	if (e.key == 'D') {
		scene[toggle? 'add': 'remove'](helpers)
		toggle = !toggle
	}
})

// VR setup
if (window.location.hash == '#vr') {
	var effect = new StereoEffect(renderer)
	effect.setSize(vp.x, vp.y)
	controls.noZoom = true
	controls.noPan 	= true
	let setOrientationControls = e => {
		if (!e.alpha) return
		controls = new DeviceOrientation(camera, true)
		controls.connect()
		controls.update()
		window.removeEventListener('deviceorientation', setOrientationControls, true)
	}
	window.addEventListener('deviceorientation', setOrientationControls, true)
}

// loop
export let loop = callback => {
	let animate = () => {
		callback()
		controls.update()
		if (window.location.hash == '#vr')
			effect.render(scene, camera)
		else
			renderer.render(scene, camera)
		requestAnimationFrame(animate)
	}
	animate()
}