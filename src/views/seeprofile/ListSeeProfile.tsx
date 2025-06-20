import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Alert, AlertTitle, Avatar, Paper } from '@mui/material'
import Typography from '@mui/material/Typography'
import { getEmployeetypev2, toLinkCase, toTitleCase } from 'src/utils/helpers'
import { Icon } from '@iconify/react'
import moment from 'moment'
import Link from 'next/link'

interface Props {
  listCandidate: any[]
}

const renderList = (listCandidate: any[]) => {
  debugger
  if (!listCandidate || listCandidate.length == 0) {
    return
  }

  return listCandidate.map(item => {
    const userPhoto = item.viewer.photo ? item.viewer.photo : '/images/avatars/default-user.png'

    return (
      <Grid item xs={12} md={6} key={item?.viewer?.id}>
        <Paper
          sx={{
            padding: { xs: 3, md: 5 },
            border: 0,
            boxShadow: 0,
            color: 'common.white',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Grid item container xs={12} md={12}>
            <Grid xs={2} md={1.8}>
              <Avatar sx={{ width: 50, height: 50 }} src={userPhoto} alt={item.viewer?.name || 'User Avatar'} />
            </Grid>
            <Grid xs={10} md={10}>
              <Link
                style={{ textDecoration: 'none' }}
                href={`/${item.viewer?.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(
                  item.viewer?.username
                )}`}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                  <Typography variant='body2' sx={{ color: '#0a66c2', fontWeight: 600, fontSize: '14px' }}>
                    {toTitleCase(item?.viewer?.name)}
                  </Typography>
                  {item?.viewer?.employee_type != null ? (
                    <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                      {getEmployeetypev2(item.employee_type)}
                    </Typography>
                  ) : (
                    <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                      {item?.viewer?.role != 'Company' ? item?.viewer?.role : 'Recruiter'}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: ['center', 'flex-start'] }}>
                    <Icon color={'#26252542'} icon='mingcute:time-fill' fontSize={'18px'} /> &nbsp;
                    <Typography sx={{ color: '#262525', fontWeight: 400, fontSize: '12px' }}>
                      {moment(item.created_at).fromNow()}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
          </Grid>

          {/* </Box> */}
        </Paper>
      </Grid>
    )
  })
}
const ListSeeProfile = (props: Props) => {
  const { listCandidate } = props

  return (
    <>
      <Alert severity='info'>
        <AlertTitle>Whos See Your Profile?</AlertTitle>
        Based on <strong>your profile</strong>
      </Alert>
      <Grid container spacing={2}>
        {renderList(listCandidate)}
      </Grid>
    </>
  )
}

export default ListSeeProfile
