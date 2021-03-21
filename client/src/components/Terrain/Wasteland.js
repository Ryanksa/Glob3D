import React from 'react';
import PropTypes from 'prop-types';
import { usePlane } from 'use-cannon';

import LeaflessTree from './models/LeaflessTree';
import Cliff from './models/Cliff';
import Bench from './models/Bench';
import Fence3 from './models/Fence3';
import Fence4 from './models/Fence4';
import Trunk from './models/Trunk';
import StreetLamp2 from './models/StreetLamp2';


const Wasteland = (props) => {
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
          <LeaflessTree position={[22, 0, -5]} size="small" rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[19, 0, -11]} />
          <LeaflessTree position={[6, 0, 3]} size="small"/>
          <LeaflessTree position={[-17, 0, 16]} rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[-21, 0, -7]} size="small" rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[14, 0, 12]} />
          <LeaflessTree position={[-14, 0, -18]} rotation={[0, -Math.PI/2, 0]}/>
          <LeaflessTree position={[4, 0, 9]} size="small"/>
          <LeaflessTree position={[20, 0, 15]} rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[7, 0, -7]} size="small"/>
          <LeaflessTree position={[-13, 0, -5]} rotation={[0, -Math.PI/2, 0]}/>
          <LeaflessTree position={[-17, 0, -15]} size="small" rotation={[0, -Math.PI/2, 0]}/>
          <LeaflessTree position={[-19, 0, -8]} rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[-4, 0, -15]} />
          <LeaflessTree position={[-9, 0, -18]} rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[-21, 0, -11]} size="small"/>
          <LeaflessTree position={[23, 0, 10]} size="small"/>
          <LeaflessTree position={[13, 0, 21]} size="small"/>
          <LeaflessTree position={[9, 0, 19]} />
          <LeaflessTree position={[3, 0, 17]} rotation={[0, Math.PI/2, 0]}/>
          <LeaflessTree position={[-5, 0, 18]} size="small"/>
          <LeaflessTree position={[13, 0, -23]} size="small"/>
          <LeaflessTree position={[17, 0, -12]} size="small"/>
          <LeaflessTree position={[22, 0, -14]} size="small"/>
          <LeaflessTree position={[11, 0, -11]} size="small"/>
          <Cliff position={[3, 0, -12]}/>
          <Cliff position={[5, 0, -10]}/>
          <Cliff position={[1, 0, -9]}/>
          <Cliff position={[3, 0, -14]}/>
          <Cliff position={[-13, 0, 7]} rotation={[2.025, 0, 0]}/>
          <Cliff position={[-10, 0, 9]} rotation={[-2.025, 0, 0]}/>
          <Cliff position={[-12, 0, 15]}/>
          <Cliff position={[-17, 0, 3]} />
          <Cliff position={[17, 0, -18]} />
          <Bench position={[4, 0, -7]}/>
          <Fence3 position={[6, 0, 9]} rotation={[0, Math.PI/2, 0]}/>
          <Fence3 position={[2, 0, 9]} rotation={[0, Math.PI/2, 0]}/>
          <Fence3 position={[4, 0, 11]} />
          <Fence3 position={[4, 0, 7]} />
          <Fence4 position={[10, 0, 2]} />
          <Fence4 position={[10, 0, -2]} />
          <Fence4 position={[12, 0, 0]} rotation={[0, Math.PI/2, 0]}/>
          <Fence4 position={[8, 0, 0]} rotation={[0, Math.PI/2, 0]}/>
          <Trunk position={[10, 0, 0]}/>
          <Trunk position={[0, 0, -18]}/>
          <Trunk position={[-8, 0, 12]}/>
          <StreetLamp2 position={[6, 0, 11]} />
          <StreetLamp2 position={[2, 0, -7]} />
          <StreetLamp2 position={[12, 0, -2]} size="small"/>
          <StreetLamp2 position={[-15, 0, -1]} size="small" />
          <StreetLamp2 position={[13, 0, -20]} />
      </group>
    );
};

Wasteland.propTypes = {};

Wasteland.defaultProps = {};

export default Wasteland;