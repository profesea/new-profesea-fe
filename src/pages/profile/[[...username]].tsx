import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Grid, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import localStorageKeys from 'src/configs/localstorage_keys'
import secureLocalStorage from 'react-secure-storage'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'
import UserProfileHeader from 'src/layouts/components/UserProfileHeader'
import JobVacancy from './JobVacancy'
import { IUser } from 'src/contract/models/user'
import { toast } from 'react-hot-toast'
import WorkeExperience from './Workexperinece'
import ListFeedView from 'src/views/social-feed/ListFeedView'
import { SocialFeedProvider } from 'src/context/SocialFeedContext'
import { useSocialFeed } from 'src/hooks/useSocialFeed'
import ListTraining from './Training'
import { useRouter } from 'next/router'
import { getCleanErrorMessage } from 'src/utils/helpers'

const ProfileCompany = () => {
  return (
    <SocialFeedProvider>
      <SocialFeedApp />
    </SocialFeedProvider>
  )
}

const SocialFeedApp = () => {
  const { fetchFeeds } = useSocialFeed()
  const router = useRouter();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [arrVacany, setArrVacancy] = useState<any>([])
  const iduser: any = user.id
  let { username } = router.query as { username: string };

  const firstload = async () => {
    let url = '';
    if (!username) {
      url = '/user/' + iduser;
      username = user.username;
    } else {
      url = '/user/?username=' + username;
    }

    try {
      const response = await HttpClient.get(url);
      if (response.data.user.length == 0) {
        toast.error(`Opps data tidak ditemukan`);

        return;
      }

      const user = response.data.user as IUser;
      setSelectedUser(user);

      if (user.role == 'Company') {
        HttpClient.get(AppConfig.baseUrl + '/job?search=&page=1&take=25').then(response => {
          const code = response.data.jobs.data;
          setArrVacancy(code);
        })
      } else if (user.role == 'Trainer') {
        HttpClient.get(AppConfig.baseUrl + '/training?search=&page=1&take=10').then(response => {
          const itemData = response.data.trainings.data;
          setArrVacancy(itemData);
        })
      } else {
        HttpClient.get(AppConfig.baseUrl + '/user/experience?page=1&take=100').then(response => {
          const itemData = response.data.experiences;
          setArrVacancy(itemData);
        })
      }
    } catch (error) {
      toast.error(`Opps ${getCleanErrorMessage(error)}`)
    }
  }

  useEffect(() => {
    firstload()
    fetchFeeds({ take: 7, username: username })
  }, [])

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          md={12}
          sx={!hidden ? { alignItems: 'stretch' } : {}}
        >
          <Grid container>
            {selectedUser && <UserProfileHeader datauser={selectedUser} address={selectedUser.address} />}
          </Grid>
          <Grid container spacing={6} sx={{ marginTop: '1px' }}>
            <Grid item lg={3} md={5} xs={12}>
              {selectedUser?.role == 'Company' && <JobVacancy vacancy={arrVacany} />}
              {selectedUser?.role == 'Seafarer' && <WorkeExperience vacancy={arrVacany} />}
              {selectedUser?.role == 'Trainer' && <ListTraining vacancy={arrVacany} />}
            </Grid>
            <Grid item lg={9} md={7} xs={12}>
              <ListFeedView />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

ProfileCompany.acl = {
  action: 'read',
  subject: 'home'
};

export default ProfileCompany