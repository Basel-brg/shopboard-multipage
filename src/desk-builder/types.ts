import type * as THREE from 'three';

export interface DeskSceneItemUserData {
  productId: number;
  sku: string;
  name: string;
  price: number;
  category: string;
  type: string;
  isSurface?: boolean;
  heightOffset?: number;
}

export type DeskObjectGroup = THREE.Group & {
  userData: DeskSceneItemUserData;
};
