import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import RoleType from 'src/contract/models/role_type'
import VesselType from 'src/contract/models/vessel_type'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import { toast } from 'react-hot-toast'

type FormData = {
  noExperience: boolean
  company: string
  roleType: number
  vessel: number
  vesselName: string
  grt: number
  dwt: number
  mePower: number
  signIn: string
  signOff: string
}

const schema = yup.object().shape({
  noExperience: yup.boolean().required(),
  company: yup.string().when('noExperience', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  roleType: yup.number().when('noExperience', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  vessel: yup.number().when('noExperience', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  vesselName: yup.string().when('noExperience', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  grt: yup.number().nullable(),
  dwt: yup.number().nullable(),
  mePower: yup.string().nullable(),
  signIn: yup.string().when('noExperience', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  signOff: yup.string().when('noExperience', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  })
})

const SeafarerExperience = ({ beforeLink }: { beforeLink: string }) => {
  const {
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: { noExperience: true },
    resolver: yupResolver(schema)
  })

  const router = useRouter()
  const { user, refreshSession } = useAuth()

  const [onLoading, setOnLoading] = useState(false)
  const [roleType, setRoleType] = useState<RoleType[] | null>(null)
  const [vessel, setVessel] = useState<VesselType[] | null>(null)

  const time = new Date()
  const noExperience = watch('noExperience')

  const firstLoad = async () => {
    HttpClient.get(AppConfig.baseUrl + '/public/data/role-type?page=1&take=1000&employee_type=onship').then(
      async response => {
        const data: RoleType[] = await response.data.roleTypes.data
        setRoleType(data)
      }
    )
    await HttpClient.get(AppConfig.baseUrl + '/public/data/vessel-type?page=1&take=1000').then(async response => {
      const data: VesselType[] = await response.data.vesselTypes.data
      setVessel(data)
    })

    if (user) {
      setValue('noExperience', user.no_experience)
    }
  }

  useEffect(() => {
    firstLoad()
  }, [])

  useEffect(() => {
    if (noExperience === true) {
      reset(undefined, { keepDirtyValues: true })
    }
  }, [noExperience])

  const onSubmit = (data: FormData) => {
    setOnLoading(true)
    HttpClient.patch(AppConfig.baseUrl + '/onboarding/experience-seafarer', {
      no_experience: data.noExperience,
      rank_id: data.roleType,
      vesseltype_id: data.vessel,
      vessel_name: data.vesselName,
      grt: data.grt,
      dwt: data.dwt,
      me_power: data.mePower,
      sign_in: data.signIn,
      sign_off: data.signOff,
      company: data.company
    })
      .then(
        async () => {
          toast.success('Successfully save profile')
          await refreshSession()
          router.push(`/profile/${user?.id}/${user?.username}`)
        },
        error => {
          toast.error('Failed to save profile: ' + error.response.data.message)
        }
      )
      .finally(() => setOnLoading(false))
  }

  const onSkip = () => {
    HttpClient.patch(AppConfig.baseUrl + '/onboarding/complete').then(async response => {
      await toast.success(response.data.message)
      router.push(`/profile/${user?.id}/${user?.username}`)
    })
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormControl error={!!errors.noExperience}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Experience <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='noExperience'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ display: 'flex', gap: '6px' }}>
                <Box
                  onClick={() => onChange(false)}
                  sx={{
                    p: '10px 24px',
                    border: value ? '1px solid #DBDBDB' : '1px solid #0B58A6',
                    backgroundColor: value ? 'transparent' : '#F2F8FE',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ color: value ? '#BFBFBF' : '#0B58A6', fontSize: 14, fontWeight: 400 }}>
                    Yes, I have experience.
                  </Typography>
                </Box>
                <Box
                  onClick={() => onChange(true)}
                  sx={{
                    p: '10px 24px',
                    border: value ? '1px solid #0B58A6' : '1px solid #DBDBDB',
                    backgroundColor: value ? '#F2F8FE' : 'transparent',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ color: value ? '#0B58A6' : '#BFBFBF', fontSize: 14, fontWeight: 400 }}>
                    No, I have no experience.
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </FormControl>
        {!noExperience && (
          <>
            <Typography sx={{ color: '#404040', fontSize: 14, fontWeight: 700 }}>
              Please fill in the details of your sea experience so we can connect you with the right jobs at sea.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormControl fullWidth error={!!errors.company}>
                <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Company <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Controller
                  name='company'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder='Enter the company name'
                      error={!!errors.company}
                      helperText={errors.company?.message}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth error={!!errors.roleType}>
                <Typography sx={{ mb: '6px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Job Rank <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Controller
                  name='roleType'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} value={field.value || 0}>
                      <MenuItem value={0} disabled>
                        Choose Job Rank
                      </MenuItem>
                      {roleType &&
                        roleType.map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl fullWidth error={!!errors.vessel}>
                <Typography sx={{ mb: '6px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Type of Vessel <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Controller
                  name='vessel'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} value={field.value || 0}>
                      <MenuItem value={0} disabled>
                        Choose Vessel
                      </MenuItem>
                      {vessel &&
                        vessel.map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl fullWidth error={!!errors.vesselName}>
                <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Vessel Name <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Controller
                  name='vesselName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder='Enter the name of the vessel'
                      error={!!errors.vesselName}
                      helperText={errors.vesselName?.message}
                    />
                  )}
                />
              </FormControl>
              <Box>
                <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Vessel Information <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '6px' }}>
                  <FormControl error={!!errors.grt}>
                    <Controller
                      name='grt'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder='Enter GRT'
                          error={!!errors.grt}
                          helperText={errors.grt?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl error={!!errors.dwt}>
                    <Controller
                      name='dwt'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder='Enter DWT'
                          error={!!errors.dwt}
                          helperText={errors.dwt?.message}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl error={!!errors.mePower}>
                    <Controller
                      name='mePower'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder='Enter Me power'
                          error={!!errors.mePower}
                          helperText={errors.mePower?.message}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>
              <FormControl fullWidth error={!!errors.signIn}>
                <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Sign in date <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Controller
                  name='signIn'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        {...field}
                        format='DD/MM/YYYY'
                        openTo='year'
                        views={['year', 'month', 'day']}
                        maxDate={moment(time)}
                        value={moment(field.value)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.signIn,
                            helperText: errors.signIn?.message
                          }
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
              <FormControl fullWidth error={!!errors.signOff}>
                <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
                  Sign off date <span style={{ color: '#F22' }}>*</span>
                </Typography>
                <Controller
                  name='signOff'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        {...field}
                        format='DD/MM/YYYY'
                        openTo='year'
                        views={['year', 'month', 'day']}
                        value={moment(field.value)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.signOff,
                            helperText: errors.signOff?.message
                          }
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ my: '32px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          href={beforeLink}
          variant='outlined'
          sx={{
            width: '120px',
            boxShadow: 0,
            color: '#32497A',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#BFBFBF' }
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => onSkip()}>
            <Typography
              sx={{ color: '#999999', fontSize: 14, fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
            >
              Skip
            </Typography>
          </Box>
          <Button
            type='submit'
            variant='contained'
            sx={{
              width: '120px',
              boxShadow: 0,
              color: '#FFF',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#BFBFBF' }
            }}
          >
            {onLoading ? <CircularProgress size={14} /> : 'Continue'}
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default SeafarerExperience