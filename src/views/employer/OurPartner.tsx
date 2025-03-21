import { Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const logos = [
  { img: '/images/logos/samudera-black.png' },
  { img: '/images/logos/sachi-black.png' },
  { img: '/images/logos/optic-marine-black.png' },
  { img: '/images/logos/mostrans-black.png' },
  { img: '/images/logos/jasindo-black.png' },
  { img: '/images/logos/hugos-black.png' },
  { img: '/images/logos/catur-dana-bali-black.png' },
  { img: '/images/logos/aweidhia-black.png' }
]

const PartnerLogo = ({ img }: { img: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#F0F0F0',
        padding: '16px 40px',
        borderRadius: '8px',
        flexShrink: 0
      }}
    >
      <Box
        component='img'
        src={img}
        sx={{
          height: '54px',
          width: 'auto',
          maxWidth: '226px',
          opacity: '55%'
        }}
      />
    </Box>
  )
}

const OurPartner = () => {
  const { t } = useTranslation()

  return (
    <Grid
      container
      sx={{
        borderRadius: '20px',
        padding: { xs: '0px 24px', md: '48px 115px' },
        backgroundColor: { xs: null, md: '#FAFAFA' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}
    >
      <Typography sx={{ fontSize: { xs: 16 }, fontWeight: 700, color:'#32497A', lineHeight: '38px', textAlign: 'center' }}>
        {t('employer_page.our_partner')}
      </Typography>
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          WebkitMask: 'linear-gradient(90deg, #0000, white 20% 80%, #0000)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '24px',
            animation: 'scroll 35s linear infinite',
            whiteSpace: 'nowrap',
            '@keyframes scroll': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(0)' }
            }
          }}
        >
          {logos.concat(logos).map((logo, i) => (
            <PartnerLogo key={i} img={logo.img} />
          ))}
        </Box>
      </Box>
    </Grid>
  )
}

export default OurPartner
