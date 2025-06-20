import { CircularProgress, Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import ISocialFeedComment from 'src/contract/models/social_feed_comment'
import CommentResponseType from 'src/contract/types/comment_response_type'
import { getUserAvatar, toTitleCase } from 'src/utils/helpers'
import ButtonLike from './ButtonLike'
import { useAlumniFeed } from 'src/hooks/useAlumniFeed'
import CommentFormAlumni from './CommentFormAlumni'

const SubCommentCardAlumni = (props: { comment: ISocialFeedComment }) => {
  const [isLike, setIsLiked] = useState(Boolean(props.comment.liked_at))
  const { comment } = props

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
          <Typography variant='body2' sx={{ color: '#262525', fontWeight: 500 }}>
            {toTitleCase(comment.user.name)}
          </Typography>
          <Typography sx={{ color: '#262525', fontWeight: 400 }}>{comment.h_created_at}</Typography>
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
            setIsLiked,
            set_count_likes: (count: number) => {
              comment.count_likes = count
            }
          }}
          likeableType='comment'
        />
      </Box>
    </Box>
  )
}

const SubCommentAreaViewAlumni = (props: { item: ISocialFeedComment }) => {
  const { item } = props
  const [onLoading, setOnLoading] = useState(true)
  const { getComments, subCommentSignature } = useAlumniFeed()
  const [commentObj, setCommentObj] = useState<CommentResponseType>()

  const loadComments = async () => {
    setOnLoading(true)
    const obj = await getComments(item.id, 1, 7, 'comment')
    setCommentObj(obj)
    setOnLoading(false)
  }

  useEffect(() => {
    loadComments()
  }, [subCommentSignature])

  return (
    <Box component='div' sx={{ ml: 5 }}>
      {commentObj?.data && commentObj?.data.length > 0 && (
        <Box mb={5}>
          {commentObj?.data.reverse().map(comment => (
            <SubCommentCardAlumni key={comment.id} comment={comment} />
          ))}
        </Box>
      )}

      {onLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      )}

      <CommentFormAlumni feedId={item.id} replyable_type='comment' main_feed_id={item.replyable_id} />
    </Box>
  )
}

export default SubCommentAreaViewAlumni
