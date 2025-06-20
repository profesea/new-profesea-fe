import {
  Autocomplete,
  createFilterOptions,
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
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import EditorArea from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import { DateType } from 'src/contract/models/DatepickerTypes'
import City from 'src/contract/models/city'
import Countries from 'src/contract/models/country'
import Degree from 'src/contract/models/degree'
import Job from 'src/contract/models/job'
import JobCategory from 'src/contract/models/job_category'
import RoleLevel from 'src/contract/models/role_level'
import RoleType, { RoleTypeAutocomplete } from 'src/contract/models/role_type'
import { HttpClient } from 'src/services'
import { getCleanErrorMessage } from 'src/utils/helpers'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
import { IUser } from 'src/contract/models/user'

type DialogProps = {
  visible: boolean
  onCloseClick: VoidFunction
  onStateChange: VoidFunction
}

interface IFormAddNonSeafarerProps {
  dialogProps: DialogProps
  alignment: string
  handleChangeToggle: (event: React.MouseEvent<HTMLElement>, newAlignment: string) => void
}

const employmentType = [{ name: 'Intern' }, { name: 'Contract' }, { name: 'Full-Time' }]

const filter = createFilterOptions<RoleTypeAutocomplete>()

const session = secureLocalStorage.getItem(localStorageKeys.userData) as IUser

const FormAddNonSeafarer: React.FC<IFormAddNonSeafarerProps> = ({ dialogProps, alignment, handleChangeToggle }) => {
  const [onLoading, setOnLoading] = useState(false)
  const [EduId, setEduId] = useState(0)
  const [LevelId, setLevelId] = useState(0)
  const [VesselId, setVesselId] = useState(0)
  const [CatId, setCatId] = useState(0)
  const [CouId, setCouId] = useState(100)
  const [CitId, setCitId] = useState('')
  const [TypeId, setTypeId] = useState<any>(0)
  const [Sail, setSail] = useState('')
  const [Employmenttype, setEmploymenttype] = useState('')
  const [license, setLicense] = useState<any[]>([])
  const [licenseCop, setLicenseCop] = useState<any[]>([])
  const [date, setDate] = useState<DateType>(new Date())
  const [rotational, setRotational] = useState('')
  const [desc, setDesc] = useState(EditorState.createEmpty())
  const [currency, setCurrency] = useState('')
  const [paymentPeriode, setPaymentPeriode] = useState('Monthly')
  const [checked, setChecked] = React.useState(false)
  const [isFixedSalary, setIsFixedSalary] = useState(false)

  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
  const [Education, getEducation] = useState<any[]>([])
  const [RoleType, getRoleType] = useState<any[]>([])
  const [RoleLevel, getRoleLevel] = useState<any[]>([])
  const [combocountry, getComboCountry] = useState<any>([])
  const [combocity, getComboCity] = useState<any[]>([])

  const combobox = async () => {
    HttpClient.get(`/public/data/role-level?search=&page=1&take=250`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }

      getRoleLevel(response.data.roleLevels.data)
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
      const filterOffshipCategories = rawData.filter(d => d.employee_type == 'offship')

      setJobCategories(filterOffshipCategories)
    })
    HttpClient.get(`/public/data/degree`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getEducation(response.data.degrees)
    })
    HttpClient.get('/public/data/country?search=').then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getComboCountry(response.data.countries)
    })
    const resp = await HttpClient.get('/public/data/city?search=&country_id=' + 100)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    const code = resp.data.cities
    getComboCity(code)
  }
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<Job>({
    mode: 'onBlur'
  })

  const searchcity = async (q: any) => {
    setCouId(q)
    const resp = await HttpClient.get('/public/data/city?search=&country_id=' + q)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    const code = resp.data.cities
    getComboCity(code)
  }

  const handleChangeCategory = (value: any) => {
    if (value !== '') {
      HttpClient.get(`/public/data/role-type?search=&page=1&take=250&category_id=` + value.id).then(response => {
        if (response.status != 200) {
          throw response.data.message ?? 'Something went wrong!'
        }
        getRoleType(response.data.roleTypes.data)
      })
    }

    if (value !== '') {
      setCatId(value.id)
      if (value.employee_type != 'onship') {
        searchcity(100)
      } else {
        setTypeId(0)
      }
    } else {
      setCatId(0)
    }
  }

  const onSubmit = async (formData: Job) => {
    const { contractDuration, experience, salary_end, salary_start, text_role } = formData

    let type = TypeId == 0 ? TypeId.inputValue : TypeId
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
      rolelevel_id: LevelId == 0 ? null : LevelId,
      roletype_id: type,
      edugrade_id: EduId == 0 ? null : EduId,
      category_id: CatId == 0 ? null : CatId,
      country_id: CouId == 0 ? null : CouId,
      city_id: CitId,
      license: [...license, ...licenseCop],
      salary_start: salary_start,
      salary_end: salary_end,
      currency: currency, // value => "idr" or "dolar" (baru)
      payment_periode: paymentPeriode,
      experience: experience,
      experience_type: 'year',
      sailing_region: Sail,
      employment_type: Employmenttype,
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
      hide_salary: checked
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

  const clear = () => {
    setEduId(0)
    setLevelId(0)
    setTypeId(0)
    setVesselId(0)
    setCatId(0)
    setCouId(100)
    setCitId('')
    setSail('')
    setEmploymenttype('')

    setLicense([])
    setLicenseCop([])
    setDate(new Date())

    setJobCategories([])
    getEducation([])
    getRoleType([])
    getRoleLevel([])
    getComboCountry([])
    getComboCity([])

    setRotational('')

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
          <Typography variant='body2'>Fulfill your Job Info here </Typography>
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
          <Grid item md={4} xs={12} sx={{ mb: 1 }}>
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
          <Grid item md={4} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              freeSolo
              id='combo-box-level'
              options={RoleType}
              //getOptionLabel={(option: RoleType | string) => (typeof option === 'string' ? option : option.name)}
              renderInput={params => <TextField {...params} label='Job Title' {...register('text_role')} />}
              onChange={(event: any, newValue: RoleType | RoleTypeAutocomplete | null | string) =>
                typeof newValue === 'string' ? setTypeId(0) : newValue?.id ? setTypeId(newValue.id) : setTypeId(0)
              }
              getOptionLabel={(option: string | RoleTypeAutocomplete) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue
                }

                // Regular option
                return option.name
              }}
              filterOptions={(options: any, params) => {
                const filtered = filter(options, params)

                const { inputValue } = params

                // Suggest the creation of a new value
                const isExisting = options.some((option: RoleTypeAutocomplete) => inputValue === option.name)
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue: inputValue,
                    id: 0,
                    category_id: 0,
                    name: inputValue,
                    category: CatId,
                    user: session.id,
                    created_at: String(new Date()),
                    updated_at: String(new Date())
                  })
                }

                return filtered
              }}
            />
          </Grid>
          <Grid item md={4} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-level'
              options={RoleLevel}
              getOptionLabel={(option: RoleLevel) => option.levelName}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Role Level'
                  {...register('rolelevel')}
                  error={Boolean(errors.rolelevel)}
                />
              )}
              onChange={(event: any, newValue: RoleLevel | null) =>
                newValue?.id ? setLevelId(newValue.id) : setLevelId(0)
              }
            />
          </Grid>
        </Grid>
        <Grid container columnSpacing={'1'} rowSpacing={'2'} sx={{ mt: 1 }}>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={combocountry}
              getOptionLabel={(option: any) => option.nicename}
              renderInput={params => <TextField {...params} label='Country' />}
              onChange={(event: any, newValue: Countries | null) =>
                newValue?.id ? searchcity(newValue.id) : searchcity(0)
              }
            />
          </Grid>
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='city'
              options={combocity}
              getOptionLabel={(option: City) => option.city_name}
              renderInput={params => <TextField {...params} label='City' />}
              onChange={(event: any, newValue: City | null) =>
                newValue?.id ? setCitId(newValue?.id.toString()) : setCitId('')
              }
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={Education}
              {...register('degree')}
              getOptionLabel={(option: Degree) => option.name}
              renderInput={params => <TextField {...params} label='Education' />}
              onChange={(event: any, newValue: Degree | null) => (newValue?.id ? setEduId(newValue.id) : setEduId(0))}
            />
          </Grid>
        </Grid>
        <Grid container columnSpacing={'1'} rowSpacing={'2'} sx={{ mt: 1 }}>
          <Grid item md={6} xs={12} sx={{ mb: 1 }}>
            <TextField
              id='experience'
              defaultValue={1}
              label='Experience (Year)'
              variant='outlined'
              fullWidth
              type='number'
              {...register('experience')}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mb: 1 }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={employmentType}
              getOptionLabel={(option: any) => option.name}
              renderInput={params => <TextField {...params} label='Employment Type' />}
              onChange={(event: any, newValue: any | null) =>
                newValue?.name ? setEmploymenttype(newValue.name) : setEmploymenttype('')
              }
            />
          </Grid>
        </Grid>
        <Grid container columnSpacing={'1'} rowSpacing={'2'} sx={{ mt: 1 }}>
          <Grid item md={3} xs={12} sx={{ mb: 1, display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '150px' }}>
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
                    checked={isFixedSalary}
                    onChange={event => setIsFixedSalary(event.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label='Fixed Salary'
                sx={{ width: '150px' }}
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
          <Grid item md={3} xs={12} sx={{ mb: 1, display: 'flex', gap: 2 }}>
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
          <Grid item md={3} xs={12} sx={{ mb: 1 }}>
            <TextField
              defaultValue={0}
              id='salary_end'
              type='number'
              label='Salary Range To'
              variant='outlined'
              fullWidth
              {...register('salary_end')}
              disabled={isFixedSalary}
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

export default FormAddNonSeafarer
