import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

type FormData = {
  province: number
}

const schema = yup.object().shape({
  province: yup.number().required()
})

const LocationPreference = ({ beforeLink, nextLink }: { beforeLink: string; nextLink: string }) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: { province: 0 },
    resolver: yupResolver(schema)
  })

  const router = useRouter()
  const { user, refreshSession } = useAuth()

  const [province, setProvince] = useState<any[]>()
  const [onLoading, setOnLoading] = useState(false)

  const firstLoad = async () => {
    await HttpClient.get(AppConfig.baseUrl + '/public/data/province?country_id=100').then(response => {
      const data = response.data.provinces
      setProvince(data)
    })

    if (user && user.location_province) {
      setValue('province', user.location_province.id)
    }
  }

  useEffect(() => {
    firstLoad()
  }, [])

  const onSubmit = (data: FormData) => {
    setOnLoading(true)
    HttpClient.patch(AppConfig.baseUrl + '/onboarding/preference-location', {
      province_id: data.province,
      next_step: 'step-five'
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
        <FormControl error={!!errors.province}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Kota <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='province'
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                autoHighlight
                options={province || []}
                getOptionLabel={option => option.province_name || ''}
                value={province?.find(province => province.id === field.value) || null}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={field => (
                  <TextField
                    {...field}
                    placeholder='Pilih kota'
                    error={!!errors.province}
                    helperText={errors.province?.message}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.id} value={option.id}>
                    {option.province_name}
                  </MenuItem>
                )}
                noOptionsText='Hasil pencaian tidak ditemukan. Coba gunakan kata kunci lain atau periksa kembali pencarian Anda'
              />
            )}
          />
        </FormControl>
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
        <Button
          type='submit'
          variant='contained'
          disabled={onLoading}
          sx={{
            width: '120px',
            boxShadow: 0,
            color: '#FFF',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#BFBFBF' }
          }}
        >
          {onLoading ? <CircularProgress size={22} /> : 'Continue'}
        </Button>
      </Box>
    </form>
  )
}

export default LocationPreference
