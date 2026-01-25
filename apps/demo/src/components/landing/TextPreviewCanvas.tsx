import React from "react";
import { Canvas } from "@react-three/fiber";
import { ExplodingText, type ExplodingTextProps } from "react-three-text-fx";

export type TextPreviewCanvasProps = {
  text: string;
  fontSize: number;
  cameraZ: number;
  className?: string;
  cameraFov?: number;
  ambientIntensity?: number;
  directionalIntensity?: number;
  directionalPosition?: [number, number, number];
} & Partial<ExplodingTextProps>;

export function TextPreviewCanvas({
  text,
  fontSize,
  cameraZ,
  className,
  cameraFov = 60,
  ambientIntensity = 0.5,
  directionalIntensity = 1,
  directionalPosition = [0, 0, 1],
  fontPath = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
  color,
  specular,
  shininess,
  depth,
  curveSegments,
  bevelSize,
  bevelThickness,
  particleRadius,
  animationDuration,
  animationProgress,
  speed = 1.25,
  autoplay,
  yoyo,
  repeatDelay
}: TextPreviewCanvasProps) {
  return (
    <div className={className}>
      <Canvas className="!h-full !w-full" camera={{ position: [0, 0, cameraZ], fov: cameraFov }}>
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={directionalPosition} intensity={directionalIntensity} />
        <ExplodingText
          text={text}
          fontPath={fontPath}
          fontSize={fontSize}
          color={color}
          specular={specular}
          shininess={shininess}
          depth={depth}
          curveSegments={curveSegments}
          bevelSize={bevelSize}
          bevelThickness={bevelThickness}
          particleRadius={particleRadius}
          animationDuration={animationDuration}
          animationProgress={animationProgress}
          speed={speed}
          autoplay={autoplay}
          yoyo={yoyo}
          repeatDelay={repeatDelay}
        />
      </Canvas>
    </div>
  );
}
