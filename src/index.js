
import '../graphic/style.sass'
import {
	Scene, PerspectiveCamera, WebGLRenderer, 
	BoxGeometry, Mesh,
	Color, ArrowHelper, Vector3, Matrix4,
	MeshBasicMaterial, PlaneGeometry, Texture, DoubleSide, CustomBlending
} from 'three'

import OrbitControls from 'orbit-controls-es6'

// render setup
let scene    = new Scene()
let camera   = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 98900390)
let renderer = new WebGLRenderer({antialias : true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// camera setup
scene.background = new Color(0xffffff)
let dist = 100000
camera.position.set(dist, dist, dist)
let controls = new OrbitControls(camera, renderer.domElement)
import * as point from './point'
import {levels} from './config'
import * as time from './time'
import * as space from './space'

let points = []

let build = (pick, depth) => {
	// prepare now
	let prev = Math.max(depth-1, 0)
	let flat = time.flat(pick, prev).getTime()
	// get range
	let ran  = time.range(depth, 100)
	let now  = pick.getTime()
	let beg  = now - ran
	let end  = now + ran
	// go through time
	time.iterate(beg, end, depth, (level, t) => {
		// calculate helix
		space.calculate(now, level, t)
		// point camera
		if (levels[prev].loop && flat == t) 
			controls.target = levels[prev].position.clone()
	}, (level, date, t) => {
		// create timepoints
		points.push(point.make(scene, level, date, t, flat, depth))
	})
}

// goes from year(0) -> seconds(5)
build(new Date(), 2)

// space origin
if (1) {
	for (let i = 0; i < 3; i ++) {
		let arrowHelper = new ArrowHelper(
			new Vector3(i==0,i==1,i==2), 
			new Vector3(0, 0, 0), 100000, 
			['red', 'green', 'blue'][i])
		scene.add(arrowHelper)
	}
}

// loop function
let animate = () => {
	requestAnimationFrame(animate)
	points.forEach(circle => circle.lookAt(camera.position))
	renderer.render(scene, camera)
}
animate()

