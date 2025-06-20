import { CircularProgress, Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import ISocialFeedComment from 'src/contract/models/social_feed_comment'
import CommentResponseType from 'src/contract/types/comment_response_type'
import { useSocialFeed } from 'src/hooks/useSocialFeed'
import { getUserAvatar, toLinkCase, toTitleCase } from 'src/utils/helpers'
import ButtonLike from './ButtonLike'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'
import { IUser } from 'src/contract/models/user'
import ButtonDelete from './ButtonDelete'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import CommentForm from './CommentForm'

const SubCommentCard = (props: { comment: ISocialFeedComment; feedId: number }) => {
  const { comment, feedId } = props
  const [isLiked, setIsLiked] = useState(Boolean(comment.liked_at))
  const [countLikes, setCountLikes] = useState(comment.count_likes)
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser

  return (
    <Box key={comment.id} sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: 5 }}>
      <Box
        component={Link}
        href={`/${comment.user?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(comment.user?.username)}`}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Avatar
          sx={{ width: 36, height: 36 }}
          src={getUserAvatar(comment.user)}
          alt={comment.user.name || 'User Avatar'}
        />
        <Typography variant='body2' sx={{ color: 'black', fontSize: 14, fontWeight: 700 }}>
          {toTitleCase(comment.user.name)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='body1' sx={{ color: 'black', fontWeight: 400, whiteSpace: 'pre-line' }}>
          {comment.content}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Typography sx={{ color: '#949EA2', fontSize: 12, fontWeight: 400 }}>{comment.h_created_at}</Typography>
          {user.team_id !== 1 && (
            <ButtonLike
              variant='no-icon'
              item={{
                id: comment.id,
                liked_at: comment.liked_at,
                count_likes: countLikes,
                isLiked: isLiked,
                setIsLiked: setIsLiked,
                set_count_likes: setCountLikes
              }}
              likeableType='comment'
            />
          )}
          {(user.team_id == 1 || user.id == comment.user_id) && (
            <ButtonDelete
              item={{ id: comment.id, feedId, count_likes: countLikes, deleteComment: true }}
              variant='no-icon'
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}>
          <Icon color='#32497A' icon={isLiked ? 'ph:thumbs-up-fill' : 'ph:thumbs-up'} fontSize={16} />
          <Typography sx={{ color: '#32497A', fontSize: 14 }}>{comment.count_likes + (isLiked ? 1 : 0)}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

const SubCommentAreaView = (props: { item: ISocialFeedComment; feedId: number }) => {
  const { item, feedId } = props
  console.log('subcommentarea: ', item)
  const [onLoading, setOnLoading] = useState(true)
  const { getComments, subCommentSignature } = useSocialFeed()
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
    <Box sx={{ ml: 5, mt: 1 }}>
      {commentObj?.data && commentObj?.data.length > 0 && (
        <Box mb={5}>
          {commentObj?.data.reverse().map(comment => (
            <SubCommentCard key={comment.id} comment={comment} feedId={feedId} />
          ))}
        </Box>
      )}
      <CommentForm feedId={item.id} replyable_type='comment' main_feed_id={item.replyable_id} />
      {onLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  )
}

export default SubCommentAreaView
