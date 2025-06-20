// ** React Imports
import React, { useCallback, useEffect, useState } from 'react'

// ** MUI Components
import {
  useMediaQuery,
  Typography,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Button,
  CircularProgressProps,
  CircularProgress,
  Box,
  Popper
} from '@mui/material'
import { Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTheme } from '@mui/material/styles'
import { IUser } from 'src/contract/models/user'
import localStorageKeys from 'src/configs/localstorage_keys'
import secureLocalStorage from 'react-secure-storage'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
// import CandidateProfile from 'src/layouts/components/CandidateProfile'
import { Icon } from '@iconify/react'
// import DialogProfilePicture from './DialogProfilePicture'
import AccordionTabGeneral from './accordion-tab-general/AccordionTabGeneral'
import EducationTab from './education-tab/EducationTab'
import TravelDocumentTab from './travel-document-tab/TravelDocumentTab'
import SeaExperienceTab from './sea-experience-tab/SeaExperienceTab'
import CertificateTab from './certificate-tab/CertificateTab'
import { IDetailPercentage } from 'src/contract/models/user_profile_percentage'
import DialogEditBanner from './DialogEditBanner'
import DialogEditProfile from './DialogEditProfile'
import WorkExperienceTab from './work-experience-tab/WorkExperienceTab'
import ProfileCompletionContext, { ProfileCompletionProvider } from 'src/context/ProfileCompletionContext'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import DialogResumeBuilder from './DialogResumeBuilder'
import { useAuth } from 'src/hooks/useAuth'
// import ModalUnlockPlusCandidate from 'src/@core/components/subscription/ModalUnlockPlusCandidate'
import BoostCandidateAlert from 'src/views/candidate/BoostCandidateAlert'
import dynamic from 'next/dynamic'

const ModalUnlockPlusCandidate = dynamic(() => import('src/@core/components/subscription/ModalUnlockPlusCandidate'), {
  ssr: false
})

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

const getCpText = (percentage: number) => {
  return percentage === 100 ? (
    <>
      Your profile looks great! You can add <br /> more details to increase visibility.
    </>
  ) : (
    <>
      {' '}
      Complete your profile to unlock more <br /> opportunities and highlight your skills.
    </>
  )
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

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  const getColor = (value: number) => {
    if (value <= 30) return 'red'
    if (value <= 70) return '#FF9800'

    return 'green'
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* CircularProgress Background */}
      <CircularProgress
        thickness={3}
        size={60}
        variant='determinate'
        value={100} // Full circle for background
        sx={{ color: '#e0e0e0', position: 'absolute' }} // Abu-abu
      />
      {/* CircularProgress Utama */}
      <CircularProgress
        thickness={3}
        size={60}
        variant='determinate'
        {...props} // Nilai progress utama
        sx={{
          color: getColor(props.value) // Warna progress utama (bisa disesuaikan)
        }}
      />
      {/* Label di tengah */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant='caption' component='div' sx={{ color: getColor(props.value) }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}

const Candidate = () => {
  const { abilities } = useAuth()
  console.log(abilities)
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser
  const userPlan = false
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const {} = useForm<FormData>({
    mode: 'onBlur'
  })
  const [profilePic, setProfilePic] = useState<any>(null)
  const [openUpateProfilePic, setOpenUpdateProfilePic] = useState(false)

  const [openEditModalBanner, setOpenEditModalBanner] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [defaultValue, setDefaultValue] = useState(0)
  const open = Boolean(anchorEl)

  //dialog state
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const tabs = Number(params.get('tabs'))
  const [tabsValue, setTabsValue] = useState<number>(tabs || 0)

  //query for resume builder
  const isUploadResume = params.get('resume')

  const [isSubs, setIsSubs] = useState<boolean>(false)

  function handleCloseDialog() {
    setIsOpen(false)
  }

  function Firstload() {
    HttpClient.get(AppConfig.baseUrl + '/user/' + user.id).then(response => {
      const resUser = response.data.user as IUser
      setSelectedUser(resUser)
      setProfilePic(resUser?.photo ? resUser?.photo : null)
    })
  }

  const handleDefaultBanner = () => {
    if (selectedUser?.banner != '') {
      return (
        <Box
          component='div'
          sx={{
            width: '100%',
            height: isMobile ? '81px' : '191px',
            backgroundImage: `url(${selectedUser?.banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
    router.push(`${pathname}?${createQueryString('tabs', newValue.toString())}`)
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const searchParams = new URLSearchParams(params.toString())
      searchParams.set(name, value)

      return searchParams.toString()
    },
    [params]
  )

  const handleDownloadResume = () => {
    HttpClient.get(`/user/${selectedUser?.id}/profile/resume`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }

      window.open(`${response.data?.path}`, '_blank', 'noreferrer')
    })
  }

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const renderPopper = (userDetailPercentage: IDetailPercentage | null) => {
    // for pelaut
    if (selectedUser?.team_id == 2 && selectedUser?.employee_type == 'onship') {
      return (
        <Popper id='popper-profile-completion' open={open} anchorEl={anchorEl}>
          <Box
            sx={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '12px',
              background: '#FFF',
              borderRadius: '6px'
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#404040'
                }}
              >
                Enhance Profile
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userDetailPercentage?.total_photo_percentage == 0 && (
                <Box
                  component={'div'}
                  onClick={() => setOpenUpdateProfilePic(true)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>
                    Add profile picture
                  </Typography>
                  <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
                </Box>
              )}

              {userDetailPercentage?.total_seafarer_education_percentage == 0 && (
                <Box
                  component={'div'}
                  onClick={() => setTabsValue(1)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>Add education</Typography>
                  <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
                </Box>
              )}
            </Box>
            {userDetailPercentage?.travel_document_percentage == 0 && (
              <Box
                component={'div'}
                onClick={() => setTabsValue(2)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>
                  Add travel document
                </Typography>
                <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
              </Box>
            )}
            {userDetailPercentage?.experience_percentage == 0 && (
              <Box
                component={'div'}
                onClick={() => {
                  setTabsValue(3)
                  setDefaultValue(0)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>Add sea experience</Typography>
                <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
              </Box>
            )}
            {userDetailPercentage?.recommendation_percentage == 0 && (
              <Box
                component={'div'}
                onClick={() => {
                  setTabsValue(3)
                  setDefaultValue(1)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>Add reference</Typography>
                <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
              </Box>
            )}
            {userDetailPercentage?.competency_percentage == 0 && (
              <Box
                component={'div'}
                onClick={() => {
                  setTabsValue(4)
                  setDefaultValue(0)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>
                  Add certification of competency
                </Typography>
                <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
              </Box>
            )}
            {userDetailPercentage?.proficiency_percentage == 0 && (
              <Box
                component={'div'}
                onClick={() => {
                  setTabsValue(4)
                  setDefaultValue(1)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>
                  Add certification of proficiency
                </Typography>
                <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
              </Box>
            )}
          </Box>
        </Popper>
      )
    }

    // for non-pelaut (profesionals)
    if (selectedUser?.team_id == 2 && selectedUser?.employee_type == 'offship') {
      return (
        <Popper id='popper-profile-completion' open={open} anchorEl={anchorEl}>
          <Box
            sx={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '12px',
              background: '#FFF',
              borderRadius: '6px'
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#404040'
                }}
              >
                Enhance Profile
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userDetailPercentage?.total_photo_percentage == 0 && (
                <Box
                  component={'div'}
                  onClick={() => setOpenUpdateProfilePic(true)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>
                    Add profile picture
                  </Typography>
                  <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
                </Box>
              )}
              {userDetailPercentage?.total_professional_education_percentage == 0 && (
                <Box
                  component={'div'}
                  onClick={() => setTabsValue(1)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>Add education</Typography>
                  <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
                </Box>
              )}
              {userDetailPercentage?.total_experience_percentage == 0 && (
                <Box
                  component={'div'}
                  onClick={() => setTabsValue(2)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>
                    Add work experience
                  </Typography>
                  <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
                </Box>
              )}
              {userDetailPercentage?.total_certificate_percentage == 0 && (
                <Box
                  component={'div'}
                  onClick={() => setTabsValue(3)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#2662EC' }}>Add certificate</Typography>
                  <Icon icon={'formkit:arrowright'} fontSize={'12px'} color='rgba(38, 98, 236, 1)' />
                </Box>
              )}
            </Box>
          </Box>
        </Popper>
      )
    }

    return null
  }

  //check subs
  useEffect(() => {
    if (abilities?.plan_type !== 'BSC-ALL') setIsSubs(true)
  }, [abilities])

  useEffect(() => {
    if (tabs) {
      setTabsValue(tabs)
    }
  }, [tabs])

  useEffect(() => {
    // setOpenPreview(false)
    Firstload()

    if (isUploadResume) {
      setIsOpen(true)
    }
    //create tabs query string if there is none
    if (tabs === null || tabs === 0) {
      router.push(`${pathname}?${createQueryString('tabs', '0')}`)
    }
  }, [])

  return (
    <>
      <ProfileCompletionProvider>
      <h1 style={{ display:'none'}}> Platform Kerja Untuk Pelaut </h1>
      <h2 style={{ display:'none'}}> Platform rekrutmen perusahaan</h2>
        <DialogEditBanner
          visible={openEditModalBanner}
          onCloseClick={() => setOpenEditModalBanner(!openEditModalBanner)}
          previewBanner={selectedUser?.banner}
        />

        <DialogEditProfile
          visible={openUpateProfilePic}
          onCloseClick={() => setOpenUpdateProfilePic(!openUpateProfilePic)}
          previewProfile={profilePic}
        />
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
                  alignItems: 'center',
                  gap: '12px'
                }
          }
        >
          <Grid item xs={12}>
            <BoostCandidateAlert isSubs={isSubs} user={user} />
          </Grid>
          <ProfileCompletionContext.Consumer>
            {({ percentage, detail_percentage }) => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: 3,
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden'
                  }}
                >
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
                          bottom: isMobile ? '120px' : '125px'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            display: 'inline-block',
                            ...(percentage === 100
                              ? { mb: { xs: 10, sm: 15, md: 0 } }
                              : { mb: { xs: 15, sm: 20, md: 0 } })
                          }}
                        >
                          <Avatar
                            src={profilePic ? profilePic : '/images/default-user-new.png'}
                            sx={{ width: isMobile ? 64 : 160, height: isMobile ? 64 : 160 }}
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

                        {/* todo next sprint */}
                        <Box
                          sx={{
                            display: 'flex',
                            gap: isMobile ? '9px' : '12px',
                            flexDirection: isMobile ? 'column' : 'row',
                            mt: { xs: 5, sm: 0, md: 28 },
                            ml: { xs: '6px !important', sm: 0, md: 0 }
                          }}
                        >
                          {isSubs ? (
                            <Button
                              aria-label='upload'
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                width: isMobile ? '100%' : 'fit-content',
                                flexDirection: 'row',
                                gap: isMobile ? '8px' : '12px',
                                padding: isMobile ? '6px 8px !important' : '8px 12px !important',
                                alignItems: 'center',
                                fontFamily: 'Figtree',
                                fontSize: isMobile ? '12px' : '14px',
                                fontWeight: 400,
                                whiteSpace: 'nowrap',
                                color: userPlan ? '#FFFFFF' : '#404040',
                                backgroundImage: userPlan ? 'linear-gradient(to left,#2561EB, #968BEB)' : '',
                                textTransform: 'capitalize',
                                alignSelf: 'flex-end',
                                border: isMobile ? '0.387px solid #F0F0F0' : '1px solid #F0F0F0'
                              }}
                              onClick={() => setIsOpen(true)}
                            >
                              <Icon
                                color={userPlan ? '#FFFFFF' : '#404040'}
                                icon={userPlan ? 'ph:crown-simple-fill' : 'material-symbols-light:upload-sharp'}
                                fontSize={isMobile ? '14px' : '20px'}
                              />
                              {userPlan
                                ? isMobile
                                  ? 'Unlock Upload Resume'
                                  : 'Unlock Pro to Upload Resume'
                                : 'Upload Resume'}
                            </Button>
                          ) : (
                            <ModalUnlockPlusCandidate
                              text={isMobile ? 'Unlock Upload Resume' : 'Unlock Plus to Upload Resume'}
                            />
                          )}
                          <Button
                            aria-label='download'
                            sx={{
                              width: isMobile ? '100%' : 'fit-content',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              gap: isMobile ? '8px' : '12px',
                              padding: isMobile ? '6px 8px !important' : '8px 12px !important',
                              alignItems: 'center',
                              fontFamily: 'Figtree',
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: 400,
                              whiteSpace: 'nowrap',
                              color: '#404040',
                              textTransform: 'capitalize',
                              alignSelf: 'flex-end',
                              border: isMobile ? '0.387px solid #F0F0F0' : '1px solid #F0F0F0'
                            }}
                            onClick={handleDownloadResume}
                          >
                            <Icon icon='material-symbols-light:download-sharp' fontSize={isMobile ? '14px' : '20px'} />
                            Download Resume
                          </Button>
                        </Box>
                      </Box>
                      <DialogResumeBuilder
                        isSubs={!userPlan}
                        isMobile={isMobile}
                        isOpen={isOpen}
                        handleClose={handleCloseDialog}
                      />
                      <Box
                        sx={{
                          marginTop: '40px',
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
                            {selectedUser?.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: isMobile ? '14px' : '18px',
                              fontWeight: 400,
                              fontFamily: 'Figtree',
                              color: '#404040'
                            }}
                          >
                            {selectedUser?.employee_type == 'onship'
                              ? selectedUser?.field_preference?.job_category?.name
                              : selectedUser?.field_preference?.job_category?.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: isMobile ? '100%' : null
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              background: percentage === 100 ? '#F4FEF2' : '#F8F8F7',
                              borderRadius: '6px',
                              border: percentage === 100 ? '1px solid #4CAF50' : '',
                              padding: isMobile ? '12px' : '16px 24px',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '20px'
                            }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Typography
                                  sx={{ fontSize: { xs: '12px', sm: '16px' }, fontWeight: 700, color: '#404040' }}
                                >
                                  Profile Completion
                                </Typography>
                                {percentage !== 100 && (
                                  <IconButton onClick={handleClickPopper}>
                                    <Icon icon='quill:info' fontSize={isMobile ? '20px' : '16px'} color='orange' />
                                  </IconButton>
                                )}
                                {renderPopper(detail_percentage)}
                              </Box>

                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: { xs: '12px', sm: '14px' },
                                    fontWeight: 400,
                                    color: '#404040',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {getCpText(percentage)}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <CircularProgressWithLabel value={percentage} />
                            </Box>
                          </Box>
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

                        {selectedUser?.employee_type == 'onship' ? (
                          <Tab
                            sx={{
                              textTransform: 'capitalize'
                            }}
                            icon={
                              detail_percentage?.total_seafarer_education_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Education'
                            {...a11yProps(1)}
                          />
                        ) : (
                          <Tab
                            sx={{
                              textTransform: 'capitalize'
                            }}
                            icon={
                              detail_percentage?.total_professional_education_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Education'
                            {...a11yProps(1)}
                          />
                        )}
                        {selectedUser?.employee_type == 'onship' ? (
                          <Tab
                            sx={{ textTransform: 'capitalize' }}
                            icon={
                              detail_percentage?.travel_document_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Travel Document'
                            {...a11yProps(2)}
                          />
                        ) : (
                          <Tab
                            sx={{ textTransform: 'capitalize' }}
                            icon={
                              detail_percentage?.total_experience_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Work Experience'
                            {...a11yProps(2)}
                          />
                        )}
                        {selectedUser?.employee_type == 'onship' && (
                          <Tab
                            sx={{ textTransform: 'capitalize' }}
                            icon={
                              detail_percentage?.experience_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Sea Experience'
                            {...a11yProps(3)}
                          />
                        )}

                        {selectedUser?.employee_type == 'onship' ? (
                          <Tab
                            sx={{ textTransform: 'capitalize' }}
                            icon={
                              detail_percentage?.competency_percentage == 0 ||
                              detail_percentage?.proficiency_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Certificate'
                            {...a11yProps(4)}
                          />
                        ) : (
                          <Tab
                            sx={{ textTransform: 'capitalize' }}
                            icon={
                              detail_percentage?.total_certificate_percentage == 0 ? (
                                <Icon icon='mdi:dot' width={'25px'} height={'25px'} color='red' />
                              ) : undefined
                            }
                            iconPosition='end'
                            label='Certificate'
                            {...a11yProps(4)}
                          />
                        )}
                      </Tabs>
                      <TabPanel value={tabsValue} index={0}>
                        <AccordionTabGeneral />
                      </TabPanel>
                      <TabPanel value={tabsValue} index={1}>
                        <EducationTab />
                      </TabPanel>
                      <TabPanel value={tabsValue} index={2}>
                        {selectedUser?.employee_type == 'onship' ? (
                          <TravelDocumentTab />
                        ) : (
                          <WorkExperienceTab dataUser={selectedUser as unknown as IUser} />
                        )}
                      </TabPanel>
                      {selectedUser?.employee_type == 'onship' && (
                        <TabPanel value={tabsValue} index={3}>
                          <SeaExperienceTab defaultValue={defaultValue} />
                        </TabPanel>
                      )}
                      <TabPanel value={tabsValue} index={selectedUser?.employee_type == 'onship' ? 4 : 3}>
                        {/* {selectedUser?.employee_type == 'onship' ? <CertificateTab defaultValue={defaultValue} /> : <>test 1</>} */}
                        <CertificateTab defaultValue={defaultValue} />
                      </TabPanel>
                    </Grid>
                  </Grid>
                </Box>
              )
            }}
          </ProfileCompletionContext.Consumer>
        </Grid>
      </ProfileCompletionProvider>
    </>
  )
}

Candidate.acl = {
  action: 'read',
  subject: 'home'
}
export default Candidate
