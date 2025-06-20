import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Job from 'src/contract/models/job'
import JobCategory from 'src/contract/models/job_category'
import { HttpClient } from 'src/services'
import Licensi from 'src/contract/models/licensi'
import RoleType from 'src/contract/models/role_type'
import City from 'src/contract/models/city'
import VesselType from 'src/contract/models/vessel_type'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import EditorArea from 'src/@core/components/react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AppConfig } from 'src/configs/api'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { FormDataSeafarer } from 'src/contract/types/create_job_type'
import { JobDraft } from '../Component'
import BoostJobAlert from '../BoostJobAlert'
import { useAuth } from 'src/hooks/useAuth'

const sailRegion = [
  { id: 'ncv', label: 'Near Coastal Voyage (NCV)' },
  { id: 'iv', label: 'International Voyage' }
]

const currency = [
  { id: 'IDR', label: 'IDR' },
  { id: 'USD', label: 'USD' }
]

const paymentPeriodeItem = [
  { id: 'Monthly', label: 'Monthly' },
  { id: 'Daily', label: 'Daily' }
]

const rotational = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' }
]

const schema = yup.object().shape({
  jobCategory: yup.number().required()
})

// const DRAFT_KEY = 'create-job-seafarer'

const SeafarerJob = ({ job, type }: { job?: Job; type: 'create' | 'edit' }) => {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataSeafarer>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { abilities, user } = useAuth()
  const router = useRouter()

  const [onLoading, setOnLoading] = useState(false)
  const [jobCategory, setJobCategory] = useState<JobCategory[] | null>(null)
  const [roleType, setRoleType] = useState<RoleType[] | null>(null)
  const [vessel, setVessel] = useState<VesselType[] | null>(null)
  const [city, setCity] = useState<City[] | null>(null)
  const [jobDescription, setJobDescription] = useState(EditorState.createEmpty())
  const [licenseCOC, setLicenseCOC] = useState<Licensi[] | null>()
  const [licenseCOP, setLicenseCOP] = useState<Licensi[] | null>()

  const today = new Date().toISOString().slice(0, 10)
  const statusBoost = job?.is_boosted && job?.end_booster_date >= today
  const [fixPrice, setFixPrice] = useState<boolean>(false)
  const [hidePrice, setHidePrice] = useState<boolean>(false)
  const [isDraft, setIsDraft] = useState<boolean>(false)
  const [isBoosted, setIsBoosted] = useState<boolean>(statusBoost as boolean)
  const [isSubs, setIsSubs] = useState<boolean>(false)
  const [totalJobPosted, setTotalJobPosted] = useState(0)

  useEffect(() => {
    if (job && job.is_draft === true) {
      setIsDraft(true)
    }
  }, [])

  //   const clearDraft = () => {
  //     if (type === 'create') {
  //       localStorage.removeItem(DRAFT_KEY)
  //     }
  //   }

  const getTotalJobPosted = async () => {
    try {
      const response = await HttpClient.get('/job', {
        page: 1,
        take: 1000,
        is_active: true
      })

      const ujp = abilities?.items.find(f => f.code === 'UJP')
      const usedCounter = response.data.jobs.total > (ujp?.used ?? 0) ? response.data.jobs.total : ujp?.used
      setTotalJobPosted(usedCounter)
    } catch (error) {
      console.error('Error fetching  jobs:', error)
    }
  }

  const populateData = () => {
    if (type === 'create') {
      //   const draftData = localStorage.getItem(DRAFT_KEY)
      //   if (draftData) {
      //     const isPopulate = confirm('Lanjutkan draft job posting anda?')
      //     if (isPopulate) {
      //       const parsedData = JSON.parse(draftData)
      //       Object.keys(parsedData).forEach(key => {
      //         setValue(key as keyof FormDataSeafarer, parsedData[key])
      //       })
      //       if (parsedData.jobDescription) {
      //         const contentState = ContentState.createFromText(parsedData.jobDescription)
      //         setJobDescription(EditorState.createWithContent(contentState))
      //       }
      //       setFixPrice(parsedData.fixPrice || false)
      //       setHidePrice(parsedData.hidePrice || false)
      //     } else {
      //       clearDraft()
      //     }
      //   }
    } else if (type === 'edit' && job) {
      setValue('jobCategory', job.category_id)
      setValue('jobTitle', job.job_title)
      setValue('roleType', job.roletype_id)
      setValue('sailRegion', job.sailing_region)
      setValue('experience', job.experience)
      setValue('city', job.city_id)
      setValue('contractDuration', job.contract_duration)
      setValue('vessel', job.vesseltype_id)
      setValue('dateOnBoard', job.onboard_at)
      setValue('rotational', job.rotational ? 'yes' : 'no')
      setValue(
        'licenseCOC',
        job.license.filter((l: any) => l.parent == 'COC')
      )
      setValue(
        'licenseCOP',
        job.license.filter((l: any) => l.parent == 'COP')
      )
      setValue('currency', job.currency)
      setValue('payment_periode', job.payment_periode)
      setValue('minimum', Number(job.salary_start))
      setValue('maximum', Number(job.salary_end))
      if (job.description) {
        const contentBlock = convertFromHTML(job.description).contentBlocks
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock)
          const editorState = EditorState.createWithContent(contentState)
          setJobDescription(editorState)
        }
      }
      setFixPrice(job.salary_start === job.salary_end)
      setHidePrice(job.hide_salary ? true : false)
    }
  }

  const firstLoad = () => {
    HttpClient.get(AppConfig.baseUrl + '/job-category', {
      page: 1,
      take: 1000,
      employee_type: 'onship'
    }).then(async response => {
      const data: JobCategory[] = await response.data.categories.data
      setJobCategory(data)
    })
    HttpClient.get(AppConfig.baseUrl + '/public/data/city?country_id=100').then(response => {
      const data = response.data.cities
      setCity(data)
    })
    HttpClient.get(AppConfig.baseUrl + '/public/data/vessel-type?page=1&take=1000').then(async response => {
      const data: VesselType[] = await response.data.vesselTypes.data
      setVessel(data)
    })
    HttpClient.get(AppConfig.baseUrl + '/licensi/all').then(async response => {
      const coc: Licensi[] = await response.data.licensiescoc
      const cop: Licensi[] = await response.data.licensiescop
      setLicenseCOC(coc)
      setLicenseCOP(cop)
    })
    setIsBoosted(false)
  }

  const selectJobCategory = watch('jobCategory') === 0 ? undefined : watch('jobCategory')
  const getRoleType = () => {
    HttpClient.get(AppConfig.baseUrl + '/public/data/role-type', {
      page: 1,
      take: 1000,
      employee_type: 'onship',
      category_id: selectJobCategory
    }).then(async response => {
      const data: RoleType[] = await response.data.roleTypes.data
      setRoleType(data)
    })
  }

  useEffect(() => {
    firstLoad()
    getRoleType()
    populateData()
  }, [job])

  useEffect(() => {
    setIsSubs(abilities?.plan_type !== 'BSC-ALL')
    getTotalJobPosted()
  }, [user, abilities])

  useEffect(() => {
    getRoleType()
  }, [selectJobCategory])

  useEffect(() => {
    if (fixPrice) {
      setValue('maximum', 0)
    }
  }, [fixPrice])

  //   const watchedDraft = watch()
  //   useEffect(() => {
  //     if (type === 'create') {
  //       const saveDraft = {
  //         ...watchedDraft,
  //         jobDescription: jobDescription.getCurrentContent().getPlainText(),
  //         fixPrice,
  //         hidePrice
  //       }
  //       localStorage.setItem(DRAFT_KEY, JSON.stringify(saveDraft))
  //     }
  //   }, [watchedDraft, jobDescription, fixPrice, hidePrice])

  const onSubmit = (data: FormDataSeafarer) => {
    const {
      jobCategory,
      jobTitle,
      roleType,
      sailRegion,
      experience,
      city,
      contractDuration,
      vessel,
      dateOnBoard,
      rotational,
      licenseCOC,
      licenseCOP,
      currency,
      payment_periode,
      minimum,
      maximum
    } = data

    const description = jobDescription.getCurrentContent()
    const onboardDate = dateOnBoard
      ? new Date(dateOnBoard)
          ?.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          .split('/')
          .reverse()
          .join('-')
      : undefined

    const json = {
      is_draft: isDraft,
      is_active: isDraft ? false : true,
      employment_type: 'contract',
      work_arrangement: 'On-Site',
      category_id: jobCategory,
      job_title: jobTitle,
      roletype_id: roleType,
      sailing_region: sailRegion,
      experience: experience,
      country_id: 100,
      city_id: city,
      contract_duration: contractDuration,
      vesseltype_id: vessel,
      onboard_at: onboardDate,
      rotational,
      license: [...(licenseCOC || []), ...(licenseCOP || [])],
      description: description.hasText() ? draftToHtml(convertToRaw(description)) : '<p></p>',
      currency: currency,
      payment_periode: payment_periode,
      salary_start: minimum,
      salary_end: maximum,
      hide_salary: hidePrice,
      is_boosted: isBoosted
    }

    setOnLoading(true)
    if (type === 'edit' && job) {
      HttpClient.patch(`/job/${job.id}`, json)
        .then(
          () => {
            toast.success(`${isDraft ? 'Draft' : jobTitle} edited successfully!`)
            router.push('/company/job-management')
          },
          error => {
            toast.error('Failed to save job: ' + error.response.data.message)
          }
        )
        .finally(() => setOnLoading(false))
    } else {
      HttpClient.post('/job', json)
        .then(
          () => {
            // clearDraft()
            toast.success(`${isDraft ? 'Draft' : jobTitle} submited successfully!`)
            router.push('/company/job-management')
          },
          error => {
            toast.error('Failed to save job: ' + error.response.data.message)
            console.log(error)
          }
        )
        .finally(() => setOnLoading(false))
    }
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        flexDirection='column'
        gap='40px'
        sx={{ backgroundColor: '#FFF', borderRadius: '8px', p: '24px' }}
      >
        {type === 'edit' && job?.is_draft === true && <JobDraft />}
        <Grid item container flexDirection='column' gap='24px'>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '24px' }}>
            <FormControl fullWidth error={!!errors.jobCategory}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Job Category <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='jobCategory'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={jobCategory || []}
                    getOptionLabel={option => option.name || ''}
                    value={jobCategory?.find(data => data.id === field.value) || null}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Job Category'
                        error={!!errors.jobCategory}
                        helperText={errors.jobCategory?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.jobTitle}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Job Title <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='jobTitle'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size='small'
                    placeholder='Job Title'
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '24px' }}>
            <FormControl fullWidth error={!!errors.roleType}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>Job Rank</Typography>
              <Controller
                name='roleType'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={roleType || []}
                    getOptionLabel={option => option.name || ''}
                    value={roleType?.find(data => data.id === field.value) || null}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Job Rank'
                        error={!!errors.roleType}
                        helperText={errors.roleType?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.sailRegion}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>Sail Region</Typography>
              <Controller
                name='sailRegion'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={sailRegion || []}
                    getOptionLabel={option => option.label || ''}
                    value={sailRegion?.find(data => data.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id || '')
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Sail Region'
                        error={!!errors.sailRegion}
                        helperText={errors.sailRegion?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '24px' }}>
            <FormControl fullWidth error={!!errors.experience}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Sea Service{' '}
                <Tooltip
                  title='Minimum number of contracts the candidate must have completed to qualify for this job.'
                  placement='top-start'
                >
                  <Icon icon='ph:info-bold' />
                </Tooltip>{' '}
                <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='experience'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={field.value || ''}
                    size='small'
                    placeholder='Minimum Number of Contracts Required'
                    type='number'
                    inputProps={{ min: 0 }}
                    error={!!errors.experience}
                    helperText={errors.experience?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.city}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Interview Location
              </Typography>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={city || []}
                    getOptionLabel={option => option.city_name || ''}
                    value={city?.find(data => data.id === field.value) || null}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Interview Location'
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.city_name}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '24px' }}>
            <FormControl fullWidth error={!!errors.contractDuration}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Contract Duration{' '}
                <Tooltip title='Specify the duration of the contract in months period.' placement='top-start'>
                  <Icon icon='ph:info-bold' />
                </Tooltip>{' '}
              </Typography>
              <Controller
                name='contractDuration'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={field.value || ''}
                    size='small'
                    placeholder='Contract Duration (Months)'
                    type='number'
                    inputProps={{ min: 0 }}
                    error={!!errors.contractDuration}
                    helperText={errors.contractDuration?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.vessel}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>Vessel Type</Typography>
              <Controller
                name='vessel'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={vessel || []}
                    getOptionLabel={option => option.name || ''}
                    value={vessel?.find(data => data.id === field.value) || null}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Vessel Type'
                        error={!!errors.vessel}
                        helperText={errors.vessel?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '24px' }}>
            <FormControl fullWidth error={!!errors.dateOnBoard}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Date of Board <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='dateOnBoard'
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      {...field}
                      format='DD/MM/YYYY'
                      openTo='year'
                      views={['year', 'month', 'day']}
                      minDate={moment(new Date())}
                      value={field.value ? moment(field.value) : null}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!errors.dateOnBoard,
                          helperText: errors.dateOnBoard?.message
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.rotational}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>Rotational</Typography>
              <Controller
                name='rotational'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={rotational || []}
                    getOptionLabel={option => option.label || ''}
                    value={rotational?.find(data => data.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id || '')
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Rotational'
                        error={!!errors.rotational}
                        helperText={errors.rotational?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
          </Box>
        </Grid>
        <Divider />
        <Grid item container flexDirection='column' gap='24px'>
          <Box flexDirection='column' gap='8px'>
            <Typography sx={{ color: '#404040', fontSize: 16, fontWeight: 700 }}>Mandatory Certificates</Typography>
            <Typography sx={{ color: '#868686', fontSize: 12, fontWeight: 400 }}>
              Add this certificate to attract people who meet your qualifications.
            </Typography>
          </Box>
          <FormControl fullWidth error={!!errors.licenseCOC}>
            <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
              Certificate of Competency
            </Typography>
            <Controller
              name='licenseCOC'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={licenseCOC || []}
                  filterSelectedOptions
                  getOptionLabel={option => option.title || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, newValue) => {
                    field.onChange(newValue)
                  }}
                  renderInput={field => (
                    <TextField
                      {...field}
                      size='small'
                      placeholder='Certificate of Competency'
                      error={!!errors.licenseCOC}
                      helperText={errors.licenseCOC?.message}
                    />
                  )}
                  renderOption={(props, option) => (
                    <MenuItem {...props} key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  )}
                  noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth error={!!errors.licenseCOP}>
            <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
              Certificate of Proficiency
            </Typography>
            <Controller
              name='licenseCOP'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={licenseCOP || []}
                  filterSelectedOptions
                  getOptionLabel={option => option.title || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, newValue) => {
                    field.onChange(newValue)
                  }}
                  renderInput={field => (
                    <TextField
                      {...field}
                      size='small'
                      placeholder='Certificate of Proficiency'
                      error={!!errors.licenseCOP}
                      helperText={errors.licenseCOP?.message}
                    />
                  )}
                  renderOption={(props, option) => (
                    <MenuItem {...props} key={option.id} value={option.id}>
                      {option.title}
                    </MenuItem>
                  )}
                  noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                />
              )}
            />
          </FormControl>
        </Grid>
        <Divider />
        <Grid item container flexDirection='column' gap='24px'>
          <Typography sx={{ color: '#404040', fontSize: 16, fontWeight: 700 }}>Add a job description</Typography>
          <EditorWrapper>
            <EditorArea
              editorState={jobDescription}
              onEditorStateChange={data => setJobDescription(data)}
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
        </Grid>
        <Divider />
        <Grid item container flexDirection='column' gap='24px'>
          <Typography sx={{ color: '#404040', fontSize: 16, fontWeight: 700 }}>Salary</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '24px' }}>
            <FormControl fullWidth error={!!errors.currency}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Currency <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='currency'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={currency || []}
                    getOptionLabel={option => option.label || ''}
                    value={currency?.find(data => data.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id || '')
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Currency'
                        error={!!errors.currency}
                        helperText={errors.currency?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.payment_periode}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Payment Periode <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='payment_periode'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    autoHighlight
                    options={paymentPeriodeItem || []}
                    getOptionLabel={option => option.label || ''}
                    value={paymentPeriodeItem?.find(data => data.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id || '')
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={field => (
                      <TextField
                        {...field}
                        size='small'
                        placeholder='Payment Periode'
                        error={!!errors.payment_periode}
                        helperText={errors.payment_periode?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    )}
                    noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.minimum}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                {fixPrice ? 'Salary ' : 'Minimum Salary '}
                <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='minimum'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={field.value || ''}
                    size='small'
                    placeholder={fixPrice ? 'Salary' : 'Minimum Price'}
                    type='number'
                    inputProps={{ min: 0 }}
                    error={!!errors.minimum}
                    helperText={errors.minimum?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.maximum}>
              <Typography sx={{ mb: '8px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                Maximum <span style={{ color: '#F22' }}>*</span>
              </Typography>
              <Controller
                name='maximum'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={fixPrice}
                    value={field.value || ''}
                    size='small'
                    placeholder='Maximum Price'
                    type='number'
                    inputProps={{ min: 0 }}
                    error={!!errors.maximum}
                    helperText={errors.maximum?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
          <FormControlLabel
            sx={{ my: '-4px' }}
            control={<Checkbox checked={fixPrice} onChange={event => setFixPrice(event.target.checked)} />}
            label='Fixed Salary'
          />
          <FormControlLabel
            sx={{ my: '-4px' }}
            control={<Checkbox checked={hidePrice} onChange={event => setHidePrice(event.target.checked)} />}
            label='Hide Salary'
          />
        </Grid>
        <BoostJobAlert setIsBoosted={setIsBoosted} currentJob={job} isBoosted={isBoosted} />
        <Grid item container sx={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'right' }}>
          <Typography component={Link} href='/company/job-management' sx={{ color: '#868686', fontSize: 14 }}>
            Cancel
          </Typography>
          {(type === 'create' || isDraft === true) && (
            <Button
              type='submit'
              onClick={async () => {
                await setIsDraft(true)
                handleSubmit(onSubmit)
              }}
              variant='outlined'
              size='small'
              disabled={onLoading}
              sx={{
                color: '#0B58A6',
                fontSize: 14,
                fontWeight: 400,
                border: '1px solid #0B58A6',
                textTransform: 'none'
              }}
            >
              {onLoading ? <CircularProgress size={22} /> : 'Save as Draft'}
            </Button>
          )}
          <Button
            type='submit'
            onClick={async () => {
              await setIsDraft(false)
              handleSubmit(onSubmit)
            }}
            variant='contained'
            size='small'
            disabled={onLoading || (type === 'edit' ? !isSubs && totalJobPosted > 5 : !isSubs && totalJobPosted >= 5)}
            sx={{ fontSize: 14, fontWeight: 400, textTransform: 'none' }}
          >
            {onLoading ? <CircularProgress size={22} /> : 'Post Job'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default SeafarerJob
