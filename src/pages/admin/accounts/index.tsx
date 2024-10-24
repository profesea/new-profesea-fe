import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { Autocomplete, Box, Button, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import DialogAdd from './DialogAdd'
import AccountDatagrid, { RowItem } from './AccountDatagrid'
import { HttpClient } from 'src/services'
import { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import Account from 'src/contract/models/account'
import debounce from 'src/utils/debounce'
import { GridPaginationModel } from '@mui/x-data-grid'
import DialogDelete from './DialogDelete'
import DialogEdit from './DialogEdit'
import { v4 } from 'uuid'
import { Icon } from '@iconify/react'
import ITeam from 'src/contract/models/team'
import DialogImport from './DialogImport'
import DialogView from './DialogView'
import DialogCalculateAllUserPoint from './DialogCalculateAllUserPoint'
import CalculateIcon from '@mui/icons-material/Calculate'

const UserScreen = () => {
  const translate: any = {
    onship: 'On-Ship',
    offship: 'Off-Ship',
    null: '',
    trainer: 'Trainer'
  }

  const EmployeeType = [
    { employee_type: 'onship', label: 'On-Ship' },
    { employee_type: 'offship', label: 'Off-Ship' }
  ]

  const [hookSignature, setHookSignature] = useState(v4())
  const [onLoading, setOnLoading] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openImModal, setOpenImModal] = useState(false)
  const [openDelModal, setOpenDelModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openDialogCalculate, setOpenDialogCalculate] = useState(false)
  const [dataSheet, setDataSheet] = useState<RowItem[]>([])
  const [selectedItem, setSelectedItem] = useState<Account | null>(null)
  const [teams, getTeams] = useState<any[]>([])

  const [page, setPage] = useState(1)
  const [rowCount, setRowCount] = useState(0)
  const [search, setSearch] = useState('')
  const [filterTeam, setFilterTeam] = useState<any>(0)
  const [filterShip, setFilterShip] = useState<any>([])
  const [filterCrewing, setFilterCrewing] = useState('')

  const [perPage, setPerPage] = useState(10)
  const getListAccount = async () => {
    try {
      const resp = await HttpClient.get(
        `/user-management?search=${search}&page=${page}&take=${perPage}&team_id=${filterTeam}&employee_type=${filterShip}&is_crewing=${filterCrewing}`
      )
      if (resp.status != 200) {
        throw resp.data.message ?? 'Something went wrong!'
      }

      const rows = resp.data.users.data as Account[]
      const items = rows.map((row, index) => {
        return {
          no: index + 1,
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          role: row.employee_type != 'offship' ? row.role : 'Candidate',
          type: translate[row.employee_type],
          plan: row.plan_type,
          point: row.point,
          verified_at: row.verified_at,
          registered_at: row.created_at,
          resend: {
            onResend: () => resendchat(row)
          },
          actions: {
            docView: () => viewHandler(row),
            onDelete: () => deleteHandler(row),
            onUpdate: () => updateHandler(row)
          }
        } as unknown as RowItem
      })

      setRowCount(resp?.data?.users?.total ?? 0)
      setDataSheet(items)
    } catch (error) {
      let errorMessage = 'Something went wrong!'

      if (error instanceof AxiosError) {
        errorMessage = error?.response?.data?.message ?? errorMessage
      }

      if (typeof error == 'string') {
        errorMessage = error
      }

      toast.error(`Opps ${errorMessage}`)
    }
  }

  const combobox = async () => {
    const resp = await HttpClient.get(`/public/data/team?nonpublic=1`)
    if (resp.status != 200) {
      throw resp.data.message ?? 'Something went wrong!'
    }
    getTeams(resp.data.teams)
  }

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
    }, 500),
    []
  )

  const onPageChange = (model: GridPaginationModel) => {
    const mPage = model.page + 1
    setPage(mPage)
    setPerPage(model.pageSize)
  }

  const deleteHandler = (row: Account) => {
    setSelectedItem(row)
    setOpenDelModal(true)
  }

  const updateHandler = (row: Account) => {
    setSelectedItem(row)
    setOpenEditModal(true)
  }

  const viewHandler = (row: Account) => {
    setSelectedItem(row)
    setOpenViewModal(true)
  }

  const resendchat = async (row: Account) => {
    const resp = await HttpClient.get(`/user-management/resend-verification?email=` + row.email)
    if (resp.status == 200) {
      toast.success('Successfully Resend Email!')
    }
  }

  useEffect(() => {
    setOnLoading(true)
    combobox()
    getListAccount().then(() => {
      setOnLoading(false)
    })
  }, [page, search, hookSignature, perPage, filterTeam, filterShip, filterCrewing])

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} sm={6} md={12}>
          <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#FFFFFF' }}>
            <CardHeader
              title={
                <Typography variant='body2' style={{ fontSize: '18px', fontWeight: '600', color: '#32487A' }}>
                  List Accounts
                </Typography>
              }
            />
            <CardContent>
              <Grid container justifyContent='flex-start'>
                <Grid item>
                  <Autocomplete
                    disablePortal
                    id='combo-box-demo'
                    options={teams}
                    getOptionLabel={(option: ITeam) => (option.id == 2 ? 'Candidate' : option.teamName)}
                    renderInput={params => (
                      <TextField {...params} label='Role' size='small' sx={{ mb: 2, width: '150px' }} />
                    )}
                    onChange={(event: any, newValue: ITeam | null) => {
                      if (newValue?.id != 3) {
                        setFilterCrewing('')
                      }

                      return newValue?.id ? setFilterTeam(newValue.id) : setFilterTeam(0)
                    }}
                  />
                </Grid>
                <Grid item>
                  <Autocomplete
                    disablePortal
                    id='combo-box-demo'
                    options={EmployeeType}
                    getOptionLabel={(option: any) => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Type' size='small' sx={{ ml: 3, mb: 2, width: '150px' }} />
                    )}
                    onChange={(event: any, newValue: any | null) =>
                      newValue?.employee_type ? setFilterShip(newValue?.employee_type) : setFilterShip('')
                    }
                  />
                </Grid>
                {filterTeam == 3 && (
                  <Grid item>
                    <Autocomplete
                      disablePortal
                      id='combo-box-demo'
                      options={['yes', 'no']}
                      getOptionLabel={(option: any) => option}
                      renderInput={params => (
                        <TextField {...params} label='Type' size='small' sx={{ ml: 3, mb: 2, width: '150px' }} />
                      )}
                      onChange={(event: any, newValue: any | null) => {
                        setFilterCrewing(newValue)
                      }}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container justifyContent='flex-end'>
                <Grid item>
                  <TextField
                    size='small'
                    sx={{ mr: 2, mb: 2, ml: 5 }}
                    placeholder='Search'
                    onChange={e => handleSearch(e.target.value)}
                  />
                </Grid>
                <Grid item sx={{ mr: 2, mb: 2 }}>
                  <Box>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() =>
                        HttpClient.downloadFile(
                          `/user-management/export?status=&team_id=${filterTeam}&employee_type=&plan_type=`,
                          'users.xlsx'
                        )
                      }
                    >
                      <Icon
                        fontSize='large'
                        icon={'solar:export-bold-duotone'}
                        color={'info'}
                        style={{ fontSize: '14px', margin: 3 }}
                      />
                      Export
                    </Button>
                  </Box>
                </Grid>
                <Grid item sx={{ mr: 2, mb: 2 }}>
                  <Box>
                    <Button variant='contained' size='small' onClick={() => setOpenImModal(!openImModal)}>
                      <Icon
                        fontSize='large'
                        icon={'solar:import-bold-duotone'}
                        color={'info'}
                        style={{ fontSize: '14px', margin: 3 }}
                      />
                      Import
                    </Button>
                  </Box>
                </Grid>
                <Grid item sx={{ mr: 6, mb: 2 }}>
                  <Box>
                    <Button variant='contained' size='small' onClick={() => setOpenAddModal(!openAddModal)}>
                      <Icon
                        fontSize='large'
                        icon={'zondicons:add-outline'}
                        color={'info'}
                        style={{ fontSize: '14px', margin: 3 }}
                      />{' '}
                      Add
                    </Button>
                  </Box>
                </Grid>
                <Grid item sx={{ mr: 6 }}>
                  <Box>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => setOpenDialogCalculate(!openDialogCalculate)}
                    >
                      <CalculateIcon fontSize='large' color={'info'} style={{ fontSize: '14px', margin: 3 }} />{' '}
                      Calculate Point
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <AccountDatagrid
                page={page - 1} // di MUI page pertama = 0
                rowCount={rowCount}
                pageSize={perPage}
                loading={onLoading}
                onPageChange={model => onPageChange(model)}
                rows={dataSheet}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DialogAdd
        visible={openAddModal}
        onStateChange={() => setHookSignature(v4())}
        onCloseClick={() => setOpenAddModal(!openAddModal)}
      />
      <DialogImport
        visible={openImModal}
        onStateChange={() => setHookSignature(v4())}
        onCloseClick={() => setOpenImModal(!openImModal)}
      />
      {selectedItem && (
        <>
          <DialogDelete
            selectedItem={selectedItem}
            visible={openDelModal}
            onStateChange={() => setHookSignature(v4())}
            onCloseClick={() => setOpenDelModal(!openDelModal)}
          />
          <DialogEdit
            key={selectedItem.id}
            selectedItem={selectedItem}
            visible={openEditModal}
            onCloseClick={() => setOpenEditModal(!openEditModal)}
            onStateChange={() => setHookSignature(v4())}
          />
          <DialogView
            key={selectedItem.id}
            selectedItem={selectedItem}
            visible={openViewModal}
            onCloseClick={() => setOpenViewModal(!openViewModal)}
            onStateChange={() => setHookSignature(v4())}
          />
        </>
      )}
      <DialogCalculateAllUserPoint
        visible={openDialogCalculate}
        onCloseClick={() => setOpenDialogCalculate(!openDialogCalculate)}
      />
    </>
  )
}

UserScreen.acl = {
  action: 'read',
  subject: 'admin-accounts'
}

export default UserScreen
