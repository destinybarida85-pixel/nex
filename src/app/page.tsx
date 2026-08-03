import Hero3D from "@/components/site/Hero3D";
import MarqueeSection from "@/components/site/MarqueeSection";
import AboutSection from "@/components/site/AboutSection";
import ModulesSection from "@/components/site/ModulesSection";
import ShowcaseSection from "@/components/site/ShowcaseSection";
import Pricing from "@/components/site/Pricing";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <main style={{ overflowX: "clip", background: "#0C0C0C" }}>
      <Hero3D />
      <MarqueeSection />
      <AboutSection />
      <ModulesSection />
      <ShowcaseSection />
      <div id="pricing">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
