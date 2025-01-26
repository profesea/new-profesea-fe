import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import { useSettings } from 'src/@core/hooks/useSettings'
import { Box, Button, CircularProgress, Container, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import UserDropdown from '../shared-components/UserDropdown'
import LanguageDropdown from '../shared-components/LanguageDropdown'
import { useRouter } from 'next/router'
import NavItemType from 'src/contract/types/navItemType'
import IconifyIcon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import Navigation from '../vertical/landing-navigation'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

const LandingPageAppBar = (props: { appBarElevation?: number }) => {
  const { user, loading } = useAuth()
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const { locale } = useRouter()
  const { skin } = settings
  const router = useRouter()
  const { t } = useTranslation()
  const [navItems, setNavItems] = useState<NavItemType[]>([])

  const [homeNavItems, setHomeNavItems] = useState<{ title: string; path: string }[]>([])
  const { navigationSize, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize
  const [navVisible, setNavVisible] = useState<boolean>(false)
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  useEffect(() => {
    if (user) {
      setNavItems([
        { title: 'Dashboard', variant: 'contained', onClick: '/home' },
        {
          title: 'Logout',
          variant: 'contained',
          onClick: '/login',
          sx: { backgroundColor: '#ffa000', ':hover': { backgroundColor: '#ef6c00' } }
        }
      ])
    }
  }, [user])

  useEffect(() => {
    const baseAddress1 = '/find-job'
    const baseAddress2 = '/#discoverSectionLink'
    // const baseAddress3 = '/faqs'
    const baseAddress4 = '/employer'
    const baseAddress5 = '/trainings'
    const baseAddress6 = '/news'

    setNavItems([
      { title: t('button_1'), variant: 'outlined', onClick: '/login', sx: { textTransform: 'capitalize' } },
      {
        title: t('button_4'),
        variant: 'contained',
        onClick: '/register',
        sx: { backgroundColor: '#32497A', textTransform: 'capitalize' }
      }
    ])

    setHomeNavItems([
      { title: t('landing_menu_1'), path: baseAddress1 },
      { title: t('landing_menu_4'), path: baseAddress4 },
      { title: t('landing_menu_5'), path: baseAddress5 },
      { title: t('landing_menu_6'), path: baseAddress6 },
      { title: t('landing_menu_2'), path: baseAddress2 }
      // { title: t('landing_menu_3'), path: baseAddress3 }
    ])
  }, [t])

  const buildAppbarActions = () => {
    return (
      <>
        {!user ? (
          navItems.map(item => (
            <Link href={item.onClick} key={item.title} locale={locale}>
              <Button size='small' type='button' variant={item.variant} sx={{ ...item.sx, mr: 2, ml: 2 }}>
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
      </>
    )
  }

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
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Link href='/'>
                <Box
                  component='img'
                  sx={{ width: 125, marginLeft: 5 }}
                  alt='The Profesea logo'
                  title='Profesea'
                  src='/images/logosamudera.png'
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
                  textTransform: 'capitalize',
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
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content',
                borderRadius: 1,
                bgcolor: 'background.paper',
                color: 'text.secondary',
                textTransform: 'capitalize',
                '& svg': { m: 1.5 },
                '& hr': { mx: 0.5 }
              }}
            >
              <LanguageDropdown settings={settings} saveSettings={saveSettings} />
              {loading ? <CircularProgress /> : buildAppbarActions()}
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
                    alt='The Profesea logo'
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

export default LandingPageAppBar
