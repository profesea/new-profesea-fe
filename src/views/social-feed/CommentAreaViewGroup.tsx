import { CircularProgress, Divider, Avatar, Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import ISocialFeed from 'src/contract/models/social_feed'
import ISocialFeedComment from 'src/contract/models/social_feed_comment'
import CommentResponseType from 'src/contract/types/comment_response_type'
import { getUserAvatar, toLinkCase, toTitleCase } from 'src/utils/helpers'
import ButtonLike from './ButtonLike'
import Link from 'next/link'
import { useGroupFeed } from 'src/hooks/useGroupFeed'
import CommentFormGroup from './CommentFormGroup'
import SubCommentAreaViewGroup from './SubCommentAreaViewGroup'

const CommentCard = (props: { comment: ISocialFeedComment }) => {
  const { comment } = props
  const [isLike, setIsLiked] = useState(Boolean(comment.liked_at))
  const [openReply, setOpenReply] = useState(false)

  return (
    <Box key={comment.id} sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box>
          <Avatar
            sx={{ width: 35, height: 35, mr: 3, mb: 3 }}
            src={getUserAvatar(comment.user)}
            alt={comment.user.name || 'User Avatar'}
          />
        </Box>
        <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
          <Link
            style={{ textDecoration: 'none' }}
            href={`/${comment.user?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(comment.user?.username)}`}
          >
            <Typography variant='body2' sx={{ color: '#0a66c2', fontWeight: 600 }}>
              {toTitleCase(comment.user.name)}
            </Typography>
            <Typography sx={{ color: '#262525', fontWeight: 400 }}>{comment.h_created_at}</Typography>
          </Link>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
        <Typography variant='body1' sx={{ color: '#262525', fontWeight: 400, margin: '5px' }}>
          {comment.content}
        </Typography>
      </Box>
      <Box>
        <ButtonLike
          variant='no-icon'
          item={{
            id: comment.id,
            liked_at: comment.liked_at,
            count_likes: comment.count_likes,
            isLiked: isLike,
            set_count_likes: () => {},
            setIsLiked
          }}
          likeableType='comment'
        />
        <Button
          onClick={() => setOpenReply(!openReply)}
          sx={{ textTransform: 'none', fontSize: 11 }}
          variant='text'
          size='small'
        >
          {comment.count_replies > 0 && comment.count_replies} Reply
        </Button>
      </Box>

      {openReply && <SubCommentAreaViewGroup key={comment.id} item={comment} />}
    </Box>
  )
}

const CommentAreaViewGroup = (props: { item: ISocialFeed }) => {
  const { item } = props
  const [onLoading, setOnLoading] = useState(true)
  const { getComments, commentSignature } = useGroupFeed()
  const [commentObj, setCommentObj] = useState<CommentResponseType>()

  const loadComments = async () => {
    setOnLoading(true)
    const obj = await getComments(item.id, 1, 7, 'feed')
    setCommentObj(obj)
    setOnLoading(false)
  }

  useEffect(() => {
    loadComments()
  }, [commentSignature])

  return (
    <>
      <CommentFormGroup feedId={item.id} replyable_type='feed' main_feed_id={item.id} />
      {onLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {!onLoading && commentObj?.data && commentObj?.data.length > 0 && (
        <Box>
          <Divider sx={{ mt: 3 }} />
          {commentObj?.data.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </Box>
      )}
    </>
  )
}

export default CommentAreaViewGroup
