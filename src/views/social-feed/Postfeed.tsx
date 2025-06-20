import Box from '@mui/material/Box'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  DialogActions,
  DialogContent,
  Divider,
  Fade,
  FadeProps,
  FormControlLabel,
  Stack,
  Typography
} from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { getCleanErrorMessage, getUserAvatar } from 'src/utils/helpers'
import { useSocialFeed } from 'src/hooks/useSocialFeed'
import { forwardRef, ReactElement, Ref, useState } from 'react'
// import ButtonUploadVideo from './ButtonUploadVideo'
// import ButtonUploadPhoto from './ButtonUploadPhoto'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

// Dialog
import Dialog from '@mui/material/Dialog'
import { HttpClient } from 'src/services'
import PostFeedDialog from './PostFeedDialog'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const Postfeed = () => {
  const { user, setUser } = useAuth()
  const { updateStatus } = useSocialFeed()
  // const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isOpenDialogPostFeed, setIsOpenDialogPostFeed] = useState(false)
  const [checked, isChecked] = useState(false)
  const [isAgree, setIsAgree] = useState<boolean | undefined>(user?.is_agree_policy_post)
  const [contentType, setContentType] = useState('text')

  const handleUpdateStatus = async (content_type: string, content: string, attachments?: any) => {
    if (!isAgree) {
      setIsOpenDialog(true)

      return
    }

    setIsLoading(true)
    try {
      await updateStatus({
        content_type: content_type,
        content: content,
        attachments: attachments
      })
    } catch (error) {
      alert(getCleanErrorMessage(error))
    }

    setIsLoading(false)
  }

  const handleOnCloseDialog = () => {
    setIsOpenDialog(!isOpenDialog)
  }

  const handleOnCloseDialogPostFeed = () => {
    setIsOpenDialogPostFeed(!isOpenDialogPostFeed)
  }

  const handleOpenDialogPostFeed = (contentType: string) => {
    setIsOpenDialogPostFeed(true)
    setContentType(contentType)
  }

  const handleUpdatePolicyPostStatus = async () => {
    const response = await HttpClient.post('/social-feed/post-policy', { agree: true })

    if (response.status != 200) {
      throw response.data.message ?? 'Something went wrong!'
    }

    setIsOpenDialog(false)
    isChecked(false)
    setIsAgree(true)
    setUser({ ...(user as unknown as any), is_agree_policy_post: true })
  }

  return (
    <>
      <PostFeedDialog
        contentTypeFromParent={contentType}
        isLoading={isLoading}
        isOpen={isOpenDialogPostFeed}
        onClose={handleOnCloseDialogPostFeed}
        user={user}
        handleUpdateStatus={handleUpdateStatus}
      />
      <Dialog
        fullWidth
        open={isOpenDialog}
        maxWidth='sm'
        scroll='body'
        onClose={handleOnCloseDialog}
        TransitionComponent={Transition}
      >
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
            onClick={handleOnCloseDialog}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>

          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant='body2' color={'#32487A'} fontWeight='600' fontSize={18}>
              Protect Your Privacy:
            </Typography>
            <Typography variant='body2'>Avoid Sharing Sensitive Information</Typography>
          </Box>

          <Stack direction={'column'} gap={2}>
            <Typography sx={{ textAlign: 'justify' }}>
              Make sure your post doesn't contain sensitive personal information such as ID numbers, passports, driver's
              licenses, home addresses, certification information, passwords, or other data that could compromise your
              security and privacy.
            </Typography>
            <Typography sx={{ textAlign: 'justify' }}>
              In the event of non-compliance, our platform reserves the right to remove or delete the post to ensure the
              safety of all users.
            </Typography>
            <Divider />
            <Typography sx={{ textAlign: 'justify' }}>
              Pastikan postingan Anda tidak mengandung informasi pribadi sensitif seperti nomor identitas, paspor, SIM,
              alamat rumah, informasi sertifikasi, kata sandi, atau data lain yang dapat membahayakan keamanan dan
              privasi Anda.
            </Typography>
            <Typography sx={{ textAlign: 'justify' }}>
              Jika terjadi pelanggaran, platform kami berhak untuk menghapus atau menghilangkan postingan tersebut demi
              menjaga keamanan semua pengguna.
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={event => isChecked(event.target.checked)} />}
              label='I have read and agree to the Feeds Policy'
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'end',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button
            variant='outlined'
            color='error'
            sx={{ mr: 2, textTransform: 'capitalize' }}
            onClick={handleOnCloseDialog}
          >
            Cancel
          </Button>
          <Button
            disabled={!checked}
            variant='contained'
            color='primary'
            sx={{ mr: 2, textTransform: 'capitalize' }}
            onClick={handleUpdatePolicyPostStatus}
          >
            Agree And Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={{
          border: 0,
          boxShadow: 0,
          color: 'common.white',
          backgroundColor: '#FFFFFF',
          padding: { xs: 3, md: 5 },
          borderRadius: '12px !important'
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid rgba(219, 219, 219, 1)', pb: '10px' }}
        >
          <Box mr={3} mt={1}>
            <Avatar src={getUserAvatar(user!)} alt={user?.name || 'User Avatar'} sx={{ height: 50, width: 50 }} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '10px'
            }}
          >
            <Button
              onClick={() => setIsOpenDialogPostFeed(true)}
              sx={{
                width: '100%',
                borderRadius: '30px !important',
                backgroundColor: 'rgba(240, 240, 240, 1)',
                textTransform: 'capitalize',
                justifyContent: 'flex-start !important',
                fontWeight: 400,
                fontSize: '14px',
                color: 'rgba(102, 102, 102, 1)'
              }}
            >
              Start a Post, Share Your Thoughts...
            </Button>
            {/* <TextField
              value={content}
              multiline
              fullWidth
              rows={3}
              placeholder='Start a post'
              variant='standard'
              onChange={e => setContent(e.target.value)}
            /> */}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 3, alignItems: 'end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              onClick={() => handleOpenDialogPostFeed('images')}
              size='small'
              variant='text'
              sx={{ textDecoration: 'none', textTransform: 'capitalize' }}
            >
              <Icon icon='icon-park-outline:picture-album' fontSize={24} color='#4CAF50' />
              <div style={{ marginLeft: 5, fontWeight: 700, fontSize: '14px', color: 'rgba(94, 94, 94, 1)' }}>
                Photo
              </div>
            </Button>
            <Button
              onClick={() => handleOpenDialogPostFeed('videos')}
              size='small'
              variant='text'
              sx={{ textDecoration: 'none', textTransform: 'capitalize' }}
            >
              <Icon icon='icon-park-outline:video' fontSize={24} color='#FF5722' />
              <div style={{ marginLeft: 5, fontWeight: 700, fontSize: '14px', color: 'rgba(94, 94, 94, 1)' }}>
                Video
              </div>
            </Button>

            {/* <Icon style={{ cursor: 'pointer' }} icon='icon-park-outline:picture-album' fontSize={24} color='#4CAF50' />
            <Icon style={{ cursor: 'pointer' }} icon='icon-park-outline:video' fontSize={24} color='#FF5722' /> */}
            {/* <ButtonUploadPhoto
              triggerDialogPolicy={() => setIsOpenDialog(true)}
              isAgree={isAgree as unknown as boolean}
            />
            <ButtonUploadVideo
              triggerDialogPolicy={() => setIsOpenDialog(true)}
              isAgree={isAgree as unknown as boolean}
            /> */}
          </Box>
          <Box flexGrow={1} textAlign='right'>
            {/* <Button
              sx={{ width: 45 }}
              disabled={isLoading}
              onClick={handleUpdateStatus}
              size='small'
              color='primary'
              variant='contained'
            >
              {isLoading ? <CircularProgress /> : 'Post'}
            </Button> */}
          </Box>
        </Box>
      </Card>
    </>
  )
}

export default Postfeed
