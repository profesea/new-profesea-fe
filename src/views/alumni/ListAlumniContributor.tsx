import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Avatar, Card, CardContent } from '@mui/material'
import Link from 'next/link'
// import Alumni from 'src/contract/models/alumni'

export type ParamMain = {
  name: string
  skill: string
  location: string
}

interface Props {
  listAlumni: any[]
}

const renderList = (listAlumni: any[]) => {
  if (!listAlumni || listAlumni.length == 0) {
    return
  }

  return listAlumni?.map(item => {
    const userPhoto = item.photo != '' ? item.photo : '/images/avatars/default-user.png'

    return (
      <Grid item xs={12} md={12} key={item?.id}>
        <Box
          height={65}
          sx={{
            display: 'flex',
            alignContent: 'center',
            '& svg': { color: 'text.secondary' }
          }}
        >
          <Link style={{ textDecoration: 'none' }} href={'/alumni?id=' + item?.id}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3} ml={2} mr={3}>
              <Avatar src={userPhoto} alt='profile-picture' sx={{ width: 55, height: 55 }} />
            </Box>
          </Link>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ['left', 'flex-start'] }} marginTop={2}>
            <Link style={{ textDecoration: 'none' }} href={'/alumni?id=' + item?.id}>
              <Typography sx={{ color: '#32487A', fontWeight: 600 }}>{item.name} </Typography>
              <Typography sx={{ color: '#32487A', fontWeight: 400 }}>{item.total ? item.total : '-'} Feed</Typography>
            </Link>
          </Box>
        </Box>
      </Grid>
    )
  })
}

const ListAlumniLeftContributor = (props: Props) => {
  const { listAlumni } = props

  return (
    <Grid container marginTop={'10px'}>
      <Grid item xs={12}>
        <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
          <CardContent>
            <Grid item lg={12} md={12} xs={12}>
              {listAlumni && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ mr: 2 }}>
                      <Typography
                        align='left'
                        variant='body2'
                        sx={{ color: '#32487A', fontWeight: '600', mb: 1 }}
                        fontSize={16}
                      >
                        Top 10 Contributor
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Grid>
            <Box sx={{ mt: 3 }}>{renderList(listAlumni)}</Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ListAlumniLeftContributor
