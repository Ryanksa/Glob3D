/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: premudraya (https://sketchfab.com/premudraya)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/low-poly-assets-c5f2e7eacc0f4e659c4188925fcb84f1
title: Low poly assets
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/core/useGLTF'

export default function LeaflessTree(props) {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets.gltf');
    const pos = {
        x: props.position[0],
        y: props.position[1] + 7 - (props.size === "small"),
        z: props.position[2]
    };
    const rot = {
        x: props.rotation ? props.rotation[0] : 0,
        y: props.rotation ? props.rotation[1] : 0,
        z: props.rotation ? props.rotation[2] : 0
    };
    return (
    <group ref={group} dispose={null}>
        {props.size === "small" ?
        <group position={[pos.x, pos.y, pos.z]} rotation={[rot.x-Math.PI, rot.y+0.57, rot.z-Math.PI]} scale={[0.83, 0.83, 0.83]}>
            <mesh material={materials['Material.001']} geometry={nodes.mesh_8.geometry} />
        </group> :
        <group position={[pos.x, pos.y, pos.z]} rotation={[rot.x-Math.PI, rot.y+0.57, rot.z-Math.PI]} scale={[1, 1, 1]}>
            <mesh material={materials['Material.001']} geometry={nodes.mesh_3.geometry} />
        </group>}
    </group>
    );
}

useGLTF.preload('/assets.gltf')