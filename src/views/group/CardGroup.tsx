// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent' 
import { Button, CircularProgress } from '@mui/material'
import {  useState } from 'react'
import { IUser } from 'src/contract/models/user'
import { toast } from 'react-hot-toast'
import { getCleanErrorMessage, getUserAvatar } from 'src/utils/helpers'
import { HttpClient } from 'src/services'
import Avatar from 'src/@core/components/mui/avatar'
 

export type ParamJobVacncy = {
  judul: string
  user: IUser
 
}

// export type ProfileTeamsType = ProfileTabCommonType & { color: ThemeColor }
interface Props {
  selectedGroup: any
  iduser: string
  label: string
  statusbutton: any
  onMessage: (message: string) => void
}

const renderList = (arr: ParamJobVacncy[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
             padding: '5px'
          }}
        > 
          <Box mr={3} mt={-1}>
            <Avatar src={getUserAvatar(item.user)} alt='profile-picture' sx={{ height: 50, width: 50 }} />
          </Box>
          <Box sx={{ columnGap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography sx={{ color: '#424242', fontWeight: 600 }}>
              {`${item.user.name.charAt(0).toUpperCase() + item.user.name.slice(1)}`}
            </Typography>
            <Typography sx={{ color: '#424242', fontWeight: 400 }}>
              {item.user.name.charAt(0).toUpperCase() + item.user.name.slice(1)}
            </Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}
 

const CardGroup = ( props:Props) => {
  const { selectedGroup } = props
  const { iduser } = props 
  const { onMessage } = props 
  const [isLoading, setIsLoading] = useState(false)
  const leaveGroup = async () => {
     const json = {
       idgroup: selectedGroup.id,
       iduser: iduser
     }
     setIsLoading(true)
     try {
       console.log(json)
       onMessage('ganticuk')
       const resp = await HttpClient.post('/group/leave', json)
       if (resp.status != 200) {
         throw resp.data.message ?? 'Something went wrong create group!'
       }
        setIsLoading(false)
       toast.success(` Leave Group successfully!`)
     } catch (error) {
       toast.error(`Opps ${getCleanErrorMessage(error)}`)
     }
  }
  const joinGroup = async () => {
    const json = {
      idgroup: selectedGroup.id,
      iduser: iduser
    } 
    setIsLoading(true) 
     try {
    console.log(json) 
    onMessage('ganticuk')
    const resp = await HttpClient.post('/group/join', json)
    setIsLoading(false)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong create group!'
    }

    toast.success(` Create Group successfully!`)
     } catch (error) {
       toast.error(`Opps ${getCleanErrorMessage(error)}`)
     }
  }
 
  const buildConnectText = () => {
    return selectedGroup.statusmember
  }

  return (
    <Grid container marginTop={'0px'}>
      <Grid item xs={12}>
        <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
          <CardContent>
            <Grid item lg={6} md={6} xs={12}>
              {selectedGroup && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ mr: 2 }}>
                      <Button
                        onClick={buildConnectText() == 'Join' ? () => joinGroup() : () => leaveGroup()}
                        variant={'contained'}
                        size='small'
                      >
                        {isLoading ? <CircularProgress /> : buildConnectText()}
                      </Button>
                    </Box>
                    {/* <Box sx={{ mr: 2 }}>
                      <Button onClick={() => leaveGroup()} variant={'contained'} size='small'>
                        Edit
                      </Button>
                    </Box>

                    <Box sx={{ mr: 2 }}>
                      <Button onClick={() => leaveGroup()} variant={'contained'} size='small'>
                        Delete
                      </Button>
                    </Box> */}
                  </Box>
                </>
              )}
            </Grid>
            <Box sx={{ mt: 3 }}>
              {/* <Typography variant='body2' sx={{ mb: 4, color: '#424242', textTransform: 'uppercase', fontWeight: 600 }}>
                Job Vacancy
              </Typography> */}
              {renderList(selectedGroup?.member)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CardGroup