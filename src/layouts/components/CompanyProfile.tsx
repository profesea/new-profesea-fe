// ** React Imports
import React, { ReactNode, useEffect, useRef, useState } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Menu, MenuItem } from '@mui/material'

import { Button, TextField, FormControl, Autocomplete, Divider, Card, InputAdornment, Alert } from '@mui/material'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks

// ** Demo Imports
// import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { Grid } from '@mui/material'

import { useForm } from 'react-hook-form'

// import { yupResolver } from '@hookform/resolvers/yup'
import ImageSlider from './ImageSlider'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { IUser } from 'src/contract/models/user'
import { toast } from 'react-hot-toast'
import Countries from 'src/contract/models/country'
import Industry from 'src/contract/models/industry'
import City from 'src/contract/models/city'
import Address from 'src/contract/models/address'
import { Icon } from '@iconify/react'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { refreshsession, removeFirstZeroChar } from 'src/utils/helpers'
import ButtonUploadPhotoGallery from './ButtonUploadPhotoGallery'
import DialogAddDocument from 'src/pages/company/DialogAddDocument'
import DialogEditBanner from 'src/pages/company/DialogEditBanner'
import DialogEditProfile from 'src/pages/company/DialogEditProfile'
import DialogBannerDeleteConfirmation from 'src/pages/company/DialogBannerDeleteConfirmation'
import DialogProfileDeleteConfirmation from 'src/pages/company/DialogProfileDeleteConfirmation'
import { v4 } from 'uuid'

type FormData = {
  companyName: string
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
  usernamesosmed: string
  facebook: string
  instagram: string
  linkedin: string
}

type compProps = {
  visible: boolean
  datauser: IUser
  address: Address
}
let statusfb: any = ''
let statusig: any = ''
let statuslinkedin: any = ''
const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))
const BoxWrapper = styled(Box)<BoxProps>(() => ({
  position: 'relative'
}))

