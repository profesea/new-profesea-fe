import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Tabs, Tab, useMediaQuery, Grid } from '@mui/material'
import CompanyProfile from 'src/layouts/components/CompanyProfile'
import { useTheme } from '@mui/material/styles'
// import ManageAccount from 'src/layouts/components/ManageAccount'
// import Subscription from 'src/layouts/components/Subscription'
import { IUser } from 'src/contract/models/user'
import localStorageKeys from 'src/configs/localstorage_keys'
import secureLocalStorage from 'react-secure-storage'
import { HttpClient } from 'src/services'
import { AppConfig } from 'src/configs/api'

const Company = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser;
  const [selectedItem, setSelectedItem] = useState<IUser | null>(null);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
            {/* <Typography>{children}</Typography> */}
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);
  const [color, getColor] = useState<any>('#FFFFFF')
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue == 1) {
      getColor('#ffeae9');
    } else {

      getColor('#FFFFFF');
    }
  };

  function firstload() {
    HttpClient.get(AppConfig.baseUrl + "/user/" + user.id)
      .then((response) => {
        const user = response.data.user as IUser;
        setSelectedItem(user);
      })
  }

  useEffect(() => {
    // setOpenPreview(false)
    firstload()
  }, [])

  return (
    <Box  >
      <h1 style={{ display:'none'}}> Platform Kerja Untuk Pelaut </h1>
      <h2 style={{ display:'none'}}> Platform rekrutmen perusahaan</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}
          sx={!hidden ? {
            direction: "row",
            justifyContent: "flex-start",
            alignItems: "stretch",
            alignContent: 'top',
            marginBottom: '10px',


          } : {
          }}
        >
          <Grid item xs={12}>
            <Box sx={{
              borderBottom: 1, borderColor: 'divider', boxSizing: 'border-box',
              background: '#FFFFFF',
              border: '1px solid rgba(76, 78, 100, 0.12)',
              borderRadius: '2px'
            }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                <Tab label='Edit Profile' {...a11yProps(0)} />
                {/* <Tab label="Subcription" {...a11yProps(1)} />
                <Tab label="Change Password" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <Grid container sx={{
              borderBottom: 1, borderColor: 'divider', boxSizing: 'border-box',
              background: color,
              border: 0,
              borderRadius: 'px',
              direction: "row",
              justifyContent: "flex-start",
              alignItems: "top",
              alignContent: 'top',
            }}>
              <Grid item xs={12} >
                <TabPanel value={value} index={0}>
                  {selectedItem != null && <CompanyProfile visible={true} datauser={selectedItem} address={selectedItem.address} />}
                </TabPanel>
                {/* <TabPanel value={value} index={2}>
                  <ManageAccount></ManageAccount>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Subscription></Subscription>
                </TabPanel> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

Company.acl = {
  action: 'read',
  subject: 'home'
};

export default Company
