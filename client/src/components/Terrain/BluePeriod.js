import React from 'react';
import { usePlane } from 'use-cannon';

import BlueBirchTree from './models/BlueBirchTree';
import BlueOakTree from './models/BlueOakTree';
import StreetLamp1 from './models/StreetLamp1';
import StreetLamp3 from './models/StreetLamp3';
import FlowerBush from './models/FlowerBush';
import Bush2 from './models/Bush2';
import Bush3 from './models/Bush3';
import Bush5 from './models/Bush5';
import Grass from './models/Grass';
import Flower from './models/Flower';
import Trunk from './models/Trunk';


const BluePeriod = (props) => {
    const [ref] = usePlane(() => ({
      position: [0,0,0],
      rotation: [-Math.PI/2, 0, 0]
    }));

    return(
      <group position={props.position}>
        <mesh ref={ref} receiveShadow >
          <planeBufferGeometry attach="geometry" args={[50, 50]} />
          <meshLambertMaterial attach="material" color="rgb(144, 238, 144)" />
        </mesh>
        <BlueBirchTree position={[5, 0, 5]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[-17, 0, -20]} />
        <BlueBirchTree position={[-11, 0, 1]} />
        <BlueBirchTree position={[1, 0, -7]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[-8, 0, -15]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[-14, 0, 21]} />
        <BlueBirchTree position={[16, 0, 7]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[13, 0, -8]} />
        <BlueBirchTree position={[-2, 0, 21]} />
        <BlueBirchTree position={[2, 0, 15]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[20, 0, 10]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[17, 0, 1]} />
        <BlueBirchTree position={[21, 0, -9]} />
        <BlueBirchTree position={[-19, 0, -11]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[-11, 0, 7]} rotation={[0, Math.PI/2, 0]}/>
        <BlueBirchTree position={[-18, 0, 1]} />
        <BlueBirchTree position={[-23, 0, -6]} rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[14, 0, 19]} />
        <BlueOakTree position={[9, 0, -5]} size="small"/>
        <BlueOakTree position={[-13, 0, -12]} rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[8, 0, -11]} size="small" rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[7, 0, 11]} rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[11, 0, 19]} size="small"/>
        <BlueOakTree position={[14, 0, -22]} size="small" rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[-8, 0, 16]} rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[-22, 0, 12]} />
        <BlueOakTree position={[-5, 0, 5]} rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[19, 0, -2]} size="small" rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[21, 0, -18]} rotation={[0, Math.PI/2, 0]}/>
        <BlueOakTree position={[2, 0, -16]} size="small"/>
        <BlueOakTree position={[9, 0, -17]} size="small"rotation={[0, Math.PI/2, 0]}/>
        <Bush2 position={[6, 0, 5]} />
        <Bush2 position={[-21, 0, 13]} />
        <Bush2 position={[-12, 0, 7]} />
        <Bush2 position={[18, 0, 0]} />
        <Bush2 position={[12, 0, 20.5]} />
        <Bush2 position={[-9, 0, -13]} />
        <Bush3 position={[-22, 0, 11]} />
        <Bush3 position={[2, 0, -7]} />
        <Bush3 position={[16, 0, 12]} />
        <Bush3 position={[-17, 0, 19]} />
        <Bush3 position={[-7.5, 0, 0.5]} />
        <Bush3 position={[-6, 0, -2.5]} />
        <Bush3 position={[-3, 0, -23]} />
        <Bush3 position={[-2, 0, -23]} />
        <Bush3 position={[-1, 0, -23]} />
        <Bush3 position={[0, 0, -23]} />
        <Bush3 position={[1, 0, -23]} />
        <Bush3 position={[2, 0, -23]} />
        <Bush3 position={[3, 0, -23]} />
        <Bush5 position={[-6, 0, 0]} />
        <Bush5 position={[-5, 0, 1]} />
        <Bush5 position={[-6, 0, -1]} />
        <Bush5 position={[-7, 0, -1.5]} />
        <Bush5 position={[8, 0, -11]} />
        <Bush5 position={[5, 0, 20]} />
        <Bush5 position={[5.5, 0, 21]} />
        <Bush5 position={[6, 0, 20]} />
        <FlowerBush color="blue" position={[0, 0, -7]} />
        <FlowerBush color="blue" position={[-12.5, 0, 8.5]} />
        <FlowerBush color="blue" position={[11, 0, -6]} />
        <FlowerBush color="blue" position={[20, 0, -18]} />
        <FlowerBush color="blue" position={[8, 0, -16]} />
        <FlowerBush color="blue" position={[14, 0, 20]} />
        <FlowerBush color="blue" position={[12, 0, 18]} />
        <FlowerBush color="blue" position={[-13, 0, -12.2]} />
        <FlowerBush color="blue" position={[-5, 0, -0.5]} />
        <FlowerBush color="blue" position={[4.5, 0, 21]} />
        <Flower position={[7, 0, 10]} />
        <Flower position={[7, 0, -11]} />
        <Flower position={[-19, 0, -19]} />
        <Flower position={[-9, 0, -14]} />
        <Flower position={[-2, 0, 17]} />
        <Flower position={[-13, 0, -16]} />
        <Flower position={[11, 0, -22]} />
        <Flower position={[-11, 0, -18]} />
        <Flower position={[-6, 0, 15]} />
        <Grass position={[7, 0, 9]} />
        <Grass position={[16, 0, -17]} />
        <Grass position={[2, 0, -2]} />
        <Grass position={[17, 0, 14]} />
        <Grass position={[8, 0, -11]} />
        <Grass position={[-5, 0, -17]} />
        <Grass position={[-4, 0, -18]} />
        <Grass position={[-7, 0, -19]} />
        <Grass position={[1, 0, -22]} />
        <Grass position={[-20, 0, -22]} />
        <Grass position={[-19, 0, -19]} />
        <Grass position={[-17, 0, -21]} />
        <Grass position={[-13, 0, -18]} />
        <Grass position={[-13, 0, -16]} />
        <Grass position={[-13, 0, -14]} />
        <Grass position={[-11, 0, -16]} />
        <Grass position={[-13, 0, -16]} />
        <Grass position={[-15, 0, -16]} />
        <Grass position={[-5, 0, 15]} />
        <Grass position={[-6, 0, 13]} />
        <Grass position={[-3, 0, 17]} />
        <Trunk position={[13, 0, -6]} />
        <Trunk position={[-11, 0, -6]} />
        <Trunk position={[19, 0, 20]} />
        <StreetLamp1 position={[13, 0, -10]} type="bent" />
        <StreetLamp1 position={[-12, 0, -6]} />
        <StreetLamp1 position={[19, 0, 17]} type="bent" />
        <StreetLamp3 position={[0, 0, -20]}/>
        <StreetLamp3 position={[4, 0, -1]} />
        <StreetLamp3 position={[-10, 0, 18]} type="bent" rotation={[0, -Math.PI/2, 0]} />
      </group>
    );
};

export default BluePeriod;