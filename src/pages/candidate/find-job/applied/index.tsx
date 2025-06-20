import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useCallback, useEffect, useState } from 'react'

import { HttpClient } from 'src/services'
import Applied from 'src/contract/models/applicant'
import debounce from 'src/utils/debounce'

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Popper,
  Select,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import CustomPaginationItem from 'src/@core/components/pagination/item'

// Applied => Waiting Review => WR
// Reviewed => Viewed => VD
// Proceed => Proceed => PR
// Not Selected => Rejected => RJ
// Withdrawn => WD

const ApplicantStatusOptions = [
  {
    status: 'WR',
    title: 'Applied'
  },
  {
    status: 'VD',
    title: 'Reviewed'
  },
  {
    status: 'PR',
    title: 'Proceed'
  },
  {
    status: 'RJ',
    title: 'Not Selected'
  },
  {
    status: 'WD',
    title: 'Withdrawn'
  }
]

const statusColor = (status: string) => {
  switch (status) {
    case 'WR':
      return {
        bgColor: '#FFEBCF',
        textColor: '#FE9602'
      }
    case 'VD':
      return {
        bgColor: '#CBE2F9',
        textColor: '#0B58A6'
      }
    case 'PR':
      return {
        bgColor: '#D9F2DA',
        textColor: '#4CAF50'
      }
    case 'RJ':
      return {
        bgColor: '#FFD9D9',
        textColor: '#F22'
      }
    case 'WD':
      return {
        bgColor: '#F0F0F0',
        textColor: '#999'
      }

    case 'AP':
      return {
        bgColor: '#D9F2DA',
        textColor: '#4CAF50'
      }
  }
}

const TruncatedTypography = (props: { children: any; line?: number; [key: string]: any }) => {
  const { children, line, ...rest } = props
  const maxLine = line ? line : 1

  return (
    <Typography
      sx={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLine,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        maxHeight: `calc(${maxLine} * 1.2em)`,
        minHeight: '1.2em',
        lineHeight: '1.2em',
        fontSize: '16px',
        ...rest
      }}
    >
      {children}
    </Typography>
  )
}

