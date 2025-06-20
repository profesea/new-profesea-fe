import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DateType } from 'src/contract/models/DatepickerTypes'
import Job from 'src/contract/models/job'
import { HttpClient } from 'src/services'
import { getCleanErrorMessage } from 'src/utils/helpers'
import { EditorState, convertToRaw } from 'draft-js'
import JobCategory from 'src/contract/models/job_category'
import Licensi from 'src/contract/models/licensi'
import draftToHtml from 'draftjs-to-html'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { Icon } from '@iconify/react'
import RoleType from 'src/contract/models/role_type'
import City from 'src/contract/models/city'
import VesselType from 'src/contract/models/vessel_type'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Company from 'src/contract/models/company'
import { yupResolver } from '@hookform/resolvers/yup'

import * as yup from 'yup'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import EditorArea from 'src/@core/components/react-draft-wysiwyg'

const SailRegion = [
  { id: 'ncv', name: 'Near Coastal Voyage (NCV)' },
  { id: 'iv', name: 'International Voyage' }
]

type DialogProps = {
  visible: boolean
  onCloseClick: VoidFunction
  onStateChange: VoidFunction
}

interface IFormAddSeafarerProps {
  dialogProps: DialogProps
  alignment: string
  handleChangeToggle: (event: React.MouseEvent<HTMLElement>, newAlignment: string) => void
}

