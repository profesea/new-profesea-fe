import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { useAuth } from 'src/hooks/useAuth'
import debounce from 'src/utils/debounce'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import Countries from 'src/contract/models/country'
import { toast } from 'react-hot-toast'

type FormData = {
  fullname: string
  username: string
  dateOfBirth: string
  phone: string
  country: number
  gender: string
}

const schema = yup.object().shape({
  fullname: yup.string().required(),
  username: yup.string().required(),
  dateOfBirth: yup.string().required(),
  phone: yup.string().required(),
  country: yup.number().required().moreThan(0, 'Please select a valid country code'),
  gender: yup
    .string()
    .matches(/^(m|f)$/)
    .optional()
})

const BasicInformationOne = ({ nextLink }: { nextLink: string }) => {
  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      fullname: '',
      username: '',
      phone: '',
      country: 0,
      gender: '',
      dateOfBirth: ''
    },
    resolver: yupResolver(schema)
  })

  const router = useRouter()
  const { user, refreshSession } = useAuth()
  const [country, setCountry] = useState<Countries[] | null>(null)

  const username = watch('username')
  const [onLoadingCheck, setOnLoadingCheck] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const time = new Date()

  const firstLoad = async () => {
    await HttpClient.get(AppConfig.baseUrl + '/public/data/country?search=').then(response => {
      const data = response.data.countries
      setCountry(data)
    })

    if (user) {
      setValue('fullname', user.name)
      setValue('username', user.username)
      setValue('phone', user.phone)
      setValue('country', user.country_id)
      setValue('gender', user.gender)
      setValue('dateOfBirth', user.date_of_birth)
    }
  }

  useEffect(() => {
    firstLoad()
  }, [user])

  const usernameCheck = useCallback(
    debounce(username => {
      setOnLoadingCheck(true)
      HttpClient.get(AppConfig.baseUrl + '/user-management/check-username/?username=' + username)
        .then(response => {
          const available = response.data.available
          if (available) {
            setUsernameAvailable(true)
            clearErrors('username')
          } else {
            setUsernameAvailable(false)
            setError('username', {
              type: 'manual',
              message: 'Username is already taken'
            })
          }
        })
        .finally(() => setOnLoadingCheck(false))
    }, 500),
    []
  )

  useEffect(() => {
    if (username && username !== '') {
      usernameCheck(username)
    }
  }, [username])

  const onSubmit = (data: FormData) => {
    setOnLoading(true)
    HttpClient.patch(AppConfig.baseUrl + '/onboarding/user-data', {
      name: data.fullname,
      username: data.username,
      date_of_birth: data.dateOfBirth,
      country_id: data.country,
      phone: data.phone,
      gender: data.gender,
      next_step: 'step-one/2'
    })
      .then(
        async () => {
          toast.success('Successfully save profile')
          await refreshSession()
          router.push(nextLink)
        },
        error => {
          toast.error('Failed to save profile: ' + error.response.data.message)
        }
      )
      .finally(() => setOnLoading(false))
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormControl fullWidth error={!!errors.fullname}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Full Name <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='fullname'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder='Enter your full name'
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth error={!!errors.username}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            User Name <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder='Enter your username'
                error={!!errors.username}
                helperText={
                  usernameAvailable && !onLoadingCheck ? (
                    <span style={{ color: 'green' }}>Username is available</span>
                  ) : (
                    errors.username?.message
                  )
                }
                InputProps={{
                  endAdornment: onLoadingCheck ? (
                    <CircularProgress size={20} />
                  ) : usernameAvailable === true ? (
                    <Icon icon='fluent:presence-available-20-regular' color='green' fontSize={20} />
                  ) : null
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth error={!!errors.dateOfBirth}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Date of Birth <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='dateOfBirth'
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
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth?.message
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </FormControl>
        <Box>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Phone Number <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <FormControl error={!!errors.country}>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <Select {...field} value={field.value || 0}>
                    <MenuItem value={0} disabled>
                      Country
                    </MenuItem>
                    {country &&
                      country.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.iso} (+{item.phonecode})
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.phone}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder='Enter your phone number'
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={{ flexGrow: 1 }}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
        <FormControl fullWidth error={!!errors.gender}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Gender <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='gender'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ display: 'flex', gap: '6px' }}>
                <Box
                  onClick={() => onChange('m')}
                  sx={{
                    p: '10px 24px',
                    border: value === 'm' ? '1px solid #0B58A6' : '1px solid #DBDBDB',
                    backgroundColor: value === 'm' ? '#F2F8FE' : 'transparent',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ color: value === 'm' ? '#0B58A6' : '#BFBFBF', fontSize: 14, fontWeight: 400 }}>
                    Male
                  </Typography>
                </Box>
                <Box
                  onClick={() => onChange('f')}
                  sx={{
                    p: '10px 24px',
                    border: value === 'f' ? '1px solid #0B58A6' : '1px solid #DBDBDB',
                    backgroundColor: value === 'f' ? '#F2F8FE' : 'transparent',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <Typography sx={{ color: value === 'f' ? '#0B58A6' : '#BFBFBF', fontSize: 14, fontWeight: 400 }}>
                    Female
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </FormControl>
      </Box>
      <Box sx={{ my: '32px', display: 'flex', justifyContent: 'flex-end' }}>
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
    </form>
  )
}

export default BasicInformationOne