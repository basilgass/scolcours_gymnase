<script lang="ts" setup>

import * as THREE from "three"
import { onMounted, ref } from "vue"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// Object to hold the scene container
const sceneContainer = ref(null)

// Create a renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(600, 600)
renderer.setClearColor("white")

// Create a scene
const scene = new THREE.Scene()

// Create a camera
const camera = new THREE.PerspectiveCamera(30, 1.0, 0.1, 1000)
camera.position.set(7, 2, 8)

// Create controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)

// controls.enablePan = false
// controls.maxPolarAngle = Math.PI / 2

// controls.enableDamping = true
// Create axes helper
// const axesHelper = new THREE.AxesHelper(5) // Adjust the size as needed
// axesHelper.material['color'].set('black')
// // Change line width of the axes
// axesHelper.material['linewidth'] = 2
// // Hide the z-axis
// // axesHelper.material['visible'] = false
//
// // Add axes helper to the scene
// scene.add(axesHelper)

// Render the scene
function render() {
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

onMounted(() => {
	// Add the renderer's DOM element to the HTML document
	sceneContainer.value.appendChild(renderer.domElement)

	render()
})


const segments = 20
const a = 1
const b = 6
// Define functions for the two solids
function f1(x) {
	return Math.sqrt(x-2) // Function for the first solid
	// return x // Function for the first solid
}

function f2(x) {
	return 1 / 3 * Math.sqrt(12*x) // Function for the second solid
	// return 1 / x // Function for the second solid
}

// Generate points for both solids
const points1 = generateMeshPoints(f1, a, b)
const points2 = generateMeshPoints(f2, a, b).reverse()

function generateMeshPoints(func, a, b, step = 0.1) {
	const points = []
	for (let x = a; x <= b; x += step) {
		points.push(new THREE.Vector2(func(x), x))
	}
	return points
}

function generateCurvePoints(func, a, b, step = 0.1) {
	const points = []
	for (let x = a; x <= b; x += step) {
		points.push(new THREE.Vector3(x, func(x), 0))
	}
	return points
}

// Create a spline curve geometry
const curveGeometry1 = new THREE.BufferGeometry().setFromPoints(generateCurvePoints(f1, -3, 5))
const curveGeometry2 = new THREE.BufferGeometry().setFromPoints(generateCurvePoints(f2, -0.1, 5))

// Create a mesh for the spline curve
scene.add(new THREE.Line(curveGeometry1, new THREE.LineBasicMaterial({ color: 0x0000ff })))
scene.add(new THREE.Line(curveGeometry2, new THREE.LineBasicMaterial({ color: 0xff00ff })))

// Create geometries for both solids
const geometry = new THREE.LatheGeometry([...points1, ...points2, points1[0]], segments)
// const geometry1 = new THREE.LatheGeometry(points1, 64)
// const geometry2 = new THREE.LatheGeometry(points2, 64)

// Create a material
const material = new THREE.MeshLambertMaterial({
	color: "#ddc895",
	side: THREE.BackSide,
})
//
// // Create meshes for both geometries
const mesh = new THREE.Mesh(geometry, material)
// const mesh1 = new THREE.Mesh(geometry1, material)
// const mesh2 = new THREE.Mesh(geometry2, material)

// Subtracted mesh
// const subtractedMesh = CSG.subtract(mesh2, mesh1)

// Rotate subtracted mesh to align with the x-axis
// subtractedMesh.rotation.set(0, 0, -Math.PI / 2)
// scene.add(subtractedMesh)

mesh.rotation.set(0, 0, -Math.PI / 2)
scene.add(mesh)

// const wireframe = new THREE.WireframeGeometry(subtractedMesh.geometry)
const wireframe = new THREE.WireframeGeometry(mesh.geometry)

const line = new THREE.LineSegments(wireframe)
line.rotation.set(0, 0, -Math.PI / 2)
line.material["color"].setHex(0x000000)
line.material["opacity"] = 0.3
line.material["transparent"] = true
// line.material.depthTest = false
// line.material.opacity = 0.25
// line.material.setHex(0x000000)
// Add subtracted mesh to the scene
scene.add(line)

// let light = new THREE.AmbientLight(0xffffff)
let light =  new THREE.AmbientLight("#ffffff", 0.1)
scene.add(light)

var light2 = new THREE.PointLight(0xffffff)
light2.position.set(10, 10, 10)
light2.power = 5000
scene.add(light2)


//Function to create/draw Axis helpers
function drawAxisHelpers(params) {
	var geometryArrow, meshXArrow, geometryXAxis, materialXAxis, meshXAxis,
		meshYArrow, geometryYAxis, materialYAxis, meshYAxis, meshZArrow,
		geometryZAxis, materialZAxis, meshZAxis

	// This function allows for the changing of parameters for all the axis helpers. I have used .2 as radius
	// and 10 for height for this assignment because it makes the helpers the most visible for my scene
	if (params == null) {
		params = {}
	}
	params.radius = params.radius || 0.01
	params.height = params.height || 3
	params.scene = params.scene || scene

	geometryArrow = new THREE.CylinderGeometry(0, 3 * params.radius, params.radius * 10)

	// This part defines and adds the X axis helper
	materialXAxis = new THREE.MeshBasicMaterial({
		color: 0x000000
	})
	geometryXAxis = new THREE.CylinderGeometry(params.radius, params.radius, params.height)
	meshXAxis = new THREE.Mesh(geometryXAxis, materialXAxis)
	meshXArrow = new THREE.Mesh(geometryArrow, materialXAxis)
	meshXAxis.add(meshXArrow)
	meshXArrow.position.y += params.height / 2
	meshXAxis.rotation.z -= 90 * Math.PI / 180
	meshXAxis.position.x += params.height / 2
	params.scene.add(meshXAxis)

	// This part defines and adds the Y axis helper
	materialYAxis = new THREE.MeshBasicMaterial({
		color: 0x000000
	})
	geometryYAxis = new THREE.CylinderGeometry(params.radius, params.radius, params.height)
	meshYAxis = new THREE.Mesh(geometryYAxis, materialYAxis)
	meshYArrow = new THREE.Mesh(geometryArrow, materialYAxis)
	meshYAxis.add(meshYArrow)
	meshYArrow.position.y += params.height / 2
	meshYAxis.position.y += params.height / 2
	params.scene.add(meshYAxis)

}

// Run the function to add/draw the axis helpers
drawAxisHelpers({})
</script>

<template>
	<div
		ref="sceneContainer"
		class="border rounded shadow aspect-square"
	/>
</template>

<style scoped>

</style>
