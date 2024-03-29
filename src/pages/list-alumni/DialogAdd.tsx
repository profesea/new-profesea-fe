import { Ref, forwardRef, ReactElement, useState, useEffect} from 'react'
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
import { styled } from '@mui/material/styles'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { HttpClient } from 'src/services'
import { getCleanErrorMessage } from 'src/utils/helpers'
import { Autocomplete, CircularProgress, Divider } from '@mui/material' 
// import { useDropzone } from 'react-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'


// import Link from 'next/link'
import * as yup from 'yup'
 import Alumni from 'src/contract/models/alumni'
import { BoxProps } from '@mui/system'
import { AppConfig } from 'src/configs/api'
import SekolahType from 'src/contract/models/sekolah'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

 
type DialogProps = {
    visible: boolean;
    onCloseClick: VoidFunction;
    onStateChange: VoidFunction;
}

 
const BoxWrapper = styled(Box)<BoxProps>(() => ({
  position: 'relative'
}))
const ProfilePictureStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))
 
const DialogAdd = (props: DialogProps) => {
    const [onLoading, setOnLoading] = useState(false); 
    // const [files, setFiles] = useState<File[]>([])
    const [preview, setPreview] = useState()
    const [selectedFile, setSelectedFile] = useState()
    const [preview2, setPreview2] = useState()
    const [selectedFile2, setSelectedFile2] = useState()
    const [comboSekolah, getComboSekolah] = useState<any>([])
    const [idcomboSekolah, setComboSekolah] = useState<any>()
  
    // const { getRootProps, getInputProps } = useDropzone({
    //     multiple: false,
    //     accept: {
    //     'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    //     },
    //     onDrop: (acceptedFiles: File[]) => {
    //     setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    //     }
    // })
    const onSelectFile = (e: any) => {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined) 
        
        return
      }

      // I've kept this example simple by using the first image instead of multiple
      setSelectedFile(e.target.files[0])
      // const selectedFiles = e.target.files as FileList
      // setCurrentImage(selectedFiles?.[0])
      // uploadPhoto(selectedFiles?.[0])
    }
    // const img = files.map((file: FileProp) => (
    //     <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} width={450} />
    // ))
      
     const onSelectFile2 = (e: any) => {
       if (!e.target.files || e.target.files.length === 0) {
         setSelectedFile2(undefined)

         return
       }

       // I've kept this example simple by using the first image instead of multiple
       setSelectedFile2(e.target.files[0])
       // const selectedFiles = e.target.files as FileList
       // setCurrentImage(selectedFiles?.[0])
       // uploadPhoto(selectedFiles?.[0])
     }
       
    
    const schema = yup.object().shape({
      // title: yup.string().required('Title is required'),
      description: yup.string().required('description  is required'),

    })

    const {
      register,
      handleSubmit,
      formState: {}
    } = useForm<Alumni>({
      mode: 'onBlur',
      resolver: yupResolver(schema)
    }) 
    useEffect(() => { 
      HttpClient.get(AppConfig.baseUrl + '/public/data/sekolah?page=1&take=100&search').then(response => {
        const code = response.data.sekolah.data
        getComboSekolah(code)
      })
    }, [])
    useEffect(() => {
      if (!selectedFile) {
        setPreview(undefined)

        return
      }

      const objectUrl: any = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    useEffect(() => {
      if (!selectedFile2) {
        setPreview2(undefined)

        return
      }

      const objectUrl: any = URL.createObjectURL(selectedFile2)
      setPreview2(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile2])
    
    
    const onSubmit = async (formData: Alumni) => {
        const { title, description} = formData
        
        // if(files.length == 0){
        //   toast.error('Isi Banner')
        // }
        if(selectedFile == undefined){
          toast.error('Isi Photo Profile')
        }
        const json = {
            // "alumnibanner": files,
            "title": title,
            "description": description,
            "profilepicture":selectedFile,
            "sekolah":idcomboSekolah,
            "suratpenugasan":selectedFile2
        }
        
        setOnLoading(true);

        try
        {
            console.log(json);
            const resp = await HttpClient.postFile('/alumni', json);
            if (resp.status != 200) {
                throw resp.data.message ?? "Something went wrong create alumni!";
            }

            props.onCloseClick();
            toast.success(` Create Alumni successfully!`);
        } catch (error) {
            toast.error(`Opps ${getCleanErrorMessage(error)}`);
        }

        setOnLoading(false);
        props.onStateChange();
    }
 
    return (
      <Dialog fullWidth open={props.visible} maxWidth='sm' scroll='body' TransitionComponent={Transition}>
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
              <Typography variant='body2' color={'#32487A'} fontWeight='600' fontSize={18}>
                Add New Alumni
              </Typography>
            </Box>

            <Grid container columnSpacing={'1'} rowSpacing={'2'}>
              <Grid item container md={12} xs={12}>
                <Grid item container md={12} xs={12}>
                  {/* <Box {...getRootProps({ className: 'dropzone' })} sx={{ p: 2, border: '1px dashed' }}>
                    <input {...getInputProps()} />
                    {files.length ? (
                      img
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                        <Img width={150} alt='Upload img' src='/images/upload.png' />
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}
                        >
                          <Typography
                            color='textSecondary'
                            fontSize='16px'
                            sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}
                          >
                            Click{' '}
                            <Link href='/' onClick={e => e.preventDefault()}>
                              browse / image
                            </Link>{' '}
                            to upload Cover Picture Group of Alumni
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box> */}
                </Grid>
                <Grid item xs={6} md={12} mt={2} container justifyContent={'left'}>
                  <Grid xs={9}>
                    <Box sx={{ marginTop: '20px', marginLeft: '5px' }}>
                      <Typography
                        variant='body2'
                        sx={{ textAlign: 'left', color: '#262525', fontSize: '10px', mb: '5px' }}
                      >
                        <strong>Group of Alumni Logo.</strong>
                      </Typography>
                      <Divider></Divider>
                      <Typography
                        variant='body2'
                        sx={{ textAlign: 'left', color: '#262525', fontSize: '10px', mt: '5px' }}
                      >
                        Allowed JPG, GIF or PNG.
                      </Typography>
                      <Typography variant='body2' sx={{ textAlign: 'left', color: '#262525', fontSize: '10px' }}>
                        Max size of 800K. Aspect Ratio 1:1
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={3}>
                    {' '}
                    <BoxWrapper>
                      <ProfilePictureStyled
                        src={preview ? preview : '/images/avatars/profilepic.png'}
                        alt='profile-picture'
                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                      ></ProfilePictureStyled>

                      <input
                        accept='image/*'
                        style={{ display: 'none', height: 250, width: 400 }}
                        id='raised-button-file'
                        onChange={onSelectFile}
                        type='file'
                      ></input>
                      <Box position={'absolute'} right={'48%'} bottom={'40%'} top={'25%'}>
                        <label htmlFor='raised-button-file'>
                          <Icon fontSize='large' icon={'bi:camera'} color={'white'} style={{ fontSize: '26px' }} />
                        </label>
                      </Box>
                    </BoxWrapper>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} xs={12}>
                <TextField
                  id='description'
                  label='Group Name of Alumni'
                  variant='filled'
                  multiline
                  maxRows={4}
                  fullWidth
                  {...register('description')}
                />
              </Grid>

              <Grid item md={12} xs={12}>
                {/* <TextField id='title' label='Title Alumni' variant='outlined' fullWidth {...register('title')} /> */}
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={comboSekolah}
                  getOptionLabel={(option: any) => option.sekolah}
                  // defaultValue={props.datauser?.field_preference?.vessel_type}
                  renderInput={params => <TextField {...params} label='Institution Name *' variant='filled' />}
                  onChange={(event: any, newValue: SekolahType | null) =>
                    newValue?.id ? setComboSekolah(newValue.id) : setComboSekolah(null)
                  }
                />
              </Grid>

              <Grid item xs={6} md={12} mt={2} container justifyContent={'left'}>
                <Grid xs={9}>
                  <Box sx={{ marginTop: '20px', marginLeft: '5px' }}>
                    <Typography
                      variant='body2'
                      sx={{ textAlign: 'left', color: '#262525', fontSize: '10px', mb: '5px' }}
                    >
                      <strong>Letter of Assignment</strong>
                    </Typography>

                    <Divider></Divider>
                    <Typography variant='body2' sx={{ textAlign: 'left', color: 'red', fontSize: '10px', mt: '5px' }}>
                      {' '}
                      <strong>Optional</strong>
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'left', color: '#262525', fontSize: '10px' }}>
                      Allowed PDF. Max size of 800K.
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={3}>
                  {' '}
                  <BoxWrapper>
                    <ProfilePictureStyled
                      src={preview2 ? preview2 : '/images/avatars/profilepic.png'}
                      alt='profile-picture'
                      sx={{ width: 50, height: 50, objectFit: 'cover' }}
                    ></ProfilePictureStyled>

                    <input
                      accept='application/pdf'
                      style={{ display: 'none', height: 50, width: '100%' }}
                      id='raised-button-file-2'
                      onChange={onSelectFile2}
                      type='file'
                    ></input>
                    <Box position={'absolute'} right={'69%'} bottom={'40%'} top={'25%'}>
                      <label htmlFor='raised-button-file-2'>
                        <Icon fontSize='large' icon={'bi:filetype-pdf'} color={'white'} style={{ fontSize: '26px' }} />
                      </label>
                    </Box>
                  </BoxWrapper>
                </Grid>
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

export default DialogAdd
