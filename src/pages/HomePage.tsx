import BrandManifesto from '../components/sections/BrandManifesto';
import BrandsSection from '../components/sections/BrandsSection';
import FromSeedToCup from '../components/sections/FromSeedToCup';
import HubsSection from '../components/sections/HubsSection';
import MotionStorySection from '../components/sections/MotionStorySection';
import OriginStory from '../components/sections/OriginStory';
import QualitySustainability from '../components/sections/QualitySustainability';
import TalentBand from '../components/sections/TalentBand';
import Hero from '../components/Hero';

export default function HomePage() {
  return (
    <div className="home-page" data-page="home">
      <Hero />
      <BrandManifesto />
      <HubsSection />
      <OriginStory />
      <FromSeedToCup />
      <BrandsSection />
      <MotionStorySection />
      <QualitySustainability />
      <TalentBand />
    </div>
  );
}
