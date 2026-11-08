import * as THREE from 'three';
import { PRODUCTS } from '../modules/products/products.api';
import type { DeskSceneItemUserData } from './types';

export function create3DProduct(
  productId: number | string,
  isPreview: boolean = false,
): THREE.Group | null {
  const product = PRODUCTS.find((p) => p.id === Number(productId));
  if (!product) return null;

  const group = new THREE.Group();
  const alpha = isPreview ? 0.6 : 1.0;
  const transparent = isPreview;

  const userData: DeskSceneItemUserData = {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    price: product.price,
    category: product.category,
    type: getProductType(product.id),
    isSurface: product.id === 8, // Desk mat is a surface for stacking
    heightOffset: 0.04,
  };
  group.userData = userData;

  const type = userData.type;

  if (type === 'pc') {
    buildGamingPCCase(group, transparent, alpha, isPreview);
  } else if (type === 'monitor') {
    buildCurvedMonitor(group, transparent, alpha);
  } else if (type === 'keyboard') {
    buildMechanicalKeyboard(group, transparent, alpha);
  } else if (type === 'mouse') {
    buildErgonomicMouse(group, transparent, alpha);
  } else if (type === 'mat') {
    buildDeskMat(group, transparent, alpha);
  } else if (type === 'speaker') {
    buildStudioSpeaker(group, transparent, alpha);
  } else if (type === 'lamp') {
    buildDeskLamp(group, transparent, alpha, isPreview);
  } else {
    buildGenericAccessory(group, transparent, alpha);
  }

  return group;
}

function getProductType(id: number): string {
  switch (id) {
    case 9:
      return 'pc';
    case 10:
      return 'monitor';
    case 1:
      return 'keyboard';
    case 4:
      return 'mouse';
    case 8:
      return 'mat';
    case 2:
      return 'speaker';
    case 3:
      return 'lamp';
    default:
      return 'accessory';
  }
}

// 1. Custom Aorus Gaming PC Case
function buildGamingPCCase(
  group: THREE.Group,
  transparent: boolean,
  alpha: number,
  isPreview: boolean,
): void {
  // Case Chassis
  const caseGeo = new THREE.BoxGeometry(0.3, 0.62, 0.55);
  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.35,
    metalness: 0.85,
    transparent,
    opacity: alpha,
  });
  const chassis = new THREE.Mesh(caseGeo, caseMat);
  chassis.position.set(0, 0.31, 0);
  chassis.castShadow = !isPreview;
  chassis.receiveShadow = true;
  group.add(chassis);

  // Tempered Glass Left Side Panel
  const glassGeo = new THREE.PlaneGeometry(0.52, 0.58);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: isPreview ? 0.4 : 0.25,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.5,
  });
  const glassPanel = new THREE.Mesh(glassGeo, glassMat);
  glassPanel.position.set(-0.151, 0.31, 0);
  glassPanel.rotation.y = -Math.PI / 2;
  group.add(glassPanel);

  // 3 Front ARGB Fans
  const fanGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 24);
  fanGeo.rotateX(Math.PI / 2);
  const fanColors = [0x00ffcc, 0xff007f, 0x0088ff];

  for (let i = 0; i < 3; i++) {
    const fanMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: fanColors[i],
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });
    const fan = new THREE.Mesh(fanGeo, fanMat);
    fan.position.set(0, 0.15 + i * 0.16, 0.276);
    group.add(fan);
  }

  // Internal GPU Representation
  const gpuGeo = new THREE.BoxGeometry(0.18, 0.06, 0.32);
  const gpuMat = new THREE.MeshStandardMaterial({
    color: 0x222225,
    metalness: 0.9,
    roughness: 0.3,
  });
  const gpu = new THREE.Mesh(gpuGeo, gpuMat);
  gpu.position.set(0.02, 0.24, -0.02);
  group.add(gpu);

  // Subtle interior glow
  if (!isPreview) {
    const caseLight = new THREE.PointLight(0x00e5ff, 1.2, 0.8);
    caseLight.position.set(-0.05, 0.35, 0);
    group.add(caseLight);
  }
}

