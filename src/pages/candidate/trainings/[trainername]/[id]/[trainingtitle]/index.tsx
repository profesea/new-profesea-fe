import { Icon } from '@iconify/react'
import { Box, Button, CircularProgress, Divider, Grid, IconButton, Typography } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HttpClient } from 'src/services'
import Training from 'src/contract/models/training'
import { formatIDR } from 'src/utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import PaymentDialog from 'src/views/payment/PaymentDialog'
import OtherTraining from './OtherTraining'

const TrainingDetailPage = () => {
  const router = useRouter()
  const trainingId = router.query.id
  const [training, setTraining] = useState<Training | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const handleClickBuy = async () => {
    setOpenDialog(!openDialog)
  }

  const getDetailTraining = async () => {
    const resp = await HttpClient.get(`/public/data/training/${trainingId}`)
    if (resp.status != 200) {
      alert(resp.data?.message ?? '')

      return
    }
    setTraining(resp.data.training)
  }

  useEffect(() => {
    if (trainingId) {
      getDetailTraining()
    }
  }, [trainingId])

  return !training ? (
    <CircularProgress />
  ) : (
    <Box>
      <Grid container sx={{ position: 'fixed' }}>
        <IconButton onClick={() => router.push(`/candidate/trainings`)}>
          <FontAwesomeIcon icon={faArrowLeft} color='text.primary' />
        </IconButton>
      </Grid>
      <Grid
        container
        spacing={3}
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Grid item xs={12} md={7} lg={6}>
          <Box sx={{ p: 10, backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column-reverse', md: 'row' },
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography
                    variant='body2'
                    color='#32487A'
                    fontWeight='600'
                    sx={{ fontSize: { xs: '28px', md: '52px' } }}
                  >
                    {training.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', mb: 2 }}>
                    <Typography fontSize='16px'>Created by</Typography>
                    <Typography color={'#32487A'} fontWeight='600' fontSize='16px'>
                      {training.trainer.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                    <Box sx={{ width: 35 }}>
                      <Icon icon='solar:bookmark-circle-bold-duotone' color='#32487A' fontSize={24} />
                    </Box>
                    <Box sx={{ width: 120 }}>
                      <Typography>Category</Typography>
                    </Box>
                    <Box>
                      <Typography>{training?.category?.category}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ width: 35 }}>
                      <Icon icon='solar:calendar-bold-duotone' color='#32487A' fontSize={24} />
                    </Box>
                    <Box sx={{ width: 120 }}>
                      <Typography>Date & time</Typography>
                    </Box>
                    <Box>
                      <Typography>{moment(training.schedule).format('dddd, DD MMM YYYY h:mm')}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <img
                    alt='logo'
                    src={training?.thumbnail ? training?.thumbnail : '/images/icon-trainer.png'}
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </Box>
              </Grid>
            </Box>

            <Divider sx={{ my: 6, borderBottomWidth: 2 }} />
            <Box sx={{ mb: 4 }}>
              <Typography color={'#32487A'} fontWeight='600' fontSize='18px' mb={2}>
                Description
              </Typography>
              <Box
                sx={{ maxWidth: 720 }}
                component='div'
                dangerouslySetInnerHTML={{ __html: training.short_description }}
              />
            </Box>
            <Box>
              <Typography color={'#32487A'} fontWeight='600' fontSize='18px' mb={2}>
                Requirement
              </Typography>
              <Box
                sx={{ maxWidth: 720 }}
                component='div'
                dangerouslySetInnerHTML={{
                  __html: training.requirements ? training.requirements : 'No requirement'
                }}
              />
            </Box>

            <Divider sx={{ my: 6, borderBottomWidth: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant='h6' mt={1} width={155}>
                {formatIDR(training.price)}
              </Typography>

              {training.joined_at ? (
                <Button disabled={true} variant='contained' size='small'>
                  Joined
                </Button>
              ) : (
                <Button onClick={handleClickBuy} variant='contained' size='small'>
                  Enroll Now
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              width: '100%',
              bgcolor: '#d5e7f7'
            }}
          >
            <Typography sx={{ fontWeight: '600', color: '#5ea1e2' }} fontSize={18}>
              Training post by the Trainer
            </Typography>
          </Box>
          <Box
            sx={{
              p: 4,
              borderColor: 'divider',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <OtherTraining user_id={training.user_id} id={training.id} />
          </Box>
        </Grid>
      </Grid>
      {openDialog && (
        <PaymentDialog onClose={() => setOpenDialog(!openDialog)} training={training} openDialog={openDialog} />
      )}
    </Box>
  )
}

TrainingDetailPage.acl = {
  action: 'read',
  subject: 'home'
}

export default TrainingDetailPage