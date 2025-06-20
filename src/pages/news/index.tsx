import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material'
import Head from 'next/head'
import React, { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'
import landingPageStyle from 'src/@core/styles/landing-page/landing-page-news'
import BreadcrumbsNews from './BreadcrumbsNews'
import { BreadcrumbsNewsProvider, useBreadcrumbsNews } from 'src/context/BreadcrumbsNewsContext'
import HighlightedCardNews from './HighlightedCardNews'
import YoutubeEmbed from './YoutubeEmbed'
import styles from '../../../styles/scss/CardNews.module.scss'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import FooterView from 'src/views/landing-page/footerView'
import { HttpClient } from 'src/services'
import INews from 'src/contract/models/news'
import moment from 'moment'
import Link from 'next/link'
import themeConfig from 'src/configs/themeConfig'

interface INewsCategory {
  id: number
  name: string
}

const NewsPage = () => {
  const { dispatch } = useBreadcrumbsNews()
  const { t, i18n } = useTranslation()
  const [tabValue, setTabValue] = useState<any>(null)
  const [newsCategories, setNewsCategories] = useState<INewsCategory[]>([])
  const [news, setNews] = useState<INews[]>([])
  const [featuredNews, setFeaturedNews] = useState<INews[]>([])
  const [isScrollAbleTab, setIsScrollAbleTab] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsScrollAbleTab(window.innerWidth <= 500)
    }

    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMBS',
      payload: [
        {
          name: 'Homepage',
          path: '/'
        },
        {
          name: 'News',
          path: '/news'
        }
      ]
    })
  }, [dispatch])

  useEffect(() => {
    handleFetchNewsCategory()
    handleFetchFeaturedNews()
  }, [])

  useEffect(() => {
    handleFecthNewsWithCategoryId()
  }, [tabValue])

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 200) {
  //       // adjust this value as needed
  //       setIsFixed(true)
  //     } else {
  //       setIsFixed(false)
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  const handleFecthNewsWithCategoryId = async () => {
    const categoryId = tabValue ? tabValue : ''

    try {
      const response = await HttpClient.get(`/news/?page=1&take=1000&type=News&category_id=${categoryId}`)
      const news = response?.data?.news?.data
      setNews(news)
    } catch (error) {
      console.error(error)
    }
  }

  const handleFetchFeaturedNews = async () => {
    try {
      const response = await HttpClient.get(`/news/?page=1&take=1000&type=News&featured_news=1`)
      setFeaturedNews(response?.data?.news?.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleFetchNewsCategory = async () => {
    try {
      const response = await HttpClient.get(`public/data/news-category/?page=1&take=1000`)
      const newsCategories = response?.data?.data?.data
      setNewsCategories(newsCategories)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  // const truncateText = (text: string, maxLength: number) => {
  //   if (text.length <= maxLength) {
  //     return text
  //   }

  //   return text.substring(0, maxLength) + '...'
  // }

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - ${t('landing_news_title')}`}</title>
        <meta property='og:title' content={`${themeConfig.templateName} - ${t('landing_news_title')}`} />
        <meta property='og:description' content={`${t('landing_news_description')}`} />
        <meta property='og:image' content='images/logoprofesea.png' />
        <meta name='description' content={`${t('landing_news_description')}`} />
        <meta name='keywords' content={`${t('landing_news_keyword')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
      </Head>

      <Box
        sx={{
          px: { xs: '24px', md: '120px' }
        }}
      >
        <h1 style={{ display: 'none' }}>Berita Maritim Terbaru</h1>
        <h2 style={{ display: 'none' }}>Berita Logistik Terbaru</h2>
        <Box
          sx={{
            my: '24px'
          }}
        >
          <BreadcrumbsNews />
        </Box>
        <Grid container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
          <Grid
            item
            xs={12}
            sx={{
              ...landingPageStyle.bannerHero,
              width: '100%',
              borderRadius: '12px'
            }}
          />
          {featuredNews.length !== 0 && (
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: {
                    xs: '18px',
                    lg: '24px'
                  },
                  mb: '24px'
                }}
                color={'primary'}
                lineHeight={'30px'}
              >
                Highlighted News
              </Typography>
              <Box
                sx={{
                  ...landingPageStyle.highlightedCardNewsWrapper
                }}
              >
                {featuredNews.map((d, i) => (
                  <HighlightedCardNews
                    key={d?.category?.name + i}
                    category={d?.category?.name}
                    title={i18n?.language == 'en' ? (d?.title_eng ? d?.title_eng : d?.title) : d?.title}
                    description={d?.snap_content}
                    image={d?.imgnews[0]}
                    postDate={d?.posting_at}
                    slug={d?.slug}
                  />
                ))}
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '18px',
                  lg: '24px'
                },
                mb: '24px'
              }}
              color={'primary'}
              lineHeight={'30px'}
            >
              Videos
            </Typography>
            <Grid container spacing={2} sx={{ width: '100%' }} mx={0} my={0}>
              <Grid
                item
                xs={12}
                lg={6}
                height={402}
                sx={{ paddingLeft: '0px !important', paddingTop: '0px !important' }}
              >
                <YoutubeEmbed embedId='vHE8UjLs3PI' />
              </Grid>
              <Grid item xs={12} lg={6} sx={{ paddingLeft: '0px !important', paddingTop: '0px !important' }}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: {
                      xs: '12px',
                      lg: '24px'
                    },
                    padding: {
                      xs: '0px',
                      lg: '32px'
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 400 }} color={'gray'} fontSize={18} mt={2}>
                    Video
                  </Typography>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      fontSize: {
                        xs: '24px',
                        lg: '32px'
                      }
                    }}
                    color={'black'}
                  >
                    Pelatihan dan Sertifikasi Pelaut Tanpa Ribet? Memang Bisa? 🤔
                  </Typography>
                  <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
                    Di episode MariTalks kali ini, Profesea berkesempatan ngobrol bareng Ibu Nanis Widiatiningsih selaku
                    Direktur dari Hugos Maritime Services. Profesean bisa mempelajari cara mudah mengikuti pelatihan dan
                    sertifikasi pelaut dengan proses yang efisien dan tanpa ribet.
                  </Typography>
                  <Box display={'flex'} gap={4}>
                    <Button
                      size='small'
                      variant='contained'
                      onClick={() => window.open('https://youtu.be/vHE8UjLs3PI?si=2WUj5trQdXJBr3GL', '_blank')}
                      startIcon={<Icon icon={'ph:play-fill'} />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 400
                      }}
                    >
                      Watch Video
                    </Button>
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => window.open('https://www.youtube.com/@Profesea_id', '_blank')}
                      sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 400
                      }}
                    >
                      View All Video
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '24px'
              }}
              color={'primary'}
            >
              News
            </Typography>
            {/* Category Tab News */}
            <Box sx={{ borderBottom: 3, borderColor: 'divider', width: '100%' }}>
              <Tabs
                sx={{
                  ...landingPageStyle.stickyTabs
                }}
                value={tabValue}
                onChange={handleChange}
                variant={isScrollAbleTab ? 'scrollable' : 'fullWidth'}
                scrollButtons='auto'
                aria-label='full width tabs example'
              >
                <Tab
                  value={null}
                  label='All News'
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    fontSize: {
                      xs: '16px'
                      // lg: '24px'
                    }
                  }}
                />
                {newsCategories.map((n, i) => (
                  <Tab
                    key={n?.name + i}
                    value={n.id}
                    label={n.name}
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 700,
                      fontSize: {
                        xs: '16px'
                        // lg: '24px'
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                mt: '24px',
                mb: '24px'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '24px'
                }}
                color={'primary'}
                textTransform={'capitalize'}
              >
                {newsCategories.find(n => n.id === tabValue)?.name ?? 'All'} News
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  width: '100%',
                  height: '700px',
                  overflowY: 'scroll'
                }}
                className={styles['hide-scroll']}
              >
                {news.map((n, i) => (
                  <Box
                    key={n?.title + i}
                    sx={{
                      ...landingPageStyle.cardNewsWrapper
                    }}
                  >
                    <div className={styles['card-news-thumb']}>
                      <a href={`/news/detail/${n?.slug}`}>
                        <img src={n?.imgnews[0]} alt={n?.title} />
                      </a>
                    </div>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 4,
                        padding: {
                          xs: 0,
                          lg: '20px'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <Typography sx={{ fontWeight: 400 }} color={'gray'} fontSize={14}>
                          {n?.category?.name}
                        </Typography>
                        <Link
                          href={`/news/detail/${n?.slug}`}
                          style={{
                            color: 'black'
                          }}
                        >
                          <Typography
                            variant='h4'
                            sx={{
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: {
                                xs: '18px !important'
                              }
                            }}
                            color={'black'}
                          >
                            {i18n.language == 'en' ? (n?.title_eng != '' ? n?.title_eng : n?.title) : n?.title}
                          </Typography>
                        </Link>
                        <Typography fontWeight={400} fontSize={16}>
                          {n?.snap_content ? n?.snap_content : '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 400 }} color={'gray'} fontSize={14}>
                          {moment(n.posting_at).format('LL')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <FooterView />
    </>
  )
}

NewsPage.guestGuard = false
NewsPage.authGuard = false
NewsPage.getLayout = (page: ReactNode) => (
  <LandingPageLayout>
    <BreadcrumbsNewsProvider>{page}</BreadcrumbsNewsProvider>
  </LandingPageLayout>
)

export default NewsPage
