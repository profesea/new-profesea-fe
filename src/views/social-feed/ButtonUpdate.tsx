import {
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  TextField,
  Typography,
  Avatar
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useSocialFeed } from 'src/hooks/useSocialFeed'
import { getCleanErrorMessage, getUserAvatar } from 'src/utils/helpers'
import ISocialFeed from 'src/contract/models/social_feed'
import { useAuth } from 'src/hooks/useAuth'

const ButtonUpdate = (props: { item: ISocialFeed; variant?: 'no-icon' | 'settings' }) => {
  const { user } = useAuth()
  const { item, variant } = props

  const { EditupdateStatus } = useSocialFeed()
  const [dialogOpen, setOpenDialog] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    setContent(item.content)
  }, [item])

  const handleUpdateStatus = async () => {
    setOnLoading(true)
    try {
      await EditupdateStatus({
        id: item.id,
        content_type: item.content_type,
        attachments: item.attachments,
        content: content
      })

      await setContent('')
      window.location.reload()
    } catch (error) {
      alert(getCleanErrorMessage(error))
    }
    setOnLoading(false)
  }

  return (
    <>
      {variant === 'settings' ? (
        <ListItemButton disabled={onLoading} onClick={() => setOpenDialog(!dialogOpen)}>
          <Icon icon='typcn:edit' fontSize={14} />
          <Typography sx={{ ml: 2 }}>Edit Post</Typography>
        </ListItemButton>
      ) : (
        <Button
          disabled={onLoading}
          sx={{
            color: variant ? 'black' : 'primary',
            fontSize: variant ? '12px' : '14px',
            fontWeight: variant ? 700 : 400,
            textTransform: 'none'
          }}
          variant={variant ? 'text' : undefined}
          size='small'
          onClick={() => setOpenDialog(!dialogOpen)}
          color='primary'
          startIcon={variant ? undefined : <Icon icon='typcn:edit' fontSize={10} />}
        >
          Edit
        </Button>
      )}
      <Dialog open={dialogOpen} onClose={() => setOpenDialog(!dialogOpen)}>
        <DialogTitle>
          <Typography color='primary' fontWeight='700' fontSize={16}>
            You're about to edit this post
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box mr={3} mt={1}>
              <Avatar src={getUserAvatar(user!)} alt={user?.name} sx={{ height: 50, width: 50 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                value={content}
                multiline
                fullWidth
                rows={3}
                placeholder='Start a post'
                variant='standard'
                onChange={e => setContent(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size='small' variant='contained' onClick={() => setOpenDialog(!dialogOpen)}>
            Cancel
          </Button>
          <Button size='small' variant='contained' color='success' disabled={onLoading} onClick={handleUpdateStatus}>
            {onLoading ? <CircularProgress style={{ fontSize: 16 }} /> : 'Update post'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ButtonUpdate
