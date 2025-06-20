import { Icon } from '@iconify/react'
import Head from 'next/head'
import { Box, Button, CircularProgress, Divider, Grid, IconButton, Typography } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { HttpClient } from 'src/services'
import Training from 'src/contract/models/training'
import { formatIDR, formatUSD } from 'src/utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import OtherTraining from './OtherTraining'
import { useAuth } from 'src/hooks/useAuth'
import DialogLogin from 'src/@core/components/login-modal'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'

const TrainingDetailPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useTranslation()
  const trainingId = router.query.id
  const [training, setTraining] = useState<Training | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const handleEnrollForOpenModalLogin = async () => {
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

  if (user) {
    const cleanedPathname = pathname.replace('/trainings/detail/', '')

    router.replace(`/candidate/trainings/${cleanedPathname}`)
  }

  useEffect(() => {
    if (trainingId) {
      getDetailTraining()
    }
  }, [trainingId])

  return !training ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <>
      <Head>
        <title>{`${training.title} - ${training.trainer.name} | Profesea`}</title>
        <meta property='og:title' content={`${training.title} - ${training.trainer.name} | Profesea`} />
        <meta
          property='og:description'
          content={`Ikuti "${training.title}" dari "${training.trainer.name}" untuk meningkatkan kompetensi maritim Anda. Daftar sekarang di Profesea.`}
        />
        <meta property='og:image' content={training.thumbnail ? training.thumbnail : '/images/icon-trainer.png'} />
        <meta name='keywords' content={`Training, Pelatihan, Sertifikasi Pelaut`} />
      </Head>
      <h1 style={{ display: 'none' }}>{training.title}</h1>
      <Box p={4}>
        <Grid container sx={{ position: 'fixed' }}>
          <IconButton onClick={() => router.push('/trainings')}>
            <FontAwesomeIcon icon={faArrowLeft} color='text.primary' />
          </IconButton>
        </Grid>
        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3
          }}
        >
          <Grid item xs={12} md={7}>
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
                      sx={{ fontSize: { xs: '28px', md: '48px' } }}
                    >
                      {training.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', mb: 2 }}>
                      <Typography fontSize='16px'>Created by</Typography>
                      <Typography color={'#32487A'} fontWeight='600' fontSize='16px'>
                        {training.trainer.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1, gap: 2 }}>
                      <Icon icon='solar:bookmark-circle-bold-duotone' color='#32487A' fontSize={24} />
                      <Box sx={{ width: 120 }}>
                        <Typography>Category:</Typography>
                      </Box>
                      <Box>
                        <Typography>{training?.category?.category}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <Icon icon='solar:calendar-bold-duotone' color='#32487A' fontSize={24} />
                      <Box sx={{ width: 120 }}>
                        <Typography>Training Start:</Typography>
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
                        width: '150px',
                        height: '150px',
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
                  sx={{ w: '100%', whiteSpace: 'pre-line' }}
                  component='div'
                  dangerouslySetInnerHTML={{ __html: training.short_description }}
                />
              </Box>
              <Box>
                <Typography color={'#32487A'} fontWeight='600' fontSize='18px' mb={2}>
                  Requirement
                </Typography>
                <Box
                  sx={{ w: '100%', whiteSpace: 'pre-line' }}
                  component='div'
                  dangerouslySetInnerHTML={{
                    __html: training.requirements ? training.requirements : 'No requirement'
                  }}
                />
              </Box>
              <Divider sx={{ my: 6, borderBottomWidth: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                {training.discounted_price ? (
                  <Box>
                    <Typography fontSize={14} mt={1} sx={{ textDecoration: 'line-through', color: 'gray' }}>
                      {training?.currency === 'IDR'
                        ? formatIDR(training?.price as number, true)
                        : formatUSD(training?.price as number, true)}
                    </Typography>
                    <Typography fontSize={20} sx={{ color: 'primary.main' }}>
                      {training?.currency === 'IDR'
                        ? formatIDR(training?.discounted_price as number, true)
                        : formatUSD(training?.discounted_price as number, true)}
                    </Typography>
                    <Typography fontSize={8} sx={{ color: 'gray' }}>
                      {t('tax_not_included')}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography fontSize={20} sx={{ color: 'primary.main' }}>
                      {training?.currency === 'IDR'
                        ? formatIDR(training?.price as number, true)
                        : formatUSD(training?.price as number, true)}
                    </Typography>
                    <Typography fontSize={10} sx={{ color: 'gray' }}>
                      {t('tax_not_included')}
                    </Typography>
                  </Box>
                )}

                <Button variant='contained' size='small' onClick={handleEnrollForOpenModalLogin}>
                  {t('login_modal_button_2')}
                </Button>

                {/* {training.joined_at ? (
                <Button disabled={true} variant='contained' size='small'>
                  {t('login_modal_button_1')}
                </Button>
              ) : (
                <Button variant='contained' size='small' onClick={handleClickBuy} disabled={!training?.cta}>
                  {t('login_modal_button_2')}
                </Button>
              )} */}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
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
          <DialogLogin
            visible={openDialog}
            variant='training'
            onCloseClick={() => {
              setOpenDialog(!openDialog)
            }}
          />
        )}
      </Box>
    </>
  )
}

TrainingDetailPage.guestGuard = false
TrainingDetailPage.authGuard = false
TrainingDetailPage.getLayout = (page: ReactNode) => <LandingPageLayout>{page}</LandingPageLayout>

export default TrainingDetailPage
