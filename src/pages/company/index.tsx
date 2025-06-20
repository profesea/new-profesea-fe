// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import { useMediaQuery, Typography, Avatar, IconButton, Tabs, Tab } from '@mui/material'
import { Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
// import CompanyProfile from 'src/layouts/components/CompanyProfile'
import { useTheme } from '@mui/material/styles'
import { IUser } from 'src/contract/models/user'
import localStorageKeys from 'src/configs/localstorage_keys'
import secureLocalStorage from 'react-secure-storage'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { Icon } from '@iconify/react'
import DialogEditBanner from './DialogEditBanner'
import DialogEditProfile from './DialogEditProfile'
import AccordionTabGeneral from '../candidate/accordion-tab-general/AccordionTabGeneral'
import DocumentUploadCompany from './document-upload-company/DocumentUploadCompany'

import { useSearchParams } from 'next/navigation'

type FormData = {
  companyName: string
  industryType: string
  country: string
  district: string
  city: string
  postalCode: string
  email: string
  code: string
  website: string
  phone: string
  address: string
  about: string
}

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: '24px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const Company = () => {
  const params = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  // const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser
  const [tabsValue, setTabsValue] = useState(params.get('tab') ? 1 : 0)
  const [selectedItem, setSelectedItem] = useState<IUser | null>(null)
  const [openEditModalBanner, setOpenEditModalBanner] = useState(false)

  const [profilePic, setProfilePic] = useState<any>(null)
  const [openUpateProfilePic, setOpenUpdateProfilePic] = useState(false)

  const {} = useForm<FormData>({
    mode: 'onBlur'
  })

  function firstload() {
    HttpClient.get(AppConfig.baseUrl + '/user/' + user.id).then(response => {
      const user = response.data.user as IUser
      setSelectedItem(user)
      setProfilePic(user?.photo ? user?.photo : null)
    })
  }

  const handleDefaultBanner = () => {
    if (selectedItem?.banner != '') {
      return (
        <Box
          component='div'
          sx={{
            width: '100%',
            height: isMobile ? '81px' : '191px',
            backgroundImage: `url(${selectedItem?.banner})`, // Replace `yourImageSrc` with the actual image source
            backgroundSize: 'cover', // Ensure the image covers the entire box
            backgroundPosition: 'center', // Center the image
            borderRadius: '0 !important',
            display: 'flex',
            justifyContent: 'end'
          }}
        >
          <Box
            sx={{
              margin: isMobile ? '20px' : '32px',
              padding: '8px 12px',
              display: 'flex',
              gap: '12px',
              borderRadius: '6px',
              border: '1px solid #F0F0F0',
              background: '#FFF',
              height: 'fit-content',
              cursor: 'pointer'
            }}
            onClick={() => setOpenEditModalBanner(!openEditModalBanner)}
          >
            <Box>
              <Icon icon='iconoir:camera' fontSize={isMobile ? '16px' : '24px'} color='#404040' />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: isMobile ? '12px' : '16px',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  color: '#404040'
                }}
              >
                Change Cover
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }

    return (
      <Box
        component='div'
        sx={{
          width: '100%',
          objectFit: 'cover',
          height: isMobile ? '81px' : '191px',
          background: 'linear-gradient(270deg, #2561EB 0%, #968BEB 100%)',
          borderRadius: '0 !important',
          display: 'flex',
          justifyContent: 'end'
        }}
      >
        <Box
          sx={{
            margin: isMobile ? '20px' : '32px',
            padding: '8px 12px',
            display: 'flex',
            gap: '12px',
            borderRadius: '6px',
            border: '1px solid #FFF',
            background: 'rgba(255, 255, 255, 0.20)',
            height: 'fit-content',
            cursor: 'pointer'
          }}
          onClick={() => setOpenEditModalBanner(!openEditModalBanner)}
        >
          <Box>
            <Icon icon='iconoir:camera' fontSize={isMobile ? '16px' : '24px'} color='#FFF' />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: isMobile ? '12px' : '16px',
                fontWeight: 700,
                color: '#FFF',
                backgroundColor: 'transparent'
              }}
            >
              Change Cover
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue)
  }

  useEffect(() => {
    // setOpenPreview(false)
    firstload()
  }, [])

  return (
    <>
      <DialogEditBanner
        visible={openEditModalBanner}
        onCloseClick={() => setOpenEditModalBanner(!openEditModalBanner)}
        previewBanner={selectedItem?.banner}
      />
      <DialogEditProfile
        visible={openUpateProfilePic}
        onCloseClick={() => setOpenUpdateProfilePic(!openUpateProfilePic)}
        previewProfile={profilePic}
      />
      <h1 style={{ display: 'none' }}> Rekrut Talenta Maritim Terbaik </h1>
      <h2 style={{ display: 'none' }}> Satu Platform, Solusi untuk Industri Maritim.</h2>
      <Grid
        container
        sx={
          isMobile
            ? {
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }
            : {
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }
        }
      >
        <Box sx={{ marginBottom: '20px' }}>
          <Typography color={'#32497A'} fontWeight='700' fontSize={32}>
            Company Builder
          </Typography>
        </Box>
        <Box sx={{ width: '100%', borderRadius: '12px', boxShadow: 3, backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          {handleDefaultBanner()}
          <Grid container sx={{ p: isMobile ? '16px' : '32px', display: 'flex', gap: '12px' }}>
            <Grid
              item
              xs={12}
              md={true}
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: isMobile ? '90px' : undefined,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'absolute',
                  padding: '4px',
                  bottom: isMobile ? '85px' : '90px'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    backgroundColor: '#FAFAFA',
                    padding: '20px',
                    borderRadius: '50%'
                  }}
                >
                  <Avatar
                    src={profilePic ? profilePic : '/images/default-user-new.png'}
                    sx={{ width: isMobile ? 64 : 126, height: isMobile ? 64 : 126 }}
                  />
                  <IconButton
                    aria-label='upload picture'
                    component='label'
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'white'
                    }}
                    onClick={() => setOpenUpdateProfilePic(true)}
                  >
                    <Icon icon='iconoir:camera' fontSize={isMobile ? '8px' : '22px'} />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: '70px',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: '16px'
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '14px' : '24px',
                      fontWeight: 700,
                      fontFamily: 'Figtree',
                      color: '#404040',
                      textTransform: 'capitalize'
                    }}
                  >
                    {selectedItem?.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '14px' : '18px',
                      fontWeight: 400,
                      fontFamily: 'Figtree',
                      color: '#404040'
                    }}
                  >
                    {selectedItem?.industry ? selectedItem?.industry?.name : '-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Tabs
                value={tabsValue}
                onChange={handleChangeTabs}
                indicatorColor='primary'
                textColor='inherit'
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons={isMobile ? true : false}
                allowScrollButtonsMobile={isMobile ? true : false}
                aria-label='full width tabs example'
                sx={{ borderBottom: '1.5px solid #DADADA' }}
              >
                <Tab sx={{ textTransform: 'capitalize' }} label='General' {...a11yProps(0)} />
                <Tab sx={{ textTransform: 'capitalize' }} label='Document' {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={tabsValue} index={0}>
                <AccordionTabGeneral />
              </TabPanel>
              <TabPanel value={tabsValue} index={1}>
                <DocumentUploadCompany />
              </TabPanel>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  )
}

// Company.getLayout = (page: ReactNode) => <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>

// Company.guestGuard = true

Company.acl = {
  action: 'read',
  subject: 'company'
}
export default Company
