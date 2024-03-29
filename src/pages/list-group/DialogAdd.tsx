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
import { CircularProgress } from '@mui/material' 
import { useDropzone } from 'react-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'


import Link from 'next/link'
import * as yup from 'yup'
 import Group from 'src/contract/models/group'
import { BoxProps } from '@mui/system'

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

interface FileProp {
    name: string
    type: string
    size: number
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
const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      width: 250
    }
}))

const DialogAdd = (props: DialogProps) => {
    const [onLoading, setOnLoading] = useState(false); 
    const [files, setFiles] = useState<File[]>([])
    const [preview, setPreview] = useState()  
    const [selectedFile, setSelectedFile] = useState()
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: (acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
        }
    })
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
    const img = files.map((file: FileProp) => (
        <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} width={450} />
    ))
      
    
    const schema = yup.object().shape({
      title: yup.string().required('Title is required'),
      description: yup.string().required('Description  is required'),

    })

    const {
      register,
      handleSubmit,
      formState: {}
    } = useForm<Group>({
      mode: 'onBlur',
      resolver: yupResolver(schema)
    }) 

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
    const onSubmit = async (formData: Group) => {
        const { title, description} = formData
        
        if(files.length == 0){
          toast.error('Isi Banner')
        }
        if(selectedFile == undefined){
          toast.error('Isi Photo Profile')
        }
        const json = {
            "groupbanner": files,
            "title": title,
            "description": description,
            "profilepicture":selectedFile
        }
        
        setOnLoading(true);

        try
        {
            console.log(json);
            const resp = await HttpClient.postFile('/group', json);
            if (resp.status != 200) {
                throw resp.data.message ?? "Something went wrong create group!";
            }

            props.onCloseClick();
            toast.success(` Create Group successfully!`);
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
                Add New Group
              </Typography>
            </Box>

            <Grid container columnSpacing={'1'} rowSpacing={'4'}>
              <Grid item container md={12} xs={12}>
                <Grid item container md={3} xs={12}>
                  {' '}
                  <BoxWrapper>
                    <ProfilePictureStyled
                      src={preview ? preview : '/images/avatars/profilepic.png'}
                      alt='profile-picture'
                      sx={{ width: 100, height: 100, objectFit: 'cover' }}>
                    </ProfilePictureStyled>

                    <input
                      accept='image/*'
                      style={{ display: 'none', height: 250, width: '100%' }}
                      id='raised-button-file'
                      onChange={onSelectFile}
                      type='file'
                    ></input>

                    <Box position={'absolute'} right={'40%'} bottom={'40%'} top={'25%'}>
                      <label htmlFor='raised-button-file'>
                        <Icon fontSize='large' icon={'bi:camera'} color={'white'} style={{ fontSize: '26px' }} />
                      </label>

                    </Box>

                  </BoxWrapper>
                  {/* <span>{errors?.title?.message}</span> */}
                 </Grid>
                <Grid item container md={9} xs={12}>
                  <Box {...getRootProps({ className: 'dropzone' })} sx={{ p: 2, border: '1px dashed' }}>
                    <input {...getInputProps()} />
                    {files.length ? (
                      img
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                        <Img width={200} alt='Upload img' src='/images/upload.png' />
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
                            to upload Cover Picture of Group
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField id='title' label='Title Group' variant='outlined' fullWidth {...register('title')} />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  id='description'
                  label='Description Group'
                  variant='outlined'
                  multiline
                  maxRows={4}
                  fullWidth
                  {...register('description')}
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

export default DialogAdd
