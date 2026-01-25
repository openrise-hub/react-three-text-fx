import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export interface ExplodingTextProps {
  text: string | string[];
  fontPath: string;
  color?: THREE.ColorRepresentation;
  specular?: THREE.ColorRepresentation;
  shininess?: number;
  fontSize?: number;
  depth?: number;
  curveSegments?: number;
  bevelSize?: number;
  bevelThickness?: number;
  particleRadius?: number;
  animationDuration?: number;
  animationProgress?: number;
  speed?: number;
  autoplay?: boolean;
  yoyo?: boolean;
  repeatDelay?: number;
}

// Fibonacci sphere point distribution
function fibSpherePoint(i: number, n: number, radius: number) {
  const G = Math.PI * (3 - Math.sqrt(5));
  const step = 2.0 / n;
  
  const y = i * step - 1 + (step * 0.5);
  const r = Math.sqrt(1 - y * y);
  const phi = i * G;
  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;
  
  return {
    x: x * radius,
    y: y * radius,
    z: z * radius
  };
}

// Compute centroid of a triangle from positions
function computeCentroid(positions: Float32Array, i0: number, i1: number, i2: number): THREE.Vector3 {
  return new THREE.Vector3(
    (positions[i0 * 3] + positions[i1 * 3] + positions[i2 * 3]) / 3,
    (positions[i0 * 3 + 1] + positions[i1 * 3 + 1] + positions[i2 * 3 + 1]) / 3,
    (positions[i0 * 3 + 2] + positions[i1 * 3 + 2] + positions[i2 * 3 + 2]) / 3
  );
}

type ExplosionMeshData = {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhongMaterial>;
  animationDuration: number;
};

type ExplosionMaterialOptions = {
  color: THREE.ColorRepresentation;
  specular: THREE.ColorRepresentation;
  shininess: number;
};

type ExplosionGeometryOptions = ExplosionMaterialOptions & {
  particleRadius: number;
  animationDuration: number;
};

type ShaderLike = {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
};

function createExplosionMaterial(options: ExplosionMaterialOptions) {
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(options.color),
    specular: new THREE.Color(options.specular),
    shininess: options.shininess,
    flatShading: true,
    side: THREE.DoubleSide,
    transparent: true
  });

  material.onBeforeCompile = (shader: ShaderLike) => {
    shader.uniforms.uTime = { value: 0 };

    const vertexFunctions = `
      float easeCubicOut(float t, float b, float c, float d) {
        t = t / d - 1.0;
        return c * (t * t * t + 1.0) + b;
      }

      vec4 quatFromAxisAngle(vec3 axis, float angle) {
        float halfAngle = angle * 0.5;
        return vec4(axis * sin(halfAngle), cos(halfAngle));
      }

      vec3 rotateVector(vec4 q, vec3 v) {
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
      }
    `;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        [
          '#include <common>',
          'uniform float uTime;',
          'attribute vec2 aAnimation;',
          'attribute vec3 aEndPosition;',
          'attribute vec4 aAxisAngle;',
          vertexFunctions
        ].join('\n')
      )
      .replace(
        '#include <begin_vertex>',
        [
          'float tDelay = aAnimation.x;',
          'float tDuration = aAnimation.y;',
          'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
          'float tProgress = easeCubicOut(tTime, 0.0, 1.0, tDuration);',
          'vec3 transformed = vec3(position);',
          'transformed = mix(transformed, aEndPosition, tProgress);',
          'float angle = aAxisAngle.w * tProgress;',
          'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
          'transformed = rotateVector(tQuat, transformed);'
        ].join('\n')
      );

    material.userData.uniforms = shader.uniforms;
  };

  material.customProgramCacheKey = () => 'exploding-text-phong';
  material.needsUpdate = true;

  return material;
}

