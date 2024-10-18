// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { format } from 'date-fns'

export type ParamJobVacncy = {
  logo: string | undefined
  institution: string
  position: string
  start_date: string
  end_date: string
  description: string
  is_current: boolean
}

// export type ProfileTeamsType = ProfileTabCommonType & { color: ThemeColor }
interface Props {
  // teams: ProfileTeamsType[]
  vacancy: ParamJobVacncy[]
}

const renderList = (arr: ParamJobVacncy[]) => {
  const maxChars = 300

  if (arr && arr.length) {
    return arr.map((item, index) => {
      const [expand, setExpand] = useState(false)

      return (
        <Grid
          container
          key={index}
          sx={{
            display: 'flex',
            borderBottom: '1px solid var(--light-action-disabled-background, rgba(76, 78, 100, 0.12))'
          }}
        >
          <Grid item container xs={12}>
            <img
              alt='logo'
              src={item.logo ? item.logo : '/images/work-experience.png'}
              style={{
                width: '100px',
                height: '100px',
                padding: 10,
                margin: 0
              }}
            />
            <Grid item container xs={true} md={true} sx={{ flexGrow: '1' }}>
              <Box sx={{ width: '100%', columnGap: 2, flexWrap: 'wrap', alignItems: 'center', m: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    sx={{ color: 'rgba(45, 52, 54, 1)', fontWeight: 700, fontSize: '16px', lineHeight: '21px' }}
                  >
                    {`${item.institution?.charAt(0).toUpperCase() + item.institution?.slice(1)}`}
                  </Typography>
                  <Typography sx={{ color: '#868686', fontWeight: 400, fontSize: '14px', lineHeight: '21px' }}>
                    {`${format(new Date(item.start_date), 'LLL yyyy')} - ${
                      !item.is_current ? format(new Date(item.end_date), 'LLL yyyy') : 'Present'
                    }`}
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(45, 52, 54, 1)', fontWeight: 400, fontSize: '14px' }}>
                  {item.position?.charAt(0).toUpperCase() + item.position?.slice(1)}
                </Typography>

                {item?.description && (
                  <Grid item xs={12}>
                    <Typography
                      variant='body2'
                      align='justify'
                      sx={{
                        color: 'rgba(45, 52, 54, 1)',
                        fontSize: '14px',
                        mt: 2,
                        whiteSpace: 'pre-line',
                        fontWeight: 400
                      }}
                    >
                      {expand ? item.description : `${item.description?.slice(0, maxChars)}`}
                      {!expand && (
                        <span
                          onClick={() => {
                            setExpand(true)
                          }}
                          style={{ cursor: 'pointer', color: 'whiteblue' }}
                        >
                          ...see more
                        </span>
                      )}
                    </Typography>
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      )
    })
  } else {
    return null
  }
}

const WorkeExperience = (props: Props) => {
  const { vacancy } = props

  return (
    <Box sx={{ borderRadius: '16px', backgroundColor: '#FFFFFF', boxShadow: 3, overflow: 'hidden' }}>
      <Box sx={{ p: '24px' }}>
        <Typography sx={{ mb: '10px', color: 'black', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' }}>
          Experience
        </Typography>
        {renderList(vacancy)}
      </Box>
    </Box>
  )
}

export default WorkeExperience
