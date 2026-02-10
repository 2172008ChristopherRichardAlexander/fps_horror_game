import { GLTFLoader } from "gltfloader";
import * as THREE from "../node_modules/three/build/three.module.js";
import { camera, renderer, scene } from "./init.js";
import * as cam from "./player.js";
import * as keys from "./key.js";

let defeat;

function createSlenderman(x, y, z, slenderman) {
  const slendermanGeometry = slenderman;
  slendermanGeometry.position.set(x, y, z);

  scene.add(slendermanGeometry);
}

function generateRandomPosition() {
  const range = 20;
  const x = Math.random() * range - range / 2;
  const z = Math.random() * range - range / 2;
  const y = 0;

  return { x, y, z };
}

function generateSlanderman(slenderman) {
  let position = generateRandomPosition();
  createSlenderman(position.x, position.y, position.z, slenderman);
}

let collisionDetected = false;

let clock = new THREE.Clock();

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveFaster = false;

let angka = 0;

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "slendermen/slenderman.gltf",
  function (result) {
    const slenderman = result.scene.children[0];
    slenderman.scale.set(0.3, 0.3, 0.3);
    console.log("ada slendermen !");
    generateSlanderman(slenderman);

    setInterval(popOutSlenderman, 10000);

    function update() {
      requestAnimationFrame(update);
      renderer.render(scene, camera);

      let delta = clock.getDelta();
      if (slenderman) {
        const playerPosition = cam.control.getObject().position.clone();
        const slendermanPosition = slenderman.position.clone();
        slendermanPosition.y = playerPosition.y;

        const direction = playerPosition.clone().sub(slendermanPosition);
        direction.normalize();

        const speed = 0.2 + keys.point * 0.1;

        slendermanPosition.add(direction.multiplyScalar(delta * speed));

        slenderman.position.copy(slendermanPosition);

        const distance = playerPosition.distanceTo(slendermanPosition);
        if (distance < 0.7) {
          window.location.href = "lose.html";
        }
      }

      if (cam.control.isLocked) {
        if (moveForward) {
          cam.control.moveForward(delta);
          if (checkSlendermenCollision(cam.control.getObject().position)) {
            cam.control.moveForward(-delta); // Move back to the previous position
          }
        }

        if (moveBackward) {
          cam.control.moveForward(-delta);
          if (checkSlendermenCollision(cam.control.getObject().position)) {
            cam.control.moveForward(delta); // Move back to the previous position
          }
        }

        if (moveLeft) {
          cam.control.moveRight(-delta);
          if (checkSlendermenCollision(cam.control.getObject().position)) {
            cam.control.moveRight(delta); // Move back to the previous position
          }
        }

        if (moveRight) {
          cam.control.moveRight(delta);
          if (checkSlendermenCollision(cam.control.getObject().position)) {
            cam.control.moveRight(-delta); // Move back to the previous position
          }
        }
      }
    }
    function popOutSlenderman() {
      if (slenderman) {
        slenderman.visible = false;

        setTimeout(function () {
          const positionNew = generateRandomPosition();
          generateSlanderman(slenderman);
          slenderman.visible = true;
          console.log("slenderman baru");
        }, 5000);
      }
    }
    update();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
