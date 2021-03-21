/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: premudraya (https://sketchfab.com/premudraya)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/low-poly-assets-c5f2e7eacc0f4e659c4188925fcb84f1
title: Low poly assets
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/core/useGLTF'

export default function GreenOakTree(props) {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets.gltf');
    const pos = {
        x: props.position[0],
        y: props.position[1]+6,
        z: props.position[2]
    };
    const rot = {
        x: props.rotation ? props.rotation[0] : 0,
        y: props.rotation ? props.rotation[1] : 0,
        z: props.rotation ? props.rotation[2] : 0
    };
    return (
    <group ref={group} dispose={null}>
        <group position={[pos.x, pos.y, pos.z]} rotation={[rot.x-Math.PI, rot.y+0.57, rot.z-Math.PI]} scale={[0.64, 0.64, 0.64]}>
            <mesh material={materials['Material.001']} geometry={nodes.mesh_4.geometry} />
        </group>
    </group>
    );
}

useGLTF.preload('/assets.gltf')