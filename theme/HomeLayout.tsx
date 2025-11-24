import type { HomeLayout as DefaultHomeLayout } from '@rspress/theme-default';
import type React from 'react';
import { BusinessSection } from './BusinessSection';
import { CoreFeature } from './CoreFeature';
import { FeaturesSection } from './FeaturesSection';
import { HomePageFooter } from './HomePageFooter';
import { Introduction } from './Introduction';
import { TechArchitecture } from './TechArchitecture';
import { TechHighlights } from './TechHighlights';
import { UseCase } from './UseCase';

export const HomeLayout = (
  props: React.ComponentProps<typeof DefaultHomeLayout>,
) => (
  <>
    <Introduction />
    <FeaturesSection />
    <TechHighlights />
    <TechArchitecture />
    <CoreFeature />
    <UseCase />
    <BusinessSection />
    <HomePageFooter />
  </>
);
