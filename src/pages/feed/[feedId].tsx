import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, CircularProgress, Grid, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SocialFeedProvider } from 'src/context/SocialFeedContext'
import ISocialFeed from 'src/contract/models/social_feed'
import { HttpClient } from 'src/services'
import FeedCard from 'src/views/social-feed/FeedCard'

const FeedDetailApp = () => {
  return (
    <SocialFeedProvider>
      <FeedDetail />
    </SocialFeedProvider>
  )
}

const FeedDetail = () => {
  const router = useRouter()
  const feedId = parseInt(router.query?.feedId as string)
  const [feed, setFeed] = useState<ISocialFeed>()

  const getDetailFeed = async () => {
    const response = await HttpClient.get(`/social-feed/feed/${feedId}`)
    if (response.status != 200) {
      alert(response.data?.message ?? 'Unknow error!')

      return
    }

    setFeed(response.data.feed)
  }

  useEffect(() => {
    getDetailFeed()
  }, [feedId])

  return (
    <Box sx={{ position: 'relative' }}>
      <Grid container sx={{ position: 'absolute', top: '12px', left: '-72px' }}>
        <IconButton onClick={() => router.push(`/candidate/trainings`)}>
          <FontAwesomeIcon icon={faArrowLeft} color='text.primary' />
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        {feed ? <FeedCard item={feed} type='page' /> : <CircularProgress />}
      </Grid>
    </Box>
  )
}

FeedDetailApp.acl = {
  action: 'read',
  subject: 'feed-detail'
}

export default FeedDetailApp
