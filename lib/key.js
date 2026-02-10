import * as THREE from "../node_modules/three/build/three.module.js";
import { scene, camera, renderer } from "./init.js";
import * as cam from "./player.js";
import { GLTFLoader } from "gltfloader";

const keys = [];
const keySeparation = 3;

function createKey(x, y, z, keyModel) {
  const keyGeometry = keyModel.clone();
  keyGeometry.position.set(x, y, z);

  scene.add(keyGeometry);
  keys.push(keyGeometry);
}

function generateRandomPosition() {
  const range = 20;
  const x = Math.random() * range - range / 2;
  const z = Math.random() * range - range / 2;
  const y = 0.3;

  return { x, y, z };
}

function generateRandomKeys(keyModel) {
  const numKeys = 8;

  for (let i = 0; i < numKeys; i++) {
    let position = generateRandomPosition();

    for (let j = 0; j < i; j++) {
      const distance = keys[j].position.distanceTo(
        new THREE.Vector3(position.x, position.y, position.z)
      );
      if (distance < keySeparation) {
        position = generateRandomPosition();
        j = -1;
      }
    }

    createKey(position.x, position.y, position.z, keyModel);
  }
}

export let point = 0;
document.getElementById("point").innerHTML = "x" + point;

const audio = document.getElementById("coin");

function checkKeyCollision() {
  const playerPosition = cam.control.camera.position;
  playerPosition.y = 0.3;
  keys.forEach((key, index) => {
    const keyBox = new THREE.Box3().setFromObject(key);

    if (keyBox.containsPoint(playerPosition)) {
      scene.remove(key);
      keys.splice(index, 1);
      point++;
      document.getElementById("point").innerHTML = "x" + point;
      audio.play();
      if (point == 8) {
        window.location.href = "win.html";
      }
    }
  });
}

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "../models/key/scene.gltf",
  function (result) {
    const keyModel = result.scene.children[0];
    keyModel.scale.set(0.001, 0.001, 0.001);
    keyModel.rotation.y = Math.PI / 2.5;
    keyModel.rotation.z = Math.PI / 2;
    generateRandomKeys(keyModel);

    const clock = new THREE.Clock();
    function update() {
      requestAnimationFrame(update);
      const delta = clock.getDelta();
      keys.forEach((key) => {
        key.rotation.z += delta;
      });
      renderer.render(scene, camera);
      checkKeyCollision();
    }
    update();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
