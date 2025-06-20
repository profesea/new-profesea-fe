import { CircularProgress, Avatar, Typography, Button, Grid, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import ISocialFeed from 'src/contract/models/social_feed'
import ISocialFeedComment from 'src/contract/models/social_feed_comment'
import CommentResponseType from 'src/contract/types/comment_response_type'
import { useSocialFeed } from 'src/hooks/useSocialFeed'
import { getUserAvatar, timeCreated, toLinkCase, toTitleCase } from 'src/utils/helpers'
import CommentForm from './CommentForm'
import SubCommentAreaView from './SubCommentAreaView'
import ButtonLike from './ButtonLike'
import Link from 'next/link'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
import { IUser } from 'src/contract/models/user'
import ButtonDelete from './ButtonDelete'
import { Icon } from '@iconify/react'

const CommentCard = (props: { comment: ISocialFeedComment; feedId: number }) => {
  const { comment, feedId } = props
  const [openReply, setOpenReply] = useState(false)
  const [isLiked, setIsLiked] = useState(Boolean(comment.liked_at))
  const [countLikes, setCountLikes] = useState(comment.count_likes)
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser

  return (
    <Box
      key={comment.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        '&:hover .delete-button': {
          display: 'inline-block'
        }
      }}
    >
      <Box
        component={Link}
        href={`/${comment.user?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(comment.user?.username)}`}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Avatar sx={{ width: 36, height: 36 }} src={getUserAvatar(comment.user)} alt={comment.user?.name} />
        <Typography variant='body2' sx={{ color: 'black', fontSize: 14, fontWeight: 700 }}>
          {toTitleCase(comment.user.name)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='body1' sx={{ color: 'black', fontWeight: 400, whiteSpace: 'pre-line' }}>
          {comment.content}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center', position: 'relative' }}>
          <Typography sx={{ color: '#949EA2', py: '9px', fontSize: 12, fontWeight: 400 }}>
            {timeCreated(comment.created_at, 'feed')}
          </Typography>
          {user.team_id !== 1 && (
            <ButtonLike
              variant='no-icon'
              item={{
                id: comment.id,
                liked_at: comment.liked_at,
                count_likes: countLikes,
                set_count_likes: setCountLikes,
                isLiked: isLiked,
                setIsLiked: setIsLiked
              }}
              likeableType='comment'
            />
          )}
          <Button
            onClick={() => setOpenReply(!openReply)}
            sx={{
              color: '#949EA2',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'none'
            }}
            variant='text'
            size='small'
          >
            {comment.count_replies > 0 && comment.count_replies} Reply
          </Button>
          {(user.team_id === 1 || user.id === comment.user_id) && (
            <Box className='delete-button' sx={{ display: 'none' }}>
              <ButtonDelete
                item={{ id: comment.id, feedId, count_likes: countLikes, deleteComment: true }}
                variant='no-icon'
              />
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}>
          <Icon color='#32497A' icon={isLiked ? 'ph:thumbs-up-fill' : 'ph:thumbs-up'} fontSize={16} />
          <Typography sx={{ color: '#32497A', fontSize: 14 }}>{countLikes}</Typography>
        </Box>
      </Box>
      {comment.count_replies !== 0 && (
        <Grid container>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => setOpenReply(!openReply)}
          >
            <Icon icon={openReply === true ? 'mdi:chevron-up' : 'mdi:chevron-down'} fontSize={18} color='primary' />
            <Typography color='primary' sx={{ fontSize: 14, fontWeight: 700 }}>
              {comment.count_replies} replies
            </Typography>
          </Box>
        </Grid>
      )}
      {openReply && <SubCommentAreaView item={comment} feedId={feedId} />}
    </Box>
  )
}

const CommentAreaView = (props: { item: ISocialFeed; placement?: 'popup' }) => {
  const { item, placement } = props
  const [onLoading, setOnLoading] = useState(true)
  const [commentObj, setCommentObj] = useState<CommentResponseType>()
  const { getComments, commentSignature } = useSocialFeed()
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser

  const loadComments = async () => {
    setOnLoading(true)
    const obj = await getComments(item.id, 1, 1000, 'feed')
    setCommentObj(obj)
    setOnLoading(false)
  }

  useEffect(() => {
    loadComments()
  }, [commentSignature])

  const [visibleComments, setVisibleComments] = useState(2)

  const handleLoadMore = () => {
    if (commentObj) {
      setVisibleComments(commentObj?.data.length)
    }
  }

  if (placement)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {onLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px' }}>
            <CircularProgress />
          </Box>
        )}
        {!onLoading && commentObj?.data && commentObj?.data.length > 0 && (
          <Stack spacing='16px' sx={{ pb: '16px' }}>
            {commentObj?.data.map(comment => (
              <CommentCard key={comment.id} comment={comment} feedId={item.id} />
            ))}
          </Stack>
        )}
        {user.team_id !== 1 && <CommentForm feedId={item.id} replyable_type='feed' main_feed_id={item.id} />}
      </Box>
    )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {onLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '16px' }}>
          <CircularProgress />
        </Box>
      )}
      {user.team_id !== 1 && <CommentForm feedId={item.id} replyable_type='feed' main_feed_id={item.id} />}
      {!onLoading && commentObj?.data && commentObj?.data.length > 0 && (
        <Stack spacing='16px' sx={{ pt: '16px' }}>
          {commentObj?.data.slice(0, visibleComments).map(comment => (
            <CommentCard key={comment.id} comment={comment} feedId={item.id} />
          ))}
          {commentObj?.data.length > visibleComments && (
            <Button
              onClick={handleLoadMore}
              variant='text'
              size='small'
              sx={{ alignSelf: 'start', fontWeight: 500, textTransform: 'none' }}
            >
              Load more comments
            </Button>
          )}
        </Stack>
      )}
    </Box>
  )
}

export default CommentAreaView
