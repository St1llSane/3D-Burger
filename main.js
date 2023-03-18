import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader'
import { sRGBEncoding } from 'three'
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

// Loaders
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
loader.setDRACOLoader(dracoLoader)

const cubeTextureLoader = new THREE.CubeTextureLoader()

// Env map
const envMap = cubeTextureLoader.load([
  './hdri/px.png',
  './hdri/nx.png',
  './hdri/py.png',
  './hdri/ny.png',
  './hdri/pz.png',
  './hdri/nz.png',
])
scene.background = envMap
scene.environment = envMap
envMap.encoding = sRGBEncoding

// Update all materials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = debugObject.envMapIntensity
			child.material.needsUpdate = true
    }
  })
}

/* Objects */
loader.load('./burger/Burger.gltf', (gltf) => {
  gltf.scene.scale.set(0.2, 0.2, 0.2)
  gltf.scene.position.set(0, -0.75, 0)
  gltf.scene.castShadow = true

  const childer = [...gltf.scene.children]
  childer.forEach((child) => {
    child.castShadow = true
    child.receiveShadow = true
  })

	updateAllMaterials()

  scene.add(gltf.scene)
})
/* Objects */

/* Meshes */
/* Meshes */

/* Lights */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff')
ambientLight.intensity = 1
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0, 3, 0)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 8
directionalLight.shadow.normalBias = 0.04
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)

// const directionalLightHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// )
// scene.add(directionalLightHelper)
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
camera.position.set(0, 0, 12)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
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

// Animations
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}
tick()
