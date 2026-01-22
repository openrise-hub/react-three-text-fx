import React from "react";
import { Canvas } from "@react-three/fiber";
import { ExplodingText } from "react-three-text-fx";

export default function App() {
  return (
    <main style={{ height: "100vh", margin: 0 }}>
      <Canvas camera={{ position: [0, 0, 600], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 1]} intensity={1} />
        <ExplodingText
          text="react-three-text-fx"
          fontPath="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
        />
      </Canvas>
    </main>
  );
}