function createExplodingMesh(
  geometry: THREE.BufferGeometry,
  options: ExplosionGeometryOptions
): ExplosionMeshData {
  geometry.computeBoundingBox();
  const maxLength = geometry.boundingBox?.max.length() ?? 0;

  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const indexAttr = geometry.getIndex();
  const positions = positionAttr.array as Float32Array;
  const vertexCount = positionAttr.count;

  // Determine face count - if no index, every 3 vertices is a face
  let faceCount: number;
  let getVertexIndices: (faceIdx: number) => [number, number, number];

  if (indexAttr) {
    const indices = indexAttr.array as ArrayLike<number>;
    faceCount = indices.length / 3;
    getVertexIndices = (faceIdx: number) => [
      indices[faceIdx * 3],
      indices[faceIdx * 3 + 1],
      indices[faceIdx * 3 + 2]
    ];
  } else {
    // Non-indexed geometry: every 3 vertices is a triangle
    faceCount = vertexCount / 3;
    getVertexIndices = (faceIdx: number) => [
      faceIdx * 3,
      faceIdx * 3 + 1,
      faceIdx * 3 + 2
    ];
  }

  // Animation parameters
  const maxDelay = 0.0;
  const minDuration = options.animationDuration;
  const maxDuration = options.animationDuration;
  const stretch = 0.05;
  const lengthFactor = 0.001;
  const animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;

  // Create buffer attributes for each vertex
  const aAnimation = new Float32Array(vertexCount * 2);
  const aEndPosition = new Float32Array(vertexCount * 3);
  const aAxisAngle = new Float32Array(vertexCount * 4);

  // Process each face
  for (let faceIdx = 0; faceIdx < faceCount; faceIdx++) {
    const [i0, i1, i2] = getVertexIndices(faceIdx);

    const centroid = computeCentroid(positions, i0, i1, i2);
    const centroidN = centroid.clone().normalize();

    // Animation timing
    const delay = (maxLength - centroid.length()) * lengthFactor;
    const duration = THREE.MathUtils.randFloat(minDuration, maxDuration);

    // End position - fibonacci sphere distribution
    const point = fibSpherePoint(faceIdx, faceCount, options.particleRadius);

    // Axis angle for rotation
    const axis = new THREE.Vector3(centroidN.x, -centroidN.y, -centroidN.z).normalize();
    const angle = Math.PI * THREE.MathUtils.randFloat(0.5, 2.0);

    // Apply to all 3 vertices of this face
    for (const vertIdx of [i0, i1, i2]) {
      // Animation (delay, duration)
      aAnimation[vertIdx * 2] = delay + stretch * Math.random();
      aAnimation[vertIdx * 2 + 1] = duration;

      // End position
      aEndPosition[vertIdx * 3] = point.x;
      aEndPosition[vertIdx * 3 + 1] = point.y;
      aEndPosition[vertIdx * 3 + 2] = point.z;

      // Axis angle
      aAxisAngle[vertIdx * 4] = axis.x;
      aAxisAngle[vertIdx * 4 + 1] = axis.y;
      aAxisAngle[vertIdx * 4 + 2] = axis.z;
      aAxisAngle[vertIdx * 4 + 3] = angle;
    }
  }

  // Add attributes to geometry
  geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2));
  geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(aEndPosition, 3));
  geometry.setAttribute('aAxisAngle', new THREE.BufferAttribute(aAxisAngle, 4));

  const material = createExplosionMaterial(options);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;

  return { mesh, animationDuration };
}

export function ExplodingText({
  text,
  fontPath,
  color = 0xffffff,
  specular = 0xcccccc,
  shininess = 4,
  fontSize = 40,
  depth = 12,
  curveSegments = 24,
  bevelSize = 2,
  bevelThickness = 2,
  particleRadius = 200,
  animationDuration = 4,
  animationProgress,
  speed = 1,
  autoplay = true,
  yoyo = true,
  repeatDelay = 0.5
}: ExplodingTextProps) {
  const { size } = useThree();
  const font = useLoader(FontLoader, fontPath);
  const timelineState = useRef({ progress: 0 });
  const meshDataRef = useRef<ExplosionMeshData[]>([]);

  const lines = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const scale = useMemo(() => {
    const baseWidth = 1200;
    const aspectRatio = size.width / Math.max(1, size.height);
    const aspectScale = aspectRatio < 0.8 ? 0.7 : aspectRatio < 1 ? 0.85 : 1;
    const widthScale = Math.min(1, size.width / baseWidth);
    return widthScale * aspectScale;
  }, [size.height, size.width]);

  const meshes = useMemo<ExplosionMeshData[]>(() => {
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const duration = animationDuration / Math.max(speed, 0.01);

    return lines.map((lineText, lineIndex) => {
      const geometry = new TextGeometry(lineText, {
        font,
        size: fontSize,
        depth,
        curveSegments,
        bevelEnabled: true,
        bevelSize,
        bevelThickness
      });

      geometry.computeBoundingBox();
      const sizeVec = new THREE.Vector3();
      geometry.boundingBox?.getSize(sizeVec);
      geometry.translate(-sizeVec.x / 2, -sizeVec.y / 2, -sizeVec.z / 2);

      const meshData = createExplodingMesh(geometry, {
        particleRadius,
        animationDuration: duration,
        color,
        specular,
        shininess
      });

      const yOffset = totalHeight / 2 - lineIndex * lineHeight - lineHeight / 2;
      meshData.mesh.position.y = yOffset;

      return meshData;
    });
  }, [
    animationDuration,
    bevelSize,
    bevelThickness,
    color,
    curveSegments,
    depth,
    font,
    fontSize,
    lines,
    particleRadius,
    shininess,
    specular,
    speed
  ]);

  useEffect(() => {
    meshDataRef.current = meshes;
    return () => {
      meshes.forEach((meshData) => {
        meshData.mesh.geometry.dispose();
        meshData.mesh.material.dispose();
      });
    };
  }, [meshes]);

  useEffect(() => {
    timelineState.current.progress = 0;
    if (!autoplay || animationProgress !== undefined) {
      return;
    }

    const duration = animationDuration / Math.max(speed, 0.01);
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay,
      yoyo
    });

    tl.to(timelineState.current, {
      progress: 1,
      duration,
      ease: 'power1.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [animationDuration, animationProgress, autoplay, repeatDelay, speed, yoyo]);

  useFrame(() => {
    const progress = animationProgress !== undefined
      ? THREE.MathUtils.clamp(animationProgress, 0, 1)
      : timelineState.current.progress;

    meshDataRef.current.forEach(({ mesh, animationDuration: meshDuration }) => {
      const uniforms = mesh.material.userData?.uniforms as { uTime?: { value: number } } | undefined;
      if (uniforms?.uTime) {
        uniforms.uTime.value = meshDuration * progress;
      }
    });
  });

  return (
    <group scale={scale}>
      {meshes.map((meshData, index) => (
        <primitive key={index} object={meshData.mesh} />
      ))}
    </group>
  );
}

export default ExplodingText;