import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Terrain.scss';

import { fetchGraphql } from '../../fetchService';
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
    fetchGraphql(`
      query {
        world {
          terrain
          size
        }
      }
    `)
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
