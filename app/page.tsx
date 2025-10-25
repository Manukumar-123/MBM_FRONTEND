import Creator from "./components/Home/Creator";
import ExclusiveContent from "./components/Home/ExclusiveContent";
import Hero from "./components/Home/Hero";
import ScrollAnimation from "./components/Home/mobile";
import Diffrent from "./components/Home/Diffrent";
import Testimonial from "./components/Home/Testimonial";
import FlipC from "./components/Home/FlipCard";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="text-center text-white md:h-screen h-[80vh] bg-black">
        <Hero />
      </div>
      <ScrollAnimation />
      <Creator />
      <ExclusiveContent />
      <FlipC />
      <Diffrent />
      <Testimonial />
    </>
  );
};

export default HomePage;
