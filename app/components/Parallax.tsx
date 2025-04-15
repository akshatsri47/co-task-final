"use client"
import Land from  "../../public/land.svg"
import Mountain from "../../public/mountain.svg"
import Cloud from  "../../public/clouds.svg"
import Tree from "../../public/trees.svg"
import Man from "../../public/man.svg";
import Land2 from "../../public/land2.svg"
import Land3 from "../../public/land3.svg"
import { Parallax, ParallaxProvider } from "react-scroll-parallax";


export default function ParallaxScene() {

  return (
    <ParallaxProvider>
    <div className="relative w-full h-screen top-30  ">
      <Mountain className="absolute bottom-20 object-left " />
      <Cloud className="absolute left-40 " />
      <Tree className="absolute bottom-18 left-36 z-10" />
      
      <div className="absolute top-40 left-30 z-10">
        <Parallax 
          translateX={[0, 250]}
          translateY={[0,60]}
          speed={-5}
          startScroll={0}
          endScroll={500}
        >
          <Man className="h-[40vh] w-[40vh]" />
        </Parallax>
      </div>
     
      <Land className="absolute bottom-18 " />
      <Land2 className="absolute left-0 bottom-[-45%]" />
      <Land3 className="absolute mx-auto ml-0 bottom-[-100%]" />
      
    
     

    </div>
    </ParallaxProvider> 
  );
}