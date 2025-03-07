import { Box, Typography } from '@mui/material'
import React from 'react'
import Job from 'src/contract/models/job'
import ReactHtmlParser from 'react-html-parser'

interface ISectionTwoJobDetailProps {
  jobDetail: Job | null
}

const SectionTwoJobDetail: React.FC<ISectionTwoJobDetailProps> = ({ jobDetail }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingBottom: '10px',
        borderBottom: theme => `1px solid ${theme.palette.divider}`
      }}
    >
      <Box>
        <Typography mt='0.2rem' sx={{ fontWeight: 'bold', color: '#0a66c2' }} fontSize={16}>
          <strong>Experience</strong>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }}>
        <Typography sx={{ color: 'text.primary' }} ml='0.5rem' fontSize={12} fontWeight={500}>
          <strong>{jobDetail?.experience}</strong> &nbsp;
          {jobDetail?.category.employee_type == 'onship' ? 'Contract' : 'Years'}
        </Typography>
      </Box>
      <Box>
        <Typography mt='0.2rem' sx={{ fontWeight: 'bold', color: '#0a66c2' }} fontSize={16}>
          <strong>Description</strong>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }}>
        <Typography sx={{ color: 'text.primary' }} ml='0.5rem' fontSize={12} fontWeight={500} textAlign={'justify'}>
          {ReactHtmlParser(`${jobDetail?.description}`)}
        </Typography>
      </Box>
    </Box>
  )
}

export default SectionTwoJobDetail
