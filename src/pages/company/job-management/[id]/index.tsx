import { Breadcrumbs, Grid, Link, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MdNavigateNext } from 'react-icons/md'
import Job from 'src/contract/models/job'
import { HttpClient } from 'src/services'
import CandidateListTabs from 'src/views/job-management/candidate-list/CandidateListTabs'
import JobCard from 'src/views/job-management/candidate-list/JobCard'
import { v4 } from 'uuid'

const CandidateList = () => {
  const params = useSearchParams()
  const jobId = params.get('id')

  const [job, setJob] = useState<Job>()
  const [onLoading, setOnLoading] = useState<boolean>(false)
  const [count, setCount] = useState(v4())

  const getJobs = async () => {
    await HttpClient.get('/job/' + jobId)
      .then(response => {
        const data = response.data.job
        setJob(data)
      })
      .finally(() => setOnLoading(false))
  }

  useEffect(() => {
    setOnLoading(true)
    getJobs()
  }, [jobId])

  useEffect(() => {
    getJobs()
  }, [count])

  if (!job || onLoading) return null

  return (
    <Grid container sx={{ display: 'flex', justifyContent: 'center', gap: '24px', pb: '48px' }}>
      <Grid item xs={12}>
        <Breadcrumbs separator={<MdNavigateNext fontSize={'17px'} color='black' />} aria-label='breadcrumb'>
          <Link key='1' href='/' sx={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: '#32497A',
                fontSize: '14px',
                fontWeight: 400
              }}
            >
              Home
            </Typography>
          </Link>
          <Link key='2' href='/company/job-management' sx={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: '#32497A',
                fontSize: '14px',
                fontWeight: 400
              }}
            >
              Job Management
            </Typography>
          </Link>
          <Typography
            key='3'
            sx={{
              color: '#949EA2',
              fontSize: '14px',
              fontWeight: 400,
              cursor: 'pointer'
            }}
          >
            {job?.employee_type === 'onship' ? job?.role_type?.name : job?.job_title ?? job?.role_type?.name ?? '-'}
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <JobCard job={job} />
      </Grid>
      <Grid item xs={12}>
        <CandidateListTabs jobType={job.category.employee_type} count={() => setCount(v4())} />
      </Grid>
    </Grid>
  )
}

CandidateList.acl = {
  action: 'read',
  subject: 'user-job-management'
}

export default CandidateList
