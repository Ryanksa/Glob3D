/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Anskar (https://sketchfab.com/Anskar)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/low-poly-flowers-857802babfd542e094e8ef2c396be360
title: Low Poly Flowers
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/core/useGLTF'

export default function Flower(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/flower.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[19.36, 21.39, 11.67]} rotation={[0, 0, 0]} scale={[100, 100, 100]}>
            <mesh material={materials['Material.001']} geometry={nodes.Circle001_Material001_0.geometry} />
          </group>
          <group position={[-12.33, 25.21, 6.35]} rotation={[0, 0, 0]} scale={[100, 100, 100]}>
            <mesh material={materials['Material.001']} geometry={nodes.Circle006_Circle007_Material001_0.geometry} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/flower.gltf')