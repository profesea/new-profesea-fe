import React from 'react'
import Box from '@mui/material/Box'
import { Tabs, Tab, useMediaQuery, Grid, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AllTrainingScreen from './all'
import OngoingTrainingScreen from './ongoing'
import SeafarerInstantTraining from './in-house'
import { Icon } from '@iconify/react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const SeafarerTraining = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Grid
        container
        spacing={3}
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column-reverse',
            lg: 'row'
          },
          justifyContent: 'center'
        }}
      >
        <Grid item xs={12} md={2}>
          <Box
            sx={{
              p: 4,
              border: 0,
              boxShadow: 0,
              borderColor: 'divider',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }} fontSize={18}>
              Training Partners
            </Typography>
            <Stack spacing={2} mt={2}>
              <Grid item sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <img
                  alt='logo'
                  src={'/images/training-partner1.jpg'}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </Grid>
            </Stack>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={
            !hidden
              ? {
                  direction: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                  alignContent: 'top',
                  marginBottom: '10px'
                }
              : {}
          }
        >
          <Box
            sx={{
              border: 0,
              boxShadow: 0,
              borderBottom: 1,
              borderColor: 'divider',
              boxSizing: 'border-box',
              color: 'common.white',
              backgroundColor: '#FFFFFF',
              borderRadius: '2px'
            }}
          >
            <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
              <Tab
                label='Find Training'
                icon={<Icon icon='solar:card-search-bold-duotone' fontSize={18} />}
                {...a11yProps(0)}
              />
              <Tab
                label='All Training Joined'
                icon={<Icon icon='solar:notebook-bookmark-bold-duotone' fontSize={18} />}
                {...a11yProps(1)}
              />
              {/* <Tab
                label='In House Training'
                icon={<Icon icon='solar:bookmark-square-bold-duotone' fontSize={18} />}
                {...a11yProps(2)}
              /> */}
            </Tabs>
          </Box>
          <Grid
            container
            sx={{
              border: 0,
              boxShadow: 0,
              borderRadius: '5px',
              color: 'common.white',
              marginTop: '5px',
              direction: 'row',
              justifyContent: 'flex-start',
              alignItems: 'top',
              alignContent: 'top'
            }}
          >
            <Grid item xs={12}>
              <TabPanel value={value} index={0}>
                <OngoingTrainingScreen />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AllTrainingScreen />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <SeafarerInstantTraining />
              </TabPanel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

SeafarerTraining.acl = {
  action: 'read',
  subject: 'seafarer-training'
}

export default SeafarerTraining
