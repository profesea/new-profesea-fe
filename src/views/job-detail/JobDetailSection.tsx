import { Icon } from '@iconify/react'
import { Box, Grid, Typography } from '@mui/material'
import Job from 'src/contract/models/job'

import ReactHtmlParser from 'react-html-parser'
import { format } from 'date-fns'
import { renderSalary } from 'src/utils/helpers'
import Licensi from 'src/contract/models/licensi'

const JobDetailSection = ({ jobDetail, isMobile }: { jobDetail: Job | null; isMobile: boolean }) => {
  const filterCertificates = (license: Licensi[]) => {
    const coc = license.filter(l => l.parent === 'COC')
    const cop = license.filter(l => l.parent === 'COP')

    return [coc, cop]
  }

  return (
    <>
      {/* Detail With Icons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '10px' : '32px',
          py: '24px',
          borderTop: '1px solid #EDEDED',
          borderBottom: jobDetail?.description && jobDetail?.description?.length > 7 ? '1px solid #EDEDED' : '',
          alignItems: 'flex-start'
        }}
      >
        {/* left side detail */}
        <Grid container spacing={4}>
          {jobDetail?.category?.employee_type == 'onship' ? (
            <>
              {jobDetail?.category?.name && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:anchor' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Job Category</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.category?.name || '-'}
                  </Grid>
                </>
              )}

              {jobDetail?.sailing_region && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='material-symbols-light:globe' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Sail Region</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.sailing_region === 'iv' ? 'International Voyage' : 'Near Coastal Voyage (NCV)'}
                  </Grid>
                </>
              )}

              {jobDetail?.experience && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:briefcase-fill' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Experience</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.experience || '-'} contract
                  </Grid>
                </>
              )}

              {jobDetail?.city?.city_name && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:chats-duotone' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>
                      Interview Location
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.city?.city_name || '-'}
                  </Grid>
                </>
              )}
            </>
          ) : (
            <>
              {jobDetail?.job_title && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:briefcase-fill' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Job Category</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.job_title || '-'}
                  </Grid>
                </>
              )}

              {jobDetail?.rolelevel?.levelName && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:steps-duotone' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Role Level</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.rolelevel?.levelName || '-'}
                  </Grid>
                </>
              )}

              {jobDetail?.work_arrangement && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:laptop-thin' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>
                      Work Arrangement
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.work_arrangement || '-'}
                  </Grid>
                </>
              )}

              {jobDetail?.employment_type && (
                <>
                  <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Icon icon='ph:clock-duotone' color='#32487A' fontSize={'16px'} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>
                      Employment Type
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    : {jobDetail?.employment_type || '-'}
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>

        {/* right side details */}
        <Grid container spacing={4}>
          {jobDetail?.category?.employee_type == 'onship' ? (
            <>
              <Grid
                item
                xs={6}
                sx={{ display: jobDetail?.contract_duration ? 'flex' : 'none', gap: '8px', alignItems: 'center' }}
              >
                <Icon icon='ph:files-light' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Contract Duration</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: jobDetail?.contract_duration ? 'flex' : 'none' }}>
                : {jobDetail?.contract_duration || '-'} months
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: jobDetail?.onboard_at ? 'flex' : 'none', gap: '8px', alignItems: 'center' }}
              >
                <Icon icon='ph:calendar-dots-duotone' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Date of Board</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: jobDetail?.onboard_at ? 'flex' : 'none' }}>
                : {format(new Date(jobDetail?.onboard_at), 'dd/MM/yy') ?? '-'}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: jobDetail?.vessel_type?.name ? 'flex' : 'none', gap: '8px', alignItems: 'center' }}
              >
                <Icon icon='ph:sailboat' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Vessel Type</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: jobDetail?.vessel_type?.name ? 'flex' : 'none' }}>
                : {jobDetail?.vessel_type?.name || '-'}
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Icon icon='ant-design:dollar-outlined' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Salary</Typography>
              </Grid>
              <Grid item xs={6}>
                : {renderSalary(jobDetail?.salary_start, jobDetail?.salary_end, jobDetail?.currency as string)}
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Icon icon='ant-design:dollar-outlined' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Salary</Typography>
              </Grid>
              <Grid item xs={6}>
                : {renderSalary(jobDetail?.salary_start, jobDetail?.salary_end, jobDetail?.currency as string)}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: jobDetail?.experience ? 'flex' : 'none', gap: '8px', alignItems: 'center' }}
              >
                <Icon icon='ph:briefcase-fill' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Work Experience</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: jobDetail?.experience ? 'flex' : 'none' }}>
                : {jobDetail?.experience || '-'} years
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: jobDetail?.degree?.name ? 'flex' : 'none', gap: '8px', alignItems: 'center' }}
              >
                <Icon icon='cil:education' color='#32487A' fontSize={'16px'} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#404040' }}>Education</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: jobDetail?.degree?.name ? 'flex' : 'none' }}>
                : {jobDetail?.degree?.name || '-'}
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}></Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Description */}
      <Box sx={{ display: jobDetail?.description && jobDetail?.description?.length > 7 ? '' : 'none' }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#32497A'
          }}
        >
          Description
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#404040' }}>
            {ReactHtmlParser(`${jobDetail?.description}`)}
          </Typography>
        </Box>

        {/* Certificate */}
        {jobDetail?.category?.employee_type == 'onship' && (
          <>
            <Box sx={{ display: jobDetail?.license?.length > 0 ? 'flex' : 'none' }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#32497A',
                  marginBottom: '16px'
                }}
              >
                Mandatory Certificate
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Box sx={{ display: jobDetail?.license[0] ? '' : 'none' }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#303030' }}>
                    Certificate of Competency
                  </Typography>
                  <ol style={{ paddingInlineStart: '20px' }}>
                    {filterCertificates(jobDetail?.license)[0].map((l, index) => (
                      <li key={index} style={{ fontSize: '14px', fontWeight: 400 }}>
                        {l.title}
                      </li>
                    ))}
                  </ol>
                </Box>

                <Box sx={{display: jobDetail?.license[0] ? '' : 'none'}}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#303030' }}>
                    Certificate of Proficiency
                  </Typography>
                  <ol style={{ paddingInlineStart: '20px' }}>
                    {filterCertificates(jobDetail?.license)[1].map((l, index) => (
                      <li key={index} style={{ fontSize: '14px', fontWeight: 400 }}>
                        {l.title}
                      </li>
                    ))}
                  </ol>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  )
}

export default JobDetailSection
