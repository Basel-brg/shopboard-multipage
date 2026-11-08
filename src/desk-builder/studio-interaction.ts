import * as THREE from 'three';
import { create3DProduct } from './studio-catalog';
import type { DeskStudioScene } from './studio-scene';

export interface DeskLimits {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  baseY: number;
}

export const DESK_LIMITS: DeskLimits = {
  minX: -1.5,
  maxX: 1.5,
  minZ: -0.7,
  maxZ: 0.7,
  baseY: 1.44,
};

export function clampToDesk(
  x: number,
  z: number,
  limits: DeskLimits = DESK_LIMITS,
): { x: number; z: number } {
  return {
    x: Math.max(limits.minX, Math.min(limits.maxX, x)),
    z: Math.max(limits.minZ, Math.min(limits.maxZ, z)),
  };
}

export interface DeskSurface {
  isSurface: boolean;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  surfaceY: number;
}

export function calculateElevation(
  x: number,
  z: number,
  surfaces: DeskSurface[] = [],
  baseY: number = DESK_LIMITS.baseY,
): number {
  for (const s of surfaces) {
    if (s.isSurface && x >= s.minX && x <= s.maxX && z >= s.minZ && z <= s.maxZ) {
      return s.surfaceY;
    }
  }
  return baseY;
}

export class DeskStudioInteraction {
  scene: DeskStudioScene;
  onSelectionChange: (selected: THREE.Group | null) => void;
  onSetupChange: (placed: THREE.Group[]) => void;

  placedObjects: THREE.Group[] = [];
  selectedObject: THREE.Group | null = null;
  activeDragObj: THREE.Group | null = null;
  isSpawningNew: boolean = false;
  isDraggingExisting: boolean = false;

  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  instanceSeq: number = 1;

  constructor(
    studioScene: DeskStudioScene,
    onSelectionChange: (selected: THREE.Group | null) => void = () => {},
    onSetupChange: (placed: THREE.Group[]) => void = () => {},
  ) {
    this.scene = studioScene;
    this.onSelectionChange = onSelectionChange;
    this.onSetupChange = onSetupChange;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initEvents();
  }

  initEvents(): void {
    if (!this.scene || !this.scene.container) return;

    const container = this.scene.container;
    container.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());

    // Click on canvas to select or start moving existing item
    container.addEventListener('pointerdown', (e: PointerEvent) => {
      if (this.isSpawningNew) return;

      const hit = this.getClickableIntersection(e.clientX, e.clientY);
      if (hit) {
        const targetGroup = hit.object.userData.parentGroup;
        if (targetGroup instanceof THREE.Group) {
          this.selectObject(targetGroup);
          this.isDraggingExisting = true;
          this.activeDragObj = targetGroup;
          this.scene.setControlsEnabled(false);
        }
      } else {
        // Clicked empty space
        this.selectObject(null);
      }
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if ((this.isSpawningNew || this.isDraggingExisting) && this.activeDragObj) {
        this.handlePointerMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('pointerup', () => {
      if (this.isSpawningNew || this.isDraggingExisting) {
        this.handlePointerUp();
      }
    });
  }

  getDeskIntersection(clientX: number, clientY: number): THREE.Intersection | null {
    if (!this.scene || !this.scene.container || !this.scene.virtualDeskPlane || !this.scene.camera)
      return null;

    const rect = this.scene.container.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / this.scene.container.clientWidth) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / this.scene.container.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const hits = this.raycaster.intersectObject(this.scene.virtualDeskPlane);
    return hits.length > 0 ? hits[0] : null;
  }

  getClickableIntersection(clientX: number, clientY: number): THREE.Intersection | null {
    if (!this.scene || !this.scene.container || !this.scene.camera) return null;

    const rect = this.scene.container.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / this.scene.container.clientWidth) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / this.scene.container.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.scene.camera);

