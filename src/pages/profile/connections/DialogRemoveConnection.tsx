import { Ref, forwardRef, ReactElement } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
// import toast from 'react-hot-toast'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'src/@core/components/icon'

import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import { IUser } from 'src/contract/models/user'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

type DeleteDialogProps = {
  selectedItem: IUser | undefined
  visible: boolean
  onCloseClick: VoidFunction
  loadConnection: VoidFunction
}

const DialogRemoveConnection = (props: DeleteDialogProps) => {
  const handleDelete = async () => {
    HttpClient.post(AppConfig.baseUrl + '/friendship/disconnect', {
      friend_id: props?.selectedItem?.id
    }).then(() => {
      props.onCloseClick()
      props.loadConnection()
    })
  }

  return (
    <Dialog fullWidth open={props.visible} maxWidth='sm' onClose={props.onCloseClick} TransitionComponent={Transition}>
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <IconButton size='small' onClick={props.onCloseClick} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Confirm Remove Connection
          </Typography>
          <Typography variant='body2'>
            Are you sure Remove Connection with <strong>{props?.selectedItem?.name}</strong> ?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button onClick={handleDelete} variant='contained' color='error' sx={{ mr: 2 }} type='button'>
          Yes
        </Button>
        <Button variant='outlined' color='secondary' onClick={props.onCloseClick}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogRemoveConnection
