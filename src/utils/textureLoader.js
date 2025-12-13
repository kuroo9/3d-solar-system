// src/utils/textureLoader.js
import * as THREE from 'three';

// Fallback colors for planets
const fallbackColors = {
  1: '#8c7853', // Mercury
  2: '#ff8c42', // Venus
  3: '#1e90ff', // Earth
  4: '#cd5c5c', // Mars
  5: '#d4a017', // Jupiter
  6: '#f0e68c', // Saturn
  7: '#afeeee', // Uranus
  8: '#4169e1', // Neptune
  9: '#c0c0c0'  // Pluto
};

class SafeTextureLoader {
  constructor() {
    this.loader = new THREE.TextureLoader();
    this.cache = new Map();
  }

  loadTexture(url, planetId) {
    // Return cached texture if available
    if (this.cache.has(url)) {
      const cached = this.cache.get(url);
      if (cached instanceof Promise) {
        return cached;
      }
      return Promise.resolve(cached);
    }

    // Create a promise for the texture load
    const texturePromise = new Promise((resolve) => {
      this.loader.load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.flipY = false;
          this.cache.set(url, { texture, error: false });
          resolve({ texture, error: false });
        },
        undefined,
        (error) => {
          console.warn(`Failed to load texture for planet ${planetId}:`, error);
          this.cache.set(url, { texture: null, error: true });
          resolve({ texture: null, error: true });
        }
      );
    });

    this.cache.set(url, texturePromise);
    return texturePromise;
  }

  getFallbackColor(planetId) {
    return fallbackColors[planetId] || '#666666';
  }
}

export const textureLoader = new SafeTextureLoader();

// Example usage:
// const { texture } = await textureLoader.loadTexture('path/to/texture.jpg', 1);
// if (texture) {
//   material.map = texture;
//   material.needsUpdate = true;
// }
