import { useMediaQuery, useTheme } from '@mui/material'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'
import themeConfig from 'src/configs/themeConfig'
import BenefitSection from 'src/views/employer/BenefitSection'
import FaqSection from 'src/views/employer/FaqSection'
import FindSection from 'src/views/employer/FindSection'
import FooterBanner from 'src/views/employer/FooterBanner'

//component
import JoinSection from 'src/views/employer/JoinSection'
import OurPartner from 'src/views/employer/OurPartner'
import TestimonySection from 'src/views/employer/TestimonySection'
import FooterView from 'src/views/landing-page/footerView'

// dynamic import
const HeroSection = dynamic(() => import('src/views/employer/HeroSection'), {
  ssr: false
})

const Main = () => {
  const { t } = useTranslation()
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - ${t('landing_employer_title')}`}</title>
        <meta name='description' content={`${themeConfig.templateName} - ${t('landing_employer_description')}`} />
        <meta name='keywords' content={`${t('landing_employer_keywords')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
        <meta name='og:title' content={`${themeConfig.templateName} - ${t('landing_employer_title')}`} />
        <meta name='og:description' content={`${themeConfig.templateName} - ${t('landing_employer_description')}`} />
        <meta property='og:image' content='images/logoprofesea.png' />
      </Head>
      <h1 style={{ display: 'none' }}> Rekrut Talenta Maritim Terbaik </h1>
      <h2 style={{ display: 'none' }}> Satu Platform, Solusi untuk Industri Maritim.</h2>
      <HeroSection />
      <OurPartner />
      <BenefitSection isMobile={isMobile} />
      <JoinSection isMobile={isMobile} />
      <FindSection isMobile={isMobile} />
      <TestimonySection isMobile={isMobile} />
      <FaqSection isMobile={isMobile} />
      <FooterBanner isMobile={isMobile} />
      <FooterView />
    </>
  )
}

Main.guestGuard = false
Main.authGuard = false
Main.getLayout = (page: ReactNode) => <LandingPageLayout>{page}</LandingPageLayout>

export default Main
