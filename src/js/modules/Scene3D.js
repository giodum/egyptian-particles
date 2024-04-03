import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'stats.js'

import gsap from 'gsap'

import math, {mod} from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'

import Model from './Model'

const DEV_HELPERS = false

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

    // init renderer and scene
    this.#initRendererAndScene()

    // init basic helpers
    this.#initBasicHelpers()

    // init camera
    this.#initCamera()

    // init orbit control
    // this.#initOrbitControl()

    // init lights
    this.#initLights()

    // init clock
    this.clock = new THREE.Clock()

    // init scene
    this.#initScene()

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
    this.camera.position.set(0, 0, 5)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  #initOrbitControl() {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbit.update()
  }

  #initLights() {
    this.spotLight = new THREE.SpotLight(
      '#d9eafc',
      100,
      30,
      Math.PI / 4,
      0.7,
      1
    )
    this.spotLight.position.set(0, 4, 4)
    this.scene.add(this.spotLight)

    if (DEV_HELPERS) {
      this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight, 'yellow')
      this.scene.add(this.spotLightHelper)
    }
  }

  #initScene() {
    this.anubis = new Model({
      name: 'anubis',
      file: './models/pharaon.glb',
      scene: this.scene,
      placeOnLoad: true,
    })
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

    this.stats.begin()

    // move light with mouse movement
    this.spotLight.position.x = math.mapRange(
      this.#mouse.x,
      0,
      window.innerWidth,
      -8,
      8
    )
    this.spotLight.position.y = math.mapRange(
      this.#mouse.y,
      0,
      window.innerHeight,
      -4,
      4
    )

    // update helper position
    if (this.spotLightHelper) {
      this.spotLightHelper.update()
    }

    // animate model
    const modTime = time / 500
    this.anubis.mesh.position.y =
      (Math.sin(modTime / 2) * Math.sin(modTime / 4) * Math.sin(modTime / 8)) /
      14
    this.anubis.mesh.rotation.y = (Math.PI / 16) * Math.sin(modTime / 4)

    // clear buffer and render the scene
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)

    this.stats.end()
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
