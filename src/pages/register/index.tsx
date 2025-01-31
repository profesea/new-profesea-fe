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
  InputAdornment,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Checkbox,
  Dialog,
  DialogContent
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

import DialogGoogleLogin from './DialogGoogleLogin'
import DialogMessage from './DialogMessage'
import { HttpClient } from 'src/services'
import { toast } from 'react-hot-toast'
import { AppConfig } from 'src/configs/api'
import { useRouter } from 'next/router'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement='top-start' />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F2F8FE',
    padding: '12px',
    width: '447px',
    maxWidth: '447px'
  }
}))

const getSchema = (t: any) => {
  return yup.object().shape({
    email: yup.string().email(t('input_label_error_3')).required(t('input_label_error_1')),
    password: yup.string().min(8, t('input_label_error_2')).required(t('input_label_error_1')),
    password2: yup.string().required(t('input_label_error_1'))
  })
}

interface FormData {
  email: string
  password: string
  password2: string
  tos: string
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
  const [showPassword2, setShowPassword2] = useState<boolean>(false)
  const [openModalGoogle, setOpenModalGoogle] = useState<boolean>(false)
  const [openDialogMessage, setOpenDialogMessage] = useState<boolean>(false)
  const [openDialogReturn, setOpenDialogReturn] = useState<boolean>(false)
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
    register,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const emailValue = watch('email')

  const post = async (json: any) => {
    setOnLoading(true)

    HttpClient.post(AppConfig.baseUrl + '/auth/register/v2', json).then(
      async () => {
        toast.success('Successfully Registered!')
        const loginJson = {
          email: json.email,
          password: json.password
        }
        await auth.login({ ...loginJson })
        setOnLoading(false)
      },
      error => {
        setOnLoading(false)
        toast.error('Registrastion Failed ' + error.response.data.message)
      }
    )
  }

