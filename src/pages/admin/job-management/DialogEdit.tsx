import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { HttpClient } from 'src/services'
import { getCleanErrorMessage } from 'src/utils/helpers'
import { CircularProgress, Autocomplete, FormControlLabel, Checkbox, createFilterOptions } from '@mui/material'
import Job from 'src/contract/models/job'
import Company from 'src/contract/models/company'
import Degree from 'src/contract/models/degree'
import JobCategory from 'src/contract/models/job_category'
import RoleLevel from 'src/contract/models/role_level'
import RoleType, { RoleTypeAutocomplete } from 'src/contract/models/role_type'
import Countries from 'src/contract/models/country'
import City from 'src/contract/models/city'
import { DateType } from 'src/contract/models/DatepickerTypes'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

import EditorArea from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import VesselType from 'src/contract/models/vessel_type'
import Licensi from 'src/contract/models/licensi'

const filter = createFilterOptions<RoleTypeAutocomplete>()

// const licenseData = [
//   { title: 'Certificate of Competency', docType: 'COC' },
//   { title: 'Certificate of Profeciency', docType: 'COP' },
//   { title: 'Certificate of Recognition', docType: 'COR' },
//   { title: 'Certificate of Endorsement', docType: 'COE' },
//   { title: 'MCU Certificates', docType: 'MCU' }
// ]

const SailRegion = [
  { id: 'ncv', name: 'Near Coastal Voyage (NCV)' },
  { id: 'iv', name: 'International Voyage' }
]

const EMPLOYMENT_TYPE_OPTIONS = [{ name: 'Intern' }, { name: 'Contract' }, { name: 'Full-Time' }]

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

type EditProps = {
  selectedItem: Job
  visible: boolean
  onCloseClick: VoidFunction
  onStateChange: VoidFunction
}

