import Box from '@mui/material/Box'
import { Button, Grid, IconButton, Typography, useMediaQuery } from '@mui/material'
import Profile, { activities } from 'src/layouts/components/Profile'
import { useAuth } from 'src/hooks/useAuth'
import Postfeed from 'src/views/social-feed/Postfeed'
import ListFeedView from 'src/views/social-feed/ListFeedView'
import { SocialFeedProvider } from 'src/context/SocialFeedContext'
import SideAd from 'src/views/banner-ad/sidead'
import FriendSuggestionCard from 'src/layouts/components/FriendSuggestionCard'
// import ProfileViewerCard from 'src/layouts/components/ProfileViewerCard'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import { HttpClient } from 'src/services'
import { useRouter } from 'next/navigation'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const LinkStyled = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
}))

const SocialFeed = () => {
  return (
    <SocialFeedProvider>
      <SocialFeedApp />
    </SocialFeedProvider>
  )
}

const SocialFeedApp = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))
  const { user } = useAuth()
  const [show, setShow] = useState(true)
  // const [documents, setDocuments] = useState<any[]>([])
  const [activities, getActivities] = useState<activities>()

  const handleRouterPushUploadDocument = () => {
    router.push(`company/?tab=document`)
  }

  const handleRouterPushCreateJob = () => {
    router.push(`company/job-management/`)
  }

  const renderAlertDocumentsForCompany = (activitiesUser: activities | undefined) => {
    if (user?.verified_at && activitiesUser && +activitiesUser?.total_post_job == 0) {
      return (
        <Box
          sx={{
            width: '100%',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            border: '1px solid #4CAF50',
            borderRadius: '8px',
            background: '#F4FEF2',
            marginBottom: '16px'
          }}
        >
          <h1 style={{ display: 'none' }}> Platform Kerja Untuk Pelaut </h1>
          <h2 style={{ display: 'none' }}> Platform rekrutmen perusahaan</h2>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <Box>
              <Icon icon='simple-line-icons:check' color='rgba(76, 175, 80, 1)' fontSize={32} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#303030' }}>
                Your documents have been verified! Post your first job!
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#303030', textAlign: 'justify' }}>
                Start posting jobs to find the best candidates!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', width: isMobile ? '100%' : 'fit-content' }}>
            <Button
              variant='contained'
              sx={{ textTransform: 'capitalize', width: '100%' }}
              onClick={handleRouterPushCreateJob}
            >
              Create Job
            </Button>
            {!isMobile && (
              <Box onClick={() => setShow(false)}>
                <Icon icon='radix-icons:cross-2' />
              </Box>
            )}
          </Box>
        </Box>
      )
    }

    if (user?.verified_at == null && user?.documents && user?.documents.length > 0) {
      return (
        <Box
          sx={{
            width: '100%',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            border: '1px solid #32497A',
            borderRadius: '8px',
            background: '#F2F8FE',
            marginBottom: '16px'
          }}
        >
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <Box>
              <Icon icon='mdi:clock-outline' color='rgba(50, 73, 122, 1)' fontSize={32} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#303030' }}>
                Almost There! We’re Reviewing Your Documents
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#303030', textAlign: 'justify' }}>
                We're carefully going through your submission to ensure everything is accurate and complete. Hang tight,
                and we'll update you as soon as possible!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', width: isMobile ? '100%' : 'fit-content' }}>
            {!isMobile && (
              <Box onClick={() => setShow(false)}>
                <Icon icon='radix-icons:cross-2' />
              </Box>
            )}
          </Box>
        </Box>
      )
    }

    if (user?.verified_at == null && user?.documents && user?.documents.length == 0) {
      return (
        <Box
          sx={{
            width: '100%',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            border: '1px solid #F22',
            borderRadius: '8px',
            background: '#FEF2F2',
            marginBottom: '16px'
          }}
        >
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <Box>
              <Icon icon='si:warning-line' color='red' fontSize={32} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#303030' }}>
                Upload Your Documents to Start Posting Jobs!
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#303030', textAlign: 'justify' }}>
                To ensure a safe and trustworthy platform, we need to verify your documents before you can post jobs.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', width: isMobile ? '100%' : 'fit-content' }}>
            <Button
              variant='contained'
              sx={{ textTransform: 'capitalize', width: '100%' }}
              onClick={handleRouterPushUploadDocument}
            >
              Upload Document
            </Button>
            {!isMobile && (
              <Box onClick={() => setShow(false)}>
                <Icon icon='radix-icons:cross-2' />
              </Box>
            )}
          </Box>
        </Box>
      )
    }

    return null
  }

  useEffect(() => {
    // HttpClient.get(AppConfig.baseUrl + '/user/candidate-document').then(response => {
    //   const documents = response.data.documents
    //   setDocuments(documents)
    // })

    HttpClient.get('/user/statistics?user_id=' + user?.id).then(response => {
      const code = response.data
      getActivities(code)
    })
  }, [user])

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12}>
        {user?.role === 'Company' && show && renderAlertDocumentsForCompany(activities)}
        <Grid container spacing={6}>
          <Grid item xs={12} md={5} lg={3}>
            <Box sx={{ position: 'sticky', top: '70px' }}>
              <Profile datauser={user} activities={activities} />
            </Box>
          </Grid>
          <Grid item xs={12} md={7} lg={6}>
            <Postfeed />
            <ListFeedView />
          </Grid>
          <Grid item xs={12} lg={3}>
            <FriendSuggestionCard location='home' />
            <Box my={4} sx={{ position: 'sticky', top: '70px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SideAd adslocation='home-page' />
              <Box
                sx={{
                  my: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <LinkStyled href={'/news'}>
                    <Typography sx={{ color: '#525252', fontSize: 14, fontWeight: 400 }}>
                      {t('landing_footer_menu_10')}
                    </Typography>
                  </LinkStyled>
                  <LinkStyled href={'/term'}>
                    <Typography sx={{ color: '#525252', fontSize: 14, fontWeight: 400 }}>
                      {t('landing_footer_menu_3')}
                    </Typography>
                  </LinkStyled>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <LinkStyled href={'/privacy'}>
                    <Typography sx={{ color: '#525252', fontSize: 14, fontWeight: 400 }}>
                      {t('landing_footer_menu_4')}
                    </Typography>
                  </LinkStyled>
                  <LinkStyled href={'/faqs'}>
                    <Typography sx={{ color: '#525252', fontSize: 14, fontWeight: 400 }}>
                      {t('landing_footer_menu_5')}
                    </Typography>
                  </LinkStyled>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px', justifyContent: 'center' }}>
                  <IconButton href='https://www.facebook.com/profesea.id' target='_blank'>
                    <Icon icon='ph:facebook-logo' color='#303030' />
                  </IconButton>
                  <IconButton href='https://www.instagram.com/profesea_id' target='_blank'>
                    <Icon icon='ph:instagram-logo' color='#303030' />
                  </IconButton>
                  <IconButton href='https://www.linkedin.com/company/profesea-indonesia/' target='_blank'>
                    <Icon icon='ph:linkedin-logo' color='#303030' />
                  </IconButton>
                  <IconButton href='https://www.tiktok.com/@profesea_id' target='_blank'>
                    <Icon icon='ph:tiktok-logo' color='#303030' />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'center' }}>
                  <Box
                    component='img'
                    sx={{ width: 85 }}
                    alt='Profesea for Seafarers'
                    title='Profesea'
                    src='/images/logoprofesea.png'
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                    <Icon icon='ph:copyright' fontSize={14} />
                    <Typography sx={{ color: '#525252', fontSize: '12px', fontWeight: 400 }}>2024 Profesea.</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

SocialFeed.acl = {
  action: 'read',
  subject: 'home'
}

export default SocialFeed
