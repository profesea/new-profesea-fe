import React, { useEffect, useState } from 'react'
import { Button, Box, Grid, Card, CardContent, useMediaQuery, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import SideAd from 'src/views/banner-ad/sidead'
import { useTheme } from '@mui/material/styles'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import style from './../../../../styles/css/NotificationPage.module.css'
import AllNotificationTab from './AllNotificationTab'
import UnreadNotificationTab from './UnreadNotificationTab'

import NotificationsType from './NotificationsType'
import { HttpClient } from 'src/services'
import INotification from 'src/contract/models/notification'
import buildNotifies from './buildNotifies'

import DialogMarkConfirmation from './DialogMarkConfirmation'

function Notification() {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [tab, setTab] = useState('1')
  const [showMarkConfirm, setShowMarkConfirm] = useState(false)
  const [notifies, setNotifies] = useState<NotificationsType[]>([])
  const [unreadNotifies, setUnreadNotifies] = useState<NotificationsType[]>([])
  const [onLoading, setOnLoading] = useState<boolean>(false)

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const getNotifications = async () => {
    setOnLoading(true)
    const response = await HttpClient.get('/user/notification', {
      page: 1,
      take: 35
    })

    if (response.status != 200) {
      alert(response.data?.message ?? 'Unknow error')
      setOnLoading(false)

      return
    }

    const { notifications } = response.data as { notifications: { data: INotification[] } }
    const notifies = notifications.data.map(buildNotifies)
    setOnLoading(false)
    setNotifies(notifies)
  }

  const getUnreadNotifications = async () => {
    setOnLoading(true)
    const response = await HttpClient.get('/user/notification/unread/', {
      page: 1,
      take: 35
    })

    if (response.status != 200) {
      alert(response.data?.message ?? 'Unknow error')
      setOnLoading(false)

      return
    }

    const { notifications } = response.data as { notifications: { data: INotification[] } }
    const unreadNotifies = notifications.data.map(buildNotifies)
    setOnLoading(false)
    setUnreadNotifies(unreadNotifies)
  }

  useEffect(() => {
    getNotifications()
    getUnreadNotifications()
  }, [])

  return (
    <Box>
      <Grid container spacing={1} className={style['notification-page']}>
        <Grid
          item
          xs={12}
          md={11}
          sx={!hidden ? { alignItems: 'stretch' } : {}}
          className={style['notification-page-ch']}
        >
          <Grid container spacing={6} sx={{ marginTop: '1px' }} direction='row'>
            {/* <Grid item lg={3} md={3} xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}></Grid> */}
            <Grid item container lg={9} md={9} xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      border: 0,
                      boxShadow: 6,
                      borderRadius: 12,
                      color: 'common.white',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <CardContent sx={{ padding: '24px' }}>
                      <Box sx={{ mb: 0 }}>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                          <div style={{ display: 'inline', float: 'left', marginBottom: '24px' }}>
                            <h1 className={style['notification-title']}> Notifications </h1>
                            <h2 className={style['notification-subtitle']}>
                              You have <b className={style['primary-color']}>{unreadNotifies.length} notifications</b>{' '}
                              today
                            </h2>
                          </div>

                          <Button
                            variant='contained'
                            className={style['btn-mark']}
                            onClick={() => setShowMarkConfirm(true)}
                          >
                            <DoneAllIcon style={{ width: 16, height: 16, margin: '0 10px 0 0' }} />
                            <span>Mark all as read</span>
                          </Button>
                          <div style={{ clear: 'both' }}></div>
                          <TabContext value={tab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                              <TabList variant='fullWidth' className={style['tablist']} onChange={handleChangeTab}>
                                <Tab
                                  className={style['tablist-item']}
                                  label='All Notification'
                                  value='1'
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                  }}
                                />
                                <Tab
                                  className={style['tablist-item']}
                                  label='Unread'
                                  value='2'
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </TabList>
                            </Box>
                            <TabPanel value='1' className={style['tabpanel']}>
                              <AllNotificationTab
                                notifies={notifies}
                                getNotifications={getNotifications}
                                onLoading={onLoading}
                              />
                            </TabPanel>
                            <TabPanel value='2' className={style['tabpanel']}>
                              <UnreadNotificationTab
                                notifies={unreadNotifies}
                                getNotifications={getUnreadNotifications}
                                onLoading={onLoading}
                              />
                            </TabPanel>
                          </TabContext>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={3} md={3} xs={12}>
              <SideAd adslocation='home-page' />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DialogMarkConfirmation
        visible={showMarkConfirm}
        onCloseClick={() => setShowMarkConfirm(!showMarkConfirm)}
        loadNotifications={getNotifications}
        loadUnreadNotifications={getUnreadNotifications}
      />
    </Box>
  )
}

Notification.acl = {
  action: 'read',
  subject: 'home'
}

export default Notification