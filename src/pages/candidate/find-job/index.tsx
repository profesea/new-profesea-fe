import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Card, CardContent, Grid, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Icon } from '@iconify/react'
import Profile from 'src/layouts/components/Profile'
import Feed from 'src/layouts/components/Feed'
import SideAd from 'src/views/banner-ad/sidead'
import RecomendedView from 'src/views/find-job/RecomendedView'
import { HttpClient } from 'src/services'
import Job from 'src/contract/models/job'
import { useAuth } from 'src/hooks/useAuth'

const FindJob = () => {
    const theme = useTheme()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const [listJob, setListJob] = useState<Job[]>([]);
    const { user } = useAuth();

    const getListJobs = async () => {
        const response = await HttpClient.get('/job?page=1&take=25&search', {
            page: 1,
            take: 25,
            search: '',
        });

        const jobs = response.data.jobs.data;
        setListJob(jobs);
    }

    useEffect(() => {
        getListJobs();
    }, []);

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={10} sx={!hidden ? { alignItems: "stretch" } : {}}>
                    <Grid container spacing={6} sx={{ marginTop: '1px' }}>
                        <Grid item lg={4} md={5} xs={12}>
                            <Profile datauser={user} />
                            <Grid container mt={3} mb={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ columnGap: 2, flexWrap: 'wrap', alignItems: 'center' }} display={'flex'}>
                                                <Icon icon={'arcticons:connect-you'} fontSize={30} />
                                                <Typography variant='body1' sx={{ color: "#424242", fontWeight: 600 }}> Total Conected :250</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Feed />
                        </Grid>
                        <Grid item lg={8} md={7} xs={12}>
                            <Grid container spacing={6}>
                                <Grid item xs={12}>
                                    <Typography variant='h5'> Recommend for you</Typography>
                                    <Typography variant='body2' marginTop={2} marginBottom={5}> Based on your profile and search history</Typography>
                                    <RecomendedView listJob={listJob} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <SideAd />
            </Grid>
        </Box>
    );
}

FindJob.acl = {
    action: 'read',
    subject: 'find-job'
};

export default FindJob