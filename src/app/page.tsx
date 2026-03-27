import { AboutLayout } from "@/components/about/AboutLayout/AboutLayout";
import { aboutPageContent } from "@/components/about/data/aboutContent";

export default function Home() {
  return <AboutLayout {...aboutPageContent} />;
}
