import { Ref, forwardRef, ReactElement, useState, useEffect } from 'react'

import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Fade,
  FadeProps,
  Typography,
  DialogActions,
  TextField,
  FormControlLabel
} from '@mui/material'
import { Icon } from '@iconify/react'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import { ISeafarerProficiencyForm } from '../../../contract/types/seafarer_proficiency_type'
import DatePicker from 'react-datepicker'
import * as Yup from 'yup'

const ProficiencySchema = Yup.object().shape({
  user_id: Yup.number().required(),
  country_id: Yup.object().shape({
    id: Yup.number().required('country id is required'),
    name: Yup.string().required('')
  }),
  cop_id: Yup.object().shape({ id: Yup.number().required('cop id is required'), title: Yup.string().required('') }),
  certificate_number: Yup.string().required(),
  is_lifetime: Yup.boolean().nullable(),
  filename: Yup.string().nullable()
})

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const SeafarerProficiencyForm = (props: ISeafarerProficiencyForm) => {
  const { type, seafarerProficiency, showModal, user_id, loadProficiency, handleModalForm } = props
  const id = seafarerProficiency?.id

  const [validDateState, setValidDateState] = useState<any>()
  const [attachment, setAttachment] = useState<any>(null)

  const [cop, setCop] = useState<any>(
    type == 'edit'
      ? {
          id: seafarerProficiency?.proficiency?.id,
          title: seafarerProficiency?.proficiency?.title
        }
      : {}
  )
  const [countryOfIssue, setCountryOfIssue] = useState<any>(
    type == 'edit'
      ? {
          id: seafarerProficiency?.country_id,
          name: seafarerProficiency?.country
        }
      : {}
  )

  const [countries, setCountries] = useState<{ id?: number; name: string }[]>([])
  const [proficiencies, setProficiencies] = useState([])

  const formik = useFormik({
    initialValues: {
      user_id: user_id,
      country_id: countryOfIssue,
      cop_id: cop,
      certificate_number: type == 'edit' ? seafarerProficiency?.certificate_number : '',
      valid_date: type == 'edit' ? validDateState : null,
      is_lifetime: type == 'edit' ? seafarerProficiency?.is_lifetime : false,
      filename: type == 'edit' ? seafarerProficiency?.filename : ''
    },
    enableReinitialize: true,
    validationSchema: ProficiencySchema,
    onSubmit: values => {
      handleSubmit(values)
    }
  })

  const loadCountries = () => {
    HttpClient.get(AppConfig.baseUrl + '/public/data/country?page=1&take=100')
      .then(response => {
        const countries = response?.data?.countries.map((item: any) => {
          return {
            id: item.id,
            name: item.name
          }
        })

        setCountries(countries)
      })
      .catch(err => {
        toast.error(' err load countries ' + JSON.stringify(err.message))
      })
  }

  const loadCertificateProficiencies = () => {
    HttpClient.get(AppConfig.baseUrl + '/licensi/all/')
      .then(response => {
        const certificates = response.data.licensiescop.map((item: any) => {
          return {
            id: item.id,
            title: item.title
          }
        })

        setProficiencies(certificates)
      })
      .catch(err => {
        toast.error(' err load Certificate ' + JSON.stringify(err.message))
      })
  }

  const createProficiency = (values: any) => {
    const formData = new FormData()
    formData.append('user_id', values.user_id)
    formData.append('country_id', values.country_id.id)
    formData.append('cop_id', values.cop_id.id)
    formData.append('certificate_number', values.certificate_number)
    if (values.valid_date) {
      formData.append('valid_until', !values.is_lifetime ? values.valid_date.toISOString().split('T')[0] : null)
    }
    formData.append('is_lifetime', values.is_lifetime ? String(1) : String(0))
    formData.append('attachment', attachment ? attachment : '')
    HttpClient.post(AppConfig.baseUrl + '/seafarer-proficiencies/', formData)
      .then(() => {
        toast.success('create proficiency success')
        loadProficiency()
        handleModalForm(type, undefined)
      })
      .catch(err => {
        toast.error(JSON.stringify(err.message))
      })
  }

  const updateProficiency = (id?: number, values?: any) => {
    const formData = new FormData()
    formData.append('user_id', values.user_id)
    formData.append('country_id', values.country_id.id)
    formData.append('cop_id', values.cop_id.id)
    formData.append('certificate_number', values.certificate_number)
    if (values.valid_date) {
      formData.append('valid_until', !values.is_lifetime ? values.valid_date.toISOString().split('T')[0] : null)
    }
    formData.append('is_lifetime', values.is_lifetime ? String(1) : String(0))
    formData.append('attachment', attachment ? attachment : '')
    HttpClient.post(AppConfig.baseUrl + '/seafarer-proficiencies/' + id, formData)
      .then(() => {
        toast.success('update proficiency success')
        loadProficiency()
        handleModalForm(type, undefined)
      })
      .catch(err => {
        toast.error(JSON.stringify(err.message))
      })
  }

  /* eslint-disable */
  useEffect(() => {
    if (seafarerProficiency?.is_lifetime) {
      setValidDateState(null)
    } else {
      setValidDateState(seafarerProficiency?.valid_until ? new Date(seafarerProficiency?.valid_until) : null)
    }
  }, [seafarerProficiency])
  /* eslint-enable */

  useEffect(() => {
    loadCountries()
    loadCertificateProficiencies()
  }, [])

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      valid_date: validDateState ? new Date(validDateState) : null
    })
  }, [formik.values.is_lifetime, validDateState])

  const handleSubmit = (values: any) => {
    if (type == 'edit') {
      updateProficiency(id, values)
    } else {
      createProficiency(values)
    }
  }

  return (
    <Dialog fullWidth open={showModal} maxWidth='sm' scroll='body' TransitionComponent={Transition}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <IconButton
            size='small'
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            onClick={() => props.handleModalForm(type, undefined)}
          >
            <Icon width='24' height='24' icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant='body2' color={'#32487A'} fontWeight='600' fontSize={18}>
              {type == 'create' ? 'Add new ' : 'Update '} proficiency
            </Typography>
            <Typography variant='body2'>Fulfill your Proficiency Info here</Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
            pt: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`],
            height: '500px'
          }}
        >
          <Grid container md={12} xs={12}>
            <Grid item md={12} xs={12} mb={5}>
              <Autocomplete
                id='autocomplete-proficiency'
                disablePortal
                options={proficiencies}
                getOptionLabel={(option: any) => option.title || ''}
                defaultValue={cop?.id ? cop : ''}
                renderInput={params => <TextField {...params} label='Certificate of Proficiency' variant='standard' />}
                onChange={(event: any, newValue: any) => (newValue?.id ? setCop(newValue) : setCop(''))}
              />
              {formik.errors.cop_id && (
                <span style={{ color: 'red', textAlign: 'left' }}>{JSON.stringify(formik.errors.cop_id)}</span>
              )}
            </Grid>
            <Grid item md={12} xs={12} mb={5}>
              <Autocomplete
                disablePortal
                id='combo-box-countries'
                options={countries}
                defaultValue={countryOfIssue?.id ? countryOfIssue : ''}
                getOptionLabel={option => option.name || ''}
                renderInput={(params: any) => <TextField {...params} label='Country of Issue' variant='standard' />}
                onChange={(event: any, newValue: string | null) =>
                  newValue ? setCountryOfIssue(newValue) : setCountryOfIssue('')
                }
              />
              {formik.errors.country_id && (
                <span style={{ color: 'red', textAlign: 'left' }}>{JSON.stringify(formik.errors.country_id)}</span>
              )}
            </Grid>
            <Grid item md={12} xs={12} mb={5}>
              <TextField
                value={formik.values.certificate_number}
                defaultValue={type == 'edit' ? seafarerProficiency?.certificate_number : ''}
                id='certificateNumber'
                name={'certificate_number'}
                label='Certificate Number'
                variant='standard'
                onChange={formik.handleChange}
                fullWidth
              />
              {formik.errors.certificate_number && (
                <span style={{ color: 'red', textAlign: 'left' }}>{formik.errors.certificate_number}</span>
              )}
            </Grid>
            <Grid item md={12} xs={12} mb={5}>
              <DatePicker
                disabled={formik.values.is_lifetime ? true : false}
                dateFormat='dd/MM/yyyy'
                selected={validDateState}
                onChange={(date: Date) => setValidDateState(date)}
                placeholderText='Click to select a date'
                showYearDropdown
                showMonthDropdown
                dropdownMode='select'
                id='valid_date'
                name='valid_date'
                customInput={<TextField label='Valid Date' variant='standard' fullWidth />}
              />
              {formik.errors.valid_date && (
                <span style={{ color: 'red', textAlign: 'left' }}>{JSON.stringify(formik.errors.valid_date)}</span>
              )}
            </Grid>
            <Grid item md={12} xs={12} mb={5}>
              <FormControlLabel
                sx={{ width: '100%' }}
                control={
                  <Checkbox
                    name='is_lifetime'
                    id='is_lifetime'
                    onClick={formik.handleChange}
                    value={formik.values.is_lifetime}
                    checked={formik.values.is_lifetime}
                  />
                }
                label='Lifetime'
              />
              {formik.errors.is_lifetime && (
                <span style={{ color: 'red', textAlign: 'left' }}>{JSON.stringify(formik.errors.is_lifetime)}</span>
              )}
            </Grid>
            <Grid>
              <Button
                component='label'
                variant='contained'
                size='small'
                fullWidth
                startIcon={
                  <Icon icon='material-symbols:cloud-upload' width='16' height='16' style={{ color: 'white' }} />
                }
              >
                Upload file <span>{attachment ? ' : ' + attachment['name'] : ''}</span>
                <input
                  style={{ visibility: 'hidden' }}
                  type='file'
                  name='attachment'
                  onChange={e => setAttachment(e.target?.files ? e.target?.files[0] : null)}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type='submit' variant='contained' style={{ margin: '10px 0' }} size='small'>
            <Icon
              fontSize='small'
              icon={'solar:add-circle-bold-duotone'}
              color={'success'}
              style={{ fontSize: '18px' }}
            />
            <div> {type == 'edit' ? 'Update ' : 'Create '} Proficiency</div>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default SeafarerProficiencyForm