    const clickableMeshes: THREE.Mesh[] = [];
    this.placedObjects.forEach((group) => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData.parentGroup = group;
          clickableMeshes.push(child);
        }
      });
    });

    const hits = this.raycaster.intersectObjects(clickableMeshes);
    return hits.length > 0 ? hits[0] : null;
  }

  startSpawnDrag(productId: number | string, clientX: number, clientY: number): void {
    this.scene.setControlsEnabled(false);
    this.isSpawningNew = true;

    // Create 3D model immediately
    this.activeDragObj = create3DProduct(productId, false);
    if (!this.activeDragObj || !this.scene.scene) return;

    this.activeDragObj.userData.instanceId = 'inst_' + this.instanceSeq++;
    this.scene.scene.add(this.activeDragObj);

    this.handlePointerMove(clientX, clientY);
  }

  spawnAtCenter(productId: number | string): void {
    const obj = create3DProduct(productId, false);
    if (!obj || !this.scene.scene) return;
    obj.userData.instanceId = 'inst_' + this.instanceSeq++;
    const jitterX = (Math.random() - 0.5) * 0.4;
    const jitterZ = (Math.random() - 0.5) * 0.3;
    const y = calculateElevation(jitterX, jitterZ, this.getSurfaces());
    obj.position.set(jitterX, y, jitterZ);
    this.scene.scene.add(obj);
    this.placedObjects.push(obj);
    this.selectObject(obj);
    this.onSetupChange(this.placedObjects);
  }

  handlePointerMove(clientX: number, clientY: number): void {
    if (!this.activeDragObj) return;

    const hit = this.getDeskIntersection(clientX, clientY);
    if (hit) {
      const clamped = clampToDesk(hit.point.x, hit.point.z);
      const surfaces = this.getSurfaces();
      const y = calculateElevation(clamped.x, clamped.z, surfaces);
      this.activeDragObj.position.set(clamped.x, y, clamped.z);
    }
  }

  handlePointerUp(): void {
    if (this.isSpawningNew && this.activeDragObj) {
      this.placedObjects.push(this.activeDragObj);
      this.selectObject(this.activeDragObj);
      this.onSetupChange(this.placedObjects);
    } else if (this.isDraggingExisting && this.activeDragObj) {
      this.onSetupChange(this.placedObjects);
    }

    this.isSpawningNew = false;
    this.isDraggingExisting = false;
    this.activeDragObj = null;
    this.scene.setControlsEnabled(true);
  }

  getSurfaces(): DeskSurface[] {
    const surfaces: DeskSurface[] = [];
    for (const obj of this.placedObjects) {
      if (obj.userData.isSurface) {
        surfaces.push({
          isSurface: true,
          minX: obj.position.x - 0.9,
          maxX: obj.position.x + 0.9,
          minZ: obj.position.z - 0.4,
          maxZ: obj.position.z + 0.4,
          surfaceY: DESK_LIMITS.baseY + 0.015,
        });
      }
    }
    return surfaces;
  }

  selectObject(group: THREE.Group | null): void {
    this.selectedObject = group;
    this.onSelectionChange(this.selectedObject);
  }

  rotateSelected(degrees: number): void {
    if (!this.selectedObject) return;
    const rad = (degrees * Math.PI) / 180;
    this.selectedObject.rotation.y = rad;
  }

  deleteSelected(): void {
    if (!this.selectedObject || !this.scene.scene) return;
    this.scene.scene.remove(this.selectedObject);
    const idx = this.placedObjects.indexOf(this.selectedObject);
    if (idx > -1) {
      this.placedObjects.splice(idx, 1);
      this.onSetupChange(this.placedObjects);
    }
    this.selectObject(null);
  }

  getPlacedObjects(): THREE.Group[] {
    return this.placedObjects;
  }

  clearAll(): void {
    if (this.scene.scene) {
      for (const obj of this.placedObjects) {
        this.scene.scene.remove(obj);
      }
    }
    this.placedObjects = [];
    this.selectObject(null);
    this.onSetupChange(this.placedObjects);
  }
}
