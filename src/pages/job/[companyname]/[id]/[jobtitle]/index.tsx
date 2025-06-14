import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import { Card, CircularProgress, IconButton, useTheme, useMediaQuery, Avatar, Typography, Button } from '@mui/material'
import { HttpClient } from 'src/services'
import Job from 'src/contract/models/job'
import Grid from '@mui/material/Grid'

import RelatedJobView from 'src/views/find-job/RelatedJobView'
import { usePathname } from 'next/navigation'
import { useAuth } from 'src/hooks/useAuth'
import DialogLogin from 'src/@core/components/login-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { linkToTitleCase } from 'src/utils/helpers'
import LandingPageLayout from 'src/@core/layouts/LandingPageLayout'
import CompanyDetailSection from 'src/views/job-detail/CompanyDetailSection'
import ShareArea from 'src/pages/candidate/job/ShareArea'
import JobDetailSection from 'src/views/job-detail/JobDetailSection'
import { Icon } from '@iconify/react'

const JobDetail = () => {
  const Theme = useTheme()
  const isMobile = useMediaQuery(Theme.breakpoints.down('md'))

  const router = useRouter()
  const params = useSearchParams()
  const shareUrl = window.location.href

  const pathname = usePathname()
  const { user } = useAuth()

  if (user) {
    router.replace(`/candidate/${pathname}`)
  }

  const { t } = useTranslation()
  const [title, setTitle] = useState<string>()

  const jobId = params.get('id')
  const companyname = linkToTitleCase(params.get('companyname'))
  const jobtitle = params.get('jobtitle')

  const [jobDetail, setJobDetail] = useState<Job | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)

  const [jobDetailSugestion, setJobDetailSugestion] = useState<Job[]>([])

  const firstload = async (companyname: any, jobId: any, jobTitle: any) => {
    try {
      const resp = await HttpClient.get(`/public/data/job/${companyname}/${jobId}/${jobTitle}`)
      const job = await resp.data.job
      await setTitle(
        `Lowongan ${
          job.category.employee_type == 'onship' ? job.role_type.name ?? '' : job.job_title ?? job.role_type.name
        } ${job.category.name} di Profesea`
      )
      setJobDetail(job)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      alert(error)
    }
  }

  useEffect(() => {
    if (jobDetail) {
      HttpClient.get(`/public/data/job?search=&take=4&page=1&username=${jobDetail?.company.username}`).then(
        response => {
          const jobs = response.data.jobs.data
          setJobDetailSugestion(jobs)
        }
      )
    }
  }, [jobDetail])

  useEffect(() => {
    if (companyname && jobId) {
      firstload(companyname, jobId, jobtitle)
    }
  }, [companyname, jobId, jobtitle])

  const handleApply = async () => {
    setOpenDialog(!openDialog)
  }

  function addProductJsonLd() {
    return {
      __html: `{
      "@context" : "https://schema.org/",
      "@type" : "JobPosting",
      "title" : "Lowongan ${
        jobDetail?.category.employee_type == 'onship'
          ? jobDetail?.role_type.name ?? ''
          : jobDetail?.job_title ?? jobDetail?.role_type.name
      } ${jobDetail?.category?.name} di Profesea",
      "description" : "${jobDetail?.description}",
      "identifier": {
        "@type": "PropertyValue",
        "name": "${jobDetail?.company.name}"
      },
      "datePosted" : "${jobDetail?.created_at}",
      "employmentType" : "${jobDetail?.employment_type}",
      "hiringOrganization" : {
        "@type" : "Organization",
        "name" : "${jobDetail?.company.name}",
        "logo" : "${jobDetail?.company.photo}"
      },
      "jobLocation": {
      "@type": "Place",
        "address": {
        "@type": "PostalAddress",
        "streetAddress": "${jobDetail?.company.address?.address}",
        "addressLocality": "${jobDetail?.company.address?.city?.city_name}",
        "addressCountry": "${jobDetail?.country?.iso}"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "IDR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": ${jobDetail?.salary_start},
          "maxValue": ${jobDetail?.salary_end},
          "unitText": "MONTH"
        }
      }
    }
  `
    }
  }

  if (isLoading) {
    return (
      <Box textAlign={'center'} mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={jobDetail?.description} />
        <meta property='og:image' content='images/logoprofesea.png' />
        <meta name='keywords' content={`${t('app_keyword')}`} />
        <meta name='viewport' content='initial-scale=0.8, width=device-width' />
        <script type='application/ld+json' dangerouslySetInnerHTML={addProductJsonLd()} key='product-jsonld' />
      </Head>

      <Box sx={{ position: 'relative' }}>

        <Grid container sx={{ position: 'absolute', top: '12px', left: '-72px' }}>
          <IconButton onClick={() => router.push('/find-job')}>
            <FontAwesomeIcon icon={faArrowLeft} color='text.primary' />
          </IconButton>
        </Grid>

        <Grid
          container
          gap={isMobile ? '16px' : '32px'}
          sx={{ flexWrap: 'nowrap', flexDirection: isMobile ? 'column' : 'row' }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '24px',
              padding: '0px !important'
            }}
          >
            <Card
              sx={{
                border: 0,
                boxShadow: 0,
                backgroundColor: '#FFFFFF',
                padding: isMobile ? '24px' : '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Avatar src={jobDetail?.company?.photo} sx={{ width: 24, height: 24 }} />
                    <TruncatedTypography fontSize={14} fontWeight={400} color={'#404040'}>
                      {jobDetail?.company?.name ?? '-'}
                    </TruncatedTypography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                      onClick={handleApply}
                      variant='contained'
                      color='primary'
                      size='small'
                      startIcon={<Icon icon='iconoir:submit-document' fontSize={10} />}
                      sx={{ width: '100%' }}
                    >
                      Apply Job
                    </Button>
                    <ShareArea
                      subject={`Job For ${
                        jobDetail?.employee_type === 'onship'
                          ? jobDetail?.role_type?.name
                          : jobDetail?.job_title ?? jobDetail?.role_type?.name ?? '-'
                      }.`}
                      url={shareUrl}
                      clean={true}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'flex-start' }}>
                  {jobDetail?.category?.employee_type == 'onship' ? (
                    <Typography sx={{ fontWeight: 'bold', color: '#32497A' }} fontSize={isMobile ? 20 : 24}>
                      <strong>{jobDetail?.role_type?.name}</strong>
                    </Typography>
                  ) : (
                    <Typography sx={{ fontWeight: 'bold', color: '#32497A' }} fontSize={isMobile ? 20 : 24}>
                      <strong>{jobDetail?.job_title ?? jobDetail?.role_type?.name ?? '-'}</strong>
                    </Typography>
                  )}
                  <Typography sx={{ color: 'text.primary' }} fontSize={12}>
                    {jobDetail?.city?.city_name}, {jobDetail?.country?.name}
                  </Typography>
                </Box>
              </Box>

              <JobDetailSection jobDetail={jobDetail} isMobile={isMobile} />
            </Card>
            <CompanyDetailSection isMobile={isMobile} user={user} jobDetail={jobDetail} />
          </Grid>
          {jobDetailSugestion.length !== 0 && (
            <Grid item xs={12} md={4} sx={{
              padding: '0px !important'
            }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center',
                  padding: '10px',
                  width: '100%',
                  bgcolor: '#d5e7f7',
                  color: '#5ea1e2'
                }}
              >
                Jobs post by the company
              </Box>
              <RelatedJobView
                jobDetailSugestion={jobDetailSugestion}
                handleDeleteJobSave={async () => {}}
                handleJobSave={async () => {}}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {openDialog && (
        <DialogLogin
          visible={openDialog}
          variant='candidate'
          onCloseClick={() => {
            setOpenDialog(!openDialog)
          }}
        />
      )}
    </>
  )
}

const TruncatedTypography = (props: { children: any; line?: number; [key: string]: any }) => {
  const { children, line, ...rest } = props
  const maxLine = line ? line : 1

  return (
    <Typography
      sx={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLine,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        maxHeight: `calc(${maxLine} * 1.2em)`,
        minHeight: '1.2em',
        lineHeight: '1.2em',
        fontSize: '16px',
        ...rest
      }}
    >
      {children}
    </Typography>
  )
}

JobDetail.acl = {
  action: 'read',
  subject: 'seafarer-jobs'
}

JobDetail.guestGuard = false
JobDetail.authGuard = false
JobDetail.getLayout = (page: ReactNode) => <LandingPageLayout>{page}</LandingPageLayout>

export default JobDetail
