import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Box, Button, CircularProgress, Divider, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import Training from 'src/contract/models/training'
import Avatar from 'src/@core/components/mui/avatar'
import { formatIDR, getUserAvatar } from 'src/utils/helpers'
import Icon from 'src/@core/components/icon'
import { HttpClient } from 'src/services'
import Link from 'next/link'

const renderList = (arr: Training[] | null) => {
  if (arr && arr.length) {
    return arr.map(item => {
      return (
        <Grid item xs={12} md={4} sx={{ marginTop: '-10px', marginBottom: '10px' }} key={item.id}>
          <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
            <Grid item xs={12}>
              <CardContent>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
                  <Grid item component={Link} href={`/landingpage-trainer/detail/${item.id}`}>
                    <img
                      alt='logo'
                      src={item?.thumbnail ? item?.thumbnail : '/images/icon-trainer.png'}
                      style={{
                        width: '265px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container component={Link} href={`/landingpage-trainer/detail/${item.id}`}>
                  <Grid
                    item
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '85px' }}
                  >
                    <Tooltip title={item.title} enterDelay={500} leaveDelay={200}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'center'] }} mb={1}>
                        <Icon icon='solar:bookmark-circle-bold-duotone' color='#32487A' />
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: '#0a66c2',
                            width: '260px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          ml='0.5rem'
                          mt='0.2rem'
                          fontSize={18}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} mb={1}>
                      <Icon icon='solar:tag-horizontal-bold-duotone' color='#32487A' />
                      <Typography sx={{ color: 'text.primary' }} ml='0.5rem' mt='0.2rem' fontSize={14} fontWeight={700}>
                        {item.category?.category}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} mb={2}>
                      <Icon icon='solar:tag-price-bold-duotone' color='#32487A' />
                      <Typography sx={{ color: 'text.primary' }} ml='0.5rem' mt='0.2rem' fontSize={14} fontWeight={700}>
                        {formatIDR(item.price)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ alignItems: 'left', justifyContent: 'left' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }} my={3}>
                    <Button
                      size='small'
                      LinkComponent={Link}
                      variant='contained'
                      color='primary'
                      href={`/landingpage-trainer/detail/${item.id}`}
                    >
                      See Details
                    </Button>
                  </Box>
                </Grid>
                <Divider sx={{ my: '0 !important' }} />
                <Box
                  height={35}
                  sx={{
                    display: 'flex',
                    alignContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3} ml={2} mr={3}>
                    <Avatar src={getUserAvatar(item.trainer)} alt='profile-picture' sx={{ width: 25, height: 25 }} />
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}
                    marginTop={3}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: '#0a66c2' }} fontSize={14}>
                      {item?.trainer?.name}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Grid>
          </Card>
        </Grid>
      )
    })
  } else {
    return null
  }
}

const OngoingTrainingScreen = () => {
  const [listTrainings, setTraining] = useState<Training[] | null>(null)
  const [onLoading, setOnLoading] = useState(false)
  const payload = { page: 1, take: 12 }

  const fetchTrainings = async () => {
    try {
      setOnLoading(true)
      const resp = await HttpClient.get(`/public/data/training`, { ...payload })

      if (resp.status == 200) {
        const data = resp.data.trainings.data
        setTraining(data)
      }
    } catch (error) {
      console.error(error)
    }

    setOnLoading(false)
  }

  useEffect(() => {
    fetchTrainings()
  }, [])

  if (onLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ my: 20 }} />
      </Box>
    )
  }

  return (
    <Grid container spacing={3} mt={1}>
      {renderList(listTrainings)}
    </Grid>
  )
}

OngoingTrainingScreen.acl = {
  action: 'read',
  subject: 'seafarer-training-ongoing'
}

export default OngoingTrainingScreen