const DialogEdit = (props: EditProps) => {
  const [onLoading, setOnLoading] = useState(false)
  const [User, setUser] = useState(props.selectedItem?.company)
  const [Edu, setEdu] = useState(props.selectedItem?.degree)
  const [Level, setLevel] = useState(props.selectedItem?.rolelevel)
  const [Type, setType] = useState<any>(props.selectedItem?.role_type)
  const [Cat, setCat] = useState<any>(props.selectedItem?.category)
  const [Cou, setCou] = useState<any>(props.selectedItem?.country)
  const [Cit, setCit] = useState<any>(props.selectedItem?.city)
  const [license, setLicense] = useState<any>(props.selectedItem?.license.filter((l: any) => l.parent == 'COC'))
  const [licenseCop, setLicenseCop] = useState<any[]>(props.selectedItem?.license.filter((l: any) => l.parent == 'COP'))
  const onboard = props.selectedItem?.onboard_at ? new Date(props.selectedItem?.onboard_at) : new Date()
  const [date, setDate] = useState<DateType>(onboard)
  const [jobTitle, setJobTitle] = useState(props.selectedItem.job_title || '')
  const [Sail, setSail] = useState(
    props.selectedItem?.sailing_region == 'ncv'
      ? { id: 'ncv', name: 'Near Coastal Voyage (NCV)' }
      : props.selectedItem?.sailing_region == 'iv'
      ? { id: 'iv', name: 'International Voyage' }
      : null
  )
  const [VesselType, getVesselType] = useState<any[]>([])
  const [Vessel, setVessel] = useState(props.selectedItem?.vessel_type)
  const [licenseData, getlicenseData] = useState<Licensi[]>([])
  const [licenseDataCOP, getlicenseDataCOP] = useState<Licensi[]>([])
  const [currency, setCurrency] = useState<any>({
    label: props.selectedItem.currency,
    value: props.selectedItem.currency
  })
  const [paymentPeriode, setPaymentPeriode] = useState<any>({
    label: props.selectedItem.payment_periode,
    value: props.selectedItem.payment_periode
  })
  const [checked, setChecked] = useState(props.selectedItem.hide_salary)
  const [rotational, setRotational] = useState(
    props?.selectedItem?.rotational ? { value: 'yes', label: 'Yes' } : { value: 'no', label: 'No' }
  )
  const [Employmenttype, setEmploymenttype] = useState<any>({ name: props.selectedItem?.employment_type })

  const [JobCategory, getJobCategory] = useState<any[]>([])
  const [Education, getEducation] = useState<any[]>([])
  const [RoleLevel, getRoleLevel] = useState<any[]>([])
  const [RoleType, getRoleType] = useState<any[]>([])
  const [Company, getCompany] = useState<any[]>([])
  const [combocountry, getComboCountry] = useState<any[]>([])
  const [combocity, getComboCity] = useState<any[]>([])

  const contenDesc = convertFromHTML(props.selectedItem?.description).contentBlocks
  const contentState = ContentState.createFromBlockArray(contenDesc)
  const editorState = EditorState.createWithContent(contentState)
  const [desc, setDesc] = useState(editorState)

  const [disabled, setDisabled] = useState(props.selectedItem.category.employee_type == 'onship' ? true : false)

  const combobox = async () => {
    const resp2 = await HttpClient.get(`/licensi/all`)
    if (resp2.status != 200) {
      throw resp2.data.message ?? 'Something went wrong!'
    }

    getlicenseData(resp2.data.licensiescoc)
    getlicenseDataCOP(resp2.data.licensiescop || [])

    HttpClient.get(`/user-management?page=1&take=250&team_id=3`).then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getCompany(response.data.users.data)
    })

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
      if (props.selectedItem.category.employee_type == 'onship') {
        const filterOnshipCategories = rawData.filter(item => item.employee_type == 'onship')
        getJobCategory(filterOnshipCategories)
      } else {
        const filterOffshipCategories = rawData.filter(item => item.employee_type == 'offship')
        getJobCategory(filterOffshipCategories)
      }
    })

    HttpClient.get('/public/data/vessel-type?page=1&take=250&search=').then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getVesselType(response.data.vesselTypes.data)
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
  }

  useEffect(() => {
    combobox()
  }, [])

  const { register, handleSubmit } = useForm<Job>({
    mode: 'onBlur'
  })

  const searchcity = async (q: any) => {
    const setDataCountry = combocountry.find(c => c.id === q.id)
    setCou(setDataCountry)
    const resp = await HttpClient.get('/public/data/city?search=&country_id=' + q.id)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    const code = resp.data.cities
    getComboCity(code)
  }

  const onSubmit = async (formData: Job) => {
    const { salary_start, salary_end, experience, job_title, contractDuration } = formData
    let type: any = ''
    type = Type.id
    // if (disabled == true) {
    //   type = Type.id
    // }

    let sailfix = Sail
    if (disabled == false) {
      sailfix = null
    }

    const categoryEmployeeType = props.selectedItem?.category?.employee_type

    const json = {
      rolelevel_id: Level == null ? null : Level.id,
      roletype_id: type == 0 ? Type.inputValue : type,
      user_id: User.id,
      edugrade_id: Edu == null ? null : Edu.id,
      category_id: Cat == null ? null : Cat.id,
      country_id: Cou == null ? null : Cou.id,
      city_id: Cit == null ? null : Cit.id,
      license: [...license, ...licenseCop],
      sailing_region: sailfix == null ? null : Sail?.id,
      vesseltype_id: Vessel == null ? null : Vessel.id,
      salary_start: salary_start,
      salary_end: salary_end,
      currency: currency?.value,
      payment_periode: paymentPeriode?.value,
      experience: experience,
      experience_type: categoryEmployeeType == 'onship' ? 'contract' : 'year',
      employment_type: Employmenttype?.name,
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
      contract_duration: contractDuration ? contractDuration : null,
      rotational: rotational.value, // value => yer or no (baru)
      hide_salary: checked,
      job_title: job_title
    }

    setOnLoading(true)
    try {
      const resp = await HttpClient.patch(`/job/${props.selectedItem.id}`, json)
      if (resp.status != 200) {
        throw resp.data.message ?? 'Something went wrong!'
      }

      props.onCloseClick()
      toast.success(`Updated successfully!`)
    } catch (error) {
      toast.error(`Opps ${getCleanErrorMessage(error)}`)
    }

    setOnLoading(false)
    props.onStateChange()
  }

  const handlecategory = (q: JobCategory | null) => {
    if (q !== null) {
      HttpClient.get(`/public/data/role-type?search=&page=1&take=250&category_id=` + q.id).then(response => {
        if (response.status != 200) {
          throw response.data.message ?? 'Something went wrong!'
        }
        getRoleType(response.data.roleTypes.data)
      })
    }

    if (q !== null) {
      setCat(q)
      if (q.employee_type == 'onship') {
        setDisabled(true)
        setType(null)
      } else {
        setDisabled(false)
        searchcity({ id: 100 })
      }
    } else {
      setCat(null)
    }
  }

  const handleChangeRotational = (newValue: any) => {
    if (newValue) {
      setRotational(newValue)
    }
  }

  return (
    <Dialog
      fullWidth
      open={props.visible}
      maxWidth='md'
      scroll='body'
      onClose={props.onCloseClick}
      TransitionComponent={Transition}
    >
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
            onClick={props.onCloseClick}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant='body2' color={'#32487A'} fontWeight='600' fontSize={18}>
              Edit Job
            </Typography>
            <Typography variant='body2'>Fulfill your Job Info here</Typography>
          </Box>
          <Grid container columnSpacing={'1'} rowSpacing={'2'}>
            <Grid item md={12} xs={12}>
              <Autocomplete
                disablePortal
                id='combo-box-company'
                value={User}
                options={Company}
                {...register('company')}
                getOptionLabel={(option: Company) => option.name}
                renderInput={params => <TextField {...params} label='Company' />}
                onChange={(event: any, newValue: Company | null) =>
                  newValue ? setUser(newValue) : setUser(props.selectedItem.company)
                }
              />
            </Grid>
            {disabled == true && (
              <Grid item md={12} xs={12} sx={{ mb: 1 }}>
                <TextField
                  id='job_title'
                  label='Job Title'
                  variant='outlined'
                  fullWidth
                  {...register('job_title')}
                  sx={{ flex: 1 }}
                  value={jobTitle}
                  onChange={event => setJobTitle(event.target.value)}
                />
              </Grid>
            )}
            <Grid item md={3} xs={12}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                value={Cat}
                options={JobCategory}
                {...register('category')}
                getOptionLabel={(option: JobCategory) => option.name}
                renderInput={params => <TextField {...params} label='Job Category' />}
                //   onChange={(event: any, newValue: JobCategory | null) =>
                //     newValue?.id ? setCat(newValue) : setCat(props.selectedItem.category)
                //   }
                onChange={(event: any, newValue: JobCategory | null) =>
                  newValue ? handlecategory(newValue) : handlecategory(null)
                }
              />
            </Grid>
            {disabled == true ? (
              // for onship
              <>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    disablePortal
                    id='combo-box-type'
                    value={Type || null}
                    options={RoleType}
                    {...register('role_type')}
                    getOptionLabel={(option: RoleType) => option.name}
                    renderInput={params => <TextField {...params} label='Job Rank' />}
                    onChange={(event: any, newValue: RoleType | null) =>
                      newValue ? setType(newValue) : setType(props.selectedItem.role_type)
                    }
                  />
                </Grid>
              </>
            ) : (
              // for offship
              <>
                <Grid item md={4} xs={12}>
                  <Autocomplete
                    disablePortal
                    id='combo-box-type'
                    value={Type || null}
                    options={RoleType}
                    {...register('role_type')}
                    // getOptionLabel={(option: RoleType) => option.name}
                    renderInput={params => <TextField {...params} label='Job Title' />}
                    onChange={(event: any, newValue: any) => {
                      newValue ? setType(newValue) : setType(props.selectedItem.role_type)
                    }}
                    getOptionLabel={(option: RoleTypeAutocomplete) => {
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
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params)

                      const { inputValue } = params

                      // Suggest the creation of a new value
                      const isExisting = options.some(option => inputValue === option.name)
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue: inputValue,
                          id: 0,
                          category_id: 0,
                          name: inputValue,
                          category: Cat,
                          user: props.selectedItem,
                          created_at: String(new Date()),
                          updated_at: String(new Date())
                        })
                      }

                      return filtered
                    }}
                  />
                </Grid>
              </>
            )}

            {disabled == false && (
              <Grid item md={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id='combo-box-level'
                  value={Level}
                  options={RoleLevel}
                  getOptionLabel={(option: RoleLevel) => option?.levelName}
                  renderInput={params => <TextField {...params} label='Role Level' />}
                  onChange={(event: any, newValue: RoleLevel | null) =>
                    newValue ? setLevel(newValue) : setLevel(props.selectedItem.rolelevel)
                  }
                />
              </Grid>
            )}

            {disabled == false && (
              <Grid item md={3} xs={12}>
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={combocountry}
                  value={Cou}
                  getOptionLabel={(option: any) => option?.nicename}
                  renderInput={params => <TextField {...params} label='Country' />}
                  onChange={(event: any, newValue: Countries | null) =>
                    newValue?.id ? searchcity(newValue) : searchcity(props.selectedItem.country)
                  }
                />
              </Grid>
            )}

            {disabled == true && (
              <>
                <Grid item md={3} xs={12} sx={{ mb: 1 }}>
                  <Autocomplete
                    disablePortal
                    id='combo-box-demo'
                    options={SailRegion}
                    value={Sail}
                    getOptionLabel={(option: any) => option.name}
                    renderInput={params => <TextField {...params} label='Sail Region' />}
                    onChange={(event: any, newValue: any | null) => (newValue ? setSail(newValue) : setSail(null))}
                  />
                </Grid>
                <Grid item md={3} xs={12} sx={{ mb: 1 }}>
                  <TextField
                    id='experience'
                    defaultValue={props.selectedItem.experience}
                    label='Experience (Contract)'
                    variant='outlined'
                    fullWidth
                    type='number'
                    {...register('experience')}
                    sx={{ flex: 1 }}
                  />
                </Grid>
              </>
            )}

            {disabled == true && (
              <Grid item md={3} xs={12}>
                <Autocomplete
                  disablePortal
                  id='combo-box-city'
                  options={combocity}
                  value={Cit}
                  getOptionLabel={(option: City) => option.city_name}
                  renderInput={params => <TextField {...params} label='Interview Location' />}
                  onChange={(event: any, newValue: City | null) =>
                    newValue ? setCit(newValue) : setCit(props.selectedItem.city)
                  }
                />
              </Grid>
            )}
            {disabled == false && (
              <Grid item md={3} xs={12}>
                <Autocomplete
                  disablePortal
                  id='combo-box-city'
                  options={combocity}
                  value={Cit}
                  getOptionLabel={(option: City) => option.city_name}
                  renderInput={params => <TextField {...params} label='City' />}
                  onChange={(event: any, newValue: City | null) =>
                    newValue ? setCit(newValue) : setCit(props.selectedItem.city)
                  }
                />
              </Grid>
            )}

            {disabled == true && (
              <>
                <Grid item md={3} xs={12} sx={{ mb: 1 }}>
                  <Autocomplete
                    disablePortal
                    id='combo-box-demo'
                    options={VesselType}
                    value={Vessel}
                    getOptionLabel={(option: VesselType) => option.name}
                    renderInput={params => <TextField {...params} label='Vessel Type' />}
                    onChange={(event: any, newValue: VesselType | null) =>
                      newValue?.id ? setVessel(newValue) : setVessel(props.selectedItem.vessel_type)
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
                <Grid item md={3} xs={12}>
                  <TextField
                    id='contractDuration'
                    label='Contract Duration (Month)'
                    variant='outlined'
                    fullWidth
                    type='number'
                    defaultValue={props.selectedItem.contract_duration}
                    {...register('contractDuration')}
                  />
                </Grid>
              </>
            )}

            {disabled == true && (
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
            )}

            {disabled == false && (
              <>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    disablePortal
                    id='combo-box-degree'
                    value={Edu}
                    options={Education}
                    {...register('degree')}
                    getOptionLabel={(option: Degree) => option.name}
                    renderInput={params => <TextField {...params} label='Education' />}
                    onChange={(event: any, newValue: Degree | null) =>
                      newValue ? setEdu(newValue) : setEdu(props.selectedItem.degree)
                    }
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    defaultValue={props.selectedItem.experience}
                    id='experience'
                    label='Experience (Year)'
                    variant='outlined'
                    fullWidth
                    {...register('experience')}
                  />
                </Grid>
                <Grid item md={6} xs={12} sx={{ mb: 1 }}>
                  <Autocomplete
                    disablePortal
                    id='combo-box-demo'
                    value={Employmenttype}
                    options={EMPLOYMENT_TYPE_OPTIONS}
                    getOptionLabel={(option: any) => option.name}
                    renderInput={params => <TextField {...params} label='Employment Type' />}
                    onChange={(event: any, newValue: any | null) =>
                      newValue ? setEmploymenttype(newValue.name) : setEmploymenttype(null)
                    }
                  />
                </Grid>
              </>
            )}

            <Grid item container xs={12} sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Grid item md={3} xs={12} sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Autocomplete
                    disablePortal
                    id='currency'
                    value={currency}
                    options={[
                      { value: 'IDR', label: 'IDR' },
                      { value: 'USD', label: 'USD' }
                    ]}
                    getOptionLabel={(option: any) => option.label}
                    renderInput={params => <TextField {...params} label='Currency' />}
                    onChange={(event: any, newValue: any | null) => setCurrency(newValue ? newValue : '')}
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
              <Grid item md={3} xs={12} sx={{ mb: 1, display: 'flex', gap: 1 }}>
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
              <Grid item md={3} xs={12} sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <TextField
                  defaultValue={props.selectedItem.salary_start}
                  id='salary_start'
                  label='Salary Range From'
                  variant='outlined'
                  fullWidth
                  {...register('salary_start')}
                />
              </Grid>
              <Grid item md={3} xs={12} sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <TextField
                  defaultValue={props.selectedItem.salary_end}
                  id='salary_end'
                  label='Salary Range To'
                  variant='outlined'
                  fullWidth
                  {...register('salary_end')}
                />
              </Grid>
              {disabled == true && (
                <Grid item md={3} xs={12} sx={{ mb: 1 }}>
                  <Autocomplete
                    disablePortal
                    id='rotational'
                    value={rotational}
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                    getOptionLabel={(option: any) => option.label}
                    renderInput={params => <TextField {...params} label='Rotational' />}
                    onChange={(event: any, newValue: any | null) => handleChangeRotational(newValue)}
                  />
                </Grid>
              )}
            </Grid>

            <Grid item md={12} xs={12}>
              <EditorWrapper>
                <EditorArea
                  placeholder='Description'
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
                />
              </EditorWrapper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' size='small' sx={{ mr: 2 }} type='submit'>
            <Icon fontSize='large' icon={'solar:diskette-bold-duotone'} color={'info'} style={{ fontSize: '18px' }} />
            {onLoading ? <CircularProgress size={25} style={{ color: 'white' }} /> : 'Submit'}
          </Button>
          <Button variant='outlined' size='small' color='error' onClick={props.onCloseClick}>
            <Icon
              fontSize='large'
              icon={'material-symbols:cancel-outline'}
              color={'info'}
              style={{ fontSize: '18px' }}
            />
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogEdit
