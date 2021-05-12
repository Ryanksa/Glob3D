import React, { useEffect, useState } from 'react';
import './Terrain.scss';

import { fetchGraphql } from '../../utils/fetchService';
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
    const abortController = new AbortController();
    const signal = abortController.signal;

    (function updateWorld(longPoll) {
      fetchGraphql(`
        query {
          world(long: ${longPoll}) {
            terrain
            size
          }
        }
      `, signal)
      .then((res) => { return res.json() })
      .then((data) => {
        if (data.data.world) {
          setTerrainMatrix(data.data.world.terrain);
          setLen(Math.sqrt(data.data.world.size));  
        }
        updateWorld(true);
      })
      .catch(() => {
        if (!signal.aborted) updateWorld(true);
      });
    })(false);

    return (() => {
      abortController.abort();
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

export default Terrain;
