import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button, Card, CircularProgress, useMediaQuery } from '@mui/material'
import Typography from '@mui/material/Typography'
import ISocialFeed from 'src/contract/models/social_feed'
import SocialFeedContext from 'src/context/SocialFeedContext'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSocialFeed } from 'src/hooks/useSocialFeed'
import FeedCard from './FeedCard'
import { useEffect } from 'react'
import CenterAd from '../banner-ad/CenterAd'
import { Icon } from '@iconify/react'
import { useTheme } from '@mui/material/styles'

const renderList = (feeds: ISocialFeed[]) => {
  const components: JSX.Element[] = []

  if (!feeds || feeds.length === 0) {
    return (
      <Card
        sx={{
          mt: 2,
          border: 0,
          boxShadow: 0,
          color: 'common.white',
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'column'
        }}
      >
        <Grid xs={12} item container spacing={0} direction='column' alignItems='center' justifyContent='center'>
          <img
            alt='logo'
            src={'/images/nofeed.jpg'}
            style={{
              width: '35%',
              padding: 10,
              margin: 0
            }}
          />
        </Grid>
      </Card>
    )
  }

  feeds.forEach((item, index) => {
    components.push(<FeedCard item={item} key={`feedItem${item.id}`} />)

    if ((index + 1) % 6 === 0) {
      components.push(
        <Box sx={{ mt: 2, width: '100%' }}>
          <CenterAd key={`adsComponent${index}`} />
        </Box>
      )
    }
  })

  return components
}

const ListFeedView = ({ username }: { username?: any }) => {
  const { fetchFeeds, hasNextPage, totalFeed } = useSocialFeed()
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))

  useEffect(() => {
    fetchFeeds({ take: 7, username })
  }, [])

  return (
    <SocialFeedContext.Consumer>
      {({ feeds, onLoading }) => {
        if (onLoading) {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress sx={{ mt: 20 }} />
            </Box>
          )
        }

        if (isMobile) {
          return (
            <>
              <Grid container>{renderList(feeds)}</Grid>
              {hasNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}>
                  <Button
                    fullWidth
                    variant='outlined'
                    sx={{ textTransform: 'capitalize', display: 'flex', gap: '10px' }}
                    onClick={() => fetchFeeds({ take: 7, username })}
                  >
                    Show More Feeds
                    <Icon icon={'fe:arrow-down'} />
                  </Button>
                </Box>
              )}
            </>
          )
        }

        return (
          <InfiniteScroll
            dataLength={totalFeed}
            next={() => fetchFeeds({ take: 7, username })}
            hasMore={hasNextPage}
            loader={
              <Typography mt={5} color={'text.secondary'}>
                Loading..
              </Typography>
            }
          >
            <Grid container>{renderList(feeds)}</Grid>
          </InfiniteScroll>
        )
      }}
    </SocialFeedContext.Consumer>
  )
}

export default ListFeedView
