// ** React Imports
import React, { useState, ReactNode } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import {
  useMediaQuery,
  Autocomplete,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button
} from '@mui/material'
import { Icon } from '@iconify/react'
import Head from 'next/head'
import { Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import landingPageStyle from 'src/@core/styles/landing-page/landing-page-job'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'
import { useTranslation } from 'react-i18next'
import FooterView from 'src/views/landing-page/footerView'
import OngoingJob from './OngoingJob'
import DialogLogin from 'src/@core/components/login-modal'
import { useAuth } from 'src/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import themeConfig from 'src/configs/themeConfig'

const SeafarerJob = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()

  if (user) {
    router.replace(`/candidate/${pathname}`)
  }

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const isXs = useMediaQuery(theme.breakpoints.down('md'))
  const isMd = useMediaQuery(theme.breakpoints.down('lg'))

  const [employeeType, setEmployeeType] = useState('onship')
  const [searchJob, setSearchJob] = useState('')

  const handleEmployeeType = () => {
    if (employeeType === 'onship') {
      setEmployeeType('offship')
    } else setEmployeeType('onship')
  }

  const [openDialog, setOpenDialog] = useState(false)
  const handleLogin = () => {
    setOpenDialog(!openDialog)
  }

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - ${t('landing_findjob_title')}`}</title>
        <meta name='description' content={`${themeConfig.templateName} - ${t('landing_findjob_description')}`} />
        <meta property='og:title' content={`${themeConfig.templateName} - ${t('landing_findjob_title')}`} />
        <meta property='og:description' content={`${themeConfig.templateName} - ${t('landing_findjob_description')}`} />
        <meta property='og:image' content='images/logoprofesea.png' />
        <meta name='keywords' content={`${t('app_keyword')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
      </Head>
      <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid
          item
          container
          sx={{
            ...landingPageStyle.bannerHero,
            my: 3,
            mx: 12,
            px: { xs: 4, md: 6 },
            borderRadius: '10px',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center'
          }}
        >
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box my={6}>
              <Typography
                variant='h1'
                sx={{ pl: 4, mb: 4, fontSize: { xs: 32, md: 48 } }}
                style={{ letterSpacing: 0.8, color: 'white', fontWeight: '800' }}
              >
                {t('landing_job_title')}
              </Typography>
              <Typography
                variant='h2'
                sx={{ pl: 4, fontSize: { xs: 16, md: 20 } }}
                style={{ letterSpacing: 0.8, color: 'white' }}
              >
                {t('landing_job_subtitle')}
              </Typography>
            </Box>
          </Grid>
          {!isXs && <Grid md={6} sx={landingPageStyle.bannerAsset} />}
        </Grid>
        <Grid item container sx={{ mx: 12 }}>
          <Grid item xs={12} sx={{ padding: 4, border: 0, boxShadow: 0, backgroundColor: '#FFFFFF' }}>
            <Box
              sx={
                !isMd && !hidden
                  ? {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }
                  : isMd && !hidden
                  ? {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      overflowX: 'scroll',
                      '&::-webkit-scrollbar': { display: 'none' }
                    }
                  : {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2
                    }
              }
            >
              <Grid item container xs={12} md={4} minWidth={'350px'} spacing={2}>
                <Grid item xs={8} md={7}>
                  <TextField
                    id='searchJob'
                    label='Search Job'
                    variant='outlined'
                    fullWidth
                    onChange={e => {
                      setSearchJob(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={5}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id='city'
                    options={[]}
                    renderInput={params => <TextField {...params} label='Location' onClick={handleLogin} />}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} md={5} minWidth={'350px'} spacing={2}>
                <Grid item xs={employeeType === 'onship' ? 4 : 3}>
                  {/* <Autocomplete
                          fullWidth
                          disablePortal
                          id='combo-box-demo'
                          options={[]}
                          renderInput={params => <TextField {...params} label='Newest' />}
                        /> */}
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id='combo-box-level'
                    options={[]}
                    renderInput={params => <TextField {...params} label='Category' onClick={handleLogin} />}
                  />
                </Grid>
                {employeeType === 'onship' ? (
                  <>
                    {/* <Grid item xs={3}>
                            <Autocomplete
                              fullWidth
                              disablePortal
                              id='combo-box-level'
                              options={JobCategory}
                              getOptionLabel={(option: JobCategory) => option.name}
                              renderInput={params => <TextField {...params} label='Category' />}
                               any, newValue: JobCategory | null) => {
                                setPage(1)
                                newValue?.id ? setJC(newValue?.id) : setJC(0)
                              }}
                            />
                          </Grid> */}
                    <Grid item xs={4}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id='combo-box-level'
                        options={[]}
                        renderInput={params => <TextField {...params} label='Role Level' onClick={handleLogin} />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id='combo-box-demo'
                        options={[]}
                        renderInput={params => <TextField {...params} label='Vessel Type' onClick={handleLogin} />}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={3}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id='combo-box-level'
                        options={[]}
                        renderInput={params => <TextField {...params} label='Role Level' onClick={handleLogin} />}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id='combo-box-demo'
                        options={[]}
                        renderInput={params => <TextField {...params} label='Education' onClick={handleLogin} />}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id='combo-box-demo'
                        options={[]}
                        renderInput={params => <TextField {...params} label='Employment Type' onClick={handleLogin} />}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: { xs: '100%', md: '250px' } }}>
                <ToggleButtonGroup
                  fullWidth
                  color='primary'
                  value={employeeType}
                  exclusive
                  onChange={handleEmployeeType}
                  aria-label='Platform'
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <ToggleButton
                    disabled={employeeType === 'onship'}
                    value='onship'
                    sx={{ py: 3.5, width: '50%', fontSize: 12 }}
                  >
                    Seafarer
                  </ToggleButton>
                  <ToggleButton
                    disabled={employeeType === 'offship'}
                    value='offship'
                    sx={{ py: 3.5, width: '50%', fontSize: 12 }}
                  >
                    Professional
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Grid>
          <Grid
            container
            sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF', mt: 3, mb: 4 }}
          >
            <Box padding={5}>
              <Grid container>
                <Grid item xs={12} sx={!hidden ? { alignItems: 'stretch' } : {}}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <OngoingJob searchJob={searchJob} employeeType={employeeType} />
                    </Grid>
                    <Grid item container xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button onClick={handleLogin}>
                        <Box mr={2}>See Other Jobs</Box>
                        <Icon icon='iconamoon:arrow-down-2-duotone' fontSize={24} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      {openDialog && (
        <DialogLogin
          visible={openDialog}
          variant='candidate'
          onCloseClick={() => {
            setOpenDialog(!openDialog)
          }}
        />
      )}
      <FooterView />
    </>
  )
}

SeafarerJob.guestGuard = false
SeafarerJob.authGuard = false
SeafarerJob.getLayout = (page: ReactNode) => <LandingPageLayout>{page}</LandingPageLayout>

SeafarerJob.acl = {
  action: 'read',
  subject: 'seafarer-job-ongoing'
}
export default SeafarerJob
