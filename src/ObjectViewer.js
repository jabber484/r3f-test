import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { useTexture, useFBX, Environment, OrbitControls, Html, useProgress } from "@react-three/drei";
import { Suspense } from "react";
import sample from "Assets/empty.fbx";
import desk from "Assets/desk.fbx";

const _DEFAULT_TEXTURE_BLK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2NgYGD4DwABBAEAcCBlCwAAAABJRU5ErkJggg==";
const _DEFAULT_TEXTURE_WHT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P4////fwAJ+wP9BUNFygAAAABJRU5ErkJggg==";
const _DEFAULT_NOMRAL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2NgYPj/HwADAgH/ybKt7gAAAABJRU5ErkJggg==";

const MainObject = (props) => {
  const src = props.src === null ? sample : props.src;
  const fbx = useFBX(src);
  const [colorMap, metalnessMap, normalMap, roughnessMap] = useTexture([
    props.maps.colorMap === null ? _DEFAULT_TEXTURE_WHT : props.maps.colorMap,
    props.maps.metalnessMap === null ? _DEFAULT_TEXTURE_BLK : props.maps.metalnessMap,
    props.maps.normalMap === null ? _DEFAULT_NOMRAL : props.maps.normalMap,
    props.maps.roughnessMap === null ? _DEFAULT_TEXTURE_WHT : props.maps.roughnessMap,
  ])
  
  const m = new THREE.MeshPhysicalMaterial( { 
    map: colorMap,
    metalnessMap: metalnessMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
  } );

  const _sample = (
    <mesh position={[0,1,0]} castShadow receiveShadow>
      <sphereBufferGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        map={colorMap}
        metalnessMap={metalnessMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
  return props.src === null ? _sample : <mesh {...fbx.children[0]}  castShadow material={m} position={props.offset} scale={props.scale}/>;
};


export default function ObjectViewer(props) {
  const Loader = () => {
    const { progress } = useProgress()
    return (
      <Html fullscreen>
        <div className="loading">{progress} % loaded</div>
      </Html>
    )
  }

  const Display = () => {
    const fbx = useFBX(desk);

    return (
      <mesh {...fbx.children[0]} scale={3} position={[0,0,0]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.65} metalness={0.9} color="#010101"/>
      </mesh>
      )
  };

  return (
    <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight
          position={[10, 10, 10]}
          angle={0.4}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

          <Suspense fallback={props.loader ? props.loader : <Loader/>}>
            <MainObject
              offset={props.offset}
              scale={props.scale}
              src={props.model ? props.model : null}
              maps={props.maps}
            />
          </Suspense>
          <Display/>
          <gridHelper/>

          <OrbitControls enablePan={false}/>
          <Environment preset="lobby" background />
        </Suspense>
    </Canvas>
  );
}
