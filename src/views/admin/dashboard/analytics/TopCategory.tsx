import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import DashboardContext, { DashboardProvider } from 'src/context/DashboardContext'
import { useDashboard } from 'src/hooks/useDashboard'
import { useEffect } from 'react'
import { CardActionArea, CircularProgress, Divider } from '@mui/material'

const TopCategory = () => {
  return (
    <DashboardProvider>
      <TopCategoryApp />
    </DashboardProvider>
  )
}

const renderList = (arr: any[]) => {
  if (arr && arr.length) {
    return arr.map((item, index: number) => {
      return (
        <Box
          key={item.name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: index !== arr.length - 1 ? 18 : undefined
          }}
        >
          {/* <img width={34} height={34} alt={item.name} src={item.photo} /> */}
          <Box sx={{ ml: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', mr: 2, flexDirection: 'column' }}>
              <Grid>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.name}
                </Typography>

                {/* <Typography variant='caption'>{item.subtitle}</Typography> */}
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                {item.total_employer}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

const TopCategoryApp = () => {
  const { dataTopCategoryList } = useDashboard()

  useEffect(() => {
    dataTopCategoryList()
  }, [])

  return (
    <DashboardContext.Consumer>
      {({ dataTopCategory, onLoading }) => {
        if (onLoading) {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress sx={{ mt: 20 }} />
            </Box>
          )
        }

        return (
          <>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
              <CardHeader
                title={
                  <Typography variant='body2' style={{ fontSize: '18px', fontWeight: '600', color: '#32487A' }}>
                    Company Category
                  </Typography>
                }
                titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' } }}
              />
              <CardContent sx={{ pb: theme => `${theme.spacing(6.5)} !important`, mt: 3, mb: 42 }}>
                {renderList(dataTopCategory)}
              </CardContent>
            </Card>
            <div style={{ backgroundColor: 'white' }}>
              <Divider component='div' />
              <CardActionArea>
                <CardContent style={{ textAlign: 'center' }}>
                  <Link href='/admin/company-and-job-management/'>View All Company Category</Link>
                </CardContent>
              </CardActionArea>
            </div>
          </>
        )
      }}
    </DashboardContext.Consumer>
  )
}

export default TopCategory
