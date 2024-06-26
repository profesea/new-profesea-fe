// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Badge from '@mui/material/Badge'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { HttpClient } from 'src/services'
// import Link from 'next/link'
// import { styled } from '@mui/material/styles'

// const LinkStyled = styled(Link)(() => ({
//   textDecoration: 'none'
// }))

const SlidesAlumni = (Ads: any[]) => {
  const components: JSX.Element[] = []

  Ads.forEach((arr, index: number) => {
    components.push(
      // <LinkStyled style={{ textDecoration: 'none' }} href={arr.cta} target='_blank'>
      <Box key={index} className='keen-slider__slide' mt={3}>
        <Box
          component='img'
          src={arr.attachments[0]}
          style={{
            width: '291px',
            height: '271px',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        ></Box>
      </Box>
      // </LinkStyled>
    )
  })

  return components
}

const SideAdAlumni = () => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [Ads, getAds] = useState([])
  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = () => {
    HttpClient.get('/public/data/adsDetail?take=9').then(response => {
      if (response.status != 200) {
        throw response.data.message ?? 'Something went wrong!'
      }
      getAds(response.data.show_case)
    })
  }

  // ** Hook
  const theme = useTheme()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>
        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }
        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Card sx={{ position: 'relative', border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
      <CardContent>
        {loaded && instanceRef.current && (
          <Box className='swiper-dots' sx={{ top: 7, right: 13, position: 'absolute' }}>
            {[...Array(instanceRef.current.track.details.length).keys()].map(idx => {
              return (
                <Badge
                  key={idx}
                  variant='dot'
                  component='div'
                  className={clsx({
                    active: currentSlide === idx
                  })}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                  sx={{
                    mr: theme => `${theme.spacing(2.5)} !important`,
                    '&.active': {
                      '& .MuiBadge-dot': {
                        backgroundColor: theme => `${theme.palette.primary.main} !important`
                      }
                    },
                    '& .MuiBadge-dot': {
                      height: '6px !important',
                      width: '6px !important',
                      minWidth: '6px !important'
                    }
                  }}
                ></Badge>
              )
            })}
          </Box>
        )}
        {Ads.length && (
          <Box ref={sliderRef} className='keen-slider'>
            {SlidesAlumni(Ads)}
          </Box>
        )}
        {Ads.length == 0 && (
          <Box
            component='img'
            mt={3}
            src='images/backgrounds/ads-here.png'
            style={{
              width: '190px',
              height: '170px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          ></Box>
        )}
      </CardContent>
    </Card>
  )
}

export default SideAdAlumni
