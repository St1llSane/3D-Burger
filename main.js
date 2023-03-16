import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader'
import './style.css'

// Bebug UI
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.canvas')

// Scene
const scene = new THREE.Scene()

// Materials
const defMaterial = new THREE.MeshStandardMaterial()
const floorMaterial = new THREE.MeshStandardMaterial({ color: '#F99F9F' })

/* Objects */
// Loader
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
loader.setDRACOLoader(dracoLoader)

loader.load('./burger/Burger.gltf', (gltf) => {
  gltf.scene.scale.set(0.1, 0.1, 0.1)
  gltf.scene.position.set(0, -Math.PI / 8, 0)
  scene.add(gltf.scene)
})
/* Objects */

/* Meshes */
// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), floorMaterial)
floor.rotation.set(-Math.PI / 2, 0, 0)
floor.position.set(0, -1, 0)
scene.add(floor)
/* Meshes */

/* Lights */
const ambientLight = new THREE.AmbientLight('#F9F9F9')
ambientLight.intensity = 0.8
scene.add(ambientLight)
/* Lights */

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Cameras
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)
camera.position.set(0, 2, 5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Resizing
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.04
controls.minDistance = 1
controls.maxDistance = 10

// Animationsa
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}
tick()
