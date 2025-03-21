import { Button, Container, Grid, Typography, Card, CardContent, Box } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'
import landingPageStyle from 'src/@core/styles/landing-page/landing-page'
import { useTranslation } from 'react-i18next'
import FindJobsView from 'src/views/landing-page/findJobsView'
import DiscoverView from 'src/views/landing-page/discoverView'
import FeatureView from 'src/views/landing-page/featureView'
import LetsSailView from 'src/views/landing-page/sailOpportunityView'
import FooterView from 'src/views/landing-page/footerView'
import Head from 'next/head'
import CarouselNewsView from 'src/views/landing-page/carouselnews'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import Spinner from 'src/@core/components/spinner'

const Main = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const auth = useAuth()
  const [isNavigating, setIsNavigating] = useState(true)

  const firstLoad = async () => {
    if (auth.user) {
      await router.replace('/home')
    }
    setIsNavigating(false)
  }

  useEffect(() => {
    if (!auth.loading) {
      firstLoad()
    }
  }, [auth, router])

  if (isNavigating || auth.loading) return <Spinner />

  return (
    <>
      <Head>
        <title>{`${t('landing_hero_title')}`}</title>
        <meta name='description' content={`${t('landing_hero_subtitle')}`} />
        <meta name='keywords' content={`${t('app_keyword')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
        <meta name='og:title' content={`${t('landing_hero_title')}`} />
        <meta name='og:description' content={`${t('landing_hero_subtitle')}`} />
        <meta property='og:image' content='images/logoprofesea.png' />
      </Head>

      <Grid container sx={landingPageStyle.bannerHero}>
        <Grid item md={12} lg={8} xl={6} pt={5} mt={20} mb={10} sx={{ px: { xs: 5, md: 10 } }}>
          <Typography
            variant='h3'
            style={{ color: '#000' }}
            mt={1}
            fontWeight='800'
            sx={{ maxWidth: { xs: '80%', color: '#32487A' }, px: { xs: 2, md: 5, whiteSpace: 'null' } }}
          >
            {t('landing_hero_title')}
          </Typography>
          <Typography
            fontSize={18}
            style={{ color: '#000' }}
            fontWeight='500'
            mt={2}
            sx={{ maxWidth: { xs: '68%' }, px: { xs: 2, md: 5 } }}
          >
            {t('landing_hero_subtitle')}
          </Typography>

          <Container style={{ marginTop: 60, lineHeight: 3.5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid container justifyContent='left' sx={{ backgroundColor: 'none' }} spacing={9} mt={0} mb={10} ml={1}>
              <Card sx={{ width: 320, height: 200, backgroundColor: '#101820', mr: 5 }} elevation={10}>
                <CardContent
                  sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                  <Typography variant='h5' sx={{ mb: 2 }} color={'#FFFFFF'} fontWeight='800'>
                    {t('b_to_seafarer')}
                  </Typography>
                  <Typography maxWidth={'70%'} variant='body2' sx={{ mb: 6.5, color: '#FFFFFF' }}>
                    {t('b_to_seafarer_detail')}
                  </Typography>
                  <Box>
                    <Button
                      href='/register/seafareronship'
                      style={{ backgroundColor: '#ef6c00', color: 'white', marginRight: 10 }}
                      variant='contained'
                    >
                      {t('landing_join_now_1')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ width: 320, height: 200, backgroundColor: '#101820' }} elevation={10}>
                <CardContent
                  sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                  <Typography variant='h5' sx={{ mb: 2 }} color={'#FFFFFF'} fontWeight='800'>
                    {t('b_to_professional')}
                  </Typography>
                  <Typography maxWidth={'90%'} variant='body2' sx={{ mb: 6.5, color: '#FFFFFF' }}>
                    {t('b_to_professional_detail')}
                  </Typography>
                  <Box>
                    <Button
                      href='/register/seafareroffship'
                      style={{ backgroundColor: '#ef6c00', color: 'white', marginRight: 10 }}
                      variant='contained'
                    >
                      {t('landing_join_now_1')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Container>
        </Grid>
        <Grid
          item
          md={12}
          lg={4}
          xl={6}
          pt={5}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}
        >
          <Box sx={landingPageStyle.bannerAsset} />
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent='center'
        sx={{ backgroundColor: 'none', py: 10, display: { xs: 'flex', md: 'none' } }}
      >
        <Grid item sx={{ mb: 10, mx: 5 }}>
          <Card sx={{ width: 320, height: 200, backgroundColor: '#101820' }} elevation={5}>
            <CardContent sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant='h5' sx={{ mb: 2 }} color={'#FFFFFF'} fontWeight='800'>
                {t('b_to_seafarer')}
              </Typography>
              <Typography maxWidth={'70%'} variant='body2' sx={{ mb: 6.5, color: '#FFFFFF' }}>
                {t('b_to_seafarer_detail')}
              </Typography>
              <Button
                href='/register/seafareronship'
                style={{ backgroundColor: '#ef6c00', color: 'white', marginRight: 10 }}
                variant='contained'
              >
                {t('landing_join_now_1')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item sx={{ mx: 5 }}>
          <Card sx={{ width: 320, height: 200, backgroundColor: '#101820' }} elevation={5}>
            <CardContent sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant='h5' sx={{ mb: 2 }} color={'#FFFFFF'} fontWeight='800'>
                {t('b_to_professional')}
              </Typography>
              <Typography maxWidth={'90%'} variant='body2' sx={{ mb: 6.5, color: '#FFFFFF' }}>
                {t('b_to_professional_detail')}
              </Typography>
              <Button
                href='/register/seafareroffship'
                style={{ backgroundColor: '#ef6c00', color: 'white', marginRight: 10 }}
                variant='contained'
              >
                {t('landing_join_now_1')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* <CarouselEvent /> */}
      <FindJobsView id='findJobSection' />
      <DiscoverView />
      <FeatureView />
      <CarouselNewsView />
      <LetsSailView />
      <FooterView />
    </>
  )
}

Main.guestGuard = false
Main.authGuard = false
Main.getLayout = (page: ReactNode) => <LandingPageLayout>{page}</LandingPageLayout>

export default Main
