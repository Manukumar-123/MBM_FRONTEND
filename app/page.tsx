import Creator from "./components/Home/Creator";
import Hero from "./components/Home/Hero";
import ScrollAnimation from "./components/Home/mobile";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="text-center text-white min-h-screen bg-black">
        <Hero />
      </div>
      <ScrollAnimation />
      <Creator />
    </>
  );
};

export default HomePage;
