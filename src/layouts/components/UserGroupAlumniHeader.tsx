import { useState } from 'react'
import { Box, Menu, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
// import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Grid, styled } from '@mui/material'
import Alumni from 'src/contract/models/alumni'
import { Icon } from '@iconify/react'

import DialogAlumniEditProfilePicture from 'src/pages/alumni/DialogAlumniEditProfilePicture'

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
  dataalumni: Alumni
  iduser: string
}

const base_url = process.env.NEXT_PUBLIC_BASE_URL

const UserProfileHeader = (props: userProps) => {
  const { dataalumni } = props

  const [openProfileMenu, setOpenProfileMenu] = useState<null | HTMLElement>(null)
  const [openEditModalProfile, setOpenEditModalProfile] = useState(false)

  return (
    <Card sx={{ width: '100%', border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
      <Box sx={{ position: 'relative', height: { xs: 150, md: 225 } }}>
        <CardMedia
          component='img'
          alt='profile-header'
          image={'/images/banner.jpeg'}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover'
          }}
        />
        {/*iduser == String(dataalumni.user_id) && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                textAlign: 'center'
              }}
            >
              <IconButton sx={{ backgroundColor: '#DFDFDF' }}>
                <input
                  accept='image/png, image/gif, image/jpeg'
                  style={{ display: 'none', height: '100%', width: '100%' }}
                  id='raised-button-file-banner'
                  onChange={onSelectFile2}
                  type='file'
                />
                <Icon fontSize='large' icon={'mingcute:pencil-fill'} color={'black'} style={{ fontSize: '24px' }} />
              </IconButton>
            </Box>
          </>
        )*/}
      </Box>
      <CardContent
        sx={{
          p: 4,
          gap: { xs: 0, md: 4 },
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        <Box style={{ width: '100px', height: '100px', position: 'relative' }}>
          <ProfilePicture
            style={{ zIndex: 5 }}
            src={
              dataalumni.profilepicture ? base_url + '/storage/' + dataalumni.profilepicture : '/images/avatars/1.png'
            }
            alt={dataalumni.user.name || 'User Avatar'}
            sx={{
              width: 100,
              height: 100,
              border: (theme: { palette: { common: { white: any } } }) => `5px solid ${theme.palette.common.white}`
            }}
          />
          <>
            <label style={{ zIndex: 100 }}>
              <Icon
                onClick={(event: any) => setOpenProfileMenu(event.currentTarget)}
                fontSize='large'
                icon={'bi:camera'}
                color={'white'}
                style={{ position: 'absolute', fontSize: '26px', zIndex: 99, marginTop: '35px', left: '35px' }}
              />
            </label>
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
            </Menu>
          </>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid container direction='row' alignItems='center'>
              <Grid item>
                <Typography variant='body2' sx={{ color: '#32487A', fontSize: '18px', fontWeight: '900' }}>
                  {dataalumni.description}
                </Typography>
              </Grid>
              {dataalumni.statusaktif == true && (
                <Grid item ml={2}>
                  <Typography sx={{ color: '#262525', fontWeight: 600 }}>
                    <Icon
                      fontSize='large'
                      icon={'solar:verified-check-bold'}
                      color={'info'}
                      style={{ fontSize: '22px', color: 'green' }}
                    />
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Typography sx={{ color: '#262525', fontWeight: 600 }}>
              Institution : {dataalumni.sekolah?.sekolah}
            </Typography>

            <Typography sx={{ color: '#262525', fontWeight: 600 }}>{dataalumni.totalmember} Member</Typography>
          </Box>
        </Box>
      </CardContent>
      <DialogAlumniEditProfilePicture
        visible={openEditModalProfile}
        onCloseClick={() => setOpenEditModalProfile(!openEditModalProfile)}
        id={dataalumni.id}
      />
    </Card>
  )
}

export default UserProfileHeader
