import React, { useEffect, useRef } from 'react';
import { useThree, extend } from 'react-three-fiber';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

// code for camera lock and controls taken from https://www.youtube.com/watch?v=Lc2JvBXMesY
extend({ PointerLockControls });

const Camera = (props) => {
    const { camera, gl } = useThree();
    const controls = useRef();

    useEffect(() => {
        const lockCamera = () => {
            if (controls.current) controls.current.lock();
        };
        const world = document.querySelector("#world");
        if (world) world.addEventListener("click", lockCamera);

        return (() => {
            if (world) document.removeEventListener("click", lockCamera);
        });
    }, []);

    return <pointerLockControls ref={controls} args={[camera, gl.domElement]} {...props}/>
}

export default Camera;