import CTA from "@/components/Landing/CTA";
import FAQ from "@/components/Landing/FAQ";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import TargetAudience from "@/components/Landing/TargetAudience";
import Value from "@/components/Landing/Value";

const Landing = () => {
  return (
    <div>
      <Hero />
      <Value />
      <TargetAudience />
      <HowItWorks />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Landing;
