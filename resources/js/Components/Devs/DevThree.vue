<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { onMounted, ref } from "vue"

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Wireframe } from "three/examples/jsm/Addons.js"

defineOptions({ layout: LayoutMain })

const threeContainer = ref(null)

onMounted(() => {

	// 1. Création de la scène, de la caméra et du rendu
	const scene = new THREE.Scene()
	const width = 800
	const height = 600
	const renderer = new THREE.WebGLRenderer()

	// 2. Configurer le rendu et l'ajouter au conteneur
	renderer.setSize(width, height)
	renderer.setClearColor(0xffffff)
	renderer.setAnimationLoop(animate)

	threeContainer.value.appendChild(renderer.domElement)

	const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100)
	camera.position.set(0, 0, 8)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.minDistance = 5
	controls.maxDistance = 20
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

	// Matière de base 
	const sphereGeometry = new THREE.SphereGeometry(3, 32, 32)
	const sphereMaterial = new THREE.MeshMatcapMaterial({
		color: 0xffffff,
		matcap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/matcaps/matcap-porcelain-white.jpg'),
		transparent: true,
		opacity: 0.5,
		depthTest: true,
		depthWrite: true,
		side: THREE.DoubleSide
	})
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphere.position.set(4, 2, 3)
	scene.add(sphere)

	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 7, 10, 7),
		new THREE.MeshBasicMaterial({
			color: 0xddeedd, side: THREE.DoubleSide,
		})
	)
	plane.rotation.x = Math.PI / 2
	plane.rotation.y = Math.PI / 15
	plane.position.set(4, 1, 3)
	scene.add(plane)
	// 4. Animation et rendu
	function animate() {
		controls.update()
		renderer.render(scene, camera)
	}

})

</script>
<template>
	<!-- Title -->
	<div ref="root">
		<h1 class="text-2xl">
			Test de Three.js
		</h1>

		<div ref="threeContainer" class="h-[600px] w-[800px] aspect-[4/3]" />
	</div>
</template>
