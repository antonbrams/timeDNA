
import {Geometry, Line, LineBasicMaterial, Color} from 'three'
import config, {levels} from './config'
import {scene} from './render'

export let init = depth => {
	scene.remove(levels[depth].graph)
	levels[depth].graph = new Line(
		new Geometry({
			dynamic : true,
			verticesNeedUpdate : true
		}), 
		new LineBasicMaterial({
			transparent  : true,
			opacity      : 0,
			vertexColors : true,
			linewidth    : 2
		}))
	scene.add(levels[depth].graph)
}

export let makeDataPoint = (space, opacity, level) => {
	let value  = Math.random()
	let height = level.radius / 4
	level.graph.geometry.vertices.push(space.p.clone()
		.add(space.x.clone()
		.multiplyScalar(height * value)))
	level.graph.geometry.colors.push(config.now.clone()
		.lerp(new Color(`rgb(255, 100, 200)`), value)
		.lerp(config.bg, 1-opacity))
} 

export let updateOpacity = (level, value) => {
	let m = level.graph.material
	m.opacity += (value - m.opacity) * .05
	scene[m.opacity > .0001?'add':'remove'](level.graph)
}
