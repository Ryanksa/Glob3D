import React, { useEffect, useRef } from 'react';
import { useThree, extend } from 'react-three-fiber';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

// code for character movement and camera referenced from https://www.youtube.com/watch?v=Lc2JvBXMesY
extend({ PointerLockControls });

const Camera = (props) => {
    const { camera, gl } = useThree();
    const controls = useRef();

    useEffect(() => {
        document.addEventListener("click", () => {
            controls.current.lock();
        });
    }, []);

    return <pointerLockControls ref={controls} args={[camera, gl.domElement]} {...props}/>
}

export default Camera;