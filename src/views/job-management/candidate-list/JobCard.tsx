import { Icon } from '@iconify/react'
import { Box, Divider, Grid, Typography } from '@mui/material'
import Job from 'src/contract/models/job'
import { calculateDaysDifference, dateProgress, getDateMonth } from 'src/utils/helpers'
import StatusCard from './StatusCard'

const JobCard = ({ job }: { job: Job }) => {
  const posted_at = new Date(job.created_at)
  const expired_at = new Date(job.onboard_at)
  const progress = calculateDaysDifference(Date.now(), expired_at)

  return (
    <Box
      sx={{
        p: '16px',
        boxShadow: 3,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        backgroundColor: '#FFF'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box flexDirection='column'>
            <Typography
              component='a'
              href={`/company/job/${job.id}`}
              sx={{
                fontSize: 18,
                fontWeight: 700,
                textTransform: 'capitalize',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                minHeight: '2.6em',
                textDecoration: 'underline',
                '& > span': {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  width: '100%'
                }
              }}
            >
              <span>
                {job.category.employee_type === 'onship'
                  ? job.role_type?.name ?? 'Unnamed Job'
                  : job.job_title
                  ? job.job_title.toLowerCase()
                  : job.role_type?.name
                  ? job.role_type.name.toLowerCase()
                  : 'Unnamed Job'}
              </span>
            </Typography>
            <Typography
              sx={{ color: '#868686', fontSize: 14, fontWeight: 600 }}
            >{`(${job.total_applied} Candidate Applied)`}</Typography>
          </Box>
          {job.category.employee_type === 'onship' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Icon icon='ph:anchor' fontSize={16} color='#32497A' style={{ flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {job.category?.name ?? 'N/A'}, {job.job_title ?? 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Icon icon='ph:files-duotone' fontSize={16} color='#32497A' />
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{job.contract_duration} months</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Icon icon='ph:sailboat-duotone' fontSize={16} color='#32497A' />
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{job.vessel_type?.name ?? ''}</Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Icon icon='ph:circles-three-plus-duotone' fontSize={16} color='#32497A' style={{ flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {job.rolelevel?.levelName ?? 'N/A'}, {job.category?.name ?? 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Icon icon='ph:clock-duotone' fontSize={16} color='#32497A' />
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                  {job.work_arrangement ?? 'N/A'}, {job.employment_type ?? 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Icon icon='ph:map-pin-duotone' fontSize={16} color='#32497A' />
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                  {job.city?.city_name ?? 'N/A'}, {job.country.nicename ?? 'N/A'}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            borderRadius: '6px',
            backgroundColor: '#F8F8F7'
          }}
        >
          <StatusCard
            label='Waiting for Review'
            total={job.total_waiting_review ?? 0}
            backgroundColor='#FFEBCF'
            icon='ph:hourglass-high-bold'
            iconColor='#FE9602'
          />
          <Divider sx={{ borderWidth: '1px', bgcolor: '#E7E7E7' }} />
          <StatusCard
            label='CV Reviewed'
            total={job.total_viewed ?? 0}
            backgroundColor='#CBE2F9'
            icon='fluent:document-checkmark-24-regular'
            iconColor='#32497A'
          />
          <Divider sx={{ borderWidth: '1px', bgcolor: '#E7E7E7' }} />
          <StatusCard
            label='Proceed'
            total={job.total_proceed ?? 0}
            backgroundColor='#CBE2F9'
            icon='ph:files-bold'
            iconColor='#0B58A6'
          />
          <Divider sx={{ borderWidth: '1px', bgcolor: '#E7E7E7' }} />
          <StatusCard
            label='Hired'
            total={job.total_hired ?? 0}
            backgroundColor='#D9F2DA'
            icon='ph:thumbs-up-bold'
            iconColor='#4CAF50'
          />
        </Box>
      </Box>
      <Grid container sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!job.is_draft && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <>
              <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '8px' }}>
                <Icon icon='ph:calendar-dots' color='#868686' fontSize={16} />
                <Typography>
                  Posted at {getDateMonth(posted_at, true, true)} - Close at {getDateMonth(expired_at, true, true)}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                {progress === 'Expired' ? progress : `${progress} Left`}
              </Typography>
            </>
          </Box>
        )}
        <Box sx={{ width: '100%', backgroundColor: '#DBDBDB', borderRadius: '100px', overflow: 'hidden' }}>
          <Box
            sx={{
              borderRadius: '8px',
              width: `${dateProgress(posted_at, expired_at)}%`,
              height: '6px',
              backgroundColor: progress === 'Expired' || job.is_active === false ? '#868686' : '#0B58A6'
            }}
          />
        </Box>
      </Grid>
    </Box>
  )
}

export default JobCard
