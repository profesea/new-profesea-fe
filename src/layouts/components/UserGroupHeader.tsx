import React from 'react'

import Box from '@mui/material/Box'
import { Menu, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Divider, styled } from '@mui/material'
import Group from 'src/contract/models/group'
import { Icon } from '@iconify/react'
import { IUser } from 'src/contract/models/user'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'

import DialogGroupConfirmDeleteBanner from 'src/pages/group/DialogGroupConfirmDeleteBanner'
import DialogGroupEditProfilePicture from 'src/pages/group/DialogGroupEditProfilePicture'
import DialogGroupConfirmDeleteProfilePicture from 'src/pages/group/DialogGroupConfirmDeleteProfilePicture'
import DialogGroupEditBanner from 'src/pages/group/DialogGroupEditBanner'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

type userProps = {
  datagroup: Group
}

const UserProfileHeader = (props: userProps) => {
  const { datagroup } = props
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser

  const [openProfileMenu, setOpenProfileMenu] = React.useState<null | HTMLElement>(null)
  const [openBannerMenu, setOpenBannerMenu] = React.useState<null | HTMLElement>(null)

  const [openBannerDeleteConfirm, setOpenBannerDeleteConfirm] = React.useState(false)
  const [openProfileDeleteConfirm, setOpenProfileDeleteConfirm] = React.useState(false)

  const [openEditModalBanner, setOpenEditModalBanner] = React.useState(false)
  const [openEditModalProfile, setOpenEditModalProfile] = React.useState(false)

  const base_url = process.env.NEXT_PUBLIC_BASE_URL

  return (
    <Card sx={{ width: '100%', border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
      <Box>
        <CardMedia
          component='img'
          alt='profile-header'
          image={
            datagroup.groupbanner
              ? base_url + '/storage/' + datagroup.groupbanner
              : '/images/avatars/headerprofile3.png'
          }
          sx={{
            height: { xs: 150, md: 250 },
            width: '100%',
            objectFit: 'cover'
          }}
        ></CardMedia>
        {datagroup.user_id == user.id && (
          <>
            <Box
              sx={{
                top: { xs: '150px', md: '270px', lg: '200px' },
                left: '50%',
                position: 'absolute'
              }}
            >
              <label>
                <Icon
                  onClick={(event: any) => setOpenBannerMenu(event.currentTarget)}
                  fontSize='large'
                  icon={'bi:camera'}
                  color={'white'}
                  style={{ fontSize: '26px' }}
                />
              </label>
            </Box>
            <Menu
              anchorEl={openBannerMenu}
              id='banner-menu'
              open={Boolean(openBannerMenu)}
              onClose={() => setOpenBannerMenu(null)}
              MenuListProps={{
                'aria-labelledby': 'banner-picture-frame-box'
              }}
            >
              <MenuItem
                color='blue'
                onClick={() => {
                  setOpenEditModalBanner(!openEditModalProfile)
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
          </>
        )}
      </Box>
      <Box>
        <ProfilePicture
          src={datagroup?.profilepicture ? base_url + '/storage/' + datagroup?.profilepicture : '/images/avatars/1.png'}
          alt={datagroup?.title || 'User Avatar'}
          sx={{
            top: 300,
            left: 50,
            width: 100,
            height: 100,
            position: 'absolute',
            border: (theme: { palette: { common: { white: any } } }) => `5px solid ${theme.palette.common.white}`
          }}
        />
        {datagroup.user_id == user.id && (
          <>
            <Box sx={{ top: 335, left: 87, width: 100, height: 100, position: 'absolute' }}>
              <label>
                <Icon
                  onClick={(event: any) => setOpenProfileMenu(event.currentTarget)}
                  fontSize='large'
                  icon={'bi:camera'}
                  color={'white'}
                  style={{ fontSize: '26px' }}
                />
              </label>
            </Box>
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
          </>
        )}
      </Box>

      <CardContent
        sx={{
          pt: 0,
          mt: 0,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' },
          marginLeft: { md: '10px' }
        }}
      >
        <Box
          sx={{
            mt: 15.75,
            mb: 5.25,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2' sx={{ color: '#32487A', fontSize: '18px', fontWeight: '900' }}>
              {datagroup.title}
            </Typography>
            <Typography sx={{ color: '#262525', fontWeight: 600 }}>{datagroup.description}</Typography>
          </Box>
        </Box>
      </CardContent>
      <Divider style={{ width: '100%' }} />
      <DialogGroupConfirmDeleteBanner
        visible={openBannerDeleteConfirm}
        onCloseClick={() => setOpenBannerDeleteConfirm(!openBannerDeleteConfirm)}
        id={props.datagroup.id}
      />
      <DialogGroupConfirmDeleteProfilePicture
        visible={openProfileDeleteConfirm}
        onCloseClick={() => setOpenProfileDeleteConfirm(!openProfileDeleteConfirm)}
        id={props.datagroup.id}
      />
      <DialogGroupEditProfilePicture
        visible={openEditModalProfile}
        onCloseClick={() => setOpenEditModalProfile(!openEditModalProfile)}
        previewProfile={datagroup?.profilepicture}
        id={props.datagroup.id}
      />
      <DialogGroupEditBanner
        visible={openEditModalBanner}
        onCloseClick={() => setOpenEditModalBanner(!openEditModalBanner)}
        previewBanner={datagroup.groupbanner}
        id={props.datagroup.id}
      />
    </Card>
  )
}

export default UserProfileHeader
