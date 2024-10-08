import { useState } from 'react'
import {
  Button,
  Box,
  Grid,
  DialogTitle,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import { Icon } from '@iconify/react'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ISeafarerRecommendationForm } from 'src/contract/types/seafarer_recommendation_type'

const ProficiencySchema = Yup.object().shape({
  company: Yup.string().required('Company is required'),
  email: Yup.string().email().required('Email is required')
})

const SeafarerProficiencyForm = (props: ISeafarerRecommendationForm) => {
  const { user_id, handleModalForm, showModal, type, loadRecommendation, seafarerRecommendation } = props
  const [loading, setLoading] = useState(false)
  const id = seafarerRecommendation?.id

  const formik = useFormik({
    initialValues: {
      user_id: user_id,
      company: type == 'edit' ? seafarerRecommendation?.company : '',
      email: type == 'edit' ? seafarerRecommendation?.email : '',
      position: type == 'edit' ? seafarerRecommendation?.position : '',
      phone_number: type == 'edit' ? seafarerRecommendation?.phone_number : ''
    },
    enableReinitialize: true,
    validationSchema: ProficiencySchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values)
      resetForm()
    }
  })

  const createRecommendation = (values: any) => {
    setLoading(true)
    HttpClient.post(AppConfig.baseUrl + '/seafarer-recommendations/', {
      user_id: values.user_id,
      company: values.company,
      email: values.email,
      position: values.position,
      phone_number: values.phone_number
    })
      .then(() => {
        toast.success('create recommendation success')
        handleModalForm(type, undefined)
        setLoading(false)
        loadRecommendation()
      })
      .catch(err => {
        toast.error(JSON.stringify(err.message))
        setLoading(false)
      })
  }

  const updateRecommendation = (id: number | undefined, values: any) => {
    setLoading(true)
    HttpClient.patch(AppConfig.baseUrl + '/seafarer-recommendations/' + id, {
      user_id: values.user_id,
      company: values.company,
      email: values.email,
      position: values.position,
      phone_number: values.phone_number
    })
      .then(() => {
        toast.success('update recommendation success')
        handleModalForm(type, undefined)
        setLoading(false)
        loadRecommendation()
      })
      .catch(err => {
        toast.error(JSON.stringify(err.message))
        setLoading(false)
      })
  }

  const handleSubmit = (values: any) => {
    if (type == 'edit') {
      updateRecommendation(id, values)
    } else {
      createRecommendation(values)
    }
  }

  return (
    <Grid item container md={12}>
      <Grid item container xs={12} md={6} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <Dialog open={showModal}>
          <form
            onSubmit={formik.handleSubmit}
            onReset={() => {
              formik.resetForm()
            }}
            method='post'
          >
            <DialogTitle>
              <IconButton
                size='small'
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                onClick={() => handleModalForm(type, undefined)}
              >
                <Icon width='24' height='24' icon='mdi:close' />
              </IconButton>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant='body2' color={'#32487A'} fontWeight='600' fontSize={18}>
                  Previous Company
                </Typography>
                <Typography variant='body2'>For Getting references</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container md={12} xs={12}>
                <Grid gap={8} item container md={12} xs={12} style={{ marginBottom: 10 }}>
                  <Grid item md={5} xs={12}>
                    <TextField
                      error={formik.errors.company ? true : false}
                      fullWidth
                      id='company'
                      name='company'
                      label='Company * '
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company}
                      defaultValue={type == 'edit' ? seafarerRecommendation?.company : ''}
                      variant='standard'
                    />
                  </Grid>
                  <Grid item md={5} xs={12}>
                    <TextField
                      fullWidth
                      id='position'
                      name='position'
                      label='Name/Position'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.position}
                      defaultValue={type == 'edit' ? seafarerRecommendation?.position : ''}
                      variant='standard'
                    />
                  </Grid>
                </Grid>
                <Grid gap={8} item container md={12} xs={12}>
                  <Grid item md={5} xs={12}>
                    <TextField
                      error={formik.errors.email ? true : false}
                      fullWidth
                      id='email'
                      name='email'
                      label='Email * '
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      defaultValue={type == 'edit' ? seafarerRecommendation?.email : ''}
                      variant='standard'
                    />
                  </Grid>
                  <Grid item md={5} xs={12}>
                    <TextField
                      fullWidth
                      id='phone_number'
                      name='phone_number'
                      label='Phone'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone_number}
                      defaultValue={type == 'edit' ? seafarerRecommendation?.phone_number : ''}
                      variant='standard'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions style={{ textAlign: 'center' }}>
              <Button
                type='reset'
                variant='contained'
                style={{ margin: '10px 10px', backgroundColor: 'grey' }}
                size='small'
              >
                Reset
              </Button>
              <Button disabled={loading} type='submit' variant='contained' style={{ margin: '10px 0' }} size='small'>
                <Icon
                  fontSize='small'
                  icon={'solar:add-circle-bold-duotone'}
                  color={'success'}
                  style={{ fontSize: '18px' }}
                />
                <div> Save</div>
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default SeafarerProficiencyForm
