import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Chip, Grid, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AppConfig } from 'src/configs/api'
import { HttpClient } from 'src/services'

const FindJobsView = (props: { id: string }) => {
  const [planItems, setDataPlanItems] = useState<any[]>([])
  const { t } = useTranslation()

  const getListNews = async () => {
    try {
      const resp = await HttpClient.get(AppConfig.baseUrl + '/recomend/jobpostbyrole')
      if (resp.status != 200) {
        throw resp.data.message ?? 'Something went wrong!'
      }
      const rows = resp.data.data
      const items = rows
      setDataPlanItems(items)
    } catch (error) {
      let errorMessage = 'Something went wrong!'

      if (error instanceof AxiosError) {
        errorMessage = error?.response?.data?.message ?? errorMessage
      }

      if (typeof error == 'string') {
        errorMessage = error
      }

      toast.error(`Opps ${errorMessage}`)
    }
  }

  useEffect(() => {
    getListNews()
  }, [])

  return (
    <Grid
      id={props.id}
      sx={{
        backgroundColor: '#FFFFFF',
        backgroundSize: 'cover',
        py: 30,
        maxWidth: { xs: '100%' },
        px: { xs: 5, md: 5 }
      }}
      container
      direction='column'
      alignItems='center'
      justifyContent='center'
    >
      <Box sx={{ display: { xs: 'block', md: 'flex' }, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box sx={{ flexShrink: 1, mx: 10 }}>
          <Typography variant='h5' sx={{ mb: 5 }} color={'#000000'} fontWeight='600'>
            {t('landing_jobs_title')}
          </Typography>
          <Typography fontSize={16} variant='body1' style={{ color: '#000' }} maxWidth='80%'>
            {t('landing_jobs_subtitle')}
          </Typography>
        </Box>
        <Box sx={{ flexDirection: 'column', py: { xs: 10, md: 0 }, mx: 10 }}>
          <Typography variant='h5' sx={{ mb: 5 }} color={'#000000'} fontWeight='600'>
            {t('landing_jobs_suggested')}
          </Typography>
          <Box sx={{ maxWidth: 880 }}>
            {planItems &&
              planItems.map(item => (
                <Chip sx={{ marginRight: 2, marginBottom: 3 }} key={item?.name} label={item?.name} variant='outlined' />
              ))}
            <Link href='/find-job/'>
              <Chip
                clickable
                label='Other'
                onDelete={() => null}
                deleteIcon={<FontAwesomeIcon color='#fff' icon={faChevronDown} />}
                sx={{ marginRight: 2, marginBottom: 3 }}
                variant='filled'
                color='primary'
              />
            </Link>
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}

export default FindJobsView
