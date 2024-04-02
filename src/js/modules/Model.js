import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'

export default class Model {
  constructor(object, nParticles = 10000) {
    this.name = object.name
    this.file = object.file
    this.scene = object.scene
    this.placeOnLoad = object.placeOnLoad
    this.nParticles = nParticles

    this.loader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('./draco/')
    this.loader.setDRACOLoader(this.dracoLoader)

    this.init()
  }

  init() {
    this.loader.load(this.file, (response) => {
      // get the mesh from the model
      this.mesh = response.scene.children[0]

      // create new material
      this.material = new THREE.MeshBasicMaterial({
        color: 'red',
        wireframe: true,
      })

      // substitued material
      this.mesh.material = this.material

      // get geometry
      this.geometry = this.mesh.geometry

      // create particles
      this.createParticles()

      // add object to the scene
      if (this.placeOnLoad) {
        this.addToScene()
      }
    })
  }

  addToScene() {
    this.scene.add(this.particles)
  }

  removeFromScene() {
    this.scene.remove(this.particles)
  }

  createParticles() {
    // initialize sampler
    const sampler = new MeshSurfaceSampler(this.mesh).build()

    // create particles geometry
    this.particlesGeometry = new THREE.BufferGeometry()
    const particlesPosition = new Float32Array(this.nParticles * 3)

    for (let i = 0; i < this.nParticles; i++) {
      const p = new THREE.Vector3()
      sampler.sample(p)
      particlesPosition.set([p.x, p.y, p.z], i * 3)
    }

    this.particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlesPosition, 3)
    )

    // create particles material
    this.particlesMaterial = new THREE.PointsMaterial({
      color: 'red',
      size: 0.001,
    })

    this.particles = new THREE.Points(
      this.particlesGeometry,
      this.particlesMaterial
    )
  }
}
