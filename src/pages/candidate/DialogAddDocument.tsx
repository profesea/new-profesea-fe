import { Ref, forwardRef, ReactElement, useState, useEffect, useRef } from 'react'
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
import { Autocomplete, CircularProgress } from '@mui/material'

import DatePicker from 'react-datepicker'
import { DateType } from 'src/contract/models/DatepickerTypes'
import Licensi from 'src/contract/models/licensi'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

type DialogProps = {
  visible: boolean
  onCloseClick: VoidFunction
  onStateChange: VoidFunction
  arrayhead: any
}
type dokumen = {
  title: string
  doctype: string
}

type FormData = {
  nameOtherDocument: string
  user_document: string
}

const DialogAddDocument = (props: DialogProps) => {
  const [onLoading, setOnLoading] = useState(false)
  const [preview, setPreview] = useState()
  const [selectedFile, setSelectedFile] = useState()
  const [showTextName, setTextName] = useState<boolean>(false)
  const [showChild, setChild] = useState<boolean>(false)
  const [combochild, setCombochild] = useState<any[]>([])
  const [dokumen, setDokumen] = useState<Licensi[]>([])
  const parent = useRef()
  // const [parent, setParent] = useState()
  const [expiredDate, setExpiredDate] = useState<DateType>(new Date())
  const [document_name, setDocument] = useState<any>([])
  const [document_nameChild, setDocumentChild] = useState<any>([])
  const getListLicense = async () => {
    try {
      const resp = await HttpClient.get(`/licensi?page=1&take=200`)
      if (resp.status != 200) {
        throw resp.data.message ?? 'Something went wrong!'
      }
      setDokumen(resp.data.licensies.data)
    } catch (error) {
      const errorMessage = 'Something went wrong!'
      toast.error(`Opps ${errorMessage}`)
    }
  }

  useEffect(() => {
    setOnLoading(true)
    getListLicense().then(() => {
      setOnLoading(false)
    })
  }, [])
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)

      return
    }
    const objectUrl: any = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    if (document_name.doctype == 'OTH') {
      setTextName(true)
    } else {
      setTextName(false)
    }
    if (document_name.child) {
      setChild(true)
      setCombochild(document_name.child)
    } else {
      setChild(false)
    }
  }, [document_name])
  // const schema = yup.object().shape({
  //     user_id: yup.string().required()
  // })

  const {
    register,
    // formState: { errors },
    handleSubmit
  } = useForm<FormData>({
    mode: 'onBlur'
    // resolver: yupResolver(schema)
  })

  const onSubmit = async (item: FormData) => {
    setOnLoading(true)

    let status = false
    for (let x = 0; x < props.arrayhead.length; x++) {
      const element = props.arrayhead[x]
      if (element.name == document_name.doctype) {
        parent.current = element.id
        status = true
      }
    }
    if (status == false) {
      await saveparent(item)
    }
    if (showChild == true) {
      await savechild()
    }
    setOnLoading(false)
    props.onStateChange()
  }
  const saveparent = async (item: FormData) => {
    const { nameOtherDocument } = item
    let doc = ''
    if (showTextName == true) {
      doc = nameOtherDocument
    } else {
      doc = document_name.title
    }
    const json = {
      user_document: selectedFile,
      document_name: doc,
      document_type: document_name.doctype,
      document_number: 123
    }
    setOnLoading(true)

    try {
      const resp = await HttpClient.postFile('/user/document', json)
      if (resp.status != 200) {
        throw resp.data.message ?? 'Something went wrong!'
      }
      parent.current = resp.data.document.id
      props.onCloseClick()
      toast.success(` Document submited successfully!`)
    } catch (error) {
      toast.error(`Opps ${getCleanErrorMessage(error)}`)
    }
  }

  const savechild = async () => {
    let childname = ''
    let childtype = ''
    if (showChild == true) {
      childname = document_nameChild.title
      childtype = document_nameChild.doctype
    }
    for (let x = 0; x < props.arrayhead.length; x++) {
      const element = props.arrayhead[x]
      if (element.name == document_nameChild.doctype) {
        parent.current = element.id
      }
    }
    const jsonchild = {
      user_document: selectedFile,
      document_name: childname,
      document_type: childtype,
      document_number: 456,
      parent_id: parent.current,
      expired_at: expiredDate
        ?.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        .split('/')
        .reverse()
        .join('-')
    }
    const resp2 = await HttpClient.postFile('/user/document', jsonchild)
    if (resp2.status != 200) {
      throw resp2.data.message ?? 'Something went wrong!'
    }
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
    <Dialog fullWidth open={props.visible} maxWidth='xs' scroll='body' TransitionComponent={Transition}>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
            height: '450px'
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
              Add New Document
            </Typography>
            <Typography variant='body2'>Fulfill your Document Info here</Typography>
          </Box>

          <Grid container columnSpacing={'1'} rowSpacing={'2'}>
            <Grid item md={12} xs={12}>
              <Autocomplete
                disablePortal
                id='dokumen'
                options={dokumen || []}
                getOptionLabel={option => option.title || ''}
                renderInput={params => <TextField {...params} label='Document' sx={{ mb: 2 }} variant='standard' />}
                onChange={(e, newValue: any) => (newValue ? setDocument(newValue) : setDocument(null))}
              />
            </Grid>
            {showChild == true && (
              <>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    disablePortal
                    id='dokumen2'
                    options={combochild}
                    getOptionLabel={(option: dokumen) => option.title}
                    renderInput={params => (
                      <TextField {...params} label='Document Child' sx={{ mb: 2 }} variant='standard' />
                    )}
                    onChange={(e, newValue: any) => (newValue ? setDocumentChild(newValue) : setDocumentChild([]))}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <DatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={expiredDate}
                    id='basic-input'
                    onChange={(dateAwal: Date) => setExpiredDate(dateAwal)}
                    placeholderText='Click to select a date'
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode='select'
                    customInput={<TextField label='Expired Date' variant='standard' fullWidth />}
                  />
                </Grid>
              </>
            )}

            {showTextName == true && (
              <TextField
                id='document_name'
                label='Document Name'
                variant='standard'
                fullWidth
                {...register('nameOtherDocument')}
              />
            )}

            <Grid item md={12} xs={12} mt={2}>
              <Grid item xs={12} md={12} container justifyContent={'left'}>
                <Grid xs={6}>
                  <label htmlFor='x'>
                    <img
                      alt='logo'
                      src={preview ? preview : '/images/uploadimage.jpeg'}
                      style={{
                        maxWidth: '100%',
                        height: '120px',
                        padding: 0,
                        margin: 0
                      }}
                    />
                  </label>
                  <input
                    accept='application/pdf,,image/*'
                    style={{ display: 'none' }}
                    id='x'
                    onChange={onSelectFile}
                    type='file'
                  ></input>
                </Grid>
                <Grid xs={6}>
                  <Box sx={{ marginTop: '20px', marginLeft: '5px' }}>
                    <Typography variant='body2' sx={{ textAlign: 'left', color: '#262525', fontSize: '10px' }}>
                      <strong>Click to change Document File.</strong>
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'left', color: '#262525', fontSize: '10px' }}>
                      Allowed PDF.
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'left', color: '#262525', fontSize: '10px' }}>
                      Max size of 800K. Aspect Ratio 1:1
                    </Typography>
                  </Box>
                </Grid>
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

export default DialogAddDocument