const AllJobApplied = () => {
  const pageItems = 9
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [jobAppliedId, setJobAppliedId] = useState(0)
  const [firstload, setFirstLoad] = useState(true)
  const [onLoading, setOnLoading] = useState(false)
  const [dataApplied, setDataApplied] = useState<Applied[]>([])
  const [totalJob, setTotalJob] = useState(0)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const [applicantStatusFilter, setApplicantStatusFilter] = useState<{ status: string; title: string } | null>(null)
  const [sortBy, setSortBy] = useState('desc')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openPopperId, setOpenPopperId] = useState(null)
  const [loadingWithDraw, setLoadingWithDraw] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const getAppliedJob = async () => {
    const resp = await HttpClient.get(
      `/user/job-applied?search=${search}&page=${page}&take=${pageItems}&sort=${sortBy}&status=${
        applicantStatusFilter?.status || ''
      }`
    )
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }

    const rows = resp.data.jobs.data as Applied[]

    setDataApplied(rows)
    setTotalJob(resp?.data?.jobs?.total ?? 0)
    setFirstLoad(false)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: any) => {
    if (openPopperId === id) {
      // Close the Popper if it is already open
      setOpenPopperId(null)
      setAnchorEl(null)
    } else {
      // Open the Popper for the clicked item
      setAnchorEl(event.currentTarget)
      setOpenPopperId(id)
    }
  }

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
    }, 500),
    []
  )

  const handleChangeSelect = (event: any) => {
    setSortBy(event?.target?.value)
  }

  const handleClearFilter = () => {
    setSearch('')
    setApplicantStatusFilter(null)
    setSortBy('desc')
  }

  const handleBrowseJob = () => {
    router.replace('/candidate/find-job/?tabs=1')
  }

  const handleWithDraw = async () => {
    setLoadingWithDraw(true)

    try {
      const response = await HttpClient.put(`/job/applicant/${jobAppliedId}/withdraw`)
      if (response?.status === 200) {
        setDataApplied(prevState => prevState.map(d => (d.id === jobAppliedId ? { ...d, status: 'WD' } : d)))
      }
    } catch (error) {
      console.error('Error withdrawing application:', error)
      toast.error('Error withdrawing application')
      // Optionally show an error notification to the user
    } finally {
      setLoadingWithDraw(false)
      setJobAppliedId(0)
      setOpenDialog(false)
    }
  }

  function getAppliedDuration(createdAt: any) {
    // Menghitung jarak waktu dari sekarang
    const distance = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

    // Menghasilkan teks dengan format "Applied 3mo ago"
    return `Applied ${distance}`
  }

  const handleClickOpen = (id: any) => {
    setJobAppliedId(id)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const renderList = (data: Applied[]) => {
    return data.map(item => {
      const companyPhoto = item?.job?.company?.photo ? item?.job?.company?.photo : '/images/avatars/default-user.png'

      return (
        <Grid item xs={12} md={6} lg={4} key={item?.id}>
          <Paper
            sx={{
              p: isMobile ? '16px' : '24px',
              border: '2px solid #eee',
              transition: 'border-color 0.2s ease-in-out, color 0.2s ease-in-out',
              '&:hover': { borderColor: 'primary.main' },
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              cursor: 'pointer'
            }}
            elevation={0}
            onClick={() => router.push(`/candidate/job/applied/${item?.id}`)}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                height: '4em'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexGrow: 1
                }}
              >
                <Avatar
                  src={companyPhoto}
                  alt={item?.job?.company?.name || 'Company Avatar'}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: '20px'
                  }}
                >
                  <TruncatedTypography line={2} fontWeight='bold' mb={0.5} textTransform='capitalize'>
                    {item?.job?.role_type?.name ?? '-'}
                  </TruncatedTypography>
                  <TruncatedTypography fontSize={14} color={'#404040'}>
                    {item?.job?.company?.name ?? '-'}
                  </TruncatedTypography>
                </Box>
              </Box>
              {item?.status === 'WR' && (
                <Box
                  ml={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'right'
                  }}
                >
                  <IconButton
                    aria-label='dot-menu'
                    size='small'
                    type='button'
                    onClick={event => {
                      event.stopPropagation()
                      handleClick(event, item.id)
                    }}
                  >
                    <Icon icon={'ph:dots-three-bold'} color='rgba(50, 73, 122, 1)' fontSize={'20px'} />
                  </IconButton>
                  <Popper
                    id={`popper-${item.id}`}
                    open={openPopperId === item.id}
                    anchorEl={openPopperId === item.id ? anchorEl : null}
                    placement='bottom-end'
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '8px',
                        borderRadius: '4px',
                        background: '#FFF',
                        boxShadow: '2px 2px 5px -1px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <Box
                        onClick={event => {
                          event.stopPropagation()
                          handleClickOpen(item?.id)
                        }}
                        sx={{ display: 'flex', gap: '10px', cursor: 'pointer' }}
                      >
                        <Image src={'/images/HandWithdraw.png'} alt='icon-hand-with-draw' width={20} height={20} />
                        <Typography>Withdraw</Typography>
                      </Box>
                    </Box>
                  </Popper>
                </Box>
              )}
            </Box>
            {item?.job?.category?.employee_type === 'onship' ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  gap: '20px',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography fontSize={14} fontWeight={400} color={'#999'}>
                    {item?.job?.contract_duration ? `${item?.job?.contract_duration} months` : '-'}
                  </Typography>
                  <Typography fontSize={14} fontWeight={400} color={'#999'}>
                    {item?.job?.vessel_type ? item?.job?.vessel_type?.name : '-'}
                  </Typography>
                  <Typography fontSize={14} fontWeight={400} color={'#999'}>
                    {item?.created_at ? getAppliedDuration(item?.created_at) : '-'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '110px',
                    height: '27px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    background: statusColor(item?.status)?.bgColor,
                    color: statusColor(item?.status)?.textColor,
                    alignSelf: 'end',
                    textAlign: 'center'
                  }}
                >
                  {ApplicantStatusOptions.find(a => a.status === item?.status)?.title}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  gap: '20px',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '80px' }}>
                  <Typography fontSize={14} fontWeight={400} color={'#999'}>
                    {item?.job?.work_arrangement ? item?.job?.work_arrangement : '-'}
                  </Typography>
                  <Typography fontSize={14} fontWeight={400} color={'#999'}>
                    {item?.job?.employment_type ? item?.job?.employment_type : '-'}
                  </Typography>
                  <Typography fontSize={14} fontWeight={400} color={'#999'}>
                    {item?.created_at ? getAppliedDuration(item?.created_at) : '-'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '110px',
                    height: '27px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    background: statusColor(item?.status)?.bgColor,
                    color: statusColor(item?.status)?.textColor,
                    alignSelf: 'end',
                    textAlign: 'center'
                  }}
                >
                  {ApplicantStatusOptions.find(a => a.status === item?.status)?.title}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      )
    })
  }

  useEffect(() => {
    setOnLoading(true)
    getAppliedJob().then(() => {
      setOnLoading(false)
    })
  }, [page, search, sortBy, applicantStatusFilter])

  const handleConditionalRendering = () => {
    if (firstload) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      )
    }

    if (dataApplied.length == 0) {
      return (
        <>
          <CardContent>
            <Grid container spacing={4} sx={{ marginBottom: '32px' }}>
              <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <TextField
                  fullWidth
                  variant='outlined'
                  size='small'
                  placeholder='Search'
                  onChange={e => handleSearch(e.target.value)}
                />
                <Autocomplete
                  id='applicant-status'
                  disablePortal
                  options={ApplicantStatusOptions}
                  getOptionLabel={option => option.title}
                  renderInput={params => <TextField {...params} size='small' label='Applicant Status' />}
                  value={applicantStatusFilter}
                  onChange={(event: any, newValue) => {
                    setPage(1)
                    newValue ? setApplicantStatusFilter(newValue) : setApplicantStatusFilter(null)
                  }}
                  sx={{ width: isMobile ? '100%' : '50%' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ color: 'black' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <Typography width={'80px'}>Sort By :</Typography>
                      <FormControl fullWidth>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={sortBy}
                          onChange={handleChangeSelect}
                          size='small'
                        >
                          <MenuItem value={'desc'}>Newest to Oldest </MenuItem>
                          <MenuItem value={'asc'}>Oldest to Newest</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      variant='outlined'
                      size='small'
                      sx={{ textTransform: 'capitalize' }}
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Image
                  src={'/images/rafiki.png'}
                  alt='assets-applied'
                  width={isMobile ? 300 : 350}
                  height={isMobile ? 200 : 260}
                  style={{
                    margin: '0 auto'
                  }}
                />
                <Typography
                  sx={{ fontSize: '18px', fontWeight: 700, color: '#32497A', marginTop: '40px', marginBottom: '24px' }}
                >
                  You haven’t applied for any jobs yet
                </Typography>
                <Button variant='outlined' size='small' sx={{ textTransform: 'capitalize' }} onClick={handleBrowseJob}>
                  Browse Job
                </Button>
              </Box>
            </Box>
          </CardContent>
        </>
      )
    }

    return (
      <CardContent>
        <Grid container spacing={4} sx={{ marginBottom: '32px' }}>
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='Search'
              onChange={e => handleSearch(e.target.value)}
            />
            <Autocomplete
              id='applicant-status'
              disablePortal
              options={ApplicantStatusOptions}
              getOptionLabel={option => option.title}
              renderInput={params => <TextField {...params} size='small' label='Applicant Status' />}
              value={applicantStatusFilter}
              onChange={(event: any, newValue) => {
                setPage(1)
                newValue ? setApplicantStatusFilter(newValue) : setApplicantStatusFilter(null)
              }}
              sx={{ width: isMobile ? '100%' : '50%' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ color: 'black' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <Typography width={'80px'}>Sort By :</Typography>
                  <FormControl fullWidth>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={sortBy}
                      onChange={handleChangeSelect}
                      size='small'
                    >
                      <MenuItem value={'desc'}>Newest to Oldest </MenuItem>
                      <MenuItem value={'asc'}>Oldest to Newest</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{ textTransform: 'capitalize' }}
                  onClick={handleClearFilter}
                >
                  Clear Filter
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {onLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={6}>
              {renderList(dataApplied)}
            </Grid>
            <Box
              sx={{
                width: 'full',
                display: 'flex',
                justifyContent: 'end',
                marginTop: '50px',
                marginBottom: '40px'
              }}
            >
              <Pagination
                page={page}
                count={Math.ceil(totalJob / pageItems)}
                onChange={(e: React.ChangeEvent<unknown>, value: number) => {
                  setPage(value)
                }}
                variant='outlined'
                shape='rounded'
                renderItem={item => <CustomPaginationItem {...item} />}
              />
            </Box>
          </>
        )}
      </CardContent>
    )
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='sm'
      >
        <DialogContent sx={{ padding: '0px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'end', padding: '16px' }}>
            <IconButton size='small' onClick={handleClose}>
              <Icon icon='mdi:close' fontSize={'16px'} />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px', px: '16px', paddingBottom: '32px' }}>
            <DialogContentText sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#404040' }}>
              Withdraw Application
            </DialogContentText>
            <DialogContentText
              id='alert-dialog-description'
              sx={{ textAlign: 'center', fontSize: '16px', fontWeight: 400, color: '#404040' }}
            >
              Are you sure you want to withdraw this application?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #F0F0F0', padding: '16px !important' }}
        >
          <Button
            sx={{ flex: 1, textTransform: 'capitalize', background: '#F0F0F0', color: '#999' }}
            variant='contained'
            onClick={handleClose}
            color='inherit'
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{ flex: 1, textTransform: 'capitalize', background: '#F22', color: '#FFF' }}
            onClick={handleWithDraw}
            color='error'
            disabled={loadingWithDraw}
          >
            {loadingWithDraw ? <CircularProgress size={'16px'} /> : ' Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} sm={6} md={12}>
          <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
            {handleConditionalRendering()}
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

AllJobApplied.acl = {
  action: 'read',
  subject: 'home'
}

export default AllJobApplied
