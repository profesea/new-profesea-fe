import { Box, Divider, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { Icon } from '@iconify/react'
import Link from 'next/link'

const LinkStyled = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
}))

const FooterView = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isHidden = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Grid
      item
      container
      sx={{
        p: { xs: '24px', md: '40px 120px 25px' },
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: '24px', md: '40px' },
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
          gap: { xs: '24px', md: '101px' }
        }}
      >
        <Box sx={{ width: '308px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Box
            component='img'
            sx={{ width: 145 }}
            alt='Profesea for Professionals'
            title='Profesea'
            src='/images/logoprofesea.png'
          />
          <Typography sx={{ color: '#1F1F1F', fontSize: '14px', fontWeight: 400 }}>
            {t('landing_footer_title')}
          </Typography>
        </Box>
        {!isHidden && <Divider sx={{ border: '1px solid #DBDBDB' }} />}
        <Box>
          <Typography sx={{ mb: '12px', color: 'primary.main', fontSize: { xs: 18, md: 16 }, fontWeight: 700 }}>
            {t('landing_footer_menu_1')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '8px' }}>
            <LinkStyled href={'/news'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_10')}
              </Typography>
            </LinkStyled>
            <LinkStyled href={'/term'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_3')}
              </Typography>
            </LinkStyled>
            <LinkStyled href={'/privacy'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_4')}
              </Typography>
            </LinkStyled>
            <LinkStyled href={'/faqs'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_5')}
              </Typography>
            </LinkStyled>
          </Box>
        </Box>
        {!isHidden && <Divider sx={{ border: '1px solid #DBDBDB' }} />}
        <Box>
          <Typography sx={{ mb: '12px', color: 'primary.main', fontSize: { xs: 18, md: 16 }, fontWeight: 700 }}>
            {t('landing_footer_menu_2')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '8px' }}>
            <LinkStyled href={'/find-job'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_6')}
              </Typography>
            </LinkStyled>
            <LinkStyled href={'/employer'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_7')}
              </Typography>
            </LinkStyled>
            <LinkStyled href={'/trainings'}>
              <Typography sx={{ color: '#1F1F1F', fontSize: { xs: 16, md: 12 }, fontWeight: 400 }}>
                {t('landing_footer_menu_8')}
              </Typography>
            </LinkStyled>
          </Box>
        </Box>
        {!isHidden && <Divider sx={{ border: '1px solid #DBDBDB' }} />}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ color: 'primary.main', fontSize: { xs: 18, md: 16 }, fontWeight: 700 }}>
            {t('landing_footer_menu_9')}
          </Typography>
          <Box sx={{ ml: '-8px', display: 'flex', gap: '12px' }}>
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
        </Box>
        {!isHidden && <Divider sx={{ border: '1px solid #DBDBDB' }} />}
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '4px' }}>
        <Icon icon='ph:copyright' style={{ marginTop: '2px' }} />
        <Typography sx={{ color: '#1F1F1F', fontSize: '12px', fontWeight: 400 }}>
          2024 Profesea. All Rights Reserved Owned by PT Selancar Logistik Indonesia.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default FooterView
