import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { HttpClient } from 'src/services'
import Account from 'src/contract/models/account'
import { getCleanErrorMessage, removeFirstZeroChar } from 'src/utils/helpers'
import { CircularProgress, FormHelperText, Autocomplete } from '@mui/material'
import ITeam from 'src/contract/models/team'

import { yupResolver } from '@hookform/resolvers/yup'

import * as yup from 'yup'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

type EditProps = {
  selectedItem: Account
  visible: boolean
  onCloseClick: VoidFunction
  onStateChange: VoidFunction
}

const EmployeeType = [
  { employee_type: 'onship', label: 'On-Ship' },
  { employee_type: 'offship', label: 'Off-Ship' }
]

const DialogEdit = (props: EditProps) => {
  const [onLoading, setOnLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPassword2, setShowPassword2] = useState<boolean>(false)
  const [phoneNum, setPhoneNum] = useState(props.selectedItem.phone)

  const [teamId, setTeamId] = useState(props.selectedItem.team_id)
  const [idcombocode, setCombocode] = useState<any>(0)
  const [selectedCombo, getSelectedCombo] = useState<any[]>([])

  const [combocode, getCombocode] = useState<any[]>([])
  const [teams, getTeams] = useState<ITeam[]>([])
  const [employeeType, setEmployeeType] = useState<any>(
    EmployeeType.find(item => props.selectedItem.employee_type == item.employee_type)
  )

  const combobox = async () => {
    const resp = await HttpClient.get(`/public/data/team?nonpublic=1`)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    getTeams(resp.data.teams)

    HttpClient.get(`/public/data/country?search=`).then(response => {
      const code = response.data.countries
      for (let x = 0; x < code.length; x++) {
        const element = code[x]
        element.label = element.iso + ' (+' + element.phonecode + ')'
        if (props.selectedItem.country_id == element.id) {
          console.log(element)
          getSelectedCombo(element)
        }
      }
      getCombocode(code)
    })
  }

  useEffect(() => {
    combobox()
  }, [])

  const schema = yup.object().shape({
    email: yup.string().email().required()
  })

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<Account>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (formData: Account) => {
    const { name, email, username, password, password_confirmation } = formData

    const json = {
      name: name,
      email: email,
      username: username,
      password: password,
      password_confirmation: password_confirmation,
      team_id: teamId,
      employee_type: employeeType?.employee_type,
      country_id: idcombocode.id ? idcombocode.id : props.selectedItem.country_id,
      phone: phoneNum
    }

    setOnLoading(true)
    try {
      const resp = await HttpClient.post(`/user-management/${props.selectedItem.id}`, json)
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

  return (
    <Dialog
      fullWidth
      open={props.visible}
      maxWidth='sm'
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
              Edit Account
            </Typography>
            <Typography variant='body2'>Fulfill your Account Info here</Typography>
          </Box>
          <Grid container columnSpacing={'1'} rowSpacing={'2'}>
            <Grid item md={12} xs={12}>
              <TextField
                defaultValue={props.selectedItem.name}
                id='Name'
                label='Name'
                variant='outlined'
                fullWidth
                sx={{ mb: 6 }}
                {...register('name')}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                defaultValue={props.selectedItem.email}
                id='Email'
                label='Email'
                variant='outlined'
                fullWidth
                {...register('email')}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                defaultValue={props.selectedItem.username}
                id='Username'
                label='Username'
                variant='outlined'
                fullWidth
                sx={{ mb: 6 }}
                {...register('username')}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  New Password
                </InputLabel>
                <OutlinedInput
                  sx={{ mb: 6 }}
                  label='Password'
                  id='password1'
                  error={Boolean(errors.password)}
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
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
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {(errors as any).password?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  sx={{ mb: 6 }}
                  label='Password'
                  id='password'
                  error={Boolean(errors.password)}
                  type={showPassword2 ? 'text' : 'password'}
                  {...register('password_confirmation')}
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
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {(errors as any).password?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                value={props.selectedItem.team}
                options={teams}
                {...register('team')}
                getOptionLabel={(option: ITeam) => option.teamName}
                renderInput={params => <TextField {...params} label='Role' />}
                onChange={(event: any, newValue: ITeam | null) =>
                  newValue?.id ? setTeamId(newValue.id) : setTeamId(props.selectedItem.team_id)
                }
                sx={{ mb: 6 }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                value={employeeType}
                options={EmployeeType}
                getOptionLabel={(option: any) => option.label}
                renderInput={params => <TextField {...params} label='Type' />}
                onChange={(event: any, newValue: any | null) =>
                  newValue ? setEmployeeType(newValue) : setEmployeeType('')
                }
                sx={{ mb: 6 }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disablePortal
                id='code'
                value={selectedCombo}
                options={!combocode ? [{ label: 'Loading...', id: 0 }] : combocode}
                renderInput={params => <TextField {...params} label='Code Phone' />}
                {...register('country_id')}
                onChange={(event: any, newValue: string | null) => setCombocode(newValue)}
                sx={{ mb: 6 }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id='Phone'
                label='Phone'
                variant='outlined'
                fullWidth
                sx={{ mb: 6 }}
                value={phoneNum}
                onChange={e => setPhoneNum(removeFirstZeroChar(e.target.value))}
              />
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
