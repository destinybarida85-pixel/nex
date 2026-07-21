import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Overview3D from "@/components/site/Overview3D";
import StatBand from "@/components/site/StatBand";
import FeatureRows from "@/components/site/FeatureRows";
import ModulesGrid from "@/components/site/ModulesGrid";
import Pricing from "@/components/site/Pricing";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Overview3D />
      <StatBand />
      <FeatureRows />
      <ModulesGrid />
      <Pricing />
      <Footer />
    </>
  );
}
