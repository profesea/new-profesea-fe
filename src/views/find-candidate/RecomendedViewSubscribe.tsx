import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Avatar, Paper } from '@mui/material'
import { IUser } from 'src/contract/models/user'
import { Icon } from '@iconify/react'

import Link from 'next/link'
import { toLinkCase } from 'src/utils/helpers'

export type ParamMain = {
  name: string
  skill: string
  location: string
}

interface Props {
  listCandidate: IUser[]
}

const renderList = (listCandidate: IUser[]) => {
  if (!listCandidate || listCandidate.length == 0) {
    return
  }

  return listCandidate?.map(item => {
    const userPhoto = item.photo != '' ? item.photo : '/images/avatars/default-user-new.png'
    const names = item.field_preference?.spoken_langs ? item.field_preference?.spoken_langs : []
    const license: any[] = Object.values(item?.license)

    return (
      <Grid item xs={12} md={4} key={item?.id}>
        <Paper sx={{ marginTop: '10px', border: '3px solid #eee', borderColor: 'warning.main' }} elevation={0}>
          <Link style={{ textDecoration: 'none' }} href={`/profile/${toLinkCase(item?.username)}`}>
            <Box
              height={65}
              sx={{
                display: 'flex',
                alignContent: 'center',
                '& svg': { color: 'text.secondary' }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3} ml={2} mr={3}>
                <Avatar src={userPhoto} alt='profile-picture' sx={{ width: 50, height: 50 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ['left', 'flex-start'] }} marginTop={2}>
                <Typography sx={{ fontWeight: 'bold', color: '#0a66c2', mb: 1 }} fontSize={14}>
                  {item.name ? item.name : '-'}
                </Typography>
                <Typography sx={{ color: 'text.primary', mb: 1 }} fontSize={12}>
                  {item.field_preference?.role_level?.levelName ? item.field_preference?.role_level?.levelName : '-'}
                  {' | '}
                  {item.field_preference?.role_type?.name ? item.field_preference?.role_type?.name : '-'}
                </Typography>
              </Box>
            </Box>
          </Link>

          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }} ml={2} mr={3} mt={2}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} mb={2}>
              <Icon icon='clarity:language-solid' color='#32487A' fontSize={'20px'} />

              {names?.map((name: string) => (
                <Typography sx={{ color: 'text.primary' }} ml='0.5rem' mt='-0.2rem' fontSize={12} key={name}>
                  {name}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} mb={2}>
              <Icon icon='icon-park-twotone:ship' color='#32487A' fontSize={'20px'} />
              <Typography sx={{ color: 'text.primary' }} ml='0.5rem' mt='-0.2rem' fontSize={12}>
                {item.field_preference?.vessel_type?.name ? item.field_preference?.vessel_type?.name : '-'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} mb={2}>
              <Icon icon='solar:medal-ribbons-star-bold-duotone' color='#32487A' fontSize={'20px'} />
              <Typography sx={{ color: 'text.primary' }} ml='0.5rem' mt='-0.2rem' fontSize={12}>
                {license?.map(e => e.name).join(', ')}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} mb={2}>
              <Icon icon='mdi:currency-usd' color='#32487A' />
              <Typography sx={{ color: 'text.primary' }} ml='0.5rem' mt='-0.2rem' fontSize={13}>
                from Rp. {item.field_preference?.role_type?.name ? item.field_preference?.salary_start : '0'} To Rp.
                {item.field_preference?.role_type?.name ? item.field_preference?.salary_end : '0'}
              </Typography>
            </Box> */}
          </Box>
        </Paper>
      </Grid>
    )
  })
}

const RecomendedViewSubscribe = (props: Props) => {
  const { listCandidate } = props

  return (
    <Grid container spacing={2}>
      {renderList(listCandidate)}
    </Grid>
  )
}

export default RecomendedViewSubscribe
