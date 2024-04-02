import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'stats.js'

import gsap from 'gsap'

import math from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'

const DEV_HELPERS = true
const DEV_WIREFRAMES = true

export default class Scene3D {
  // unique instance
  static item = null

  // screen variable
  #mouse = new THREE.Vector2(0, 0)
  #window = {
    aspectRatio: window.innerWidth / window.innerHeight,
    height: window.innerHeight,
    width: window.innerWidth,
  }

  constructor() {
    // check previous existance of the instance
    if (Scene3D.item) {
      throw new Error('Scene3D has already been initialized')
    }

    // init stats
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
    this.stats.dom.classList.add('stats')

    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init renderer and scene
    this.#initRendererAndScene()

    // init basic helpers
    this.#initBasicHelpers()

    // init camera
    this.#initCamera()

    // init orbit control
    this.#initOrbitControl()

    // init lights
    this.#initLights()

    // test scene
    this.#testScene()

    // add event listeners
    this.eventListeners()

    // animation loop
    this.animate()
  }

  #initRendererAndScene() {
    // init renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: document.querySelector('canvas'),
    })
    this.renderer.setSize(this.#window.width, this.#window.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000, 0)

    // init scene
    this.scene = new THREE.Scene()
  }

  #initBasicHelpers() {
    if (DEV_HELPERS) {
      // axes helper
      const axesHelper = new THREE.AxesHelper(300)
      axesHelper.setColors()
      this.scene.add(axesHelper)

      // grid helper
      let gridHelper = new THREE.GridHelper(30, 30)
      this.scene.add(gridHelper)
    }
  }

  #initCamera() {
    // init camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.#window.aspectRatio,
      0.1,
      100
    )
    this.camera.position.set(10, 10, 10)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  #initOrbitControl() {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbit.update()
  }

  #initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 10)
    this.ambientLight.position.set(0, 0, 0)
    this.scene.add(this.ambientLight)
  }

  #testScene() {
    const geometry = new THREE.SphereGeometry(3, 20, 20)
    const material = new THREE.MeshStandardMaterial({
      color: 0x444,
      wireframe: DEV_WIREFRAMES,
    })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
  }

  eventListeners() {
    // mouse mouve and mobile touch move
    window.addEventListener('mousemove', this.mouseMove.bind(this))
    window.addEventListener('touchmove', this.mouseMove.bind(this))

    // resize
    window.addEventListener('resize', this.resize.bind(this))
  }

  animate(time) {
    requestAnimationFrame((time) => this.animate(time))

    // clear buffer and render the scene
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }

  mouseMove(event) {
    // interpolate mouse movement to make it smootjìh
    gsap.to(this.#mouse, {
      duration: 1,
      x:
        event.clientX ||
        event.pageX ||
        (event.touches ? event.touches[0].pageX : 0),
      y:
        event.clientY ||
        event.pageY ||
        (event.touches ? event.touches[0].pageY : 0),
      ease: 'power2.out',
    })
  }

  resize() {
    // update window info
    this.#window.height = window.innerHeight
    this.#window.width = window.innerWidth
    this.#window.aspectRatio = window.innerWidth / window.innerHeight

    // update renderer
    this.renderer.setSize(this.#window.width, this.#window.height)
    this.camera.aspect = this.#window.aspectRatio
    this.camera.updateProjectionMatrix()
  }

  static init() {
    if (!Scene3D.item) {
      Scene3D.item = new Scene3D()
    }
  }
}
