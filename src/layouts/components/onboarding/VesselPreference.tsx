import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import VesselType from 'src/contract/models/vessel_type'
import { toast } from 'react-hot-toast'

type FormData = {
  vessel: number
}

const schema = yup.object().shape({
  vessel: yup.number().required()
})

const VesselPreference = ({ beforeLink, nextLink }: { beforeLink: string; nextLink: string }) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: { vessel: 0 },
    resolver: yupResolver(schema)
  })

  const router = useRouter()
  const { user, refreshSession } = useAuth()

  const [vessel, setVessel] = useState<VesselType[]>()
  const [onLoading, setOnLoading] = useState(false)

  const firstLoad = async () => {
    await HttpClient.get(AppConfig.baseUrl + '/public/data/vessel-type?page=1&take=1000').then(async response => {
      const data: VesselType[] = await response.data.vesselTypes.data
      setVessel(data)
    })

    if (user && user.vessel_type) {
      setValue('vessel', user.vessel_type.id)
    }
  }

  useEffect(() => {
    firstLoad()
  }, [])

  const onSubmit = (data: FormData) => {
    setOnLoading(true)
    HttpClient.patch(AppConfig.baseUrl + '/onboarding/preference-vessel', {
      vesseltype_id: data.vessel,
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
        <FormControl error={!!errors.vessel}>
          <Typography sx={{ mb: '12px', color: '#525252', fontSize: 12, fontWeight: 700 }}>
            Tipe Kapal <span style={{ color: '#F22' }}>*</span>
          </Typography>
          <Controller
            name='vessel'
            control={control}
            render={({ field }) => (
              <Select {...field} value={field.value || 0}>
                <MenuItem value={0} disabled>
                  Pilih Tipe Kapal Anda
                </MenuItem>
                {vessel &&
                  vessel.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
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

export default VesselPreference
