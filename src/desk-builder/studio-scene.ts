import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class DeskStudioScene {
  container: HTMLElement | null = null;
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  controls: OrbitControls | null = null;
  deskTopMesh: THREE.Mesh | null = null;
  virtualDeskPlane: THREE.Mesh | null = null;
  animId: number | null = null;
  isRunning: boolean = false;
  private _onResize: (() => void) | null = null;

  init(containerElement: HTMLElement): void {
    this.container = containerElement;
    if (!this.container) return;

    // Scene setup with soft clean studio atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1e212b);
    this.scene.fog = new THREE.FogExp2(0x1e212b, 0.015);

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // Perspective Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 3.4, 4.6);

    // Renderer with enhanced studio exposure
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.45;

    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent going under floor
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 8.0;
    this.controls.target.set(0, 1.25, 0);

    // Lighting (Studio 3-Point Lighting + Hemisphere Fill)
    this.setupLighting();

    // Environment & Desk
    this.setupRoomAndDesk();

    // Resize handler
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
  }

  setupLighting(): void {
    if (!this.scene) return;

    // 1. Hemisphere Light (Soft Sky Light + Warm Ground Bounce) - Eliminates pitch-black shadows
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444855, 1.8);
    this.scene.add(hemiLight);

    // 2. Main Key Light (Warm Front-Right Spotlight)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(3.5, 6.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // 3. Fill Light (Cool Front-Left Soft Fill) - Brightens the left side of the desk & keyboard
    const fillLight = new THREE.DirectionalLight(0xd5e5ff, 1.6);
    fillLight.position.set(-4.5, 5.0, 4.0);
    this.scene.add(fillLight);

    // 4. Back / Rim Light (Highlights monitor bevels and PC glass edge)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
    rimLight.position.set(0, 4.5, -3.5);
    this.scene.add(rimLight);
  }

  setupRoomAndDesk(): void {
    if (!this.scene) return;

    // Floor (Warm Studio Slate)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x1c1f28, roughness: 0.75, metalness: 0.1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Wall (Clean Modern Studio Backing)
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 15),
      new THREE.MeshStandardMaterial({ color: 0x242834, roughness: 0.85 }),
    );
    wall.position.set(0, 7.5, -3);
    wall.receiveShadow = true;
    this.scene.add(wall);

    // Desk Group
    const deskGroup = new THREE.Group();
    this.scene.add(deskGroup);

    // Desk Top (Warm Natural Walnut / Oak Wood)
    const deskGeo = new THREE.BoxGeometry(3.2, 0.08, 1.6);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x66412b,
      roughness: 0.28,
      metalness: 0.04,
    });
    this.deskTopMesh = new THREE.Mesh(deskGeo, deskMat);
    this.deskTopMesh.position.set(0, 1.4, 0);
    this.deskTopMesh.castShadow = true;
    this.deskTopMesh.receiveShadow = true;
    deskGroup.add(this.deskTopMesh);

    // Invisible Raycasting Plane for direct drag
    const deskPlaneGeo = new THREE.PlaneGeometry(3.4, 1.8);
    const deskPlaneMat = new THREE.MeshBasicMaterial({ visible: false });
    this.virtualDeskPlane = new THREE.Mesh(deskPlaneGeo, deskPlaneMat);
    this.virtualDeskPlane.rotation.x = -Math.PI / 2;
    this.virtualDeskPlane.position.set(0, 1.44, 0);
    this.scene.add(this.virtualDeskPlane);

    // Desk Legs
    const legGeo = new THREE.BoxGeometry(0.08, 1.4, 1.4);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.4,
      metalness: 0.8,
    });

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-1.45, 0.7, 0);
    leftLeg.castShadow = true;
    deskGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(1.45, 0.7, 0);
    rightLeg.castShadow = true;
    deskGroup.add(rightLeg);
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      this.animId = requestAnimationFrame(loop);
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    loop();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resize(): void {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getDeskTopMesh(): THREE.Mesh | null {
    return this.deskTopMesh;
  }

  getVirtualDeskPlane(): THREE.Mesh | null {
    return this.virtualDeskPlane;
  }

  setControlsEnabled(enabled: boolean): void {
    if (this.controls) {
      this.controls.enabled = enabled;
    }
  }

  dispose(): void {
    this.stop();
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
