// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import { CardMedia, useMediaQuery } from '@mui/material'
import { HttpClient } from 'src/services'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IUser } from 'src/contract/models/user'
import FieldPreference from 'src/contract/models/field_preference'
import { getUserAvatar, toLinkCase } from 'src/utils/helpers'

import { useTheme } from '@mui/material/styles'

export type ParamJobVacncy = {
  judul: string
  namapt: string
  lokasi: string
  waktu: string
}

export type activities = {
  total_connected: string
  total_visitor: string
  total_post_feed: string
  total_post_job: string
  total_applied_job: string
  total_post_thread: string
  total_followed: string
  total_followers: string
}

type userProps = {
  datauser: IUser | null
  activities?: activities | undefined
}

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 85,
  height: 85,
  borderRadius: '50%',
  border: `2px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const Profile = (props: userProps) => {
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))
  const [selectedItem, setSelectedItem] = useState<FieldPreference | null>(null)

  useEffect(() => {
    HttpClient.get('/user/field-preference', { user_id: props.datauser?.id }).then(response => {
      const { fieldPreference } = response.data as { fieldPreference: FieldPreference }
      setSelectedItem(fieldPreference)
    })
  }, [props.datauser])

  const resolveEditHref = (role?: string, username?: string) => {
    if (role == 'Seafarer') {
      return `/profile/${toLinkCase(username)}`
    }

    if (role == 'Company') {
      return `/company/${toLinkCase(username)}`
    }

    if (role == 'Trainer') {
      return `/trainer${toLinkCase(username)}`
    }

    return '/'
  }

  const link = `${props.datauser?.role === 'Seafarer' ? '/profile' : '/company'}/${toLinkCase(
    props.datauser?.username
  )}`

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
          <CardMedia
            component='img'
            alt='profile-header'
            src={
              props.datauser?.banner
                ? props.datauser?.banner
                : props.datauser?.team_id == 3
                ? '/images/banner/employer-banner.png'
                : props.datauser?.employee_type == 'onship'
                ? '/images/banner/seafarer-banner.png'
                : '/images/banner/professional-banner.png'
            }
            sx={{
              height: '100px',
              width: '100%',
              objectFit: 'cover',
              marginBottom: '-80px'
            }}
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                objectFit: 'Fill'
              }}
            >
              <Link href={link}>
                <ProfilePicture
                  src={getUserAvatar(props.datauser!)}
                  sx={{
                    width: isMobile ? 62 : 100,
                    height: isMobile ? 62 : 100,
                    objectFit: 'cover',
                    marginTop: isMobile ? '25px' : '40px'
                  }}
                  alt={props.datauser?.name || 'User Avatar'}
                />
              </Link>
            </Box>
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Link href={link}>
                <Typography
                  sx={{ color: '#2D3436', fontWeight: isMobile ? 600 : 400, fontSize: isMobile ? '14px' : '16px' }}
                >
                  {props.datauser?.name}
                </Typography>
              </Link>
              {props.datauser?.role === 'Seafarer' ? (
                <Typography sx={{ color: '#999', fontSize: '14px', fontWeight: 400 }}>
                  {`${
                    props.datauser?.employee_type === 'onship'
                      ? selectedItem?.role_type?.name
                        ? selectedItem?.role_type?.name
                        : ''
                      : selectedItem?.job_category?.name
                      ? selectedItem?.job_category?.name
                      : ''
                  }`}
                </Typography>
              ) : (
                <Typography sx={{ color: '#999', fontSize: '14px', fontWeight: 400 }}>
                  {props.datauser?.industry?.name}
                </Typography>
              )}
            </Box>

            {props?.datauser?.role === 'Seafarer' ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTop: '1px solid #F0F0F0',
                  borderBottom: '1px solid #F0F0F0'
                }}
              >
                <Box
                  sx={{
                    py: '8px',
                    px: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    borderRight: '1px solid #F0F0F0'
                  }}
                >
                  <Link href={'/connections?tab=2'}>
                    <Typography sx={{ fontSize: '14px', fontFamily: 700, color: '#2D3436', textAlign: 'center' }}>
                      {props?.activities?.total_connected}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontFamily: 400, color: '#999', textAlign: 'center' }}>
                      Connections
                    </Typography>
                  </Link>
                </Box>
                <Box sx={{ py: '8px', px: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Link href={'/connections?tab=3'}>
                    <Typography sx={{ fontSize: '14px', fontFamily: 700, color: '#2D3436', textAlign: 'center' }}>
                      {props?.activities?.total_followed}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontFamily: 400, color: '#999', textAlign: 'center' }}>
                      Following
                    </Typography>
                  </Link>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTop: '1px solid #F0F0F0',
                  borderBottom: '1px solid #F0F0F0'
                }}
              >
                <Box
                  sx={{
                    py: '8px',
                    px: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Typography sx={{ fontSize: '14px', fontFamily: 700, color: '#2D3436', textAlign: 'center' }}>
                    {props?.activities?.total_followers || 0}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontFamily: 400, color: '#999', textAlign: 'center' }}>
                    Followers
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '16px' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#32497A', cursor: 'pointer' }}>
                <Link
                  href={resolveEditHref(props.datauser?.role, props.datauser?.username)}
                  style={{ color: 'inherit' }}
                >
                  View My Profile
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Profile
