/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: premudraya (https://sketchfab.com/premudraya)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/low-poly-assets-c5f2e7eacc0f4e659c4188925fcb84f1
title: Low poly assets
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/core/useGLTF'

export default function StreetLamp3(props) {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets.gltf');
    const pos = {
        x: props.position[0],
        y: props.position[1] + 3.7,
        z: props.position[2]
    };
    return (
        <group ref={group} dispose={null}>
            {props.type === "bent" ?
            <group position={[pos.x, pos.y, pos.z]} scale={[0.155, 2.79, 0.155]} rotation={props.rotation}>
                <mesh material={materials['Material.001']} geometry={nodes.mesh_37.geometry} />
            </group> :
            <group position={[pos.x, pos.y, pos.z]} scale={[0.155, 2.79, 0.155]}>
                <mesh material={materials['Material.001']} geometry={nodes.mesh_36.geometry} />
            </group>}
        </group>
    );
}

useGLTF.preload('/assets.gltf')