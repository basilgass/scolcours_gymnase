import { useResizeObserver } from '@vueuse/core'
import * as THREE from 'three'

import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, Ref } from 'vue'
import { CSS2DRenderer, CSS2DObject, Line2 } from 'three/examples/jsm/Addons.js'
import katex from "katex/dist/katex.mjs"

export function usePiThreeScene(container: Ref<HTMLElement>) {

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'


    // 2. Configurer le rendu et l'ajouter au conteneur
    renderer.setClearColor(0xffffff)
    const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100)

    const controls = new OrbitControls(camera, labelRenderer.domElement)
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.enablePan = true
    controls.enableDamping = true
    controls.dampingFactor = 0.05


    interface IThreeFigure {
        name: string,
        figure: THREE.Object3D,
        math: THREE.Vector3 | THREE.Line3 | THREE.Plane | THREE.EllipseCurve,
        raw: (string | number)[],
        label?: CSS2DObject
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
                camera: [],
                fog: false
            }, paramConfig)


        // Camera
        const [x, y, z, fov, near, far] = config.camera
        camera.position.set(
            Number(x ?? 25),
            Number(y ?? 15),
            Number(z ?? 30)
        )
        camera.fov = Number(fov ?? 20)
        camera.near = Number(near ?? 0.1)
        camera.far = Number(far ?? 2000)
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
                if (item.label) {
                    item.figure.remove(item.label)
                }
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
                const [code, params] = line.split('->')
                let color: undefined | string = undefined
                let opacity: undefined | number = undefined
                let width = 1

                const parameters = params === undefined ? [] : params.trim().split(',')
                if (parameters) {
                    // Find the color and opacity
                    const colorParameter = parameters.filter(param => param.startsWith('color='))
                    if (colorParameter.length > 0) {

                        const [, value] = colorParameter[0].split('=')
                        const [paramColor, paramOpacity] = value.split('/')
                        color = paramColor
                        opacity = Number(paramOpacity)
                    }

                    width = Number(
                        parameters
                            .filter(param => param.startsWith('w='))
                            .map(param => param.split('=')[1])[0] ?? width
                    )
                }

                // A(1, 0, 1) : it's a point
                if (code.match(/^[A-Z][0-9]*\([-0-9.]+,[-0-9.]+,[-0-9.]+\)[*]?$/)) {
                    // Default point color
                    if (!color) color = '#000000'

                    const [name, coords] = code.split('(')

                    // Show the point ?
                    const show = parameters.includes('*')
                    const [x, y, z] = coords.slice(0, -1).split(',').map(Number)


                    const geometry = new THREE.SphereGeometry(0.07, 16, 16)
                    const material = new THREE.MeshBasicMaterial({ color })
                    const sphere = new THREE.Mesh(geometry, material)
                    sphere.position.set(x, y, z)
                    scene.add(sphere)
                    sphere.visible = show

                    const label = addLabel(sphere, parameters)

                    // Default values of the point
                    figures[name] = {
                        name,
                        math: new THREE.Vector3(x, y, z),
                        raw: [x, y, z],
                        figure: sphere,
                        label
                    }
                }

                // d=AB[.-] : it's a line. If has . => segment, if has - => dashed
                else if (code.match(/^[a-z][0-9]*=[A-Z][0-9]*[A-Z][0-9]*[.-]?$/)) {
                    // Default point color
                    if (!color) color = '#000000'

                    let [name, points] = code.split('=')

                    const dashed = parameters.includes('dash')


                    const lineType = points.includes('.') ? 'segment' : 'line'
                    points = points.replace(/[.-]/, '')

                    const [pt1, pt2] = points.split(/(?=[A-Z])/)
                    const pt1Vector = figures[pt1].math as THREE.Vector3
                    const pt2Vector = figures[pt2].math as THREE.Vector3

                    const L = lineFromPoints(pt1Vector, pt2Vector, lineType, color, width, dashed)
                    scene.add(L)

                    figures[name] = {
                        name,
                        raw: [pt1, pt2],
                        figure: L,
                        math: new THREE.Line3(pt1Vector, pt2Vector)
                    }
                }

                // v=vAB : it's a vector
                else if (code.match(/^[a-z][0-9]*=v[A-Z][0-9]*[A-Z][0-9]*/)) {
                    // Default point color
                    if (!color) color = '#000000'

                    const [name, data] = code.split('=')
                    const points = data.split(',')
                    const [pt1, pt2] = points.shift().slice(1).split(/(?=[A-Z])/)
                    const [length, aLength, aWidth] = points
                        .filter(x => x !== '').map(Number)
                    const pt1Start = figures[pt1].math as THREE.Vector3
                    const pt2Vector = figures[pt2].math as THREE.Vector3

                    const arrowLength = aLength ?? 0.6
                    const arrowWidth = aWidth ?? 0.2

                    const pt2End = length === undefined ? pt2Vector : pt1Start.clone().add(pt2Vector.clone().sub(pt1Start).normalize().multiplyScalar(length))

                    // Replace the line by a Fat line
                    // V.line.geometry.dispose()
                    const director = pt2End.clone().sub(pt1Start).normalize()
                    const line = lineFromPoints(
                        // Starting point
                        pt1Start.clone(),
                        // Ending point : move the ending point by half the cone length
                        pt2End.clone().sub(director.clone().multiplyScalar(arrowLength / 2)),
                        'vector', color, width)

                    const cone = new THREE.Mesh(
                        new
                            THREE.ConeGeometry(
                                arrowWidth,
                                arrowLength,
                                16
                            ),
                        new THREE.MeshBasicMaterial({ color })
                    )
                    cone.translateX(pt2End.x)
                    cone.translateY(pt2End.y)
                    cone.translateZ(pt2End.z)
                    cone.translateOnAxis(pt2Vector.clone().sub(pt1Start).normalize(), -arrowLength / 2)
                    cone.quaternion.setFromUnitVectors(
                        new THREE.Vector3(0, 1, 0),
                        new THREE.Vector3().copy(pt2Vector).sub(pt1Start).normalize()
                    )
                    line.add(cone)

                    scene.add(line)

                    figures[name] = {
                        name,
                        raw: [pt1, pt2],
                        figure: line,
                        math: new THREE.Line3(pt1Start, pt2Vector)
                    }
                }

                // P=proj A,p : it's a projection of a point A on a plane p
                else if (code.match(/^[A-Z][0-9]*=proj [A-Z][0-9]*,[a-z][0-9]*/)) {
                    // Default point color
                    if (!color) color = '#000000'

                    const [name, points] = code.split('=proj ')
                    const [pt1, pt2] = points.split(',')

                    const pt1Vector = figures[pt1].math as THREE.Vector3
                    const plane = figures[pt2].math as THREE.Plane

                    const proj = new THREE.Vector3()
                    plane.projectPoint(pt1Vector, proj)

                    const geometry = new THREE.SphereGeometry(0.07, 16, 16)
                    const material = new THREE.MeshBasicMaterial({ color })

                    const sphere = new THREE.Mesh(geometry, material)
                    sphere.position.set(proj.x, proj.y, proj.z)
                    scene.add(sphere)

                    figures[name] = {
                        name,
                        raw: [pt1, pt2],
                        figure: sphere,
                        math: proj,
                        label: addLabel(sphere, parameters)
                    }

                }

                // p=plane A,B,C : it's a plane
                else if (code.split('=plane ').length === 2) {
                    // Default point color
                    if (!color) color = '#c5dbec'
                    if (!opacity) opacity = 0.8

                    let width = 10,
                        height = 10,
                        rotate = 0

                    const plane = new THREE.Plane()
                    const position = new THREE.Vector3()

                    const [name, value] = code.split('=plane ')
                    const data = value.split(',').map(x => x.trim())
                    // data can be:
                    // <pt1>,<pt2>,<pt3>,<width>,<height>,<rotate>
                    // <pt>,<normal>,<width>,<height>,<rotate>
                    // <equation>,<width>,<height>,<rotate>

                    if (
                        data[0].includes('=')
                    ) {
                        // It's an equation
                    } else if (
                        Object.hasOwn(figures, data[0]) &&
                        Object.hasOwn(figures, data[1]) &&
                        Object.hasOwn(figures, data[2])
                    ) {
                        // It's a three points
                        const pt1 = figures[data.shift()].math as THREE.Vector3
                        const pt2 = figures[data.shift()].math as THREE.Vector3
                        const pt3 = figures[data.shift()].math as THREE.Vector3
                        plane.setFromCoplanarPoints(pt1, pt2, pt3)

                        position.set(
                            (pt1.x + pt2.x + pt3.x) / 3,
                            (pt1.y + pt2.y + pt3.y) / 3,
                            (pt1.z + pt2.z + pt3.z) / 3,
                        )
                    } else if (
                        Object.hasOwn(figures, data[0]) &&
                        Object.hasOwn(figures, data[1])
                    ) {
                        // It's a point and two other points
                        const line = figures[data.shift()].math as THREE.Line3
                        const pt = figures[data.shift()].math as THREE.Vector3

                        // normalise the normal
                        const normal = new THREE.Vector3()
                        line.delta(normal).normalize()
                        plane.setFromNormalAndCoplanarPoint(normal, pt)

                        position.set(
                            pt.x,
                            pt.y,
                            pt.z
                        )
                    }


                    // const [width, height, rotate] = opts.map(Number)
                    if (data.length > 0) {
                        width = Number(data.shift())
                    }
                    if (data.length > 0) {
                        height = Number(data.shift())
                    }
                    if (data.length > 0) {
                        rotate = Number(data.shift())
                    }



                    const geom = new THREE.PlaneGeometry(width ?? 10, height ?? 10)
                    const material = new THREE.MeshBasicMaterial({
                        color,
                        side: THREE.DoubleSide,
                        wireframe: false,
                        transparent: true,
                        opacity,
                    })
                    const mesh = new THREE.Mesh(geom, material)

                    mesh.position.set(position.x, position.y, position.z)
                    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), plane.normal)
                    if (rotate) { mesh.rotateZ(rotate * Math.PI / 180) }
                    scene.add(mesh)

                    figures[name] = {
                        name,
                        raw: value.split(','),
                        figure: mesh,
                        math: plane
                    }
                }

                // a=arc A,B,C : it's an arc
                else if (code.split('=arc ').length === 2) {
                    // Default point color
                    if (!color) color = '#000000'

                    const [name, points] = code.split('=arc ')
                    const [ptName1, ptName2, ptName3, radius] = points.split(',')
                    const pt1 = figures[ptName1].math as THREE.Vector3
                    const pt2 = figures[ptName2].math as THREE.Vector3
                    const pt3 = figures[ptName3].math as THREE.Vector3
                    const r = isNaN(Number(radius)) ? 2 : Number(radius)

                    const AB = pt1.clone().sub(pt2)
                    const AC = pt3.clone().sub(pt2)
                    const angle = AB.angleTo(AC)

                    const curve = new THREE.EllipseCurve(0, 0, r, r, 0, angle, false, 0)


                    // Fat line system
                    const lineGeometry = new LineGeometry()
                    const positions = []
                    curve.getPoints(50).forEach(pt => {
                        positions.push(pt.x, pt.y, 0)
                    })
                    lineGeometry.setPositions(positions)

                    const matLine = new LineMaterial({
                        color,
                        linewidth: width,
                        vertexColors: false,
                        dashed: false,
                        alphaToCoverage: true
                    })
                    const arc = new Line2(lineGeometry, matLine)

                    // Create a cone to show the direction.
                    // Use the two last positions points to set the cone position
                    if (parameters.includes('mark')) {
                        const cone = new THREE.Mesh(
                            new THREE.ConeGeometry(0.2, 0.4),
                            new THREE.MeshBasicMaterial({ color })
                        )

                        // Move the cone tip to the last point
                        cone.position.set(curve.getPoint(1).x, curve.getPoint(1).y, 0)
                        // Rotate the cone to the direction of the arc
                        const tangent = curve.getTangent(1)
                        cone.translateX(-tangent.x * 0.2)
                        cone.translateY(-tangent.y * 0.2)
                        cone.quaternion.setFromUnitVectors(
                            new THREE.Vector3(0, 1, 0),
                            new THREE.Vector3(tangent.x, tangent.y, 0)
                        )

                        arc.add(cone)
                    }

                    // Move the arc mesh to the center of the arc
                    arc.position.set(pt2.x, pt2.y, pt2.z)

                    // Align the arc to the plane
                    arc.quaternion.setFromUnitVectors(
                        new THREE.Vector3(0, 0, 1),
                        AB.clone().cross(AC).normalize()
                    )

                    // Rotate the arc so that it starts at the first point
                    const vertex = new THREE.Vector3()
                    const attribute = arc.geometry.attributes.position

                    // Why 5 ? Because the position is a Float32Array with 3 values (x, y, z) and 2 values for the UV
                    vertex.fromBufferAttribute(attribute, 5)
                    arc.localToWorld(vertex)

                    // Turn the angle to match the starting angle
                    arc.rotateZ(
                        (parameters.includes('invert') ? -1 : 1) * AB.angleTo(vertex.clone().sub(pt2)))

                    // Add the mesh to the scene.
                    scene.add(arc)

                    figures[name] = {
                        name,
                        raw: points.split(','),
                        figure: arc,
                        math: curve
                    }
                }
            })
    }

    function addLabel(obj: THREE.Mesh, parameters: string[]): CSS2DObject | undefined {
        const hasLabel = parameters.filter(param => param.startsWith('label='))
        let label: CSS2DObject
        if (hasLabel.length > 0) {
            const [, ...values] = hasLabel[0].split('=')
            const value = values.join('=')
            label = new CSS2DObject(document.createElement('div'))
            label.element.textContent = value
            label.element.style.textAlign = 'center'
            label.center.set(0, 0)
            obj.add(label)
        }

        // Maybe there are some texts to display
        const tex = parameters.filter(param => param.startsWith('tex='))
        if (tex.length > 0) {
            const [, ...values] = tex[0].split('=')
            const value = values.join('=')
            label = new CSS2DObject(document.createElement('div'))
            label.element.innerHTML = katex.renderToString(value)
            label.element.classList.add('katex-m-0')
            label.center.set(0, 1)
            obj.add(label)
        }

        return label
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

    function lineFromPoints(
        pt1: THREE.Vector3,
        pt2: THREE.Vector3,
        type: 'line' | 'segment' | 'vector' | 'halfLine',
        color: string,
        width: number,
        dashed?: boolean | { dashSize: number, gapSize: number }
    ): Line2 {

        // const lineGeometry = new THREE.BufferGeometry()
        const lineGeometry = new LineGeometry()

        if (type === 'segment') {
            lineGeometry.setPositions([
                pt1.x, pt1.y, pt1.z,
                pt2.x, pt2.y, pt2.z
            ])
        }

        if (type === 'vector') {
            lineGeometry.setPositions([
                pt1.x, pt1.y, pt1.z,
                pt2.x, pt2.y, pt2.z
            ])
        }

        if (type === 'halfLine') {
            // TODO: implement halfLine

        }

        if (type === 'line') {
            // Any other cases (line)
            const pt1pt2 = new THREE.Vector3().copy(pt2).sub(pt1).multiplyScalar(20)
            const pt2pt1 = new THREE.Vector3().copy(pt1).sub(pt2).multiplyScalar(20)

            lineGeometry.setPositions([
                pt1pt2.x, pt1pt2.y, pt1pt2.z,
                pt2pt1.x, pt2pt1.y, pt2pt1.z
            ])

            // Move the line to the correct place
            lineGeometry.translate(pt1.x, pt1.y, pt1.z)

        }


        // Create a basic material with a color attribute
        // const lineMaterial = dashed ?
        //     new THREE.LineDashedMaterial(Object.assign(
        //         {
        //             color,
        //             dashSize: 0.5,
        //             gapSize: 0.2
        //         },
        //         dashed === true ? {} : dashed
        //     ))
        //     : new THREE.LineBasicMaterial({ color, })
        const lineMaterial = new LineMaterial({
            color,
            linewidth: width,
            vertexColors: false,
            dashed: dashed ? true : false,
            alphaToCoverage: true
        })

        // const line = new THREE.Line(lineGeometry, lineMaterial)
        const line = new Line2(lineGeometry, lineMaterial)
        line.scale.set(1, 1, 1)
        line.computeLineDistances()

        return line
    }

    function animate() {
        controls.update()
        renderer.render(scene, camera)
        labelRenderer.render(scene, camera)
    }

    function onResize() {
        const width = container.value.clientWidth
        const height = container.value.clientHeight
        renderer.setSize(width, height)
        labelRenderer.setSize(width, height)

        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }

    onMounted(() => {
        container.value.appendChild(renderer.domElement)
        container.value.appendChild(labelRenderer.domElement)

        // Animation
        renderer.setAnimationLoop(animate)

        // Gestion du redimensionnement
        useResizeObserver(container.value, () => {
            onResize()
        })
    })

    return { scene, renderer, camera, controls, animate, onResize, parse, parseParameters }
}