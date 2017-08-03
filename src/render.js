
import {Scene, PerspectiveCamera, WebGLRenderer, Color} from 'three'
// import {OrbitControls, DeviceOrientation, StereoEffect} from 'vr'
import {OrbitControls} from 'vr'

let vp = {x: window.innerWidth, y: window.innerHeight}
export let scene  = new Scene()
export let camera = new PerspectiveCamera(75, vp.x/vp.y, 1, 1000000)
let renderer = new WebGLRenderer({antialias : true})
renderer.setSize(vp.x, vp.y)
document.body.appendChild(renderer.domElement)

// camera setup
scene.background = new Color(`hsl(205,10%,10%)`)
export let controls = new OrbitControls(camera, renderer.domElement)

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
		if (window.location.hash == '#vr') {
			controls.update()
			effect.render(scene, camera)
		} else {
			renderer.render(scene, camera)
		}
		requestAnimationFrame(animate)
	}
	animate()
}