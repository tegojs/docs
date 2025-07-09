import type React from "react";
import { HomeLayout as DefaultHomeLayout } from "@rspress/theme-default";

export const HomeLayout = (
  props: React.ComponentProps<typeof DefaultHomeLayout>
) => (
  <>
    <DefaultHomeLayout {...props} />
  </>
);
