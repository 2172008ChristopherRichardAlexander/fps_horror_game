import * as THREE from '../node_modules/three/build/three.module.js';
import { scene } from './init.js';

const texture = new THREE.TextureLoader().load('./img/sky.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8, 5);

var skyGeometry = new THREE.CapsuleGeometry(30, 1, 6, 4);
var skyMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
var sky = new THREE.Mesh(skyGeometry, skyMaterial);
sky.rotation.y = Math.PI / 4;
scene.add(sky);
