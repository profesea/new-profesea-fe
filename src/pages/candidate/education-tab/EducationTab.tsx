import {
  Box,
  useMediaQuery,
  Button,
  Typography,
  SwipeableDrawer,
  IconButton,
  Dialog,
  DialogContent,
  FadeProps,
  Fade,
  DialogActions,
  CircularProgress
} from '@mui/material'
import React, { forwardRef, ReactElement, Ref, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import IEducation from 'src/contract/models/education'
import { format } from 'date-fns'
import FormEducation from './FormEducation'
import { v4 } from 'uuid'
import DialogAddEducation from '../DialogAddEducation'
import toast from 'react-hot-toast'
import DialogEditEducation from '../DialogEditEducation'
import { useProfileCompletion } from 'src/hooks/useProfileCompletion'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const EducationTab = () => {
  const { refetch, setRefetch } = useProfileCompletion()
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))
  const [hookSignature, setHookSignature] = useState(v4())

  // user data
  const [userEducations, setUserEducations] = useState<IEducation[]>([])
  const [eduId, setEduId] = useState<any>(null)

  const [openDrawer, setOpenDrawer] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openModalDeleteEducation, setOpenModalDeleteEducation] = useState(false)
  const [onLoadingDelete, setOnLoadingDelete] = useState(false)

  const [selectedItem, setSelectedItem] = useState<any>()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const toggleDrawer = (toggle: boolean) => {
    setOpenDrawer(toggle)
  }

  const toggleModal = () => {
    setOpenModal(!openModal)
  }

  const fetchUserEducations = () => {
    setLoading(true)
    HttpClient.get(AppConfig.baseUrl + '/user/education?page=1&take=100').then(response => {
      const educations = response?.data.educations

      setUserEducations(educations)
      setLoading(false)
    })
  }

  const handleDeleteEducation = async (id: any) => {
    setOnLoadingDelete(true)
    try {
      const response = await HttpClient.del('/user/education/' + id)
      if (response?.status === 200) {
        fetchUserEducations()
        setRefetch(!refetch)
        toast.success(`Deleted Successfully!`)
      }
    } catch (error) {
      toast.error('Failed delete education!')
    } finally {
      setOnLoadingDelete(false)
      setEduId(null)
      setOpenModalDeleteEducation(false)
    }
  }

  const editEducation = (item: any) => {
    setSelectedItem(item)
    setOpenEditModal(!openEditModal)
  }

  useEffect(() => {
    fetchUserEducations()
  }, [hookSignature])

  if (loading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </>
    )
  }

  return (
    <>
      <DialogEditEducation
        key={selectedItem?.id}
        selectedItem={selectedItem}
        visible={openEditModal}
        onCloseClick={() => setOpenEditModal(!openEditModal)}
        onStateChange={() => setHookSignature(v4())}
      />
      <Dialog open={openModalDeleteEducation} maxWidth='sm' TransitionComponent={Transition}>
        <DialogContent sx={{ padding: '0px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
            <Box>
              <Typography color={'#32487A'} fontWeight='700' fontSize={18}>
                Delete Education
              </Typography>
            </Box>
            <IconButton size='small' onClick={() => setOpenModalDeleteEducation(!openModalDeleteEducation)}>
              <Icon icon='mdi:close' fontSize={'16px'} />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: '32px',
              px: '16px',
              borderTop: '1px solid #F0F0F0',
              borderBottom: '1px solid #F0F0F0'
            }}
          >
            <Typography>Are you sure you want to delete your Education?</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '0px', display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              gap: 4
            }}
          >
            <Button
              variant='contained'
              size='small'
              onClick={() => setOpenModalDeleteEducation(!openModalDeleteEducation)}
              sx={{
                background: '#DDD',
                flex: 1,
                border: 'none',
                textTransform: 'capitalize',
                color: '#404040',
                '&:hover': {
                  backgroundColor: 'initial'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              size='small'
              onClick={() => handleDeleteEducation(eduId)}
              sx={{ background: 'red', textTransform: 'capitalize', flex: 1 }}
            >
              {onLoadingDelete ? <CircularProgress size={25} style={{ color: 'white' }} /> : 'Delete'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <DialogAddEducation
        visible={openModal}
        getUserEducation={fetchUserEducations}
        onStateChange={() => setHookSignature(v4())}
        onCloseClick={toggleModal}
      />
      <SwipeableDrawer
        anchor='bottom'
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography fontSize={16} fontWeight={700} color={'#32497A'}>
              Add Educational Info
            </Typography>
            <IconButton
              size='small'
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              onClick={() => toggleDrawer(false)}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
          <Box sx={{ px: '16px', py: '24px', marginBottom: '60px' }}>
            {/* form education for mobile  */}
            <FormEducation onClose={() => toggleDrawer(false)} getUserEducation={fetchUserEducations} />
          </Box>
        </Box>
      </SwipeableDrawer>
      {userEducations.length == 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: isMobile ? '64px' : '78px',
            px: isMobile ? '24px' : '40px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <Image src={'/images/fluent-mdl2_education.png'} alt={'mdl2'} width={'64'} height={'65'} />
              <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#404040', textAlign: 'center' }}>
                No education yet
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#404040', textAlign: 'center' }}>
                stand out and unlock more opportunities!
              </Typography>
            </Box>
            <Box>
              <Button
                sx={{ fontSize: '14px', fontWeight: 400, textTransform: 'capitalize' }}
                variant='outlined'
                onClick={() => (isMobile ? toggleDrawer(true) : toggleModal())}
              >
                <Icon icon={'mdi-light:plus'} fontSize={16} style={{ marginRight: '10px' }} />
                Add Education
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: isMobile ? '40px' : 0,
              marginTop: '20px'
            }}
          >
            <Box>
              <Typography fontSize={16} fontWeight={700} color={'#32497A'}>
                Educational Info
              </Typography>
              <Typography fontSize={14} fontWeight={400} color={'#404040'}>
                Enhance your profile by adding your education
              </Typography>
            </Box>
            <Box>
              <Button
                sx={{ fontSize: '14px', fontWeight: 400, textTransform: 'capitalize' }}
                variant='outlined'
                onClick={() => (isMobile ? toggleDrawer(true) : toggleModal())}
              >
                <Icon icon={'mdi-light:plus'} fontSize={16} style={{ marginRight: '10px' }} />
                Add
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {userEducations.map((e, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.08)',
                  background: '#FFF',
                  padding: '24px'
                }}
              >
                <Box>
                  <Typography fontSize={16} fontWeight={700} color={'#404040'}>
                    {e.title ? e.title : '-'}
                  </Typography>
                  <Typography fontSize={14} fontWeight={400} color={'#303030'}>
                    {e.degree ? e.degree : null} - {e?.major ? e?.major : null}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Icon
                      icon={'ph:pencil-simple-line-light'}
                      fontSize={24}
                      style={{ marginRight: '10px', cursor: 'pointer' }}
                      onClick={() => editEducation(e)}
                    />
                    <Icon
                      icon={'material-symbols-light:delete-outline'}
                      fontSize={24}
                      style={{ marginRight: '10px', color: 'red', cursor: 'pointer' }}
                      onClick={() => {
                        setOpenModalDeleteEducation(true)
                        setEduId(e?.id)
                      }}
                    />
                  </Box>
                  <Box>
                    {e?.still_here == 0 ? (
                      <Typography fontSize={14} fontWeight={400} color={'#868686'}>
                        {format(new Date(e?.start_date), 'MMM yyyy')} - {format(new Date(e?.end_date), 'MMM yyyy')}
                      </Typography>
                    ) : (
                      <Typography fontSize={14} fontWeight={400} color={'#868686'}></Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </div>
      )}
    </>
  )
}

export default EducationTab
