import { Icon } from '@iconify/react'
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'

const OurFeatureView = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isHidden = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        flexWrap: 'nowrap',
        gap: { xs: '24px', md: '32px' }
      }}
    >
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '34px' }}>
        {isHidden && (
          <Typography sx={{ color: '#303030', fontSize: 48, fontWeight: 700 }}>
            {t('landing_page.our_feature.title')}
          </Typography>
        )}
        <Grid
          container
          sx={{
            flexGrow: 1,
            p: { xs: '0px 24px', md: '20px' },
            backgroundColor: { xs: null, md: '#CBE2F9' },
            borderRadius: '20px',
            display: 'flex',
            gap: '32px'
          }}
        >
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <Box sx={{ flexShrink: 0, height: '24px' }}>
              <Icon icon='ph:chats-circle' color='#525252' fontSize={28} />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Typography
                sx={{
                  color: '#525252',
                  fontSize: { xs: '20px', md: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', md: '20px' }
                }}
              >
                {t('landing_page.our_feature.feature_title_1')}
              </Typography>
              <Typography
                sx={{
                  color: '#525252',
                  fontSize: { xs: '20px', md: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '27px', md: '21px' }
                }}
              >
                {t('landing_page.our_feature.feature_1')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <Box sx={{ flexShrink: 0, height: '24px' }}>
              <Icon icon='ph:users-three' color='#525252' fontSize={28} />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Typography
                sx={{
                  color: '#525252',
                  fontSize: { xs: '20px', md: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', md: '20px' }
                }}
              >
                {t('landing_page.our_feature.feature_title_2')}
              </Typography>
              <Typography
                sx={{
                  color: '#525252',
                  fontSize: { xs: '20px', md: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '27px', md: '21px' }
                }}
                dangerouslySetInnerHTML={{ __html: t('landing_page.our_feature.feature_2') }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <Box sx={{ flexShrink: 0, height: '24px' }}>
              <Icon icon='ph:student' color='#525252' fontSize={28} />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Typography
                sx={{
                  color: '#525252',
                  fontSize: { xs: '20px', md: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', md: '20px' }
                }}
              >
                {t('landing_page.our_feature.feature_title_3')}
              </Typography>
              <Typography
                sx={{
                  color: '#525252',
                  fontSize: { xs: '20px', md: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '27px', md: '21px' }
                }}
              >
                {t('landing_page.our_feature.feature_3')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          mx: { xs: '24px', md: 0 },
          p: '48px 12px',
          backgroundColor: '#9DC7F2',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          component='img'
          src='/images/profesea-feature.gif'
          alt='Profesea as Training Platform'
          sx={{
            width: { xs: '400px', md: '100%' },
            height: 'auto',
            maxHeight: { xs: '273px', md: '500px' },
            objectFit: 'cover'
          }}
        />
      </Grid>
    </Grid>
  )
}

export default OurFeatureView
