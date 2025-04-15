
import Navbar from "./components/Navbar";
import ParallaxScene from "./components/Parallax";
import Text from "./components/Text1"



export default function Home() {
  return (
    <div className="bg-[#CCEEED] h-[200vh] w-screen ">
      <Navbar />
      <Text
  heading="BEGIN"
  subheading="Your Journey"
  tagline="Discover. Create. Thrive."
  description="Unleash your potential with CoTask—where AI meets adventure in productivity."
  className="lg:right-40 bottom-20"
/>


      <ParallaxScene />
      
    </div>
  );
}
