import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { LayoutProps } from 'src/@core/layouts/types'
import Icon from 'src/@core/components/icon'
import { IUser } from 'src/contract/models/user'

interface Props {
  navHover: boolean
  collapsedNavWidth: number
  hidden: LayoutProps['hidden']
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding']
  menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon']
  menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon']
  user: IUser | null
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(4),
  justifyContent: 'space-between',
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  const {
    hidden,
    navHover,
    settings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    navMenuBranding: userNavMenuBranding
  } = props
  const { navCollapsed } = settings
  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8
      }
    } else {
      return 5.5
    }
  }

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {/* {!user ? <RegularNavHeader hidden={hidden} toggleNavVisibility={toggleNavVisibility} /> : <SessionedNvHeader user={props.user!} />} */}
      <RegularNavHeader hidden={hidden} toggleNavVisibility={toggleNavVisibility} />
    </MenuHeaderWrapper>
  )
}

const RegularNavHeader = (props: { hidden: boolean; toggleNavVisibility: () => void }) => {
  const { hidden, toggleNavVisibility } = props

  return (
    <>
      <LinkStyled href='/home'>
        <Box
          component='img'
          sx={{ width: 125 }}
          alt='Profesea for Seafarers'
          title='Profesea'
          src='/images/logoprofesea.png'
        />
      </LinkStyled>

      {hidden && (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      )}
    </>
  )
}

// const SessionedNvHeader = (props: { user: IUser }) => {
//     const userPhoto = (props.user?.photo) ? props.user.photo : "/images/avatars/default-user.png";

//     return <Box display={'flex'} flexDirection={'column'} mt={6} alignItems={'start'}>
//         <Box display='flex' justifyContent='center' alignItems='center' mb={3}>
//             <Avatar src={userPhoto} alt='profile-picture' sx={{ width: 50, height: 50 }} />
//         </Box>
//         <Box display='flex' justifyContent='center' alignItems='center'>
//             <Typography variant='body1' sx={{ color: 'text.primary', textTransform: 'uppercase' }}>
//                 {props.user?.name}
//             </Typography>
//         </Box>
//         <Box display='flex' justifyContent='center' alignItems='center'>
//             <Typography sx={{ color: 'text.secondary' }}> {props.user?.industry?.name}</Typography>
//         </Box>
//     </Box>;
// }

export default VerticalNavHeader
