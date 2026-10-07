import Navigation from "@/components/Navigation";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import CaseStudies from "@/components/sections/CaseStudies";
import Certifications from "@/components/sections/Certifications";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact, { Footer } from "@/components/sections/Contact";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";

/**
 * Hero → About → Skills → Work → Case studies → Certifications → Experience → Achievements → Contact
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
        <Skills />
        <Work />
        <CaseStudies />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
