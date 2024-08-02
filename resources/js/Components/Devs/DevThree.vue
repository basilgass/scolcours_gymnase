<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { onMounted, ref } from "vue"

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useResizeObserver } from "@vueuse/core"

defineOptions({ layout: LayoutMain })

const threeContainer = ref(null)

function lineFromPoints(pt1: THREE.Vector3, pt2: THREE.Vector3, color: string): THREE.Line {
	const pt1pt2 = new THREE.Vector3().copy(pt2).sub(pt1).multiplyScalar(20)
	const pt2pt1 = new THREE.Vector3().copy(pt1).sub(pt2).multiplyScalar(20)
	const lineGeometry = new THREE.BufferGeometry().setFromPoints([
		pt1pt2,
		pt2pt1
	])

	lineGeometry.translate(pt1.x, pt1.y, pt1.z)
	// Create a basic material with a color attribute
	const lineMaterial = new THREE.LineBasicMaterial({ color, })

	// Create a new line mesh
	return new THREE.Line(lineGeometry, lineMaterial)
}

onMounted(() => {

	// 1. Création de la scène, de la caméra et du rendu
	const scene = new THREE.Scene()
	const width = threeContainer.value.clientWidth
	const height = threeContainer.value.clientHeight
	const renderer = new THREE.WebGLRenderer()

	// 2. Configurer le rendu et l'ajouter au conteneur
	renderer.setSize(width, height)
	renderer.setClearColor(0xffffff)
	renderer.setAnimationLoop(animate)
	threeContainer.value.appendChild(renderer.domElement)

	const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
	camera.position.set(0, 0, 8)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.minDistance = 5
	controls.maxDistance = 50
	controls.enablePan = true
	controls.enableDamping = true
	controls.dampingFactor = 0.05
	// scene.fog = new THREE.Fog('#999999', 2, 20)

	const size = 20
	const divisions = 10
	const gColor1 = 0xdddddd
	const gColor2 = 0xeeeeee
	const gridXY = new THREE.GridHelper(size, divisions, gColor1, gColor2) // Taille 10, divisions 10, couleur noir
	gridXY.rotation.x = Math.PI / 2
	gridXY.position.set(size / 2, size / 2, 0) // Positionner à z = 0 pour éviter l'interférence visuelle
	scene.add(gridXY)

	// 2. GridHelper pour le plan YZ (mur)
	const gridYZ = new THREE.GridHelper(size, divisions, gColor1, gColor2)
	gridYZ.position.set(0, size / 2, size / 2) // Positionner à z = -size/2 pour éviter l'interférence visuelle
	gridYZ.rotation.z = Math.PI / 2 // Faire pivoter pour qu'il soit parallèle au plan YZ
	scene.add(gridYZ)

	// 3. GridHelper pour le plan XZ (paroi)
	const gridXZ = new THREE.GridHelper(size, divisions, gColor1, gColor2)
	gridXZ.position.set(size / 2, 0, size / 2) // Positionner à y = -5 pour éviter l'interférence visuelle
	scene.add(gridXZ)

	const arrowSize = 2
	const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), arrowSize, 0xff0000) // Axe X en rouge
	const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), arrowSize, 0x00ff00) // Axe Y en vert
	const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), arrowSize, 0x0000ff) // Axe Z en bleu

	scene.add(xAxis)
	scene.add(yAxis)
	scene.add(zAxis)

	// Position de la caméra
	camera.position.set(6, 5, 14)
	camera.lookAt(0, 0, 0)

	// const light = new THREE.AmbientLight(0x404040, 100) // soft white light
	// scene.add(light)
	// const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
	// scene.add(directionalLight)

	const pt1 = new THREE.Vector3(8, 0, 0),
		pt2 = new THREE.Vector3(1, 3, 7),
		pt3 = new THREE.Vector3(-1, 7, 2)

	// const g1 = new THREE.BufferGeometry()
	// g1.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
	// 	pt1.x, pt1.y, pt1.z,
	// 	pt2.x, pt2.y, pt2.z,
	// 	pt3.x, pt3.y, pt3.z,
	// ]), 3))
	const ptMat = new THREE.PointsMaterial({ color: 0x000000, size: 0.2 })
	// const points = new THREE.Points(g1, ptMat)
	// scene.add(points)

	// Matière de base 
	const plane = new THREE.Plane().setFromCoplanarPoints(
		pt2,
		pt1,
		pt3,
	)
	const geom = new THREE.PlaneGeometry(15, 10)
	const material = new THREE.MeshBasicMaterial({
		color: '#c5dbec',
		side: THREE.DoubleSide,
		wireframe: false,
		transparent: true,
		opacity: 0.9,
	})
	const mesh = new THREE.Mesh(geom, material)
	mesh.position.set(
		(pt1.x + pt2.x + pt3.x) / 3,
		(pt1.y + pt2.y + pt3.y) / 3,
		(pt1.z + pt2.z + pt3.z) / 3,
	)
	mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), plane.normal)
	scene.add(mesh)

	// const n = new THREE.ArrowHelper(plane.normal, pt2, 4, 0x0000ff, 0.4, 0.2)
	// scene.add(n)

	// Create a new line geometry
	scene.add(lineFromPoints(pt1, pt2, "#000000"))

	// Create another line from two points
	const A = new THREE.Vector3(1, 0, 1)
	const B = new THREE.Vector3(4, 8, 2)

	scene.add(lineFromPoints(A, B, "#000000"))

	const lineAB = new THREE.Line3(A, B)

	const intersection = new THREE.Vector3()
	plane.intersectLine(lineAB, intersection)
	const intersectionPoint = new THREE.Points(new THREE.BufferGeometry().setFromPoints([intersection]), ptMat)
	scene.add(intersectionPoint)

	// 4. Animation et rendu
	function animate() {
		controls.update()
		renderer.render(scene, camera)
	}

	useResizeObserver(threeContainer.value, () => {
		console.log('resizing')

		const width = threeContainer.value.clientWidth
		const height = threeContainer.value.clientHeight
		camera.aspect = width / height
		camera.updateProjectionMatrix()
		renderer.setSize(width, height)
		// PiParserUpdate("onResize", true)
		// PiParser.updateLayout(props.draw.parameters ?? "")
		// PiParser.update(drawCode.value, true)
	})

})

</script>
<template>
	<!-- Title -->
	<div ref="root">
		<h1 class="text-2xl">
			Test de Three.js
		</h1>

		<div ref="threeContainer" class="min-h-[10px] w-full  aspect-[4/3]" />
	</div>
</template>
