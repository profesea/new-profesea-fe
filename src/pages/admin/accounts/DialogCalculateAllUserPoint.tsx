import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
import { HttpClient } from 'src/services'

interface IDialogCalculateAllUserPointProps {
  visible: boolean
  onCloseClick: VoidFunction
}

export default function DialogCalculateAllUserPoint(props: IDialogCalculateAllUserPointProps) {
  const [usersId, setUserdId] = useState([]) // only collections user ID [1,2,3 ..]
  const [itemResult, setItemResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState<number>(10)

  const fetchUsersId = async () => {
    setLoading(true)
    try {
      const response = await HttpClient.get(`/public/data/usersId/`, {
        limit: limit
      })
      const userResponse = response?.data?.data?.map((item: any) => {
        return item.id
      })
      setUserdId(userResponse)
    } catch (err) {
      console.log(' error : ', err)
      setLoading(false)
    }
  }

  const calculateEachUser = () => {
    return usersId.map(async (userId: number) => {
      try {
        const calculate = await HttpClient.get(`/public/data/user/calculate-point/${userId}`)
        itemResult.push(calculate.data)
        setItemResult(itemResult)

        return calculate
      } catch (err) {
        console.log('error : ', err)
        setLoading(false)

        return null
      }
    })
  }

  useEffect(() => {
    const promises = calculateEachUser()
    Promise.all(promises)
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        console.log(' error : ', err)
        setLoading(false)
      })
  }, [usersId])

  useEffect(() => {}, [])

  const handleClickCalculateAllButton = () => {
    fetchUsersId()
  }

  return (
    <Dialog open={props.visible} scroll='paper' maxWidth={'md'} fullWidth>
      <DialogTitle id='scroll-dialog-title'>
        <Grid container>
          <Grid item width={'50%'}>
            User Calculation Point
          </Grid>
          <Grid item width={'50%'}>
            <FormControl sx={{ m: 1, minWidth: 120, float: 'right' }} size='small'>
              <InputLabel id='demo-select-small-label'>Limit</InputLabel>
              <Select
                value={limit}
                label='Limit'
                onChange={event => {
                  setLimit(Number(event?.target.value))
                }}
              >
                <MenuItem value={10}> 10 </MenuItem>
                <MenuItem value={50}> 50 </MenuItem>
                <MenuItem value={100}> 100 </MenuItem>
                <MenuItem value={200}> 200 </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ height: 600 }} dividers>
        <Box>
          <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }} border={1}>
            <thead>
              <th> No </th>
              <th> Name </th>
              <th>Employee Type</th>
              <th> Point </th>
              <th> Detail </th>
            </thead>
            <tbody>
              {!loading && itemResult.length > 0 ? (
                itemResult?.map((item: any, index) => {
                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td align='center'>{item?.profile.name}</td>
                      <td align='center'>{item?.profile.employee_type}</td>
                      <td align='center'>{item?.point}</td>
                      <td>
                        {item?.detail_point
                          ? Object.keys(item?.detail_point).map(function (key) {
                              return (
                                <div key={key}>
                                  {key} : {item?.detail_point[key]}
                                </div>
                              )
                            })
                          : JSON.stringify(item?.detail_point)}
                      </td>
                    </tr>
                  )
                })
              ) : loading ? (
                <tr>
                  <td colSpan={5} align='center'>
                    Loading ...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} align='center'>
                    No calculation Process
                  </td>
                </tr>
              )}

              {itemResult.length === 0 && (
                <tr>
                  <td colSpan={5} align='center'>
                    All Users Point already calculated
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingTop: 20 }}>
        <Button
          color='secondary'
          variant='contained'
          onClick={() => {
            setLoading(false)
            props.onCloseClick()
            window.location.reload()
          }}
        >
          {' '}
          Close{' '}
        </Button>
        <Button
          disabled={loading}
          variant='contained'
          onClick={() => {
            handleClickCalculateAllButton()
          }}
        >
          {' '}
          {loading ? 'Calculating ... ' : 'Start Calculation'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
