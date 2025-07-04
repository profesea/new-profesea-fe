import { useEffect, useState } from 'react'
import { Avatar, Box, Divider, Grid, Typography, Button } from '@mui/material'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import moment from 'moment'
import ISocialFeed from 'src/contract/models/social_feed'
import FetchFeedPayload from 'src/contract/params/fetch_feed_payload'
import { HttpClient } from 'src/services'
import { getUserAvatar, toLinkCase, toTitleCase } from 'src/utils/helpers'
import { IUser } from 'src/contract/models/user'
import ImageListFeed from '../social-feed/ImageListFeed'
import FeedCard from '../social-feed/FeedCard'

const Activity = ({ dataUser, status }: { dataUser: IUser; status: boolean }) => {
  const [feeds, setFeeds] = useState<ISocialFeed[]>([])
  const [onLoading, setOnLoading] = useState(false)

  const fetchFeeds = async (payload: FetchFeedPayload) => {
    let sPage = 1
    if (payload.mPage) {
      sPage = payload.mPage
    }

    if (sPage == 1) setOnLoading(true)

    try {
      const url = 'public/data/social-feed/feed/'
      const response = await HttpClient.get(url, {
        page: sPage,
        ...payload
      })

      if (response.status == 200) {
        const { feeds } = response.data as { feeds: { data: ISocialFeed[]; next_page_url?: string; total: number } }
        if (feeds.data.length && feeds.data.length > 0) {
          if (sPage == 1) {
            setFeeds(feeds.data)
          } else {
            setFeeds((old: any) => {
              const newItems = old
              feeds.data.forEach(e => newItems.push(e))

              return newItems
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
    setOnLoading(false)
  }

  useEffect(() => {
    fetchFeeds({ mPage: 1, take: 3, user_id: dataUser?.id })
  }, [dataUser])

  const isStatusLink = (link: string) => {
    if (!status) {
      return `/login/?returnUrl=` + link
    }

    return link
  }

  return (
    <Box sx={{ borderRadius: '16px', backgroundColor: '#FFFFFF', boxShadow: 3, overflow: 'hidden' }}>
      <Box sx={{ p: '24px' }}>
        <Typography sx={{ mb: '16px', color: 'black', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' }}>
          activity
        </Typography>
        {onLoading && <Typography style={{ textAlign: 'center' }}> Loading ...</Typography>}
        {feeds.length > 0
          ? feeds.map((item, index) => {
              const profileLink = `/${item.user?.role === 'Seafarer' ? 'profile' : 'company'}/${
                item.user?.id
              }/${toLinkCase(item.user?.username)}`

              return (
                <Link href={`/feed/${item.id}`} key={index}>
                  <Grid container spacing={6} pl={1}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar
                          component={Link}
                          href={isStatusLink(profileLink)}
                          alt='profile-picture'
                          src={getUserAvatar(item.user)}
                          sx={{ width: 42, height: 42 }}
                        />
                        <Box>
                          <Typography
                            component={Link}
                            href={isStatusLink(profileLink)}
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
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 400, textAlign: 'justify', whiteSpace: 'pre-line' }}>
                        {item.content}
                      </Typography>
                      {item.content_type !== 'text' && <ImageListFeed item={item} />}
                      {item.feed_repost && (
                        <Box sx={{ px: '24px' }}>
                          <FeedCard item={item.feed_repost} withBottomArea={false} user={dataUser} type='repost' />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', gap: '16px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon icon='material-symbols:thumb-up' style={{ fontSize: 16, color: '#32497A' }} />
                        <Typography sx={{ fontSize: 14, color: '#444B4E' }}>{item.count_likes}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon icon='iconamoon:comment' style={{ fontSize: 16, color: '#32497A' }} />
                        <Typography sx={{ fontSize: 14, color: '#444B4E' }}>{item.count_comments}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {index !== feeds.length - 1 && <Divider sx={{ my: '24px' }} />}
                </Link>
              )
            })
          : !onLoading && (
              <Box>
                <Typography sx={{ fontSize: '16px', color: 'black' }}>
                  {`${dataUser.username} hasn't posted yet`}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#949EA2' }}>
                  {`Recent activities will be displayed here.`}
                </Typography>
              </Box>
            )}
      </Box>
      <Divider sx={{ mx: '24px' }} />
      <Button
        endIcon={<Icon icon='mingcute:right-fill' style={{ fontSize: 18 }} />}
        href={isStatusLink(
          `/${dataUser?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(dataUser?.username)}/activities`
        )}
        sx={{
          py: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textTransform: 'none',
          color: 'primary.main',
          fontSize: 14,
          fontWeight: 'bold',
          borderRadius: '0 !important'
        }}
      >
        Show more posts
      </Button>
    </Box>
  )
}

export default Activity
