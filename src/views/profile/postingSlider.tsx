import React, { useState, useRef } from 'react'
import { Grid, Typography, Box, IconButton, Avatar } from '@mui/material'
import { format } from 'date-fns'
import { Icon } from '@iconify/react'
import { formatIDR, formatUSD, getUserAvatar, timeCreated } from 'src/utils/helpers'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'

const Slides = (items: any[], teamId: number, width: number, status: boolean) => {
  const { user } = useAuth()

  const isStatusLink = (link: string) => {
    if (!status) {
      return `/login/?returnUrl=` + link
    }

    return link
  }

  if (teamId === 4)
    return items.map((arr: any, index) => {
      const trainerNameUrl = arr.trainer.name.toLowerCase().split(' ').join('-')
      const trainingTitleUrl = arr.title ? arr.title?.toLowerCase().split(' ').join('-') : ''
      const link =
        user && user.team_id !== 3 && user.team_id !== 4
          ? `/candidate/trainings/${trainerNameUrl}/${arr.id}/${trainingTitleUrl}`
          : `/trainings/${trainerNameUrl}/${arr.id}/${trainingTitleUrl}`

      return (
        <Box
          key={index}
          component={Link}
          href={isStatusLink(link)}
          target='_blank'
          sx={{
            p: '16px',
            border: '2px solid #F5F5F5',
            borderRadius: '16px',
            display: 'flex',
            gap: '16px',
            width: `${width}px`,
            height: '200px',
            cursor: 'pointer',
            transition: 'transform 0.5s ease-in-out',
            '&:hover': {
              border: '1px solid #32497A'
            }
          }}
        >
          <Box
            component='img'
            src={arr.thumbnail ? arr.thumbnail : '/images/icon-trainer.png'}
            sx={{
              alignSelf: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '8px',
              backgroundSize: 'cover',
              width: '170px',
              maxHeight: '174px',
              overflow: 'hidden'
            }}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography sx={{ color: 'primary.main', fontSize: 16, fontWeight: 'bold' }}>{arr.title}</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: 14 }}>{arr.category?.category}</Typography>
              <Typography sx={{ fontSize: 14, color: '#949EA2' }}>
                {arr?.currency === 'IDR'
                  ? formatIDR(arr?.discounted_price ?? (arr?.price as number), true)
                  : formatUSD(arr?.discounted_price ?? (arr?.price as number), true)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3} ml={2} mr={3}>
                <Avatar
                  src={getUserAvatar(arr.trainer)}
                  alt={arr.trainer.name || 'User Avatar'}
                  sx={{ width: 25, height: 25 }}
                />
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}
                marginTop={3}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#0a66c2' }} fontSize={14}>
                  {arr.trainer.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )
    })

  return items.map((arr: any, index) => {
    const companyNameUrl = arr.company.name.toLowerCase().split(' ').join('-')
    const jobTitleUrl = arr.job_title ? arr.job_title?.toLowerCase().split(' ').join('-') : ''
    const link =
      user && user.team_id !== 3 && user.team_id !== 4
        ? `/candidate/job/${companyNameUrl}/${arr?.id}/${jobTitleUrl}`
        : `/job/${companyNameUrl}/${arr?.id}/${jobTitleUrl}`

    return (
      <Box
        key={index}
        component={Link}
        href={isStatusLink(link)}
        target='_blank'
        sx={{
          p: '16px',
          border: '2px solid #F5F5F5',
          borderRadius: '16px',
          display: 'flex',
          gap: '16px',
          width: `${width}px`,
          height: '200px',
          cursor: 'pointer',
          transition: 'transform 0.5s ease-in-out',
          '&:hover': {
            border: '1px solid #32497A'
          }
        }}
      >
        <Box
          component='img'
          src={arr.company.photo ? arr.company.photo : '/images/avatars/default-user.png'}
          sx={{
            alignSelf: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '8px',
            backgroundSize: 'cover',
            height: '100%',
            aspectRatio: 1
          }}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {arr.category.employee_type === 'onship' ? (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography sx={{ color: 'primary.main', fontSize: 16, fontWeight: 'bold' }}>
                  {`${arr.category?.name ?? ''} `}
                  {arr.job_title ?? ''}
                </Typography>
                <Box sx={{ p: '8px', border: '1px solid #32497A', borderRadius: '4px', maxWidth: 'fit-content' }}>
                  <Typography sx={{ color: 'primary.main', fontSize: 12 }}>{arr.vessel_type?.name ?? '-'}</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#949EA2' }}>
                  Onboarding on{' '}
                  <span style={{ color: '#32497A', fontWeight: 'bold' }}>
                    {format(new Date(arr.onboard_at), 'dd MMMM yyyy') ?? '-'}
                  </span>
                </Typography>
                <Typography sx={{ color: '#636E72', fontSize: 14 }}>{arr.company.name}</Typography>
              </Box>
              <Typography sx={{ color: '#949EA2', fontSize: 12 }}>
                {arr.created_at ? timeCreated(arr.created_at) : '-'}
              </Typography>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography sx={{ color: 'primary.main', fontSize: 16, fontWeight: 'bold' }}>
                  {`${arr.category.name ?? ''}, `}
                  {arr.rolelevel?.levelName ?? ''}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>{arr.city?.city_name ?? '-'}</Typography>
                <Typography sx={{ color: '#636E72', fontSize: 14 }}>{arr.company.name}</Typography>
              </Box>
              <Typography sx={{ color: '#949EA2', fontSize: 12 }}>
                {arr.created_at ? timeCreated(arr.created_at) : '-'}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    )
  })
}

const IndexDots = ({ total, currentIndex, setIndex }: { total: number; currentIndex: number; setIndex: any }) => {
  if (total <= 1) return null

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentIndex === i ? 'black' : '#DDDDDD',
              cursor: 'pointer'
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

const Slider = ({ items, teamId, status }: { items: any[]; teamId: number; status: boolean }) => {
  const [index, setIndex] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    setIndex(prev => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const handleNext = () => {
    setIndex(prev => (prev < items.length - 1 ? prev + 1 : 0))
  }

  const handleStart = (x: number) => {
    setIsDragging(true)
    setStartX(x)
  }

  const handleMove = (x: number) => {
    if (!isDragging) return
    const moveX = x - startX
    if (moveX > 100) {
      handlePrev()
      setIsDragging(false)
    } else if (moveX < -100) {
      handleNext()
      setIsDragging(false)
    }
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const cardWidth = 500
  const totalWidth = items.length * (cardWidth + 24)
  const translateX = (totalWidth / items.length) * index

  return (
    <Grid
      container
      sx={{ mt: items.length > 1 ? '-44px' : '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {items.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <IconButton sx={{ border: '2px solid #D9D9D9', borderRadius: '12px' }} onClick={handlePrev}>
              <Icon icon='mdi:chevron-left' fontSize={24} color='black' />
            </IconButton>
            <IconButton sx={{ border: '2px solid #D9D9D9', borderRadius: '12px' }} onClick={handleNext}>
              <Icon icon='mdi:chevron-right' fontSize={24} color='black' />
            </IconButton>
          </Box>
        </Box>
      )}
      <Grid
        container
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        ref={sliderRef}
        sx={{
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Grid
          style={{
            display: 'flex',
            gap: '24px',
            transform: `translateX(-${translateX}px)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {Slides(items, teamId, cardWidth, status)}
        </Grid>
      </Grid>
      <IndexDots total={items.length} currentIndex={index} setIndex={setIndex} />
    </Grid>
  )
}

export default Slider
