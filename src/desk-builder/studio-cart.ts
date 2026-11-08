import type * as THREE from 'three';
import { PRODUCTS } from '../modules/products/products.api';
import type { DeskSceneItemUserData } from './types';
import type { Product } from '../modules/products/products.types';

export interface SetupCartResult {
  totalItems: number;
  uniqueProducts: number;
  totalAmount: number;
}

export function isDeskItemUserData(data: unknown): data is Partial<DeskSceneItemUserData> {
  return typeof data === 'object' && data !== null;
}

export function calculateSetupTotal(placedInstances: THREE.Object3D[] = []): number {
  return placedInstances.reduce((sum, inst) => {
    if (isDeskItemUserData(inst.userData)) {
      return sum + (inst.userData.price || 0);
    }
    return sum;
  }, 0);
}

export function addSetupToCart(
  placedInstances: THREE.Object3D[] = [],
  addItemFn?: (product: Product, quantity?: number) => void,
): SetupCartResult {
  if (!placedInstances.length || !addItemFn) {
    return { totalItems: 0, uniqueProducts: 0, totalAmount: 0 };
  }

  const counts = new Map<number, number>();
  for (const inst of placedInstances) {
    if (isDeskItemUserData(inst.userData)) {
      const pId = inst.userData.productId;
      if (pId) {
        counts.set(pId, (counts.get(pId) || 0) + 1);
      }
    }
  }

  let totalItems = 0;
  let totalAmount = 0;

  for (const [productId, quantity] of counts.entries()) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      addItemFn(product, quantity);
      totalItems += quantity;
      totalAmount += product.price * quantity;
    }
  }

  return {
    totalItems,
    uniqueProducts: counts.size,
    totalAmount,
  };
}
