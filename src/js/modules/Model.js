import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'

export default class Model {
  constructor(object) {
    this.name = object.name
    this.file = object.file
    this.scene = object.scene
    this.placeOnLoad = object.placeOnLoad

    this.isActive = false

    this.loader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('./draco/')
    this.loader.setDRACOLoader(this.dracoLoader)

    this.textureLoader = new THREE.TextureLoader()

    this.init()
  }

  init() {
    // promise - loading texture
    const loadTexturePromise = new Promise((resolve, reject) => {
      this.textureLoader.load(
        '/maps/acoustical_shell_1k.jpg',
        resolve,
        undefined,
        reject
      )
    })

    // promise - loading model
    const loadModelPromise = new Promise((resolve, reject) => {
      this.loader.load(this.file, resolve, undefined, reject)
    })

    Promise.all([loadTexturePromise, loadModelPromise]).then(
      ([texture, model]) => {
        // save the texture
        this.texture = texture

        // generate proper material
        this.material = new THREE.MeshPhysicalMaterial({
          attenuationColor: 'green',
          clearcoat: 0.7,
          color: 0x121212,
          ior: 2.0,
          envMap: this.texture,
          roughness: 0.1,
        })

        // save the model mesh
        this.mesh = model.scene.children[0]

        // substitued material
        this.mesh.material = this.material

        // save geometry
        this.geometry = this.mesh.geometry

        // add object to the scene
        if (this.placeOnLoad) {
          this.addToScene()
        }
      }
    )
  }

  addToScene() {
    this.scene.add(this.mesh)
    this.isActive = true
  }

  removeFromScene() {
    this.scene.remove(this.mesh)
    this.isActive = false
  }
}
