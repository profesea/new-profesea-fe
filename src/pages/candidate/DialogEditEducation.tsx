import { Ref, forwardRef, ReactElement, useState, useEffect } from 'react'
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
import { CircularProgress } from '@mui/material' 
import { DateType } from 'src/contract/models/DatepickerTypes'
import { Autocomplete } from '@mui/material'
import DatePicker from 'react-datepicker' 
// import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'  
import Degree from 'src/contract/models/degree'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

 
 
 type FormData = {
   title: string
   major: string
   degree: string
   start_date: string
   end_date: string 
   institution: string 
   startdate: string
   enddate: string
 }
type DialogProps = {
  selectedItem: any
  visible: boolean
  onCloseClick: VoidFunction
  onStateChange: VoidFunction
}


const DialogEditEducation = (props: DialogProps) => { 
    const [onLoading, setOnLoading] = useState(false); 
    const [dateAwal, setDateAwal] = useState<DateType>(new Date()) 
    const [dateAkhir, setDateAkhir] = useState<DateType>(new Date()) 
    const [preview, setPreview] = useState(props.selectedItem?.logo)
    const [Education, getEducation] = useState<any[]>([])
    const [selectedFile, setSelectedFile] = useState()
    const [EduId, setEduId] = useState('---')  
    const combobox = async () =>{  
        const res3 = await HttpClient.get(`/public/data/degree`)
        if (res3.status != 200) {
          throw res3.data.message ?? 'Something went wrong!'
        }
        getEducation(res3.data.degrees)
    }

    useEffect(() => {  
        setPreview(props.selectedItem?.logo) 
      combobox()
    },[]) 
    useEffect(() => {
      if (!selectedFile) {
           setPreview(props.selectedItem?.logo) 

          return
      } 
      const objectUrl: any = URL.createObjectURL(selectedFile)
      setPreview(objectUrl) 
      
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    
    // const schema = yup.object().shape({
    //     user_id: yup.string().required()
    // })

    const { 
        register,
        // formState: { errors }, 
        handleSubmit,
    } = useForm<FormData>({
        mode: 'onBlur',
        // resolver: yupResolver(schema)
    }) 
    

    const onSubmit = async (data: FormData) => {
      const { title, major} = data

      const json = {
        title: title,
        major: major,
        degree: EduId,
        logo: selectedFile,
        still_here : 0,
        start_date: dateAwal
          ?.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          .split('/')
          .reverse()
          .join('-'),
        end_date: dateAkhir
          ?.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          .split('/')
          .reverse()
          .join('-')
      } 
      setOnLoading(true)

      try {
        console.log(json)
        const resp = await HttpClient.postFile('/user/education/'+ props.selectedItem.id , json)
        if (resp.status != 200) {
          throw resp.data.message ?? 'Something went wrong!'
        }

        props.onCloseClick()
        toast.success(` Education submited successfully!`)
      } catch (error) {
        toast.error(`Opps ${getCleanErrorMessage(error)}`)
      }

      setOnLoading(false)
      props.onStateChange()
    }
const onSelectFile = (e: any) => {
  if (!e.target.files || e.target.files.length === 0) {
    setSelectedFile(undefined)

    return
  }

  // I've kept this example simple by using the first image instead of multiple
  setSelectedFile(e.target.files[0]) 
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
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              onClick={props.onCloseClick}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Edit Educational
              </Typography>
              <Typography variant='body2'>Edit Candidate Educational info details</Typography>
            </Box>

            <Grid container columnSpacing={'1'} rowSpacing={'2'}>
              <Grid item md={6} xs={12}>
                <TextField
                  id='institutuin'
                  label='Institution Name'
                  variant='outlined'
                  fullWidth
                  {...register('title')}
                  defaultValue={props.selectedItem?.title}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  id='major'
                  label='Major'
                  variant='outlined'
                  fullWidth
                  {...register('major')}
                  defaultValue={props.selectedItem?.major}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={Education}
                  defaultValue={props.selectedItem?.degree}
                  {...register('degree')}
                  getOptionLabel={(option: Degree) => option.name}
                  renderInput={params => <TextField {...params} label='Education' />}
                  onChange={(event: any, newValue: Degree | null) =>
                    newValue?.name ? setEduId(newValue.name) : setEduId('---')
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid item xs={12} md={12} container justifyContent={'center'}>
                  <Grid xs={6}>
                    <label htmlFor='x'>
                      <img
                        alt='logo'
                        src={preview ? preview : '/images/avatar.png'}
                        style={{
                          maxWidth: '100%',
                          height: '120px',
                          padding: 0,
                          margin: 0
                        }}
                      />
                    </label>
                    <input
                      accept='image/*'
                      style={{ display: 'none' }}
                      id='x'
                      onChange={onSelectFile}
                      type='file'
                    ></input>
                  </Grid>
                  <Grid xs={6}>
                    <Box sx={{ marginTop: '20px' }}>
                      <Typography variant='body2' sx={{ textAlign: 'left', color: '#424242', fontSize: '10px' }}>
                        Click Photo to change institution Logo.
                      </Typography>
                      <Typography variant='body2' sx={{ textAlign: 'left', color: '#424242', fontSize: '10px' }}>
                        Allowed JPG, GIF or PNG.
                      </Typography>
                      <Typography variant='body2' sx={{ textAlign: 'left', color: '#424242', fontSize: '10px' }}>
                        Max size of 800K. Aspect Ratio 1:1
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                {/* <DatePickerWrapper> */}
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  selected={dateAwal}
                  id='basic-input'
                  onChange={(dateAwal: Date) => setDateAwal(dateAwal)}
                  placeholderText='Click to select a date'
                  customInput={
                    <TextField
                      label='Start Date'
                      variant='outlined'
                      fullWidth
                      {...register('startdate')}
                      defaultValue={props.selectedItem?.start_date}
                    />
                  }
                />
                {/* </DatePickerWrapper> */}
              </Grid>
              <Grid item md={6} xs={12}>
                {/* <DatePickerWrapper> */}
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  selected={dateAkhir}
                  id='basic-input'
                  onChange={(dateAkhir: Date) => setDateAkhir(dateAkhir)}
                  placeholderText='Click to select a date'
                  customInput={
                    <TextField
                      label='End Date'
                      variant='outlined'
                      fullWidth
                      {...register('enddate')}
                      defaultValue={props.selectedItem?.end_date}
                    />
                  }
                />
                {/* </DatePickerWrapper> */}
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
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              {onLoading ? <CircularProgress size={25} style={{ color: 'white' }} /> : 'Submit'}
            </Button>
            <Button variant='outlined' color='secondary' onClick={props.onCloseClick}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
}

export default DialogEditEducation