const FormAddSeafarer: React.FC<IFormAddSeafarerProps> = ({ dialogProps, alignment, handleChangeToggle }) => {
  const [onLoading, setOnLoading] = useState(false)
  const [VesselId, setVesselId] = useState(0)
  const [CatId, setCatId] = useState(0)
  const [CouId, setCouId] = useState(100)
  const [CitId, setCitId] = useState('')
  const [TypeId, setTypeId] = useState(0)
  const [Sail, setSail] = useState('')
  const [license, setLicense] = useState<any[]>([])
  const [licenseCop, setLicenseCop] = useState<any[]>([])
  const [date, setDate] = useState<DateType>(new Date())
  const [rotational, setRotational] = useState('')
  const [desc, setDesc] = useState(EditorState.createEmpty())
  const [currency, setCurrency] = useState('')
  const [paymentPeriode, setPaymentPeriode] = useState('Monthly')
  const [checked, setChecked] = React.useState(false)
  const [UserId, setUserId] = useState(0)

  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])

  const [RoleType, getRoleType] = useState<any[]>([])
  const [combocity, getComboCity] = useState<any[]>([])
  const [VesselType, getVesselType] = useState<any[]>([])
  const [licenseData, getlicenseData] = useState<Licensi[]>([])
  const [licenseDataCOP, getlicenseDataCOP] = useState<Licensi[]>([])
  const [Company, getCompany] = useState<any[]>([])

  const schema = yup.object().shape({
    user_id: yup.string().required()
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Job>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const combobox = async () => {
    HttpClient.get(`/user-management?page=1&take=250&team_id=3`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getCompany(response.data.users.data)
    })

    HttpClient.get(`/public/data/role-type?search=&page=1&take=250`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getRoleType(response.data.roleTypes.data)
    })
    HttpClient.get(`/job-category?search=&page=1&take=250`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      const rawData: JobCategory[] = response?.data?.categories?.data
      const filterOnshipCategories = rawData.filter(d => d.employee_type == 'onship')

      setJobCategories(filterOnshipCategories)
    })
    HttpClient.get('/public/data/vessel-type?page=1&take=250&search=').then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getVesselType(response.data.vesselTypes.data)
    })
    const resp = await HttpClient.get('/public/data/city?search=&country_id=' + 100)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    const code = resp.data.cities
    getComboCity(code)

    const resp2 = await HttpClient.get(`/licensi/all`)
    if (resp2.status != 200) {
      throw resp2.data.message ?? 'Something went wrong!'
    }
    getlicenseData(resp2.data.licensiescoc)
    getlicenseDataCOP(resp2.data.licensiescop || [])
  }

  const onSubmit = async (formData: Job) => {
    const { contractDuration, experience, salary_end, salary_start, text_role, job_title } = formData

    let type = TypeId
    if (TypeId == 0 && text_role != '') {
      const json1 = {
        name: text_role,
        category_id: CatId
      }

      setOnLoading(true)

      try {
        const resp = await HttpClient.post('/role-type', json1)

        type = resp.data.roleType.id
        if (resp.status != 200) {
          throw resp.data.message ?? 'Something went wrong!'
        }

        toast.success(`${json1.name} submited successfully!`)
      } catch (error) {
        toast.error(`Opps ${getCleanErrorMessage(error)}`)
      }
    }

    const json = {
      rolelevel_id: null,
      roletype_id: type,
      user_id: UserId,
      edugrade_id: null,
      category_id: CatId == 0 ? null : CatId,
      country_id: CouId == 0 ? null : CouId,
      city_id: CitId,
      license: [...license, ...licenseCop],
      salary_start: salary_start,
      salary_end: salary_end,
      currency: currency, // value => "idr" or "dolar" (baru)
      paymentPeriode: paymentPeriode,
      experience: experience,
      experience_type: 'contract',
      sailing_region: Sail,
      employment_type: '',
      vesseltype_id: VesselId,
      description: draftToHtml(convertToRaw(desc?.getCurrentContent())),
      onboard_at: date
        ?.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        .split('/')
        .reverse()
        .join('-'),
      contract_duration: contractDuration, // value => string number (baru)
      rotational: rotational, // value => yer or no (baru)
      hide_salary: checked,
      job_title: job_title
    }

    setOnLoading(true)

    try {
      const resp = await HttpClient.post('/job', json)
      if (resp.status != 200) {
        throw resp.data.message ?? 'Something went wrong!'
      }

      dialogProps.onCloseClick()
      toast.success(` Job submited successfully!`)
      clear()
    } catch (error) {
      toast.error(`Opps ${getCleanErrorMessage(error)}`)
    }

    setOnLoading(false)
    dialogProps.onStateChange()
  }

  const handleChangeCategory = (value: any) => {
    if (value === '') {
      setCatId(0)
    } else {
      setCatId(value.id)

      // fetch role type
      HttpClient.get(`/public/data/role-type?search=&page=1&take=250&category_id=` + value.id).then(response => {
        if (response.status != 200) {
          throw response.data.message ?? 'Something went wrong!'
        }
        getRoleType(response.data.roleTypes.data)
      })

      setTypeId(0)
    }
  }

  const handleChangeRotational = (newValue: any) => {
    if (newValue) {
      setRotational(newValue.value)
    }
  }

  const clear = () => {
    setTypeId(0)
    setVesselId(0)
    setCatId(0)
    setCouId(100)
    setCitId('')
    setSail('')

    setLicense([])
    setDate(new Date())

    setJobCategories([])

    getRoleType([])

    getComboCity([])
    getVesselType([])

    setDesc(EditorState.createEmpty())
  }

  useEffect(() => {
    combobox()
  }, [])

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <IconButton
          size='small'
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          onClick={dialogProps.onCloseClick}
        >
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant='body2' color={'#32487A'} fontWeight='600' fontSize={18}>
            Add New Job
          </Typography>
          <Typography variant='body2'>Fulfill your Job Info here</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <ToggleButtonGroup
            color='primary'
            value={alignment}
            exclusive
            onChange={handleChangeToggle}
            aria-label='Platform'
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <ToggleButton value='seafarer' sx={{ flex: '1' }}>
              Seafarer
            </ToggleButton>
            <ToggleButton value='non-seafarer' sx={{ flex: '1' }}>
              Professional
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container columnSpacing={'1'} rowSpacing={'2'}>
          <Grid item md={12} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-company'
              options={Company}
              {...register('company')}
              getOptionLabel={(option: Company) => option.name}
              renderInput={params => (
                <TextField {...params} label='Company' error={Boolean(errors.user_id)} {...register('user_id')} />
              )}
              onChange={(event: any, newValue: Company | null) =>
                newValue?.id ? setUserId(newValue.id) : setUserId(0)
              }
            />
          </Grid>
          <Grid item md={12} xs={12} sx={{ mb: 1 }}>
            <TextField
              id='job_title'
              label='Job Title'
              variant='outlined'
              fullWidth
              {...register('job_title')}
              sx={{ flex: 1 }}
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={jobCategories}
              {...register('category')}
              getOptionLabel={(option: JobCategory) => option.name}
              renderInput={params => <TextField {...params} label='Job Category' />}
              onChange={(event: any, newValue: JobCategory | null) =>
                newValue ? handleChangeCategory(newValue) : handleChangeCategory('')
              }
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              id='combo-box-level'
              options={RoleType}
              getOptionLabel={(option: RoleType | string) => (typeof option === 'string' ? option : option.name)}
              renderInput={params => <TextField {...params} label='Job Rank' {...register('text_role')} />}
              onChange={(event: any, newValue: RoleType | null | string) =>
                typeof newValue === 'string' ? setTypeId(0) : newValue?.id ? setTypeId(newValue.id) : setTypeId(0)
              }
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={SailRegion}
              getOptionLabel={(option: any) => option.name}
              renderInput={params => <TextField {...params} label='Sail Region' />}
              onChange={(event: any, newValue: any | null) => (newValue?.id ? setSail(newValue.id) : setSail(''))}
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <TextField
              id='experience'
              defaultValue={1}
              label='Experience (Contract)'
              variant='outlined'
              fullWidth
              type='number'
              {...register('experience')}
              sx={{ flex: 1 }}
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='city'
              options={combocity}
              getOptionLabel={(option: City) => option.city_name}
              renderInput={params => <TextField {...params} label='Interview Location ' />}
              onChange={(event: any, newValue: City | null) =>
                newValue?.id ? setCitId(newValue?.id.toString()) : setCitId('')
              }
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={VesselType}
              getOptionLabel={(option: VesselType) => option.name}
              renderInput={params => <TextField {...params} label='Vessel Type' />}
              onChange={(event: any, newValue: VesselType | null) =>
                newValue?.id ? setVesselId(newValue.id) : setVesselId(0)
              }
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <DatePickerWrapper>
              <DatePicker
                minDate={new Date()}
                dateFormat='dd/MM/yyyy'
                selected={date}
                id='basic-input'
                onChange={(date: Date) => setDate(date)}
                placeholderText='Click to select a date'
                customInput={
                  <TextField label='Date On Board' variant='outlined' fullWidth {...register('onboard_at')} />
                }
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <TextField
              id='contractDuration'
              label='Contract Duration (Month)'
              variant='outlined'
              fullWidth
              type='number'
              {...register('contractDuration')}
            />
          </Grid>
        </Grid>
        <Grid container rowGap={1}>
          <Grid item>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Mandatory Certificate
            </Typography>
          </Grid>
          <Grid item md={12} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              multiple
              options={licenseData}
              id='license'
              value={license}
              filterSelectedOptions
              getOptionLabel={option => option.title || ''}
              fullWidth
              onChange={(e, newValue: any) => (newValue ? setLicense(newValue) : setLicense([]))}
              renderInput={params => <TextField {...params} fullWidth label='Certificate of Competency' />}
            />
          </Grid>
          <Grid item md={12} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              multiple
              options={licenseDataCOP}
              id='licensecop'
              value={licenseCop}
              filterSelectedOptions
              getOptionLabel={option => option.title || ''}
              fullWidth
              onChange={(e, newValue: any) => (newValue ? setLicenseCop(newValue) : setLicenseCop([]))}
              renderInput={params => <TextField {...params} fullWidth label='Certificate of Proficiency' />}
            />
          </Grid>
        </Grid>
        <Grid container columnSpacing={2} sx={{ mt: 2 }}>
          <Grid item md={3} xs={12} sx={{ mb: 1, gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Autocomplete
                disablePortal
                id='currency'
                options={[
                  { value: 'IDR', label: 'IDR' },
                  { value: 'USD', label: 'USD' }
                ]}
                getOptionLabel={(option: any) => option.label}
                renderInput={params => <TextField {...params} label='Currency' />}
                onChange={(event: any, newValue: any | null) => setCurrency(newValue ? newValue.value : '')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={event => setChecked(event.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label='Hide Salary'
                sx={{ width: '150px' }}
              />
            </Box>
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1, gap: 1 }}>
            <Autocomplete
              disablePortal
              id='paymentPeriode'
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Daily', label: 'Daily' }
              ]}
              getOptionLabel={(option: any) => option.label}
              renderInput={params => <TextField {...params} label='Payment Periode' />}
              onChange={(event: any, newValue: any | null) => setPaymentPeriode(newValue ? newValue.value : '')}
            />
          </Grid>
          <Grid item md={2} xs={12} sx={{ mb: 1, gap: 1 }}>
            <TextField
              defaultValue={0}
              id='salary_start'
              type='number'
              label='Salary Range From'
              variant='outlined'
              fullWidth
              {...register('salary_start')}
            />
          </Grid>
          
          <Grid item md={2} xs={12} sx={{ mb: 1, gap:1 }}>
            <TextField
              defaultValue={0}
              id='salary_end'
              type='number'
              label='Salary Range To'
              variant='outlined'
              fullWidth
              {...register('salary_end')}
            />
          </Grid>
          <Grid item md={2} xs={12} sx={{ mb: 1, gap:1 }}>
            <Autocomplete
              disablePortal
              id='rotational'
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              getOptionLabel={(option: any) => option.label}
              renderInput={params => <TextField {...params} label='Rotational' />}
              onChange={(event: any, newValue: any | null) => handleChangeRotational(newValue)}
            />
          </Grid>
          <Grid item md={12} xs={12} sx={{ mb: 1 }}>
            <EditorWrapper>
              <EditorArea
                editorState={desc}
                onEditorStateChange={data => setDesc(data)}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true }
                }}
                placeholder='Description'
              />
            </EditorWrapper>
            <Typography color={'blue'}>*Job title can be filled in with free text</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='contained' size='small' sx={{ mr: 2 }} type='submit'>
          <Icon fontSize='large' icon={'solar:diskette-bold-duotone'} color={'info'} style={{ fontSize: '18px' }} />
          {onLoading ? <CircularProgress size={25} style={{ color: 'white' }} /> : 'Submit'}
        </Button>
        <Button variant='outlined' size='small' color='error' onClick={dialogProps.onCloseClick}>
          <Icon fontSize='large' icon={'material-symbols:cancel-outline'} color={'info'} style={{ fontSize: '18px' }} />
          Cancel
        </Button>
      </DialogActions>
    </form>
  )
}

export default FormAddSeafarer
