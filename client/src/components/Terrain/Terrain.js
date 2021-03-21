import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Terrain.scss';
import { usePlane } from 'use-cannon';

import Wasteland from './Wasteland';
import BluePeriod from './BluePeriod';
import AutumnFalls from './AutumnFalls';
import Vinland from './Vinland';

const intToTerrain = {
  0: Wasteland,
  1: BluePeriod,
  2: Vinland,
  3: AutumnFalls
};

const Terrain = () => {
  const [terrainMatrix, setTerrainMatrix] = useState([]);
  const [len, setLen] = useState(0);

  useEffect(() => {
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `
          query {
            world {
              terrain
              size
            }
          }`
      }),
      credentials: "include"
    })
    .then((res) => { return res.json() })
    .then((data) => {
      if (data.data.world) {
        setTerrainMatrix(data.data.world.terrain);
        setLen(Math.sqrt(data.data.world.size));  
      }
    });
  }, []);

  return (<>
    {terrainMatrix.map((terrainArray, i) => {
      return (
        <>
          {terrainArray.map((terrainInt, j) => {
            const half = Math.floor(len/2);
            const TerrainType = intToTerrain[terrainInt];
            return <TerrainType position={[(j - half)*50, 0, (half - i)*50]}/>
          })}
        </>
      );
    })}
  </>);
};

Terrain.propTypes = {};

Terrain.defaultProps = {};

export default Terrain;
