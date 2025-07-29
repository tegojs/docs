import type React from 'react'
import { HomeLayout as DefaultHomeLayout } from '@rspress/theme-default'
import { BusinessSection } from './BusinessSection'

export const HomeLayout = (props: React.ComponentProps<typeof DefaultHomeLayout>) => (
  <>
    <DefaultHomeLayout {...props} />
    <BusinessSection />
  </>
)
