import Navigation from "@/components/Navigation";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Experience from "@/components/sections/Experience";
import Credentials from "@/components/sections/Credentials";
import BriefcaseDrawer from "@/components/briefcase/BriefcaseDrawer";
import Contact, { Footer } from "@/components/sections/Contact";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";

/**
 * Hero → About → Services → Case studies → Skills → Achievements → Experience → Credentials
 * → Contact. The Portfolio Briefcase opens as a drawer from the nav, hero and cases.
 * One continuous page: no loader, no curtains, no page transitions.
 */
export default function App() {
  return (
    <>
      <SmoothScroll />
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <CaseStudies />
        <Skills />
        <Achievements />
        <Experience />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <BriefcaseDrawer />
      <RevealObserver />
    </>
  );
}
