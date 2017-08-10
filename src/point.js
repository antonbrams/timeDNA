

import {
	ArrowHelper, Matrix4, Vector3, 
	Color, Group, Math as math
} from 'three'

import config, {levels} from './config'
import * as helix from './space'
import * as PreRender from './prerender.js'

export let build = me => {
	// make gimble
	let group   = new Group()
	let opacity = {set:0, cur:0}
	let time = {
		unix  : me.time.unix,
		date  : me.time.date,
		loop  : me.time.loop,
		depth : levels.indexOf(me)
	}
	let space = {
		x : new Vector3().crossVectors(me.space.y, me.space.z),
		y : me.space.y.clone(),
		z : me.space.z.clone(),
		p : me.space.p.clone()
	}
	space.m = helix.gimbleToMatrix(space, me.scale)
	// circle
	let circle = PreRender.makeCircle()
	circle.applyMatrix(space.m)
	group.add(circle)
	// label
	let text = PreRender.makeText(format(me, time.depth))
	group.add(text)
	// helpers
	// TODO: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
	let helpers = [
		new ArrowHelper(space.y, space.p, me.scale * 0.3, 'red'),
		new ArrowHelper(space.z, space.p, me.scale * 0.3, 'green')]
	// external interface
	return {
		group, space, time,
		lookAt (position, local) {
			// look to camera
			circle.lookAt(position)
			// rotate to camera
			let m = helix.rotationsMatrix(local, space).elements
			let a = Math.atan2(m[9], m[10])
			text.matrix = new Matrix4()
			text.applyMatrix(space.m.clone()
				.multiply(new Matrix4().makeRotationX(-a)))
		},
		get isVisible () {
			return opacity.cur > 0
		},
		setColors (min, now, max, depth) {
			// set color
			let cycle = levels[Math.max(time.depth-1, 0)].points[time.unix]
			let start = time.depth > 0 && cycle && cycle.time.loop
			let color = time.unix == now? 
				config.now: start? config.start: config.base
			text.material.color   =
			circle.material.color = color
			// set opacity
			if (depth >= time.depth) {
				let x = math.mapLinear(time.unix, min, max, 0, 1)
				opacity.set = 1 - Math.pow(x * 2 - 1, 2)
			} else 
				opacity.set = 0
		},
		animateOpacity () {
			opacity.cur += (opacity.set - opacity.cur) * config.fadeSpeed
			// set opacity
			circle.material.opacity =
			text.material.opacity   = opacity.cur
			// hide
			group.visible = opacity.cur > 0
		},
		debug (state) {
			helpers.forEach(helper => 
				group[state?'add':'remove'](helper))
		},
	}
}

let format = (me, depth) => {
	let out   = {}
	if (me.label == 'Month')
		out.month = me.time.date.getMonth()
	else {
		if (me.label == 'Date') {
			out.day   = me.time.date.getDay()
			out.digit = me.time.date[`get${me.label}`]()
		} else {
			let digit = `${me.time.date[`get${me.label}`]()}`
			out.digit = digit.length == 1? `0${digit}`: digit
		}
	}
	return out
}
