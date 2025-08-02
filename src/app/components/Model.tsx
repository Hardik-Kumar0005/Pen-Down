// components/Model.tsx
import { useGLTF } from '@react-three/drei'
import { JSX } from 'react'

// We are defining the props that the component will accept.
// JSX.IntrinsicElements['group'] includes types for position, rotation, scale, etc.
type ModelProps = JSX.IntrinsicElements['group']

export function Model(props: ModelProps): JSX.Element {
  // The useGLTF hook is already typed, so 'scene' is correctly inferred.
  const { scene } = useGLTF('/scene.gltf')
  
  // The 'primitive' component renders the loaded scene.
  // We pass any additional props (like scale or position) to it.
  return <primitive object={scene} {...props} />
}

// Preload the model for faster loading.
useGLTF.preload('/scene.gltf')