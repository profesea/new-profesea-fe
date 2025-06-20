import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import { useSettings } from 'src/@core/hooks/useSettings'
import { Box, Button, Container, Divider, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NavItemType from 'src/contract/types/navItemType'
import IconifyIcon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import { useAuth } from 'src/hooks/useAuth'
import Navigation from '../components/vertical/landing-navigation'
import LanguageDropdown from '../components/shared-components/LanguageDropdown'
import UserDropdown from '../components/shared-components/UserDropdown'
import { useTranslation } from 'react-i18next'

const OuterPageAppbar = (props: { appBarElevation?: number }) => {
  const { user } = useAuth()
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const { locale } = useRouter()
  const { skin } = settings
  const router = useRouter()
  const { t } = useTranslation()
  const [navItems, setNavItems] = useState<NavItemType[]>([
    { title: t('button_1'), variant: 'contained', onClick: '/login' },
    {
      title: t('button_4'),
      variant: 'contained',
      onClick: '/register',
      sx: { backgroundColor: '#ffa000', ':hover': { backgroundColor: '#ef6c00' } }
    }
  ])

  const homeNavItems = [
    { title: t('landing_menu_1'), path: '/find-job' },
    { title: t('landing_menu_2'), path: '/#discoverSectionLink' },
    { title: t('landing_menu_3'), path: '/faqs' },
    { title: t('landing_menu_4'), path: '/employer' },
    { title: t('landing_menu_5'), path: '/trainings' },
    { title: t('landing_menu_6'), path: '/news' }
  ]

  const { navigationSize, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize
  const [navVisible, setNavVisible] = useState<boolean>(false)
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  useEffect(() => {
    if (user) {
      setNavItems([
        { title: t('button_1'), variant: 'contained', onClick: '/home' },
        {
          title: t('button_4'),
          variant: 'contained',
          onClick: '/login',
          sx: { backgroundColor: '#ffa000', ':hover': { backgroundColor: '#ef6c00' } }
        }
      ])
    }
  }, [user])

  return (
    <>
      <Navigation
        navWidth={navWidth}
        navVisible={navVisible}
        setNavVisible={setNavVisible}
        collapsedNavWidth={collapsedNavWidth}
        toggleNavVisibility={toggleNavVisibility}
        navigationBorderWidth={navigationBorderWidth}
        hidden={true}
        settings={settings}
        saveSettings={() => {
          return
        }}
        navMenuBranding={undefined}
        menuLockedIcon={undefined}
        homeNavItems={homeNavItems}
        navItems={navItems}
        navMenuProps={undefined}
        menuUnlockedIcon={undefined}
        afterNavMenuContent={undefined}
        beforeNavMenuContent={undefined}
        user={user}
      />

      <AppBar
        color='default'
        position='sticky'
        elevation={props.appBarElevation ?? 0}
        sx={{
          display: {
            md: 'flex',
            xs: 'none'
          },
          backgroundColor: 'background.paper',
          ...(skin === 'bordered' && { borderBottom: `1px solid ${theme.palette.divider}` })
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              p: theme => `${theme.spacing(0, 6)} !important`,
              minHeight: `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`
            }}
          >
            <Link href='/'>
              <Box
                component='img'
                sx={{ width: 125 }}
                alt='Profesea for Professionals'
                title='Profesea'
                src='/images/logoprofesea.png'
              />
            </Link>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content',
                borderRadius: 1,
                bgcolor: 'background.paper',
                color: 'text.secondary',
                '& svg': { m: 1.5 },
                '& hr': { mx: 0.5 }
              }}
            >
              {homeNavItems.map(el => (
                <Link
                  key={el.path}
                  href={el.path}
                  onClick={() => {
                    if (el.path == '/#discoverSectionLink') {
                      const element = document.getElementById('discoverSection')
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }

                      return false
                    }
                  }}
                >
                  <Button
                    sx={{ fontWeight: router.asPath == el.path ? 'bold' : undefined, textTransform: 'capitalize' }}
                    variant='text'
                    color='secondary'
                  >
                    {el.title}
                  </Button>
                </Link>
              ))}

              <Divider orientation='vertical' variant='middle' flexItem color='#ddd' />

              {!user ? (
                navItems.map(item => (
                  <Link href={item.onClick} key={item.title} locale={locale}>
                    <Button
                      onClick={() => {}}
                      size='small'
                      type='button'
                      variant={item.variant}
                      sx={{ ...item.sx, mr: 2, ml: 2 }}
                    >
                      {item.title}
                    </Button>
                  </Link>
                ))
              ) : (
                <>
                  <Link href='/home' locale={locale}>
                    <Button size='small' type='button' variant='outlined' sx={{ mr: 2, ml: 2 }}>
                      Dashboard
                    </Button>
                  </Link>
                  <UserDropdown settings={settings} />
                </>
              )}

              <Divider orientation='vertical' variant='middle' flexItem color='#ddd' />
              <LanguageDropdown settings={settings} saveSettings={saveSettings} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <AppBar
        color='default'
        position='sticky'
        elevation={3}
        sx={{
          display: {
            xs: 'flex',
            md: 'none'
          },
          backgroundColor: 'background.paper',
          ...(skin === 'bordered' && { borderBottom: `1px solid ${theme.palette.divider}` })
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            sx={{
              flexDirection: 'row',
              p: theme => `${theme.spacing(0, 6)} !important`,
              minHeight: `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`
            }}
          >
            <Box display={{ xs: 'flex', md: 'none' }}>
              <IconButton onClick={toggleNavVisibility}>
                <IconifyIcon icon='mdi:menu' fontSize={32} />
              </IconButton>
            </Box>

            {!navVisible && (
              <Box sx={{ alignContent: 'center', alignSelf: 'center', textAlign: 'center', flexGrow: 1 }}>
                <Link href='/'>
                  <Box
                    component='img'
                    sx={{ width: 125 }}
                    alt='Profesea for Professionals'
                    title='Profesea'
                    src='/images/logoprofesea.png'
                  />
                </Link>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default OuterPageAppbar
