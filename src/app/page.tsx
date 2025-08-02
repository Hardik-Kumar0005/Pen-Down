import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <>

    <div className="font-sans grid grid-cols-2 p-8 pb-20 gap-16 sm:p-20 text-amber-200 place-items-center h-screen bg-[url('/blurbg.png')] bg-cover bg-center">
    <div>Todo App</div>
      <Link href="/dashboard"
      className="flex flex-row items-center justify-center gap-9 p-8  rounded-lg transition-colors duration-300 h-92 w-135 mr-40 ">
        <Image
        src="/illustratio.jpg"
        alt="Dashboard"
        width={600}
        height={600}
        className="my-96 rounded-lg shadow-lg"
        priority
        draggable={false}
        />
      <Image
        src="/blocks.png"
        alt="Dashboard"
        width={600}
        height={600}
        className="rotate-45 rounded-lg shadow-lg"
        priority
        draggable={false}
        />
      </Link>
        </div>
    </>
  );
}