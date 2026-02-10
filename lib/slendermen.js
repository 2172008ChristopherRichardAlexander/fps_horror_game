import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";
import * as THREE from "../node_modules/three/build/three.module.js";

var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer({
  antialias: true,
});

cam.position.z = 15;
cam.position.x = 10;
cam.position.y = 0;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xaaaaaa);

const controls = new OrbitControls(cam, renderer.domElement);

var ambientLight = new THREE.PointLight(0xffffff, 0.5);
scene.add(ambientLight);

let texture = new THREE.TextureLoader().load("img/slenderman-2.png");

let slenderman;
let animation;
let mixer;
const loader = new GLTFLoader().load(
  "slendermen/slenderman-baru/slenderman-mad.gltf",
  function (result) {
    animation = result.animations;

    mixer = new THREE.AnimationMixer(result.scene);
    let action = mixer.clipAction(animation[0]);
    action.play();

    slenderman = result.scene.children[1];
    slenderman.scale.set(3, 3, 3);
    slenderman.position.set(0, -13, 0);
    slenderman.rotation.z -= 0.5;
    slenderman.castShadow = true;
    console.log(result);
    scene.add(slenderman);
  }
);

window.addEventListener("resize", function () {
  renderer.setSize(this.window.innerWidth, this.window.innerHeight);
  cam.aspect = this.window.innerWidth / this.window.innerHeight;
  cam.updateProjectionMatrix();
});

let clock = new THREE.Clock();
function update() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }

  requestAnimationFrame(update);
  renderer.render(scene, cam);
}
update();
