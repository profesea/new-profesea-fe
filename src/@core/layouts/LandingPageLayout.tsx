import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { LandingPageLayoutProps } from './types'
import LandingPageAppBar from './components/landing-page-appbar'
import { Container } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import Spinner from '../components/spinner'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const LandingPageLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh',
  '& .content-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  },
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  }
}))

const LandingPageLayout = (props: LandingPageLayoutProps) => {
  const { children } = props
  const auth = useAuth()
  const [isNavigating, setIsNavigating] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    if (!auth.loading) {
      setTimeout(() => {
        setIsNavigating(false)
      }, 2000)
    }
  }, [auth, auth.loading])

  if (isNavigating) return <Spinner />

  return (
    <LandingPageLayoutWrapper>
      <LandingPageAppBar appBarElevation={props.appBarElevation} />
      <Container maxWidth={false} disableGutters={true}>
        <Box
          className='app-content'
          sx={{
            overflowX: 'hidden',
            position: 'relative',
            minHeight: theme => `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`,
            padding: pathname.startsWith('/profile/') || pathname.startsWith('/company/') || pathname.startsWith('/job/') ? '24px 120px' : ''
          }}
        >
          {children}
        </Box>
      </Container>
    </LandingPageLayoutWrapper>
  )
}

export default LandingPageLayout
