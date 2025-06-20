import { Grid, Box, useMediaQuery, TextField, InputAdornment, Autocomplete } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FooterView from 'src/views/landing-page/footerView'
import Head from 'next/head'
import themeConfig from 'src/configs/themeConfig'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'
import SeafarerOngoingTraining from '../OngoingTraining'
import HeroBannerTraining from 'src/views/training/HeroBannerTraining'
import TrainingPartnerSection from 'src/views/training/TrainingPartnerSection'
import { Icon } from '@iconify/react'
import { HttpClient } from 'src/services'
import { useRouter } from 'next/router'

const Main = () => {
  const router = useRouter()
  const trainername = router.query.trainername
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // state

  const [searchTraining, setSearchTraining] = useState<string>('')
  const [trainingCenter, setTrainingCenter] = useState<any>(null)
  const [category, setCategory] = useState<any>(null)
  const [optionsTrainingCenter, setOptionsTrainingCenter] = useState<any[]>([])
  const [optionsCategory, setOptionsCategory] = useState<any[]>([])

  const firstLoad = async () => {
    // fetch trainer
    HttpClient.get('/public/data/trainer?take=100&page=1&isSelect').then(response => {
      console.log(response)
      setOptionsTrainingCenter(response.data.training)
    })

    // fetch category
    HttpClient.get('/public/data/training-category?take=100&page=1').then(response => {
      setOptionsCategory(response?.data?.trainingCategories?.data)
    })
  }

  useEffect(() => {
    firstLoad()
  }, [])

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - ${t('landing_training_title')}`}</title>
        <meta name='description' content={`${themeConfig.templateName} - ${t('landing_training_description')}`} />
        <meta name='keywords' content={`Sertifikasi pelaut, training pelaut`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
        <meta name='og:title' content={`${themeConfig.templateName} - ${t('landing_training_title')}`} />
        <meta name='og:description' content={`${themeConfig.templateName} - ${t('landing_training_description')}`} />
        <meta property='og:image' content='images/logoprofesea.png' />
      </Head>
      <HeroBannerTraining />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
          // background: 'red',
          px: isMobile ? '24px' : '120px',
          mt: '24px',
          mb: '24px'
        }}
      >
         <h1 style={{ display:'none'}}> Sertifikasi Pelaut </h1>
         <h2 style={{ display:'none'}}> Sertifikasi Pelaut dan Profesional </h2>
        <TrainingPartnerSection />
        {trainername == 'all' && (
          <>
            <Grid
              container
              spacing={2}
              sx={{
                padding: '16px 24px',
                borderRadius: '12px',
                background: '#FFF',
                boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.08);'
              }}
            >
              <Grid item xs={12} lg={8} sx={{ paddingTop: '0px' }}>
                <TextField
                  id='search-training'
                  variant='outlined'
                  placeholder='Search training'
                  fullWidth
                  size='small'
                  value={searchTraining}
                  onChange={e => {
                    setSearchTraining(e.target.value)
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon={'iconamoon:search-thin'} fontSize={16} style={{ marginRight: '10px' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, paddingTop: '0px' }}
              >
                <Autocomplete
                  fullWidth
                  disablePortal
                  id='training-center'
                  options={optionsTrainingCenter}
                  getOptionLabel={(option: any) => option.name}
                  renderInput={params => <TextField {...params} label='Training Center' size='small' />}
                  value={trainingCenter}
                  onChange={(_, value) => {
                    setTrainingCenter(value)
                  }}
                />
                <Autocomplete
                  fullWidth
                  disablePortal
                  id='cateogory'
                  options={optionsCategory}
                  getOptionLabel={(option: any) => option.category}
                  renderInput={params => <TextField {...params} label='Category' size='small' />}
                  value={category}
                  onChange={(_, value) => {
                    setCategory(value)
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}

        <SeafarerOngoingTraining searchTraining={searchTraining} trainingCenter={trainingCenter} category={category} />
      </Box>
      <FooterView />
    </>
  )
}

Main.guestGuard = false
Main.authGuard = false
Main.getLayout = (page: ReactNode) => <LandingPageLayout>{page}</LandingPageLayout>

export default Main
