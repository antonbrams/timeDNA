
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
let dist = 10000
camera.position.set(dist, dist, dist)
let controls = new OrbitControls(camera, renderer.domElement)
import * as point from './point'
import {levels} from './config'
import * as time from './time'
import * as space from './space'

let depth = 3 // goes from year(0) -> seconds(5)
let now = Date.now()
let beg = now - levels[depth].range
let end = now + levels[depth].range

let lookAt = new Vector3()

let circles = []
time.iterate(beg, end, depth, (t, date, level) => {
	space.calculate(now, level, t)
	if (levels[depth-1].loop)
		if (time.flat(new Date(now), depth-1).getTime() == t)
			lookAt = levels[depth-1].position
	if (levels[level].loop)
		circles.push(point.make(scene, levels[level], date))
})

// space origin
if (0) {
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
	circles.forEach(circle => circle.lookAt(camera.position))
	controls.target = lookAt
	renderer.render(scene, camera)
}
animate()

