// ** MUI Imports
import Grid from '@mui/material/Grid'
import TopPostCompany from 'src/views/admin/dashboard/analytics/TopPostCompany'
import CardUserStat from 'src/views/admin/dashboard/CardUserStat'
import CardActiveAds from 'src/views/admin/dashboard/CardActiveAds'
import TopLastJob from 'src/views/admin/dashboard/analytics/TopLastJob'
import TopCategory from 'src/views/admin/dashboard/analytics/TopCategory'
import CardCompletionPercetage from 'src/views/admin/dashboard/CardCompletionPercentage'

const Home = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid container spacing={6} item xs={12} sm={12} md={12}>
        <Grid item xs={12} sm={7} md={7}>
          <CardUserStat />
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <CardCompletionPercetage />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TopPostCompany />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TopLastJob />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TopCategory />
      </Grid>

      <Grid container spacing={6} item xs={12} sm={12} md={12}>
        <Grid item xs={12} sm={7} md={7}>
          <CardActiveAds />
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
        
        </Grid>
      </Grid>

    </Grid>
  )
}

export default Home