// 2. Gigabyte Curved Gaming Monitor
function buildCurvedMonitor(group: THREE.Group, transparent: boolean, alpha: number): void {
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.4,
  });

  // Stand Base & Pole
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.28), standMat);
  base.position.set(0, 0.01, 0);
  base.castShadow = true;
  group.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52), standMat);
  pole.position.set(0, 0.27, 0);
  pole.castShadow = true;
  group.add(pole);

  // Screen Bezel
  const screenGeo = new THREE.BoxGeometry(1.85, 0.65, 0.04);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x0f0f12,
    roughness: 0.5,
    metalness: 0.5,
    transparent,
    opacity: alpha,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0.58, 0.06);
  screenMesh.castShadow = true;
  group.add(screenMesh);

  // Curved Display Panel
  const displayGeo = new THREE.PlaneGeometry(1.81, 0.61);
  const displayMat = new THREE.MeshStandardMaterial({
    color: 0x225599,
    emissive: 0x1166cc,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    transparent,
    opacity: alpha,
  });
  const displayPlane = new THREE.Mesh(displayGeo, displayMat);
  displayPlane.position.set(0, 0.58, 0.082);
  group.add(displayPlane);
}

// 3. Mechanical Keyboard
function buildMechanicalKeyboard(group: THREE.Group, transparent: boolean, alpha: number): void {
  const kbGeo = new THREE.BoxGeometry(0.72, 0.035, 0.25);
  const kbMat = new THREE.MeshStandardMaterial({
    color: 0x2e323b,
    roughness: 0.4,
    transparent,
    opacity: alpha,
  });
  const kb = new THREE.Mesh(kbGeo, kbMat);
  kb.position.set(0, 0.018, 0);
  kb.castShadow = true;
  group.add(kb);

  // Keycaps with RGB backlight accent
  const keysGeo = new THREE.BoxGeometry(0.68, 0.018, 0.21);
  const keysMat = new THREE.MeshStandardMaterial({
    color: 0x1e2026,
    emissive: 0xff7b00,
    emissiveIntensity: 0.65,
    transparent,
    opacity: alpha,
  });
  const keys = new THREE.Mesh(keysGeo, keysMat);
  keys.position.set(0, 0.035, 0);
  group.add(keys);
}

// 4. Ergonomic Mouse
function buildErgonomicMouse(group: THREE.Group, transparent: boolean, alpha: number): void {
  const mouseGeo = new THREE.BoxGeometry(0.12, 0.045, 0.18);
  const mouseMat = new THREE.MeshStandardMaterial({
    color: 0x262a34,
    roughness: 0.3,
    metalness: 0.5,
    transparent,
    opacity: alpha,
  });
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  mouse.position.set(0, 0.0225, 0);
  mouse.castShadow = true;
  group.add(mouse);
}

// 5. Desk Mat
function buildDeskMat(group: THREE.Group, transparent: boolean, alpha: number): void {
  const matGeo = new THREE.BoxGeometry(1.8, 0.015, 0.8);
  const matMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e323d,
    roughness: 0.85,
    transparent,
    opacity: alpha,
  });
  const deskPad = new THREE.Mesh(matGeo, matMaterial);
  deskPad.position.set(0, 0.0075, 0);
  deskPad.receiveShadow = true;
  group.add(deskPad);
}

// 6. Studio Speaker
function buildStudioSpeaker(group: THREE.Group, transparent: boolean, alpha: number): void {
  const spkGeo = new THREE.BoxGeometry(0.2, 0.36, 0.22);
  const spkMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.6,
    transparent,
    opacity: alpha,
  });
  const spk = new THREE.Mesh(spkGeo, spkMat);
  spk.position.set(0, 0.18, 0);
  spk.castShadow = true;
  group.add(spk);

  // Woofer cone
  const coneGeo = new THREE.CylinderGeometry(0.065, 0.035, 0.015, 24);
  coneGeo.rotateX(Math.PI / 2);
  const coneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.set(0, 0.14, 0.112);
  group.add(cone);
}

// 7. Desk Lamp / Screenbar
function buildDeskLamp(
  group: THREE.Group,
  transparent: boolean,
  alpha: number,
  isPreview: boolean,
): void {
  const barGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.82, 16);
  barGeo.rotateZ(Math.PI / 2);
  const barMat = new THREE.MeshStandardMaterial({
    color: 0x242428,
    metalness: 0.85,
    roughness: 0.25,
    transparent,
    opacity: alpha,
  });
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.position.set(0, 0.1, 0);
  group.add(bar);

  if (!isPreview) {
    const warmLight = new THREE.PointLight(0xffaa44, 2.0, 2.5);
    warmLight.position.set(0, 0.15, 0.1);
    group.add(warmLight);
  }
}

// 8. Generic Accessory Fallback
function buildGenericAccessory(group: THREE.Group, transparent: boolean, alpha: number): void {
  const geo = new THREE.BoxGeometry(0.18, 0.12, 0.18);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x555560,
    roughness: 0.5,
    transparent,
    opacity: alpha,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0.06, 0);
  mesh.castShadow = true;
  group.add(mesh);
}
