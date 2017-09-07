
import {Geometry, Line, LineBasicMaterial, Color} from 'three'
import config, {levels} from './config'
import {scene} from './render'

// TODO: http://jsfiddle.net/8mrH7/266/

let oldTime = null
export let make = (level, unix) => {
	if (1) {//oldTime != unix || !level.graph) {
		scene.remove(level.graph)
		level.graph = new Line(
			new Geometry({
				dynamic : true
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
	let i = 0
	return p => {
		let color = value => config.now.clone()
			.lerp(config.high, value)
			.lerp(config.bg, value == 0? 1: 1 - p.opacity)
		level.graph.geometry.vertices[i] = p.valueToCoords()
		level.graph.geometry.colors[i] = color(p.value)
		// db update
		p.onLoad = (i => () => {
			// position
			level.graph.geometry.vertices[i] = p.valueToCoords()
			level.graph.geometry.verticesNeedUpdate = true
			// color
			level.graph.geometry.colors[i] = color(p.value)
			level.graph.geometry.colorsNeedUpdate = true
		})(i++)
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