  const onSubmit = (data: FormData) => {
    const { email, password, password2, tos } = data
    const lowerCaseEmail = email.toLowerCase()

    if (tos == '') {
      toast.error(`${t('input_label_error_5')}`)

      return
    } else if (password !== password2) {
      toast.error(`${t('input_label_error_6')}`)

      return
    }

    try {
      post({
        email: lowerCaseEmail,
        password: password,
        password_confirmation: password2
      })
    } catch (e) {
      alert(e)
    }
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

    if (result.available) {
      setOnLoading(false)
      setCheckEmail(true)
    } else {
      setOnLoading(false)
      setCheckEmail(false)
      setOpenDialogMessage(true)
    }
  }

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - ${t('register_title')}`}</title>
        <meta name='description' content={`${themeConfig.templateName} - ${t('register_description')}`} />
        <meta name='keywords' content={`${t('app_keyword')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
        <meta property='og:title' content={`${themeConfig.templateName} - ${t('register_title')}`} />
        <meta property='og:description' content={`${themeConfig.templateName} - ${t('register_description')}`} />
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
                    onClick={() => setOpenDialogReturn(true)}
                  >
                    <Icon icon='mdi:chevron-left' fontSize={24} />
                  </IconButton>
                  <Typography
                    sx={{ textAlign: 'center', color: '#404040', fontSize: 32, fontWeight: 700, lineHeight: '38.4px' }}
                  >
                    {t('register_page.title_2')}
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
                    {t('register_page.title_1')}
                  </Typography>
                  <Typography
                    sx={{ textAlign: 'center', color: '#999', fontSize: 16, fontWeight: 400, lineHeight: '21px' }}
                  >
                    {t('register_page.description')}
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
                    gap: '18px'
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      autoFocus
                      disabled={checkEmail}
                      label={t('input.email')}
                      {...register('email')}
                      error={Boolean(errors.email)}
                      InputLabelProps={{ shrink: checkEmail || Boolean(emailValue) }}
                    />
                    {errors.email && (
                      <Typography sx={{ color: 'error.main', m: '6px 4px 0', fontSize: 12 }}>
                        {errors.email.message}
                      </Typography>
                    )}
                  </FormControl>
                  {checkEmail && (
                    <>
                      <LightTooltip
                        title={
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'nowrap',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Box sx={{ flexShrink: 0 }}>
                              <Icon icon='ph:warning-circle' color='#32497A' fontSize={24} />
                            </Box>
                            <Typography sx={{ flexGrow: 1, color: '#32497A', fontSize: 14, fontWeight: 400 }}>
                              Minimal 8 karakter. Gunakan kombinasi angka, huruf, simbol, serta huruf besar dan kecil.
                            </Typography>
                          </Box>
                        }
                      >
                        <FormControl fullWidth>
                          <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                            {t('input.password')}
                          </InputLabel>
                          <OutlinedInput
                            {...register('password')}
                            label={t('input.password')}
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
                          {errors.password && (
                            <Typography sx={{ color: 'error.main', ml: '4px', fontSize: 12 }}>
                              {errors.password.message}
                            </Typography>
                          )}
                        </FormControl>
                      </LightTooltip>
                      <FormControl fullWidth>
                        <InputLabel htmlFor='auth-login-v2-password2' error={Boolean(errors.password2)}>
                          {t('input.password_2')}
                        </InputLabel>
                        <OutlinedInput
                          {...register('password2')}
                          label={t('input.password_2')}
                          error={Boolean(errors.password2)}
                          type={showPassword2 ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword2(!showPassword2)}
                              >
                                <Icon icon={showPassword2 ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        {errors.password2 && (
                          <Typography sx={{ color: 'error.main', ml: '4px', fontSize: 12 }}>
                            {errors.password2.message}
                          </Typography>
                        )}
                      </FormControl>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'left',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '2px'
                        }}
                      >
                        <Controller
                          name='tos'
                          control={control}
                          render={({ field }) => <Checkbox {...field} {...register('tos')} />}
                        />
                        <Typography sx={{ color: '#404040', fontSize: 12, fontWeight: 400 }}>
                          {t('tos.tos_me')}
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
                    </>
                  )}
                  {checkEmail ? (
                    <Button disabled={auth.loading} fullWidth size='large' type='submit' variant='contained'>
                      {auth.loading ? <CircularProgress color='primary' /> : t('input.register')}
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
                      {t('register_page.account')}
                    </Typography>
                    <Typography component={Link} href='/login' sx={{ color: '#0B58A6', fontWeight: 700 }}>
                      {t('input.login')}
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
      <DialogGoogleLogin
        visible={openModalGoogle}
        onCloseClick={() => {
          setOpenModalGoogle(!openModalGoogle)
        }}
      />
      <DialogMessage
        email={getValues('email')}
        visible={openDialogMessage}
        onCloseClick={() => {
          setOpenDialogMessage(!openDialogMessage)
        }}
      />
      <Dialog maxWidth='sm' open={openDialogReturn}>
        <DialogContent sx={{ p: '24px', width: '400px', textAlign: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{t('register_page.return_dialog.title')}</Typography>
          <Typography sx={{ mt: '6px', fontSize: 14, fontWeight: 400 }}>
            {t('register_page.return_dialog.description')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              mt: '16px'
            }}
          >
            <Button
              fullWidth
              variant='contained'
              onClick={() => {
                setValue('email', '')
                setValue('password', '')
                setValue('password2', '')
                setValue('tos', '')
                setCheckEmail(false)
                setOpenDialogReturn(false)
                router.replace(router.pathname)
              }}
              sx={{
                h: '33px',
                backgroundColor: '#D8E6FF',
                color: '#32497A',
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 400,
                '&:hover': { backgroundColor: '#A6C6FF' }
              }}
            >
              {t('register_page.return_dialog.cancel')}
            </Button>
            <Button
              fullWidth
              variant='contained'
              onClick={() => setOpenDialogReturn(false)}
              sx={{
                h: '33px',
                backgroundColor: '#32497A',
                color: 'white',
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 400
              }}
            >
              {t('register_page.return_dialog.continue')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
