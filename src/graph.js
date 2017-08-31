
import {Geometry, Line, LineBasicMaterial, Color} from 'three'
import config, {levels} from './config'
import {scene} from './render'

let oldTime = null
export let make = (level, unix) => {
	if (1) {//oldTime != unix || !level.graph) {
		scene.remove(level.graph)
		level.graph = new Line(
			new Geometry({
				dynamic : true,
				verticesNeedUpdate : true
			}),
			new LineBasicMaterial({
				transparent  : true,
				vertexColors : true,
				linewidth    : 1.4
			}))
		scene.add(level.graph)
	}
	level.graph.material.opacity = oldTime != unix
	oldTime = unix
	return (value, coords, opacity) => {
		let height = level.radius / 4
		level.graph.geometry.vertices.push(coords)
		level.graph.geometry.colors.push(config.now.clone()
			.lerp(new Color(`rgb(255, 100, 200)`), value)
			.lerp(config.bg, 1-opacity))
	}
}

export let updateOpacity = (level, depth) => {
	if (level.graph) {
		let value = levels.indexOf(level) == depth? 1: 0
		let m = level.graph.material
		m.opacity += (value - m.opacity) * .05
		scene[m.opacity > .0001?'add':'remove'](level.graph)
	}
}
