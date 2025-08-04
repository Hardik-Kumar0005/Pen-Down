"use client";

import { Luckiest_Guy } from 'next/font/google';
const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-luckiest-guy',
});

import { Bitcount_Grid_Double } from 'next/font/google';
const bitcount = Bitcount_Grid_Double({
  weight: '400',
  variable: '--font-bitcount',
});

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Model } from "../app/components/Model"

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

import Image from "next/image";
import Link from "next/link";



export default function Home() {
  
  useGSAP(() => {

    


let h1 = SplitText.create("h1", { type: "words, chars" });
gsap.from(h1.chars, {
  duration: 0.2, 
  x: -100, // animate from 100px to the right  
  autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
  stagger: 0.05,  // 0.05 seconds between each
});


let h3 = SplitText.create("h3", { type: "words, chars" });
gsap.from(h3.chars, {
  duration: 0.7, 
       // animate from 100px below
  autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
  stagger: 0.05,  // 0.05 seconds between each
});


  });


  return (
    <>

    <div className="font-sans grid grid-cols-2 p-8 pb-20 gap-16 sm:p-20 text-amber-200 place-items-center h-screen bg-[url('/blurbg.png')] bg-cover bg-center">
    <div>
      <h1 className={`text-4xl sm:text-9xl font-bold mb-4 ${luckiestGuy.className}`}>Pen Down</h1>
      <h3 className={`text-lg sm:text-xl mb-8 ${bitcount.className}`}>Track and keep up with your todos from anywhere!</h3>
      <Link href="/dashboard"
        className="px-6 py-3 bg-cyan-600 text-black font-bold rounded-lg hover:bg-cyan-500 transition-colors text-[clamp(1.2)]"
      >
        <span className={`text-2xl ${luckiestGuy.className}`}>🖊️Start Now !</span>
      </Link>

    </div>
      {/* <Link href="/dashboard"
      className="flex flex-row items-center justify-center gap-9 p-8  rounded-lg transition-colors duration-300 h-auto w-auto mr-0 "> */}
        <div className="w-auto h-auto sm:w-300 sm:h-250 relative right-1">
      <Canvas
        shadows
        className=""
        camera={{
          position: [4, 100, 10]
        }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model 
          scale={1}
          />
          <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={1}
          />
        </Suspense>

      </Canvas>
    </div>
      {/* </Link> */}
        </div>
    </>
  );
}