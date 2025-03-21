import React, { ReactNode } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { EmployerProfileCard } from 'src/views/onboarding/ProfileCard'
import ProgressBar from 'src/views/onboarding/ProgressBar'
import CompanyCrewing from 'src/layouts/components/onboarding/CompanyCrewing'

const Onboarding = () => {
  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: '44px 32px',
          height: '100%',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <Box sx={{ width: '480px', display: 'flex', flexDirection: 'column' }}>
          <Box component='img' src='/images/logoprofesea.png' sx={{ width: '143px', height: 'auto' }} />
          <Box sx={{ mt: '32px', pb: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ProgressBar current={3} total={4} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Typography sx={{ color: '#404040', fontSize: 24, fontWeight: 700 }}>
                Apakah Anda perusahaan <i>crewing</i>? <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Typography sx={{ color: '#999', fontSize: 14, fontWeight: 400 }}>
                Pilih jenis perusahaan Anda untuk mendapatkan fitur rekrutmen dan posting pekerjaan yang sesuai dengan
                kebutuhan Anda.
              </Typography>
            </Box>
            <CompanyCrewing beforeLink='/onboarding/employer/step-two' nextLink='/onboarding/employer/step-four' />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          background: 'linear-gradient(270deg, #2561EB 0%, #968BEB 100%)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <EmployerProfileCard />
      </Grid>
    </Grid>
  )
}

Onboarding.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Onboarding.acl = {
  action: 'read',
  subject: 'on-boarding'
}
export default Onboarding
