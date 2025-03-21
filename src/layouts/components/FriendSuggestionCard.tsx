import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Avatar, Button, CircularProgress, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { IUser } from 'src/contract/models/user'
import { toLinkCase, toTitleCase } from 'src/utils/helpers'
import ConnectButton from './ConnectButton'
import Link from 'next/link'
import { HttpClient } from 'src/services'
import { Icon } from '@iconify/react'
import secureLocalStorage from 'react-secure-storage'
import localStorageKeys from 'src/configs/localstorage_keys'

const renderList = (arr: IUser[]) => {
  if (!arr || arr.length == 0) {
    return (
      <Box textAlign={'center'}>
        <Typography color='text.secondary'>No suggestion for now</Typography>
      </Box>
    )
  }

  return arr.map((item, index) => {
    const userPhoto = item.photo ? item.photo : '/images/avatars/default-user.png'

    return (
      <Box key={index}>
        <Grid
          container
          sx={{
            display: 'flex',
            gap: '12px',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          }}
        >
          <Avatar src={userPhoto} alt='profile-picture' sx={{ width: 44, height: 44 }} />
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                style={{ textDecoration: 'none' }}
                href={`/${item.role === 'Seafarer' ? 'profile' : 'company'}/${toLinkCase(item.username)}`}
                target='_blank'
              >
                <Typography
                  sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 16,
                    wordBreak: 'break-word'
                  }}
                >
                  {toTitleCase(item.username)}
                </Typography>
              </Link>
              <Typography sx={{ color: '#949EA2', fontSize: 14 }}>
                {`${
                  item?.employee_type === 'onship'
                    ? item?.field_preference?.role_type?.name
                      ? item?.field_preference?.role_type?.name
                      : ''
                    : item?.field_preference?.role_type?.name
                    ? item?.field_preference?.job_category?.name
                    : ''
                }`}
              </Typography>
            </Box>
            <ConnectButton user={item} />
          </Box>
        </Grid>
        {index !== arr.length - 1 && <Divider sx={{ my: '24px' }} />}
      </Box>
    )
  })
}

const FriendSuggestionCard = ({
  location,
  dataUser,
  status
}: {
  location?: string
  dataUser?: IUser
  status?: boolean
}) => {
  const [listFriends, setListFriends] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const user = secureLocalStorage.getItem(localStorageKeys.userData) as IUser
  if (status === undefined) {
    status = true
  }
  const fetchListFriends = async () => {
    setIsLoading(true)
    try {
      const user_id = dataUser ? dataUser.id : user.id

      const resp = await HttpClient.get('/public/data/friendship/suggestion/?' + 'user_id=' + user_id, {
        page: 1,
        take: 3
      })

      const { data } = resp.data as { data: IUser[] }

      setIsLoading(false)
      setListFriends(data)
    } catch (error) {
      setIsLoading(false)
      alert(error)
    }
  }

  useEffect(() => {
    fetchListFriends()
  }, [])

  const isStatusLink = (link: string) => {
    if (!status) {
      return `/login/?returnUrl=` + link
    }

    return link
  }

  return (
    <Box
      sx={{
        borderRadius: location === 'profile' ? '16px' : '4px',
        backgroundColor: '#FFFFFF',
        boxShadow: location === 'profile' ? 3 : 0,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: '24px' }}>
        <Typography
          sx={{
            mb: '24px',
            color: 'black',
            fontSize: location === 'profile' ? 20 : 18,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}
        >
          Add to your network
        </Typography>
        {isLoading ? (
          <Box textAlign={'center'} mt={10}>
            <CircularProgress />
          </Box>
        ) : (
          renderList(listFriends)
        )}
      </Box>
      {location === 'profile' ||
        (location === 'home' && (
          <>
            <Divider sx={{ mx: '24px' }} />
            <Button
              endIcon={<Icon icon='mingcute:right-fill' style={{ fontSize: 18 }} />}
              href={isStatusLink(`/connections`)}
              sx={{
                py: '18px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textTransform: 'none',
                color: 'primary.main',
                fontSize: 14,
                fontWeight: 'bold',
                borderRadius: '0 !important'
              }}
            >
              Show all
            </Button>
          </>
        ))}
    </Box>
  )
}

export default FriendSuggestionCard
