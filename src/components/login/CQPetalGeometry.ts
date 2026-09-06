import * as THREE from 'three';

/**
 * Creates an organic, cupped 3D petal BufferGeometry.
 * Supports multiple shape variations (0: classic rose petal, 1: slender willow leaf, 2: broad curved leaf).
 */
export function createCQPetalGeometry(
  variant: 0 | 1 | 2 | 3 = 0,
  segmentsU = 16,
  segmentsV = 12
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= segmentsV; j++) {
    const v = j / segmentsV; // 0 to 1 across width
    const widthFactor = (v - 0.5) * 2; // -1 to 1

    for (let i = 0; i <= segmentsU; i++) {
      const u = i / segmentsU; // 0 to 1 along length

      let width = 0.45;
      let lengthScale = 1.2;
      let cupCurve = 0.14;
      let foldCurve = 0.08;
      let twistFactor = 0;

      if (variant === 1) {
        // Slender curved willow leaf
        width = Math.sin(Math.PI * Math.pow(u, 0.8)) * 0.32;
        lengthScale = 1.6;
        cupCurve = Math.sin(Math.PI * u) * 0.18;
        foldCurve = (1 - Math.pow(widthFactor, 2)) * 0.05;
      } else if (variant === 2) {
        // Broad curved leaf
        width = Math.sin(Math.PI * Math.pow(u, 0.5)) * 0.58;
        lengthScale = 1.1;
        cupCurve = Math.sin(Math.PI * u) * 0.12;
        foldCurve = (1 - Math.pow(widthFactor, 2)) * 0.12;
      } else if (variant === 3) {
        // Asymmetric twisted / folded leaf
        width = Math.sin(Math.PI * Math.pow(u, 0.65)) * 0.48;
        lengthScale = 1.35;
        cupCurve = Math.sin(Math.PI * u) * 0.22;
        foldCurve = widthFactor * 0.15;
        twistFactor = (u - 0.5) * widthFactor * 0.12;
      } else {
        // Classic cupped petal
        width = Math.sin(Math.PI * Math.pow(u, 0.7)) * 0.45;
      }

      const x = widthFactor * width;
      const y = (u - 0.5) * lengthScale;
      const z = Math.sin(Math.PI * u) * cupCurve + (1 - Math.pow(widthFactor, 2)) * foldCurve + twistFactor;

      positions.push(x, y, z);
      uvs.push(v, u);

      // Smooth organic normal
      const nx = -widthFactor * 0.35;
      const ny = (u - 0.5) * 0.25;
      const nz = 0.9;
      const len = Math.hypot(nx, ny, nz);
      normals.push(nx / len, ny / len, nz / len);
    }
  }

  const stride = segmentsU + 1;
  for (let j = 0; j < segmentsV; j++) {
    for (let i = 0; i < segmentsU; i++) {
      const a = j * stride + i;
      const b = j * stride + (i + 1);
      const c = (j + 1) * stride + (i + 1);
      const d = (j + 1) * stride + i;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
