import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import StatBand from "@/components/site/StatBand";
import ProductStory from "@/components/site/ProductStory";
import ModulesGrid from "@/components/site/ModulesGrid";
import Pricing from "@/components/site/Pricing";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <StatBand />
      <ProductStory />
      <ModulesGrid />
      <Pricing />
      <Footer />
    </>
  );
}
