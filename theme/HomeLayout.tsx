import type React from "react";
import { HomeLayout as DefaultHomeLayout } from "@rspress/theme-default";
import { BusinessSection } from "./BusinessSection";
import { FeaturesSection } from "./FeaturesSection";
import { TechHighlights } from "./TechHighlights";
import { CoreFeature } from "./CoreFeature";
import { UseCase } from "./UseCase";
import { TechArchitecture } from "./TechArchitecture";
import { HomePageFooter } from "./HomePageFooter";
import { Introduction } from "./Introduction";

export const HomeLayout = (
  props: React.ComponentProps<typeof DefaultHomeLayout>
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
)
