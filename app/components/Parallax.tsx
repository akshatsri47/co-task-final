import Background1 from "../../public/background1.svg";
import Man from "../../public/man.svg";


export default function Parallax() {
  return (
    <div className="relative w-full h-screen ">
    
      <Background1 className="absolute bottom-0.5 left-0 w-[1400px] max-full h-auto" />
      <Man className=" absolute w-[30vh] h-[25vh] left-10 bottom-20" />

    </div>
  );
}
