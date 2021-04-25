import { Html, useProgress } from "@react-three/drei";
import { useState } from "react";

import "./styles.css";
import ObjectViewer from 'ObjectViewer';

export default function App() {
  const [offset, setOffset] = useState([0,0,0]);
  var _offset = [0,0,0]
  const [scale, setScale] = useState(1);
  const [model, setModel] = useState(null);
  const [maps, setMaps] = useState({
    colorMap: null,
    metalnessMap: null,
    normalMap: null,
    roughnessMap: null
  });

  const submitfile = (event) => {
    const file = event.target.files[0];

    switch(event.target.name)
    {
      case "model":
        setModel(URL.createObjectURL(file));
        break;
      default:
        setMaps({
          ...maps,
          [event.target.name]: URL.createObjectURL(file)
        })
        break;
    }
	};
  const handleOffset = (index, value) => {
    _offset[index] = value;
    setOffset(_offset);
  }

  const CustomLoader = () => {
    const { progress } = useProgress()
    return (
      <Html fullscreen>
        <div className="loading2">{progress} % loaded</div>
      </Html>
    )
  }

  return (
    <div className="Wrapper">
      <div className="App">
        <ObjectViewer 
          model={model} 
          maps={maps} 
          loader={<CustomLoader/>}
          offset={offset}
          scale={scale}
        />

        <div style={{marginTop:"16px", textAlign: "left"}}>
          <div>Model</div>
          <input name="model" type="file" accept=".fbx" onChange={submitfile}/>

          <div className="space"/>
          <div>Texture</div>
          <input name="colorMap" type="file" accept=".jpg, .jpeg, .png" onChange={submitfile}/>

          <div className="space"/>
          <div>Metal</div>
          <input name="metalnessMap" type="file" accept=".jpg, .jpeg, .png" onChange={submitfile}/>

          <div className="space"/>
          <div>Normal</div>
          <input name="normalMap" type="file" accept=".jpg, .jpeg, .png" onChange={submitfile}/>

          <div className="space"/>
          <div>Roughness</div>
          <input name="roughnessMap" type="file" accept=".jpg, .jpeg, .png" onChange={submitfile}/>

          <div className="space"/>
          <div>Offset</div>
          <input name="offset-x" type="number" onChange={(e) => handleOffset(0, e.target.value)} className="offset" value={offset[0]}/>
          <input name="offset-y" type="number" onChange={(e) => handleOffset(1, e.target.value)} className="offset" value={offset[1]}/>
          <input name="offset-z" type="number" onChange={(e) => handleOffset(2, e.target.value)} className="offset" value={offset[2]}/>

          <div className="space"/>
          <div>Scale</div>
          <input name="scale" type="number" onChange={(e) => setScale(e.target.value)} className="offset" value={scale}/>
        </div>
        
      </div>
    </div>
  );
}
