import Footer from "@/components/Footer";
import CTA from "@/components/Landing/CTA";
import FAQ from "@/components/Landing/FAQ";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import TargetAudience from "@/components/Landing/TargetAudience";
import Value from "@/components/Landing/Value";
import Navbar from "@/components/Navbar";

const Landing = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Value />
      <TargetAudience />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
