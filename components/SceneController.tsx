import React, { useMemo, useEffect, useRef } from 'react';
import { useStore, useStoreActions } from '../store/store';
import { PLAYBACK_SPEED } from '../constants';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AxesAndGrid from './AxesAndGrid';
import Trajectory from './Trajectory';
import * as THREE from 'three';

const SceneController: React.FC = () => {
  const { trackData, axisMapping, isPlaying, currentTime } = useStore(state => ({
    trackData: state.trackData,
    axisMapping: state.view.axisMapping,
    isPlaying: state.playback.isPlaying,
    currentTime: state.playback.currentTime,
  }));
  
  const { setTime, togglePlay } = useStoreActions();
  const lastFrameTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    let animationFrameId: number;
    
    if (isPlaying && trackData) {
      const animate = (time: number) => {
        const deltaTime = (time - lastFrameTimeRef.current) / 1000;
        lastFrameTimeRef.current = time;

        let endOfTrack = false;

        setTime(prevTime => {
            if (!trackData) return 0;
            const newTime = prevTime + deltaTime * PLAYBACK_SPEED;
            if (newTime >= trackData.metadata.duration) {
              endOfTrack = true;
              return trackData.metadata.duration;
            }
            return newTime;
        });
        
        if (endOfTrack) {
          togglePlay();
        } else {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      lastFrameTimeRef.current = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, trackData, setTime, togglePlay]);

  // FIX: Destructure axisMapping properties 'x', 'y', 'z' and alias them.
  const { x: xMetric, y: yMetric, z: zMetric } = axisMapping;

  if (!trackData || !xMetric || !yMetric) {
    return (
        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
            <p>Select X and Y axes to visualize data.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls 
          enablePan={true} 
          minPolarAngle={Math.PI / 2} 
          maxPolarAngle={Math.PI / 2}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />
        <AxesAndGrid />
        <Trajectory 
          trackData={trackData}
          axisMapping={axisMapping}
          currentTime={currentTime}
        />
      </Canvas>
       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 text-center italic">
        Rotate: Left-click + Drag | Zoom: Scroll | Pan: Right-click + Drag
      </div>
    </div>
  );
};

export default SceneController;