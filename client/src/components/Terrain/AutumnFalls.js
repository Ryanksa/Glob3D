import React from 'react';
import PropTypes from 'prop-types';
import { usePlane } from 'use-cannon';

import OrangeBirchTree from './models/OrangeBirchTree';
import OrangeOakTree from './models/OrangeOakTree';
import Fence1 from './models/Fence1';
import Fence3 from './models/Fence3';
import Bench from './models/Bench';
import Bush2 from './models/Bush2';
import FlowerBush from './models/FlowerBush';
import RedFlower from './models/RedFlower';
import Trunk from './models/Trunk';

const AutumnFalls = (props) => {
    const [ref] = usePlane(() => ({
      position: [0, 0, 0],
      rotation: [-Math.PI/2, 0, 0]
    }));

    return(
      <group position={props.position}>
        <mesh ref={ref} receiveShadow >
          <planeBufferGeometry attach="geometry" args={[50, 50]} />
          <meshLambertMaterial attach="material" color="rgb(144, 238, 144)" />
        </mesh>
        <OrangeBirchTree position={[10, 0, 11]}  rotation={[0, Math.PI/6, 0]}/>
        <OrangeBirchTree position={[5, 0, 18]} size="small" rotation={[0, Math.PI/2, 0]}/>
        <OrangeBirchTree position={[18, 0, 16]} size="small" rotation={[0, Math.PI/2, 0]}/>
        <OrangeBirchTree position={[19, 0, -12]} />
        <OrangeBirchTree position={[4, 0, -21]} size="small" rotation={[0, Math.PI/4, 0]}/>
        <OrangeBirchTree position={[-13, 0, 4]} size="small" rotation={[0, Math.PI/1.5, 0]}/>
        <OrangeBirchTree position={[-6, 0, 9]} />
        <OrangeBirchTree position={[-16, 0, 3]} />
        <OrangeBirchTree position={[-9, 0, -6]} rotation={[0, Math.PI/2, 0]}/>
        <OrangeBirchTree position={[-22, 0, -17]} />
        <OrangeBirchTree position={[-18, 0, -2]} rotation={[0, Math.PI/2, 0]}/>
        <OrangeOakTree position={[7, 0, 21]} size="small"/>
        <OrangeOakTree position={[19, 0, 8]} rotation={[0, Math.PI/2, 0]}/>
        <OrangeOakTree position={[13, 0, -19]} size="small"/>
        <OrangeOakTree position={[22, 0, -14]} rotation={[0, Math.PI/2, 0]}/>
        <OrangeOakTree position={[2, 0, -5]} size="small"/>
        <OrangeOakTree position={[-8, 0, 2]} size="small"/> 
        <OrangeOakTree position={[-17, 0, 15]} rotation={[0, Math.PI/4, 0]}/>
        <OrangeOakTree position={[-12, 0, -18]} rotation={[0, Math.PI/4, 0]}/>
        <OrangeOakTree position={[-10, 0, -16]} size="small"/>
        <OrangeOakTree position={[-5, 0, -19]} rotation={[0, Math.PI/8, 0]}/>
        <Bench position={[7, 0, 19.5]} rotation={[0, Math.PI/1.2, 0]} />
        <FlowerBush color="red" position={[5.5, 0, 20]} />
        <Fence1 position={[-7, 0, 6.5]} rotation={[0, Math.PI/1.85, 0]}/>
        <Fence1 position={[-7.25, 0, 4.5]} rotation={[0, Math.PI/1.85, 0]}/>
        <Bench position={[-6.5, 0, 5]} rotation={[0, Math.PI/1.85, 0]}/>
        <FlowerBush color="red" position={[-8, 0, 6]} />
        <FlowerBush color="red" position={[-8, 0, 7]} />
        <FlowerBush color="red" position={[-8, 0, 5]} />
        <FlowerBush color="red" position={[-8, 0, 4]} />
        <Fence3 position={[2, 0, -4]} />
        <Fence3 position={[2, 0, -6]} />
        <Fence3 position={[1, 0, -5]} rotation={[0, Math.PI/2, 0]}/>
        <Fence3 position={[3, 0, -5]} rotation={[0, Math.PI/2, 0]}/>
        <Trunk position={[12, 0, -2]} />
        <FlowerBush color="red" position={[13, 0, -2.5]} />
        <FlowerBush color="red" position={[10.5, 0, -2]} />
        <RedFlower position={[11.5, 0, -0.5]} rotation={[0, -Math.PI/4, 0]}/>
        <RedFlower position={[11, 0, -0.75]} rotation={[0, Math.PI/2, 0]}/>
        <RedFlower position={[12.5, 0, -0.5]} />
        <RedFlower position={[11.5, 0, -0.25]} rotation={[0, Math.PI/4, 0]}/>
        <Trunk position={[7, 0, -14]} />
        <Bench position={[2.25, 0, -20.5]} rotation={[0, Math.PI, 0]}/>
        <Bush2 position={[-9, 0, 19]} />
        <Bush2 position={[-10, 0, 18.5]} />
        <FlowerBush color="red" position={[-10.5, 0, 19.5]} />
        <FlowerBush color="red" position={[-8.5, 0, 20]} />
        <FlowerBush color="red" position={[-11, 0, 17]} />
        <FlowerBush color="red" position={[-7, 0, 18]} />
        <FlowerBush color="red" position={[-7.5, 0, 18.5]} />
        <RedFlower position={[-9, 0, 18]} rotation={[0, Math.PI, 0]}/>
        <RedFlower position={[-8.5, 0, 17]} rotation={[0, Math.PI, 0]}/>
        <RedFlower position={[-9.5, 0, 16]} rotation={[0, Math.PI, 0]}/>
        <RedFlower position={[-10, 0, 17.5]} rotation={[0, Math.PI, 0]}/>
        <RedFlower position={[-9, 0, 16.5]} rotation={[0, Math.PI, 0]}/>
      </group>
    );
};

AutumnFalls.propTypes = {};

AutumnFalls.defaultProps = {};

export default AutumnFalls;