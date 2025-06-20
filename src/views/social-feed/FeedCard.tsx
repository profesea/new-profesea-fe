import { Avatar, Divider, Grid, Paper, Typography, Box } from '@mui/material'
import ISocialFeed from 'src/contract/models/social_feed'
import { getUserAvatar, toLinkCase, toTitleCase } from 'src/utils/helpers'
import { useState } from 'react'
import CommentAreaView from './CommentAreaView'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import FeedBottomActions from './FeedBottomActions'
import moment from 'moment'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
import { IUser } from 'src/contract/models/user'
import ImageListFeed from './ImageListFeed'
import ButtonSettings from './ButtonSettings'

type Prop = {
  item: ISocialFeed
  withBottomArea?: boolean
  user?: IUser
  type?: 'repost' | 'page'
}

const FeedCard = (props: Prop) => {
  const { item, withBottomArea, type } = props
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser
  const [openComment, setOpenComment] = useState(false)

  const profileLink = `/${item.user?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(item.user?.username)}`

  return (
    <Grid item xs={12} sx={{ mt: type ? 0 : '16px' }}>
      <Paper
        sx={{
          p: '24px',
          boxShadow: type ? 0 : 3,
          borderRadius: type ? '8px' : '12px',
          border: type ? '1px solid #DDDDDD' : '',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                component={Link}
                href={profileLink}
                alt={item.user.name || 'User Avatar'}
                src={getUserAvatar(item.user)}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography
                  component={Link}
                  href={profileLink}
                  sx={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}
                >
                  {toTitleCase(item.user.name)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon color={'#949EA2'} icon='formkit:time' fontSize='16px' />
                  <Typography sx={{ fontSize: '12px', color: '#949EA2' }}>
                    {moment(item.created_at).fromNow()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {user.id === item.user_id && <ButtonSettings item={item} />}
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 400, textAlign: 'justify', whiteSpace: 'pre-line' }}>
            {item.content}
          </Typography>
        </Box>
        <Box sx={{ mx: '-24px', display: 'flex', flexDirection: 'column' }}>
          {item.content_type !== 'text' && <ImageListFeed item={item} />}
          {item.feed_repost && (
            <Box sx={{ px: '24px' }}>
              <FeedCard item={item.feed_repost} withBottomArea={false} user={user} type='repost' />
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: '5px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}>
            <Icon color='#32497A' icon='ph:thumbs-up' fontSize={16} />
            <Typography sx={{ color: '#32497A', fontSize: 14 }}>{item.count_likes}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}>
            <Icon color='#32497A' icon='ph:chat-circle' fontSize={16} />
            <Typography sx={{ color: '#32497A', fontSize: 14 }}>{item.count_comments}</Typography>
          </Box>
        </Box>
        {withBottomArea !== false && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Divider sx={{ border: '1px solid #DDDDDD' }} />
            <FeedBottomActions item={item} openComment={openComment} setOpenComment={setOpenComment} />
          </Box>
        )}
        {withBottomArea !== false && <CommentAreaView item={item} />}
      </Paper>
    </Grid>
  )
}

export default FeedCard
