import { useResizeObserver } from '@vueuse/core'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, Ref } from 'vue'

export function usePiThreeScene(container: Ref<HTMLElement>) {

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    // 2. Configurer le rendu et l'ajouter au conteneur
    renderer.setClearColor(0xffffff)
    const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.enablePan = true
    controls.enableDamping = true
    controls.dampingFactor = 0.05


    interface IThreeFigure {
        name: string,
        figure?: THREE.Object3D,
        vector?: THREE.Vector3,
        raw: (string | number)[],
    }

    // interface IThreeGrid {
    //     size: number,
    //     division: number,
    //     color1: number,
    //     color2: number,
    // }

    let figures: Record<string, IThreeFigure> = {}
    function parseParameters(parameters: string) {
        const params = parameters.split(/(axis|grid|camera|fog)/)
            .filter(param => param !== '' && param !== ',')
            .map(param => param.trim())
            .map(param => param.endsWith(',') ? param.slice(0, -1) : param)

        // Rebuilt the parameters : if the parameter is a key, the next is the value if it starts with =, otherwise it's true
        const paramConfig = {}
        params.reduce((acc, param) => {
            if (acc.length === 0) {
                acc.push([param, true])
                return acc
            }

            if (param.startsWith('=')) {
                acc[acc.length - 1][1] = param.slice(1).split(',').map(x => {
                    if (!isNaN(Number(x))) return Number(x)
                    if (x.includes('/')) {
                        const [a, b] = x.split('/')
                        return Number(a) / Number(b)
                    }
                    return x
                })
            } else {
                acc.push([param, true])
            }
            return acc
        }, [])
            .map(([key, value]) => {
                paramConfig[key] = value
            })

        const config: {
            axis: boolean | (number | string)[],
            grid: boolean | number[],
            camera: number[],
            fog: boolean | (string | number)[],
        } = Object.assign(
            {
                axis: false,
                grid: false,
                camera: [10, 8, 15, 45, 0.1, 100],
                fog: false
            }, paramConfig)


        // Camera
        const [x, y, z, angle, near, far] = config.camera
        camera.position.set(
            Number(x ?? 10),
            Number(y ?? 10),
            Number(z ?? 10)
        )
        camera.fov = Number(angle ?? 45)
        camera.near = Number(near ?? 0.1)
        camera.far = Number(far ?? 100)
        camera.lookAt(0, 0, 0)

        if (config.grid === false) {
            // Remove the grid if exists
            scene.remove(scene.getObjectByName('gridXY'))
            scene.remove(scene.getObjectByName('gridYZ'))
            scene.remove(scene.getObjectByName('gridXZ'))
        } else {
            if (config.grid === true) {
                sceneGrid()
            } else {
                const [size, division, color1, color2] = config.grid
                sceneGrid({ size, division, color1, color2 })
            }
        }

        if (config.axis === false) {
            // Remove the axis if exists
            scene.remove(scene.getObjectByName('axisX'))
            scene.remove(scene.getObjectByName('axisY'))
            scene.remove(scene.getObjectByName('axisZ'))
        } else {
            if (config.axis === true) {
                sceneAxis()
            } else {
                // TODO: must hand x, y and z axis.
                const [length, color, headLength, headWidth] = config.axis
                sceneAxis(
                    {
                        length: Number(length ?? 2),
                        headLength: Number(headLength ?? 0.4),
                        headWidth: Number(headWidth ?? 0.2),
                        color
                    }
                )
            }
        }

        if (config.fog === false) {
            scene.fog = null
        } else {
            if (config.fog === true) {
                scene.fog = new THREE.Fog('#ffffff', 20, 80)
            } else {
                const [color, near, far] = config.fog
                scene.fog = new THREE.Fog(color, Number(near ?? 20), Number(far ?? 80))
            }
        }
    }
    function parse(code: string) {
        // Clear the scene
        for (const item of Object.values(figures)) {
            if (item.figure) {
                scene.remove(item.figure)
            }
        }

        figures = {}
        code.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '')
            .forEach(line => {
                // Split to code and parameters
                // <code>-><parameters>
                const [code, parameters] = line.split('->')
                let color: undefined | string = undefined
                let opacity: undefined | number = undefined

                if (parameters) {
                    const [key, value] = parameters.split('=')
                    if (key === 'color') {
                        const [paramColor, paramOpacity] = value.split('/')
                        color = paramColor
                        opacity = Number(paramOpacity)

                    }
                }

                // A(1, 0, 1) : it's a point
                if (code.match(/^[A-Z][0-9]*\([0-9.]+,[0-9.]+,[0-9.]+\)[*]?$/)) {
                    // Default point color
                    if (!color) color = '#000000'

                    const [name, coords] = code.split('(')

                    // Show the point ?
                    const show = coords.endsWith('*')
                    const [x, y, z] = coords.slice(0, show ? -2 : -1).split(',').map(Number)

                    // Default values of the point
                    figures[name] = {
                        name,
                        vector: new THREE.Vector3(x, y, z),
                        raw: [x, y, z]
                    }

                    if (show) {
                        const geometry = new THREE.SphereGeometry(0.07, 16, 16)
                        const material = new THREE.MeshBasicMaterial({ color })
                        const sphere = new THREE.Mesh(geometry, material)
                        sphere.position.set(x, y, z)
                        scene.add(sphere)
                        figures[name].figure = sphere
                    }
                }

                // d=AB[.-] : it's a line. If has . => segment, if has - => dashed
                else if (code.match(/^[a-z][0-9]*=[A-Z][0-9]*[A-Z][0-9]*[.-]?$/)) {
                    // Default point color
                    if (!color) color = '#000000'

                    let [name, points] = code.split('=')

                    const dashed = points.includes('-')
                    // const segment = points.includes('.')
                    points = points.replace(/[.-]/, '')

                    const [pt1, pt2] = points.split(/(?=[A-Z])/)
                    const pt1Vector = figures[pt1].vector
                    const pt2Vector = figures[pt2].vector

                    const L = lineFromPoints(pt1Vector, pt2Vector, color, dashed)
                    scene.add(L)

                    figures[name] = {
                        name,
                        raw: [pt1, pt2],
                        figure: L
                    }
                }

                // p=plane A,B,C : it's a plane
                else if (code.split('=plane ').length === 2) {
                    // Default point color
                    if (!color) color = '#c5dbec'
                    if (!opacity) opacity = 0.8

                    const [name, points] = code.split('=plane ')
                    const [ptName1, ptName2, ptName3, ...opts] = points.split(',')
                    const [width, height, rotate] = opts.map(Number)

                    const pt1 = figures[ptName1].vector
                    const pt2 = figures[ptName2].vector
                    const pt3 = figures[ptName3].vector

                    const plane = new THREE.Plane().setFromCoplanarPoints(pt1, pt2, pt3)
                    const geom = new THREE.PlaneGeometry(width ?? 10, height ?? 10)
                    const material = new THREE.MeshBasicMaterial({
                        color,
                        side: THREE.DoubleSide,
                        wireframe: false,
                        transparent: true,
                        opacity,
                    })
                    const mesh = new THREE.Mesh(geom, material)
                    mesh.position.set(
                        (pt1.x + pt2.x + pt3.x) / 3,
                        (pt1.y + pt2.y + pt3.y) / 3,
                        (pt1.z + pt2.z + pt3.z) / 3,
                    )
                    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), plane.normal)
                    if (rotate) { mesh.rotateZ(rotate * Math.PI / 180) }
                    scene.add(mesh)

                    figures[name] = {
                        name,
                        raw: points.split(','),
                        figure: mesh
                    }
                }
            })
    }

    function sceneAxis(axis = { length: 5, headLength: 0.4, headWidth: 0.2, color: undefined }) {
        const xAxis = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            axis.length,
            axis.color ?? 0xff0000,
            axis.headLength,
            axis.headWidth
        ) // Axe X en rouge
        xAxis.name = 'axisX'

        const yAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            axis.length,
            axis.color ?? 0x00ff00,
            axis.headLength,
            axis.headWidth
        ) // Axe Y en vert
        yAxis.name = 'axisY'

        const zAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            axis.length,
            axis.color ?? 0x0000ff,
            axis.headLength,
            axis.headWidth
        ) // Axe Z en bleu
        zAxis.name = 'axisZ'

        scene.add(xAxis)
        scene.add(yAxis)
        scene.add(zAxis)
    }
    function sceneGrid(grid = { size: 20, division: 10, color1: 0xdddddd, color2: 0xeeeeee }) {
        const gridXY = new THREE.GridHelper(grid.size, grid.division, grid.color1, grid.color2) // Taille 10, divisions 10, couleur noir
        gridXY.name = 'gridXY'
        gridXY.rotation.x = Math.PI / 2
        gridXY.position.set(grid.size / 2, grid.size / 2, 0) // Positionner à z = 0 pour éviter l'interférence visuelle
        scene.add(gridXY)

        // 2. GridHelper pour le plan YZ (mur)
        const gridYZ = new THREE.GridHelper(grid.size, grid.division, grid.color1, grid.color2)
        gridYZ.name = 'gridYZ'
        gridYZ.position.set(0, grid.size / 2, grid.size / 2) // Positionner à z = -size/2 pour éviter l'interférence visuelle
        gridYZ.rotation.z = Math.PI / 2 // Faire pivoter pour qu'il soit parallèle au plan YZ
        scene.add(gridYZ)

        // 3. GridHelper pour le plan XZ (paroi)
        const gridXZ = new THREE.GridHelper(grid.size, grid.division, grid.color1, grid.color2)
        gridXZ.name = 'gridXZ'
        gridXZ.position.set(grid.size / 2, 0, grid.size / 2) // Positionner à y = -5 pour éviter l'interférence visuelle
        scene.add(gridXZ)
    }

    function lineFromPoints(pt1: THREE.Vector3, pt2: THREE.Vector3, color: string, dashed?: boolean | { dashSize: number, gapSize: number }): THREE.Line {
        const pt1pt2 = new THREE.Vector3().copy(pt2).sub(pt1).multiplyScalar(20)
        const pt2pt1 = new THREE.Vector3().copy(pt1).sub(pt2).multiplyScalar(20)
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            pt1pt2,
            pt2pt1
        ])

        lineGeometry.translate(pt1.x, pt1.y, pt1.z)
        // Create a basic material with a color attribute
        const lineMaterial = dashed ?
            new THREE.LineDashedMaterial(Object.assign(
                {
                    color,
                    dashSize: 0.5,
                    gapSize: 0.2
                },
                dashed === true ? {} : dashed
            ))
            : new THREE.LineBasicMaterial({ color, })

        const line = new THREE.Line(lineGeometry, lineMaterial)
        if (dashed) {
            line.computeLineDistances()
        }

        return line
    }

    function animate() {
        controls.update()
        renderer.render(scene, camera)
    }

    function onResize() {
        const width = container.value.clientWidth
        const height = container.value.clientHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }

    onMounted(() => {
        container.value.appendChild(renderer.domElement)

        // Animation
        renderer.setAnimationLoop(animate)

        // Gestion du redimensionnement
        useResizeObserver(container.value, () => {
            onResize()
        })
    })

    return { scene, renderer, camera, controls, animate, onResize, parse, parseParameters }
}