import { ElementType, Fragment } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'
import themeConfig from 'src/configs/themeConfig'
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useRouter } from 'next/router'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<
  ListItemProps & { component?: ElementType; href: string; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: 'auto',
  paddingTop: theme.spacing(2.25),
  color: theme.palette.text.primary,
  paddingBottom: theme.spacing(2.25),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&.active, &.active:hover': {
    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08)
  },
  '&.active .MuiTypography-root, &.active .MuiListItemIcon-root': {
    color: theme.palette.primary.main
  },
  '&:focus-visible': {
    outline: 0,
    backgroundColor: theme.palette.action.focus
  }
}))

const HorizontalNavLink = (props: Props) => {
  const { item, settings, hasParent } = props
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const router = useRouter()

  const isActive = router.pathname === item?.path

  const icon = item.icon ? item.icon : navSubItemIcon
  const Wrapper = !hasParent ? List : Fragment

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 } } : {})}>
        <ListItem
          className={isActive ? 'active' : ''}
          component={Link}
          disabled={item.disabled}
          {...(item.disabled && { tabIndex: -1 })}
          // className={clsx({ active: isNavLinkActive() })}
          target={item.openInNewTab ? '_blank' : undefined}
          href={item.path === undefined ? '/' : `${item.path}`}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sx={{
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            ...(!hasParent
              ? {
                  // borderRadius: '8px',
                  '&.active, &.active:hover': {
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid rgba(50, 73, 122, 1)',
                    '&:focus-visible': { backgroundColor: 'primary.dark' },
                    '& .MuiTypography-root, & .MuiListItemIcon-root': {
                      color: 'primary.main'
                    }
                  }
                }
              : {
                  '&.active, &.active:hover': {
                    '&:focus-visible': {
                      backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.24)
                    }
                  }
                })
          }}
        >
          <Box
            sx={{
              gap: 2,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' })
              }}
            >
              <ListItemIcon sx={{ mr: hasParent ? 3 : 2.5, color: 'text.primary', display: 'none' }}>
                <UserIcon icon={icon} fontSize={icon === navSubItemIcon ? '0.5rem' : '1.5rem'} />
              </ListItemIcon>
              <Typography {...(menuTextTruncate && { noWrap: true })}>
                <Translations text={item.title} />
              </Typography>
            </Box>
            {item.badgeContent ? (
              <Chip
                size='small'
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{ '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
              />
            ) : null}
          </Box>
        </ListItem>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
