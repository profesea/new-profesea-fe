import React, { ReactNode } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import SeafarerProfileCard from 'src/views/onboarding/ProfileCard'
import ProgressBar from 'src/views/onboarding/ProgressBar'
import VesselPreference from 'src/layouts/components/onboarding/VesselPreference'

const Onboarding = () => {
  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          py: '44px',
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
          <Box component={Link} href='/'>
            <Box component='img' src='/images/logosamudera.png' sx={{ width: '143px', height: 'auto' }} />
          </Box>
          <Box sx={{ my: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ProgressBar current={4} total={6} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Typography sx={{ color: '#404040', fontSize: 24, fontWeight: 700 }}>Select Your Vessel Type</Typography>
              <Typography sx={{ color: '#999', fontSize: 14, fontWeight: 400 }}>
                Choose your vessel type to receive customized job recommendations based on your experience.
              </Typography>
            </Box>
            <VesselPreference beforeLink='/onboarding/seafarer/step-three' nextLink='/onboarding/seafarer/step-five' />
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
        <SeafarerProfileCard />
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