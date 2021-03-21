/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Anskar (https://sketchfab.com/Anskar)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/low-poly-cliff-b790920f0d1049dda2c35efb0352be60
title: Low poly Cliff
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/core/useGLTF'

export default function Cliff(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/cliff.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={[2, 2, 2]}>
        <mesh material={materials.Cliff} geometry={nodes.mesh_0.geometry} />
      </group>
    </group>
  )
}

useGLTF.preload('/cliff.gltf')
