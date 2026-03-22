import { Hero } from "../components/Hero";
import { ListingsPreview } from "../components/ListingsPreview";
import { FinalCTA } from "../components/FinalCTA";
import { SubletSection } from "../components/SubletSection";

export function Home() {
  return (
    <>
      <Hero />
      <ListingsPreview />
      <FinalCTA />
      <SubletSection />
    </>
  );
}
