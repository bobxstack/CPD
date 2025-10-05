import React from 'react';
// FIX: Import for side-effects to bring in @react-three/fiber's JSX namespace augmentations
import '@react-three/fiber';
import { Text } from '@react-three/drei';

const AxesAndGrid: React.FC = () => {
  const size = 10;
  const divisions = 10;

  return (
    <>
      <gridHelper args={[size, divisions, '#4A5568', '#4A5568']} rotation={[Math.PI / 2, 0, 0]} />
      {/* X Axis - Red */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-size / 2, 0, 0, size / 2, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <Text color="red" position={[size / 2 + 0.5, 0, 0]} fontSize={0.5}>X</Text>
      
      {/* Y Axis - Green */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -size / 2, 0, 0, size / 2, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="green" />
      </line>
      <Text color="green" position={[0, size / 2 + 0.5, 0]} fontSize={0.5}>Y</Text>

      {/* Z Axis - Blue */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -size / 2, 0, 0, size / 2])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="blue" />
      </line>
       <Text color="blue" position={[0, 0, size / 2 + 0.5]} fontSize={0.5}>Z</Text>
    </>
  );
};

export default AxesAndGrid;