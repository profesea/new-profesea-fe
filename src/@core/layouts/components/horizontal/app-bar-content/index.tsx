import Link from 'next/link'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { LayoutProps } from 'src/@core/layouts/types'

interface Props {
  hidden: LayoutProps['hidden']
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
}

const LinkStyled = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: '24px'
}))

const AppBarContent = (props: Props) => {
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled href='/home'>
          <Box
            component='img'
            sx={{ width: 125 }}
            alt='Profesea for Seafarers'
            title='Profesea'
            src='/images/logoprofesea.png'
          />
        </LinkStyled>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
