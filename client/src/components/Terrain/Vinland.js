import React from 'react';
import PropTypes from 'prop-types';
import { usePlane } from 'use-cannon';

import GreenBirchTree from './models/GreenBirchTree';
import GreenOakTree from './models/GreenOakTree';
import PineTree from './models/PineTree';
import Fence1 from './models/Fence1';
import Fence2 from './models/Fence2';
import Bench from './models/Bench';
import Bush1 from './models/Bush1';
import Bush2 from './models/Bush2';
import Bush3 from './models/Bush3';
import FlowerBush from './models/FlowerBush';
import Grass from './models/Grass';
import Flower from './models/Flower';
import Trunk from './models/Trunk';


const Vinland = (props) => {
    const [ref] = usePlane(() => ({
      position: [0,0,0],
      rotation: [-Math.PI/2, 0, 0]
    }));
    const pos = props.position;

    return(
      <group position={props.position}>
        <mesh ref={ref} receiveShadow >
          <planeBufferGeometry attach="geometry" args={[50, 50]} />
          <meshLambertMaterial attach="material" color="rgb(144, 238, 144)" />
        </mesh>
        <GreenBirchTree position={[10, 0, 9]} rotation={[0, -Math.PI/4 , 0]}/>
        <GreenBirchTree position={[6, 0, 17]} />
        <GreenBirchTree position={[14, 0, -4]} />
        <GreenBirchTree position={[18, 0, -10]} />
        <GreenBirchTree position={[-7, 0, 4]} rotation={[0, Math.PI/4, 0]}/>
        <GreenBirchTree position={[-19, 0, 8]} rotation={[0, Math.PI/2, 0]}/>
        <GreenBirchTree position={[-9, 0, -9]} />
        <GreenBirchTree position={[-13, 0, -18]} rotation={[0, -Math.PI/2, 0]}/>
        <GreenOakTree position={[22, 0, 13]} rotation={[0, Math.PI/2, 0]}/>
        <GreenOakTree position={[11, 0, 17]} rotation={[0, Math.PI/4, 0]}/>
        <GreenOakTree position={[7, 0, -16]} rotation={[0, Math.PI/2, 0]}/>
        <GreenOakTree position={[14, 0, -19]} />
        <GreenOakTree position={[-14, 0, 11]} rotation={[0, -Math.PI/6, 0]}/>
        <GreenOakTree position={[-17, 0, 20]} rotation={[0, Math.PI/8, 0]}/>
        <GreenOakTree position={[-20, 0, -12]} />
        <GreenOakTree position={[-4, 0, -15]} />
        <PineTree position={[0, 0, 4]} />
        <PineTree position={[17, 0, 3]} size="small"/>
        <PineTree position={[-6.5, 0, 19]} size="small"/>
        <PineTree position={[2, 0, -18]} />
        <PineTree position={[-18, 0, -4]} />
        <Bench position={[-0.25, 0, 2.5]} rotation={[0, Math.PI, 0]}/>
        <Bench position={[2.5, 0, -17]}/>
        <Bench position={[-18.5, 0, 5.5]} rotation={[0, -Math.PI/2, 0]}/>
        <Bench position={[16.75, 0, -8.75]} rotation={[0, Math.PI/3.5, 0]}/>
        <Bench position={[15.25, 0, -6.25]} rotation={[0, Math.PI/2.75, 0]}/>
        <Bench position={[-16, 0, -19]} rotation={[0, Math.PI, 0]}/>
        <Bush1 position={[5, 0, -16.5]} />
        <Bush2 position={[3, 0, -18.5]} />
        <Bush2 position={[4, 0, -18]} />
        <FlowerBush color="red" position={[15.5, 0, -9]} />
        <FlowerBush color="red" position={[16, 0, -10]} />
        <Bush2 position={[16.75, 0, -11]} />
        <Bush2 position={[14.5, 0, -8]} />
        <FlowerBush color="blue" position={[14, 0, -6.75]} />
        <Bush2 position={[13.5, 0, -5.5]} />
        <Bush2 position={[-10, 0, -9]} />
        <Bush2 position={[10, 0, 17]} />
        <FlowerBush color="red" position={[8.5, 0, 17]} />
        <FlowerBush color="red" position={[7.5, 0, 17]} />
        <Bush2 position={[14, 0, -20]} />
        <Bush2 position={[-17, 0, 19]} />
        <Bush2 position={[-14, 0, 9.5]} />
        <Bush2 position={[-13, 0, 10]} />
        <FlowerBush color="blue" position={[-13.5, 0, 9]} />
        <Bush3 position={[-14, 0, -17]} />
        <Bush1 position={[-15, 0, -17]} />
        <Bush3 position={[-16, 0, -17]} />
        <Bush1 position={[-17, 0, -17]} />
        <Bush3 position={[-18, 0, -17]} />
        <Fence1 position={[-17, 0, -18]} />
        <Fence1 position={[-15, 0, -18]} />
        <Fence1 position={[-17, 0, -16]} />
        <Fence1 position={[-15, 0, -16]} />
        <Fence2 position={[-19.5, 0, -4]} rotation={[0, Math.PI/2, 0]}/>
        <Fence2 position={[-16.5, 0, -4]} rotation={[0, Math.PI/2, 0]}/>
        <Fence2 position={[-18, 0, -5.5]} />
        <Fence2 position={[-18, 0, -2.5]} />
        <Grass position={[3, 0, -3]} />
        <Grass position={[3, 0, -4]} />
        <Grass position={[4, 0, -3]} />
        <Flower position={[3, 0, -3.5]} />
        <Grass position={[-11, 0, -1]} />
        <Grass position={[-11.5, 0, -2]} />
        <Grass position={[-10.75, 0, -3]} />
        <Grass position={[-11.75, 0, -4]} />
        <Grass position={[-10, 0, -1]} />
        <Grass position={[-10.5, 0, -2]} />
        <Grass position={[-9.75, 0, -3]} />
        <Grass position={[-10.75, 0, -4]} />
        <Flower position={[-11, 0, -3]} />
        <Flower position={[-10, 0, -2]} />
        <Trunk position={[2, 0, 12]}/>
        <Grass position={[2, 0, 13]} />
        <Grass position={[3, 0, 12]} />
        <Grass position={[1, 0, 12]} />
        <Trunk position={[15, 0, 8]}/>
        <Grass position={[15, 0, 9]} />
        <Grass position={[15.5, 0, 10]} />
        <Grass position={[14, 0, 11]} />
        <Flower position={[15, 0, 10.5]} />
        <Flower position={[16, 0, 7]} />
      </group>
    );
};

Vinland.propTypes = {};

Vinland.defaultProps = {};

export default Vinland;