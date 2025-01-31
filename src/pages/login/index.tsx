import { useState, ReactNode, useEffect } from 'react'
import Link from 'next/link'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material'
import { styled } from '@mui/material/styles'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Head from 'next/head'
import themeConfig from 'src/configs/themeConfig'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { useSearchParams } from 'next/navigation'

import DialogMessage from './DialogMessage'
import { AppConfig } from 'src/configs/api'
import { useRouter } from 'next/router'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  '& svg': { mr: 1.5 },
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const getSchema = (t: any) => {
  return yup.object().shape({
    email: yup.string().email(t('input_label_error_3')).required(t('input_label_error_1')),
    password: yup.string().min(7, t('input_label_error_2')).required(t('input_label_error_1'))
  })
}

const defaultValues = {
  password: '',
  email: ''
}

interface FormData {
  email: string
  password: string
}

interface CheckEmailResponse {
  available: boolean
  message: string
}

const LoginPage = () => {
  const { t } = useTranslation()
  const schema = getSchema(t)
  const auth = useAuth()
  const router = useRouter()

  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const checked = searchParams.get('checked')

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [openDialogMessage, setOpenDialogMessage] = useState<boolean>(false)
  const [onLoading, setOnLoading] = useState<boolean>(false)
  const [checkEmail, setCheckEmail] = useState<boolean>(false)

  useEffect(() => {
    if (email && email !== '') {
      setValue('email', email)
    }
    if (checked && checked === '1') {
      setCheckEmail(true)
    }
  }, [email, checked])

  const {
    control,
    setValue,
    getValues,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setOnLoading(true)
    const { email, password } = data
    await auth.login({ email, password }, () => {
      setError('email', {
        type: 'manual',
        message: `${t('input_label_error_4')}`
      })
    })
    setOnLoading(false)
  }

  const onChecking = async (email: string) => {
    if (!email && email === '') {
      setError('email', {
        type: 'manual',
        message: `${t('input_label_error_1')}`
      })

      return
    }

    setOnLoading(true)
    const response = await fetch(AppConfig.baseUrl + `/public/data/check-email?email=${email}`)
    const result: CheckEmailResponse = await response.json()

    if (!result.available) {
      await setOnLoading(false)
      setCheckEmail(true)
    } else {
      await setOnLoading(false)
      setCheckEmail(false)
      setOpenDialogMessage(true)
    }
  }

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - ${t('login_title')}`}</title>
        <meta name='description' content={`${themeConfig.templateName} - ${t('login_description')}`} />
        <meta name='keywords' content={`${t('app_keyword')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
        <meta property='og:title' content={`${themeConfig.templateName} - ${t('login_title')}`} />
        <meta property='og:description' content={`${themeConfig.templateName} - ${t('login_description')}`} />
        <meta property='og:image' content='images/logoprofesea.png' />
      </Head>
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          item
          md={6}
          sx={{
            backgroundImage: `url(/images/bg-login.jpg)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto',
            backgroundPosition: '20% 45%'
          }}
        />
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              width: '495px'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <Link href='/'>
                <Box component='img' src='/images/logoprofesea.png' sx={{ width: '143px', height: 'auto' }} />
              </Link>
              {checkEmail ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <IconButton
                    sx={{ backgroundColor: '#F0F0F0', '&:hover': { backgroundColor: '#E0E0E0' } }}
                    onClick={() => {
                      setValue('email', '')
                      setValue('password', '')
                      setCheckEmail(false)
                      router.replace(router.pathname)
                    }}
                  >
                    <Icon icon='mdi:chevron-left' fontSize={24} />
                  </IconButton>
                  <Typography
                    sx={{ textAlign: 'center', color: '#404040', fontSize: 32, fontWeight: 700, lineHeight: '38.4px' }}
                  >
                    {t('login_page.title_2')}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Typography
                    sx={{ textAlign: 'center', color: '#404040', fontSize: 32, fontWeight: 700, lineHeight: '38.4px' }}
                  >
                    {t('login_page.title_2')}
                  </Typography>
                  <Typography
                    sx={{ textAlign: 'center', color: '#999', fontSize: 16, fontWeight: 400, lineHeight: '21px' }}
                  >
                    {t('login_page.description')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                height: '444px',
                p: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}
                >
                  <FormControl fullWidth>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={t('input.email')}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.email)}
                          InputLabelProps={{ shrink: checkEmail || Boolean(getValues('email')) }}
                        />
                      )}
                    />
                    {errors.email && (
                      <Typography sx={{ color: 'error.main', m: '6px 4px 0', fontSize: 12 }}>
                        {errors.email.message}
                      </Typography>
                    )}
                  </FormControl>
                  {checkEmail && (
                    <FormControl fullWidth>
                      <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                        {t('input.password')}
                      </InputLabel>
                      <Controller
                        name='password'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <OutlinedInput
                            value={value}
                            onBlur={onBlur}
                            label={t('input.password')}
                            onChange={onChange}
                            id='auth-login-v2-password'
                            error={Boolean(errors.password)}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        )}
                      />
                      {errors.password && (
                        <Typography sx={{ color: 'error.main', ml: '4px', fontSize: 12 }} id=''>
                          {errors.password.message}
                        </Typography>
                      )}
                      <Typography
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginTop: '2%' }}
                      >
                        <LinkStyled href='/forgot-password'>
                          <span>{t('input.forgot_password')}</span>
                        </LinkStyled>
                      </Typography>
                    </FormControl>
                  )}
                  {checkEmail ? (
                    <Button disabled={onLoading} fullWidth size='large' type='submit' variant='contained'>
                      {onLoading ? <CircularProgress color='primary' /> : t('input.login')}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      disabled={onLoading}
                      size='large'
                      type='button'
                      variant='contained'
                      onClick={() => {
                        const emailValue = getValues('email')
                        onChecking(emailValue)
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      {onLoading ? <CircularProgress color='primary' /> : t('input.continue')}
                    </Button>
                  )}
                  {!checkEmail && (
                    <>
                      <Divider role='presentation'>
                        <Typography sx={{ mx: '10px', textAlign: 'center', fontSize: 14, fontWeight: 400 }}>
                          {t('input.or')}
                        </Typography>
                      </Divider>
                      <Button
                        fullWidth
                        size='large'
                        variant='outlined'
                        component={Link}
                        href='https://apifix.profesea.id/auth/google'
                        startIcon={<Icon icon='devicon:google' fontSize={20} />}
                        sx={{ textTransform: 'none' }}
                      >
                        {t('input.g_login')}
                      </Button>
                      <Button
                        fullWidth
                        size='large'
                        variant='outlined'
                        component={Link}
                        href='https://apifix.profesea.id/auth/facebook'
                        startIcon={<Icon icon='devicon:facebook' fontSize={20} />}
                        sx={{ textTransform: 'none' }}
                      >
                        {t('input.f_login')}
                      </Button>
                    </>
                  )}
                </Box>
              </form>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {!checkEmail && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      gap: '2px'
                    }}
                  >
                    <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 400, color: '#404040' }}>
                      {t('login_page.account')}
                    </Typography>
                    <Typography component={Link} href='/register' sx={{ color: '#0B58A6', fontWeight: 700 }}>
                      {t('input.register')}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Typography sx={{ color: '#404040', fontSize: 12, fontWeight: 400 }}>
                    {t('tos.tos_start')}
                    <Box
                      component={Link}
                      href='/term'
                      target='_blank'
                      sx={{ mx: '3px', color: '#0B58A6', fontWeight: 400 }}
                    >
                      {t('tos.tos_terms')}
                    </Box>
                    {t('tos.tos_and')}
                    <Box
                      component={Link}
                      href='/privacy'
                      target='_blank'
                      sx={{ mx: '3px', color: '#0B58A6', fontWeight: 400 }}
                    >
                      {t('tos.tos_privacy')}
                    </Box>
                    {t('tos.tos_end')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <DialogMessage
        email={getValues('email')}
        visible={openDialogMessage}
        onCloseClick={() => {
          setOpenDialogMessage(!openDialogMessage)
        }}
      />
    </>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
