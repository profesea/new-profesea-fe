import { Icon } from '@iconify/react'
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Fade,
  FadeProps,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import moment from 'moment'
import Link from 'next/link'
import React, { forwardRef, ReactElement, Ref, useState } from 'react'
import ISocialFeed from 'src/contract/models/social_feed'
import { getUserAvatar, toLinkCase, toTitleCase } from 'src/utils/helpers'
import CommentAreaView from './CommentAreaView'
import FeedBottomActions from './FeedBottomActions'
import ImageSlider from './ImageSlider'

type Prop = {
  feed: ISocialFeed
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const PopUpFeed = (props: Prop) => {
  const { feed, openDialog, setOpenDialog } = props
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('md'))

  const [openComment, setOpenComment] = useState(false)
  const profileLink = `/${feed.user?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(feed.user?.username)}`

  return (
    <Dialog
      fullScreen={isXs}
      fullWidth={!isXs}
      open={openDialog}
      onClose={() => setOpenDialog(!openDialog)}
      TransitionComponent={Transition}
      maxWidth='lg'
      PaperProps={{ sx: { borderRadius: isXs ? '0 !important' : '' } }}
    >
      <DialogContent sx={{ position: 'relative', p: '0 !important' }}>
        <IconButton
          size='small'
          onClick={() => setOpenDialog(!openDialog)}
          sx={{ position: 'absolute', zIndex: 2, right: '12px', top: '12px' }}
        >
          <Icon icon='mdi:close' color={isXs ? 'white' : ''} />
        </IconButton>
        <Grid
          container
          sx={{ display: 'flex', flexDirection: isXs ? 'column' : null, flexWrap: isXs ? 'wrap' : 'nowrap' }}
        >
          <Grid item sx={{ flexGrow: 1, backgroundColor: '#1B1F23', height: isXs ? '250px' : '530px' }}>
            <ImageSlider items={feed.attachments} />
          </Grid>
          <Grid
            item
            sx={{
              flexShrink: 0,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              width: isXs ? '100%' : '400px',
              height: isXs ? 'fit-content' : '530px',
              gap: '16px',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar
                  component={Link}
                  href={profileLink}
                  alt={feed.user.name || 'User Avatar'}
                  src={getUserAvatar(feed.user)}
                  sx={{ width: 36, height: 36 }}
                />
                <Box>
                  <Typography
                    component={Link}
                    href={profileLink}
                    sx={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}
                  >
                    {toTitleCase(feed.user.name)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon color={'#949EA2'} icon='formkit:time' fontSize='16px' />
                    <Typography sx={{ fontSize: '12px', color: '#949EA2' }}>
                      {moment(feed.created_at).fromNow()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 400, textAlign: 'justify', whiteSpace: 'pre-line' }}>
                {feed.content}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}>
                <Icon color='#32497A' icon='ph:thumbs-up' fontSize={16} />
                <Typography sx={{ color: '#32497A', fontSize: 14 }}>{feed.count_likes}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}>
                <Icon color='#32497A' icon='ph:chat-circle' fontSize={16} />
                <Typography sx={{ color: '#32497A', fontSize: 14 }}>{feed.count_comments}</Typography>
              </Box>
            </Box>
            <Box>
              <Divider sx={{ mb: '6px' }} />
              <FeedBottomActions item={feed} openComment={openComment} setOpenComment={setOpenComment} />
              <Divider sx={{ mt: '6px' }} />
            </Box>
            <CommentAreaView item={feed} placement='popup' />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default PopUpFeed