const CompanyProfile = (props: compProps) => {
  const inputRef = useRef<any>('')

  const [combocountry, getComboCountry] = useState<any>([])
  const [comboindustry, getComboIndustry] = useState<any>([])
  const [combocity, getComboCity] = useState<any[]>([])
  const [combocode, getCombocode] = useState<any[]>([])
  const [idcombocode, setCombocode] = useState<any>(props.datauser.country_id)
  const [idcity, setCombocity] = useState<any>(props.datauser.address?.city_id)
  const [idindustry, setIndustry] = useState<any>(props.datauser.industry_id)
  const [idcountry, setCountry] = useState<any>(props.datauser.country_id)
  const [facebook, setFacebook] = useState<any>('')
  const [instagram, setInstagram] = useState<any>('')
  const [linkedin, setLinkedin] = useState<any>('')
  const [openProfileMenu, setOpenProfileMenu] = React.useState<null | HTMLElement>(null)
  const [openBannerMenu, setOpenBannerMenu] = React.useState<null | HTMLElement>(null)
  const [openEditModalBanner, setOpenEditModalBanner] = useState(false)
  const [openEditModalProfile, setOpenEditModalProfile] = useState(false)
  const [openBannerDeleteConfirm, setOpenBannerDeleteConfirm] = React.useState(false)
  const [openProfileDeleteConfirm, setOpenProfileDeleteConfirm] = React.useState(false)
  const [, setSelectedFile] = React.useState()

  // const [verified, setVerified] = useState<any>('')
  const [reason, setReason] = useState<any>('')

  // const [disabledFacebook, setDisabledFacebook] = useState<boolean>(true)
  // const [disabledInstagram, setDisabledInstagram] = useState<boolean>(true)
  // const [disabledLinkedn, setDisabledLinkedin] = useState<boolean>(true)
  const [itemData, getItemdata] = useState<any[]>([])
  // const [arrayHead, getArrayHead] = useState<any[]>([])
  const [openAddModalDoc, setOpenAddModalDoc] = useState(false)
  const [hookSignature, setHookSignature] = useState(v4())
  const [slides, setSlides] = useState<any>([])
  const [phoneNum, setPhoneNum] = useState(props.datauser?.phone)
  const onChangePhoneNum = (input: string) => {
    setPhoneNum(removeFirstZeroChar(input))
  }

  const deletework = async (id: any) => {
    const resp = await HttpClient.del(`/user/document/` + id)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    combobox()
    toast.success(`  deleted successfully!`)
  }
  const combobox = () => {
    HttpClient.get(AppConfig.baseUrl + '/public/data/country?search=').then(response => {
      const code = response.data.countries
      getComboCountry(code)
    })
    HttpClient.get(AppConfig.baseUrl + '/public/data/industry?search=').then(response => {
      const code = response.data.industries
      getComboIndustry(code)
    })
    HttpClient.get(AppConfig.baseUrl + '/public/data/country?search=').then(response => {
      const code = response.data.countries
      for (let x = 0; x < code.length; x++) {
        const element = code[x]
        element.label = element.name + '(' + element.phonecode + ')'
      }
      getCombocode(code)
    })
    HttpClient.get(AppConfig.baseUrl + '/user/sosmed?page=1&take=100').then(response => {
      const code = response.data.sosmeds.data
      for (let x = 0; x < code.length; x++) {
        const element = code[x]
        if (element.sosmed_type == 'Facebook') {
          setFacebook(element.username)
          statusfb = element.id
        }
        if (element.sosmed_type == 'Instagram') {
          setInstagram(element.username)
          statusig = element.id
        }
        if (element.sosmed_type == 'LinkedIn') {
          setLinkedin(element.username)
          statuslinkedin = element.id
        }
      }
    })
    HttpClient.get(AppConfig.baseUrl + '/user/' + props.datauser.id).then(response => {
      const code = response.data.user
      let reason = ''
      if (code.reason != null) reason = code.reason
      setReason(reason)
      setPreview(code.photo)
      setPreviewBanner(code.banner)
    })

    HttpClient.get(AppConfig.baseUrl + '/public/data/country?search=').then(response => {
      const code = response.data.countries
      for (let x = 0; x < code.length; x++) {
        const element = code[x]
        element.label = element.name + '(' + element.phonecode + ')'
      }
      getCombocode(code)
    })
    HttpClient.get(AppConfig.baseUrl + '/user/document').then(response => {
      const itemData = response.data.documents

      const arr = []

      for (let x = 0; x < itemData.length; x++) {
        const element = itemData[x]
        if (element.childs.length > 0) {
          arr.push({ id: element.id, name: element.document_type })
        }
      }
      getItemdata(itemData)
    })
  }
  const searchcity = async (q: any) => {
    setCountry(q)
    const resp = await HttpClient.get('/public/data/city?search=&country_id=' + q)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    const code = resp.data.cities
    getComboCity(code)
  }

  useEffect(() => {
    combobox()
    if (props.datauser.address != undefined) {
      searchcity(props.datauser.country_id)
    }
    getimage()
  }, [hookSignature])
  const { register, handleSubmit } = useForm<FormData>({
    mode: 'onBlur'
  })
  const onSubmit = (data: FormData) => {
    const { companyName, website, address, about } = data
    const json = {
      country_id: idcountry,
      industry_id: idindustry,
      name: companyName,
      phone: phoneNum,
      website: website,
      about: about,
      address_country_id: idcombocode,
      address_city_id: idcity,
      address_address: address,
      date_of_birth: null
    }
    HttpClient.patch(AppConfig.baseUrl + '/user/update-profile', json).then(
      ({ data }) => {
        console.log('here 1', data)
        toast.success(' Successfully submited!')
        refreshsession()
        window.location.replace('/home')
      },
      error => {
        console.log('here 1', error)
        toast.error('Save Profile failed: Please fill in the required data')
      }
    )
  }

  const addbuttonfacebook = () => {
    let user = ''

    if (facebook.length < 20) {
      user = 'https://facebook.com/' + facebook
    } else {
      user = facebook
    }

    const json = {
      sosmed_type: 'Facebook',
      sosmed_address: user
    }
    if (statusfb == '') {
      HttpClient.post(AppConfig.baseUrl + '/user/sosmed', json).then(
        ({ data }) => {
          // toast.success(' Successfully submited!')
          statusfb = data.sosmed.id
        },
        error => {
          toast.error('Registrastion Failed ' + error.response.data.message)
        }
      )
    } else {
      HttpClient.patch(AppConfig.baseUrl + '/user/sosmed/' + statusfb, json).then(
        () => {
          // toast.success(' Successfully submited!')
        },
        error => {
          toast.error('Registrastion Failed ' + error.response.data.message)
        }
      )
    }
    // setDisabledFacebook(true)
  }

  const addbuttoninstagram = () => {
    let user = ''
    if (instagram.length < 20) {
      user = 'https://instagram.com/' + instagram
    } else {
      user = instagram
    }
    const json = {
      sosmed_address: user
    }
    if (statusig == '') {
      HttpClient.post(AppConfig.baseUrl + '/user/sosmed', json).then(
        ({ data }) => {
          console.log('here 1', data)
          // toast.success(' Successfully submited!')
          statusig = data.sosmed.id
        },
        error => {
          console.log('here 1', error)
          toast.error('Registrastion Failed ' + error.response.data.message)
        }
      )
    } else {
      HttpClient.patch(AppConfig.baseUrl + '/user/sosmed/' + statusig, json).then(
        ({ data }) => {
          console.log('here 1', data)
          // toast.success(' Successfully submited!')
        },
        error => {
          console.log('here 1', error)
          toast.error('Registrastion Failed ' + error.response.data.message)
        }
      )
    }
    // setDisabledInstagram(true)
  }
  const addbuttonlinkedin = () => {
    let user = ''
    if (linkedin.length < 20) {
      user = 'https://linkedin.com/' + linkedin
    } else {
      user = linkedin
    }
    const json = {
      sosmed_type: 'linkedin',
      sosmed_address: user
    }
    if (statuslinkedin == '') {
      HttpClient.post(AppConfig.baseUrl + '/user/sosmed', json).then(
        ({ data }) => {
          // toast.success(' Successfully submited!')
          statuslinkedin = data.sosmed.id
        },
        error => {
          console.log('here 1', error)
          toast.error('Registrastion Failed ' + error.response.data.message)
        }
      )
    } else {
      HttpClient.patch(AppConfig.baseUrl + '/user/sosmed/' + statuslinkedin, json).then(
        ({ data }) => {
          console.log('here 1', data)
          // toast.success(' Successfully submited!')
        },
        error => {
          console.log('here 1', error)
          toast.error('Registrastion Failed ' + error.response.data.message)
        }
      )
    }
    // setDisabledLinkedin(true)
  }

  const [preview, setPreview] = useState()
  const [previewBanner, setPreviewBanner] = useState()

  const onSelectFileGallery = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)

      return
    }

    // I've kept this example simple by using the first image instead of multiple

    const selectedFiles = e.target.files as FileList
    // setCurrentImage(selectedFiles?.[0])
    uploadPhotoGallery(selectedFiles?.[0])
  }
  const uploadPhotoGallery = (data: any) => {
    const json: any = new FormData()
    json.append('image_file', data)
    HttpClient.post(AppConfig.baseUrl + '/user/gallery', json).then(
      ({ data }) => {
        console.log('here 1', data)
        toast.success(' Successfully submited!')
      },
      error => {
        console.log('here 1', error)
        toast.error(' Failed ' + error.response.data.message)
      }
    )
  }
  // const enabledtextfield = (x: any) => {

  // if (x == 'fb') setDisabledFacebook(false)
  // if (x == 'ig') setDisabledInstagram(false)
  // if (x == 'li') setDisabledLinkedin(false)
  // }
  const getimage = async () => {
    const resp = await HttpClient.get('/user/gallery?page=1&take=25')
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    const slides = []
    const data = resp.data.data
    for (let x = 0; x < data.length; x++) {
      const element = data[x]
      const url = { url: element.file_address, title: element.mime, id: element.id }
      slides.push(url)
    }
    setSlides(slides)
  }
  // const slides = [
  //   { url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'beach' },
  //   { url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d', title: 'boat' },
  //   { url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'forest' },
  //   { url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'city' },
  //   { url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'italy' }
  // ]

  return (
    <>
      <Grid container padding={5}>
        <Grid xs={12} sx={{ mt: 0, ml: 2, mb: 2 }}>
          <Typography variant='body2' sx={{ color: '#32487A', fontSize: '18px', fontWeight: '600' }}>
            General Info
          </Typography>
          <Grid container item xs={12} justifyContent={'left'}>
            <Typography variant='body2' sx={{ color: '#262525', fontSize: '12px' }}>
              Fulfill your General Info
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          sx={{
            height: { xs: 150, md: 250 },
            width: '100%',
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          <Box position={'relative'} width={'100%'}>
            <Card>
              <CardMedia
                component='img'
                alt='profile-header'
                image={previewBanner ? previewBanner : '/images/banner/employer-banner.png'}
                sx={{
                  height: { xs: 150, md: 250 },
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </Card>

            <Box
              // onClick={() => setOpenEditModalBanner(true)}

              position={'absolute'}
              sx={{ right: { xs: '45%', md: '50%' }, bottom: { xs: '50%', md: '50%' } }}
            >
              <Icon
                id='banner-button'
                aria-controls={Boolean(openBannerMenu) ? 'banner-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={Boolean(openBannerMenu) ? 'true' : undefined}
                onClick={(event: any) => setOpenBannerMenu(event.currentTarget)}
                fontSize='large'
                icon={'bi:camera'}
                color={'white'}
                style={{ fontSize: '36px' }}
              />

              <Menu
                anchorEl={openBannerMenu}
                aria-labelledby='banner-button'
                id='banner-menu'
                open={Boolean(openBannerMenu)}
                onClose={() => setOpenBannerMenu(null)}
                MenuListProps={{
                  'aria-labelledby': 'banner-button'
                }}
              >
                <MenuItem
                  color='blue'
                  onClick={() => {
                    setOpenEditModalBanner(!openEditModalBanner)
                    setOpenBannerMenu(null)
                  }}
                >
                  <Icon fontSize='large' icon={'bi:upload'} color={'blue'} style={{ fontSize: '14px' }} /> &nbsp; Update
                  Banner Picture
                </MenuItem>
                <MenuItem onClick={() => setOpenBannerDeleteConfirm(true)} color='red'>
                  <Icon fontSize='large' icon={'bi:trash'} color={'red'} style={{ fontSize: '14px' }} />
                  &nbsp; Remove Banner Picture
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Grid>

        <CardContent
          sx={{
            pt: 0,
            mt: -8,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' },
            marginLeft: { md: '10px' }
            // marginTop:'125px'
          }}
        >
          <BoxWrapper
            id='profile-picture-frame-box'
            onClick={(event: React.MouseEvent<HTMLElement>) => setOpenProfileMenu(event.currentTarget)}
          >
            <ProfilePicture
              src={preview ? preview : '/images/avatars/profilepic.png'}
              alt={props.datauser.name || 'User Avatar'}
            ></ProfilePicture>

            <Box position={'absolute'} right={'40%'} bottom={'40%'}>
              <Icon fontSize='large' icon={'bi:camera'} color={'white'} style={{ fontSize: '26px' }} />
            </Box>
          </BoxWrapper>
          <Menu
            anchorEl={openProfileMenu}
            id='profile-menu'
            open={Boolean(openProfileMenu)}
            onClose={() => setOpenProfileMenu(null)}
            MenuListProps={{
              'aria-labelledby': 'profile-picture-frame-box'
            }}
          >
            <MenuItem
              color='blue'
              onClick={() => {
                setOpenEditModalProfile(!openEditModalProfile)
                setOpenProfileMenu(null)
              }}
            >
              <Icon fontSize='large' icon={'bi:upload'} color={'blue'} style={{ fontSize: '14px' }} /> &nbsp; Update
              Profile Picture
            </MenuItem>
            <MenuItem onClick={() => setOpenProfileDeleteConfirm(true)} color='red'>
              <Icon fontSize='large' icon={'bi:trash'} color={'red'} style={{ fontSize: '14px' }} />
              &nbsp; Remove Profile Picture
            </MenuItem>
          </Menu>
        </CardContent>

        {props.datauser.role == 'Company' && (
          <>
            <Grid item container md={12} xs={12}>
              {props.datauser.verified_at == null && itemData.length == 0 && (
                <Grid container item xs={12} justifyContent={'left'}>
                  <Alert severity='info' sx={{ marginTop: 2, marginBottom: 2, width: '100%' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Please Upload your document to verify your company
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {props.datauser.verified_at == null && itemData.length > 0 && (
                <Grid container item xs={12} justifyContent={'left'}>
                  <Alert severity='info' sx={{ marginTop: 2, marginBottom: 2, width: '100%' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Please wait for admin to verify
                    </Typography>
                  </Alert>
                </Grid>
              )}

              <Divider style={{ width: '100%' }} />
              <Grid item container xs={12}>
                {reason !== '' && (
                  <Grid container item xs={12} justifyContent={'left'}>
                    <Alert severity='info' sx={{ marginTop: 2, marginBottom: 2, width: '100%' }}>
                      <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{reason}</Typography>
                    </Alert>
                  </Grid>
                )}

                <Grid xs={10} md={11} mt={2}>
                  <Grid container item xs={12} justifyContent={'left'}>
                    <Typography variant='body2' sx={{ color: '#32487A', fontSize: '18px', fontWeight: '600' }}>
                      Document Upload
                    </Typography>
                  </Grid>
                  <Grid container item xs={12} justifyContent={'left'}>
                    <Typography variant='body2' sx={{ color: '#262525', fontSize: '12px' }}>
                      Please upload mandatory document and get your profile verify
                    </Typography>
                  </Grid>
                </Grid>
                <Grid display='flex' justifyContent='flex-end' alignItems='flex-end' xs={2} md={1}>
                  <Button variant='contained' size='small' onClick={() => setOpenAddModalDoc(!openAddModalDoc)}>
                    <Icon
                      fontSize='small'
                      icon={'solar:add-circle-bold-duotone'}
                      color={'success'}
                      style={{ fontSize: '18px' }}
                    />
                    <div style={{ marginLeft: 5 }}>ADD</div>
                  </Button>
                </Grid>
                <Divider style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} />
                <Grid item container xs={12}>
                  {itemData.map(itemhead => (
                    <>
                      {itemhead.childs?.length <= 0 ? (
                        <>
                          <Grid item container xs={12} marginTop={2} key={itemhead.id} alignItems='center'>
                            <Grid xs={12} md={9} container direction='row' alignItems='center'>
                              <Icon
                                fontSize='large'
                                icon={'solar:document-bold'}
                                color={'info'}
                                style={{ fontSize: '18px', margin: '5px' }}
                              />
                              <Typography variant='body2' sx={{ color: '#262525', fontSize: '14px' }}>
                                {itemhead.document_name}
                              </Typography>
                            </Grid>
                            <Grid xs={12} md={3} display='flex' item container>
                              <Grid
                                xs={12}
                                md={12}
                                container
                                direction='row'
                                justifyContent='flex-end'
                                alignItems='center'
                              >
                                <Box margin={1}>
                                  <Button
                                    variant='outlined'
                                    color='info'
                                    size='small'
                                    href={itemhead.path}
                                    target='_blank'
                                  >
                                    <Icon
                                      fontSize='large'
                                      icon={'icon-park-outline:preview-open'}
                                      color={'info'}
                                      style={{ fontSize: '18px' }}
                                    />
                                  </Button>
                                </Box>
                                {/* <Box margin={1}>
                              <Button
                                variant='outlined'
                                color='primary'
                                size='small'
                                onClick={() => editDocument(itemhead)}
                              >
                                <Icon
                                  fontSize='large'
                                  icon={'solar:pen-new-round-bold-duotone'}
                                  color={'primary'}
                                  style={{ fontSize: '18px' }}
                                />
                              </Button>
                            </Box> */}
                                <Box margin={1}>
                                  <Button
                                    variant='outlined'
                                    color='error'
                                    size='small'
                                    onClick={() => deletework(itemhead.id)}
                                  >
                                    <Icon
                                      fontSize='large'
                                      icon={'solar:trash-bin-trash-bold-duotone'}
                                      color={'error'}
                                      style={{ fontSize: '18px' }}
                                    />
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Typography> {itemhead.document_name}</Typography>
                          {itemhead.childs.map(
                            (item: {
                              id: React.Key | null | undefined
                              document_name: string | null | undefined
                              path: string
                            }) => (
                              <Grid item container xs={12} marginTop={2} key={item.id} alignItems='center'>
                                <Grid xs={12} md={9} container direction='row' alignItems='center'>
                                  <Icon
                                    fontSize='large'
                                    icon={'solar:document-bold'}
                                    color={'info'}
                                    style={{ fontSize: '18px', margin: '5px' }}
                                  />
                                  <Typography variant='body2' sx={{ color: '#262525', fontSize: '14px' }}>
                                    {item.document_name}
                                  </Typography>
                                </Grid>
                                <Grid xs={12} md={3} display='flex' item container>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    container
                                    direction='row'
                                    justifyContent='flex-end'
                                    alignItems='center'
                                  >
                                    <Box margin={1}>
                                      <Button
                                        variant='outlined'
                                        color='info'
                                        size='small'
                                        href={item.path}
                                        target='_blank'
                                      >
                                        <Icon
                                          fontSize='large'
                                          icon={'icon-park-outline:preview-open'}
                                          color={'info'}
                                          style={{ fontSize: '18px' }}
                                        />
                                      </Button>
                                    </Box>
                                    <Box margin={1}>
                                      <Button
                                        variant='outlined'
                                        color='primary'
                                        size='small'
                                        // onClick={() => editDocument(item)}
                                      >
                                        <Icon
                                          fontSize='large'
                                          icon={'solar:pen-new-round-bold-duotone'}
                                          color={'primary'}
                                          style={{ fontSize: '18px' }}
                                        />
                                      </Button>
                                    </Box>
                                    <Box margin={1}>
                                      <Button
                                        variant='outlined'
                                        color='error'
                                        size='small'
                                        onClick={() => deletework(item.id)}
                                      >
                                        <Icon
                                          fontSize='large'
                                          icon={'solar:trash-bin-trash-bold-duotone'}
                                          color={'error'}
                                          style={{ fontSize: '18px' }}
                                        />
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )
                          )}
                        </>
                      )}
                      <Divider style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} />
                    </>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            {/* )} */}
            <form>
              <DialogAddDocument
                visible={openAddModalDoc}
                onStateChange={() => setHookSignature(v4())}
                onCloseClick={() => setOpenAddModalDoc(!openAddModalDoc)}
                arrayhead={itemData}
                role={props.datauser.role}
              />
            </form>
          </>
        )}

        <>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Grid item xs={12} container marginTop={'25px'}>
                <Grid item container spacing={3} sx={{ mb: 2 }}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id='companyName'
                      defaultValue={props.datauser.name}
                      label='Company Name'
                      required
                      variant='standard'
                      fullWidth
                      sx={{ mb: 1 }}
                      {...register('companyName')}
                    />
                  </Grid>
                  {props.datauser.role == 'Company' && (
                    <Grid item md={6} xs={12}>
                      <Autocomplete
                        disablePortal
                        id='combo-box-demo'
                        options={comboindustry}
                        defaultValue={props.datauser?.industry}
                        getOptionLabel={(option: any) => option.name}
                        renderInput={params => <TextField {...params} label='Industry *' variant='standard' />}
                        onChange={(event: any, newValue: Industry | null) =>
                          newValue?.id ? setIndustry(newValue.id) : setIndustry(props.datauser.industry_id)
                        }
                      />
                    </Grid>
                  )}
                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      disablePortal
                      id='combo-box-demo'
                      options={combocountry}
                      getOptionLabel={(option: any) => option.nicename}
                      defaultValue={props.address?.country}
                      renderInput={params => <TextField {...params} label='Country *' variant='standard' />}
                      onChange={(event: any, newValue: Countries | null) =>
                        newValue?.id ? searchcity(newValue.id) : searchcity(props.datauser.country_id)
                      }
                    />
                  </Grid>

                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      disablePortal
                      id='city'
                      value={props.datauser.address?.city}
                      options={combocity}
                      getOptionLabel={(option: City) => option.city_name}
                      renderInput={params => <TextField {...params} label='City *' sx={{ mb: 2 }} variant='standard' />}
                      onChange={(event: any, newValue: City | null) =>
                        newValue?.id ? setCombocity(newValue.id) : setCombocity(props.address?.city_id)
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id='address'
                      label='Address *'
                      defaultValue={props.datauser.address?.address}
                      variant='standard'
                      fullWidth
                      sx={{ mb: 1 }}
                      {...register('address')}
                    />
                  </Grid>

                  {props.datauser.role == 'Company' && (
                    <>
                      <Grid item md={3} xs={12}>
                        <TextField
                          id='website'
                          label='Website'
                          defaultValue={props.datauser.website}
                          variant='standard'
                          fullWidth
                          sx={{ mb: 1 }}
                          {...register('website')}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12}>
                    <TextField
                      id='Email'
                      label='Email'
                      required
                      defaultValue={props.datauser.email}
                      variant='standard'
                      fullWidth
                      sx={{ mb: 1 }}
                      {...register('email')}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      id='phone'
                      label='Phone'
                      required
                      defaultValue={props.datauser.phone}
                      variant='standard'
                      fullWidth
                      sx={{ mb: 1 }}
                      type='number'
                      value={phoneNum}
                      {...register('phone')}
                      onChange={e => onChangePhoneNum(e.target.value)}
                      InputProps={{
                        // startAdornment: <InputAdornment position='start'>Prefix</InputAdornment>,
                        startAdornment: (
                          <Autocomplete
                            disablePortal
                            id='code'
                            options={combocode}
                            getOptionLabel={(option: Countries) => option.iso}
                            defaultValue={props.datauser?.country}
                            renderInput={params => <TextField {...params} variant='standard' />}
                            onChange={(event: any, newValue: Countries | null) =>
                              newValue?.id ? setCombocode(newValue.id) : setCombocode(props.address.country_id)
                            }
                          />
                          // <Autocomplete
                          //   style={{ width: '160px' }}
                          //   disablePortal
                          //   id='code'
                          //   options={!combocode ? [{ label: 'Loading...', id: 0 }] : combocode}
                          //   renderInput={params => <TextField {...params} variant='standard' />}
                          //   {...register('code')}
                          //   onChange={(event: any, newValue: string | null) => setCombocode(newValue)}
                          // />
                        )
                      }}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <TextField
                      required
                      fullWidth
                      sx={{ mb: 1 }}
                      id='outlined-multiline-static'
                      label='About Company'
                      multiline
                      variant='standard'
                      rows={4}
                      defaultValue={props.datauser.about}
                      {...register('about')}
                    />
                  </Grid>

                  <Grid item md={5} xs={12}>
                    <Grid container item xs={12} justifyContent={'left'}>
                      <Typography variant='body2' sx={{ color: '#262525', fontSize: '18px' }}>
                        Social Media Info
                      </Typography>
                    </Grid>
                    <Grid container item xs={12} justifyContent={'left'}>
                      <Typography variant='body2' sx={{ color: '#262525', fontSize: '12px' }}>
                        Fulfill your Social Media Info
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container item md={12} xs={12} marginTop={'20px'}>
                    <Grid container item xs={12} md={4} marginBottom={2}>
                      <Grid container item xs={12} md={12}>
                        <Grid xs={12} item>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 6, minWidth: 5, display: 'flex', justifyContent: 'center' }}>
                              <Icon icon='mdi:facebook' fontSize={24} color={'#262525'} />
                            </Box>
                            <TextField
                              id='facebook'
                              defaultValue={facebook}
                              label='Facebook'
                              variant='standard'
                              fullWidth
                              sx={{ mb: 1 }}
                              value={facebook}
                              {...register('facebook')}
                              // disabled={disabledFacebook}
                              onChange={e => setFacebook(e.target.value)}
                              onBlur={handleSubmit(addbuttonfacebook)}
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>/</InputAdornment>
                              }}
                            />
                            {/* <Button
                              onClick={() => enabledtextfield('fb')}
                              sx={{ mr: 4, minWidth: 5, display: 'flex', justifyContent: 'center' }}
                            >
                              <Icon
                                fontSize='large'
                                icon={'solar:pen-new-round-bold-duotone'}
                                color={'primary'}
                                style={{ fontSize: '24px' }}
                              />
                            </Button> */}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid container item xs={12} marginBottom={2} md={4}>
                      <Grid container item xs={12} md={12}>
                        <Grid xs={12} item>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 6, minWidth: 5, display: 'flex', justifyContent: 'center' }}>
                              <Icon icon='mdi:instagram' fontSize={24} color={'#262525'} />
                            </Box>
                            <TextField
                              id='instagram'
                              label='Instagram'
                              variant='standard'
                              fullWidth
                              value={instagram}
                              sx={{ mb: 1 }}
                              {...register('instagram')}
                              // disabled={disabledInstagram}
                              onChange={e => setInstagram(e.target.value)}
                              onBlur={handleSubmit(addbuttoninstagram)}
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>/</InputAdornment>
                              }}
                            />
                            {/* <Button
                              onClick={() => enabledtextfield('ig')}
                              sx={{ mr: 4, minWidth: 5, display: 'flex', justifyContent: 'center' }}
                            >
                              <Icon
                                fontSize='large'
                                icon={'solar:pen-new-round-bold-duotone'}
                                color={'primary'}
                                style={{ fontSize: '24px' }}
                              />
                            </Button> */}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid container item xs={12} marginBottom={2} md={4}>
                      <Grid container item xs={12} md={12}>
                        <Grid xs={12} item>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 6, minWidth: 5, display: 'flex', justifyContent: 'center' }}>
                              <Icon icon='mdi:linkedin' fontSize={24} color={'#262525'} />
                            </Box>
                            <TextField
                              id='linkedin'
                              defaultValue={linkedin}
                              label='Linkedin'
                              variant='standard'
                              fullWidth
                              sx={{ mb: 1 }}
                              {...register('linkedin')}
                              // disabled={disabledLinkedn}
                              value={linkedin}
                              onChange={e => setLinkedin(e.target.value)}
                              onBlur={handleSubmit(addbuttonlinkedin)}
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>/</InputAdornment>
                              }}
                            />
                            {/* <Button
                              onClick={() => enabledtextfield('li')}
                              sx={{ mr: 4, minWidth: 5, display: 'flex', justifyContent: 'center' }}
                            >
                              <Icon
                                fontSize='large'
                                icon={'solar:pen-new-round-bold-duotone'}
                                color={'primary'}
                                style={{ fontSize: '24px' }}
                              />
                            </Button> */}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    direction='row'
                    justifyContent='flex-end'
                    alignItems='center'
                    md={11}
                    lg={11}
                    xs={12}
                  ></Grid>
                  <Grid item direction='row' justifyContent='flex-end' alignItems='center' md={1} lg={1} xs={12}>
                    <Button variant='contained' color='success' size='small' type='submit' sx={{ mb: 7 }}>
                      <Icon
                        fontSize='large'
                        icon={'solar:diskette-bold-duotone'}
                        color={'success'}
                        style={{ fontSize: '18px' }}
                      />
                      <div style={{ marginLeft: 5 }}>SAVE</div>
                    </Button>
                  </Grid>
                  <Grid
                    item
                    direction='row'
                    justifyContent='flex-end'
                    alignItems='center'
                    md={0.2}
                    lg={0.2}
                    xs={12}
                  ></Grid>
                  <Divider style={{ width: '100%' }} />
                  <Box sx={{ marginTop: '20px' }}></Box>
                </Grid>
              </Grid>
            </FormControl>
          </form>
          <DialogBannerDeleteConfirmation
            visible={openBannerDeleteConfirm}
            onCloseClick={() => setOpenBannerDeleteConfirm(!openBannerDeleteConfirm)}
          />
          <DialogProfileDeleteConfirmation
            visible={openProfileDeleteConfirm}
            onCloseClick={() => setOpenProfileDeleteConfirm(!openProfileDeleteConfirm)}
          />
          <DialogEditProfile
            visible={openEditModalProfile}
            onCloseClick={() => setOpenEditModalProfile(!openEditModalProfile)}
            previewProfile={preview}
          />

          {/* <form> */}
          <DialogEditBanner
            visible={openEditModalBanner}
            onCloseClick={() => setOpenEditModalBanner(!openEditModalBanner)}
            previewBanner={previewBanner}
          />
          {props.datauser.role == 'hide' && (
            <>
              <Grid item md={7} xs={12}>
                <Grid container item xs={12} justifyContent={'left'}>
                  <Typography variant='body2' sx={{ color: '#262525', fontSize: '18px' }}>
                    Gallery
                  </Typography>
                </Grid>
                <Grid container item xs={12} justifyContent={'left'}>
                  <Typography variant='body2' sx={{ color: '#262525', fontSize: '12px' }}>
                    Upload your Photo here
                  </Typography>
                </Grid>
              </Grid>
              <Grid item md={4} display={{ xs: 'none', lg: 'block' }}>
                {' '}
              </Grid>

              <Grid item md={1} xs={12} marginBottom={'5px'}>
                <Box marginBottom={2}>
                  <ButtonUploadPhotoGallery />
                </Box>
                <input
                  accept='image/*'
                  id='raised-button-x'
                  style={{ display: 'none', height: 250, width: '100%' }}
                  onChange={onSelectFileGallery}
                  type='file'
                  ref={inputRef}
                ></input>
              </Grid>
              {slides.length > 0 && (
                <Grid item md={12} xs={12}>
                  <ImageSlider slide={slides} />
                </Grid>
              )}
            </>
          )}
          {/* <DialogEditDocument
            key={selectedItem?.id}
            selectedItem={selectedItem}
            visible={openEditModalDoc}
            onCloseClick={() => setOpenEditModalDoc(!openEditModalDoc)}
            onStateChange={() => setHookSignature(v4())}
          />  */}
        </>
      </Grid>
    </>
  )
}

CompanyProfile.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

CompanyProfile.guestGuard = true

export default CompanyProfile
