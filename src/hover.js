
import {
	Vector3, Raycaster, 
	SphereGeometry, MeshBasicMaterial, Mesh, 
	Points, PointsMaterial, Geometry
} from 'three'
import {camera, scene} from './render'
import config, {levels} from './config'

let sphere = null

let onHover = p => {
	sphere = new Mesh(
		new SphereGeometry(levels[config.depth].scale * .02, 10, 10),
		new MeshBasicMaterial({color: config.now}))
	let a = p.valueToCoords()
	sphere.position.set(a.x, a.y, a.z)
	scene.add(sphere)
}

let onUnhover = p => {
	scene.remove(sphere)
}

let hovered = null
// ray caster and debouncer
document.body.addEventListener('mousemove', e => {
	let found 	  = null
	let raycaster = new Raycaster()
	let mouse     = new Vector3(
		 e.clientX / window.innerWidth  * 2 - 1, // x
	    -e.clientY / window.innerHeight * 2 + 1, 1) // y
	raycaster.setFromCamera(mouse, camera)
	for (let i in levels[config.depth].points) {
		let p = levels[config.depth].points[i]
		let intersects = []
		p.group.children[2].raycast(raycaster, intersects)
		if (intersects.length > 0) {
			if (hovered != p && !hovered) {
				hovered = p
				onHover(p)
			}
			found = true
		}
	}
	if (!found && hovered) {
		onUnhover(hovered)
		hovered = null
	}
})
