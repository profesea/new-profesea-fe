import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import moment from 'moment'

const columns: GridColDef[] = [
  { field: 'no', headerName: '#', sortable: true },
  { field: 'name', headerName: 'Job Title', sortable: false, minWidth: 300 },
  { field: 'category', headerName: 'Category Name', sortable: false, minWidth: 300 },
  {
    field: 'created_at',
    headerName: 'Created At',
    sortable: false,
    minWidth: 300,
    renderCell: cell => {
      const { row } = cell

      return <div title={row.created_at}>{moment(row.created_at).fromNow()}</div>
    }
  },
  {
    field: 'user',
    headerName: 'Created By',
    sortable: false,
    minWidth: 300,
    renderCell: cell => {
      const { row } = cell

      return <div>{row.user.team_id == 1 ? 'Admin' : row.user.name}</div>
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    renderCell: cell => {
      const { row } = cell

      return (
        <>
          <IconButton onClick={() => row.actions.onUpdate()} aria-label='edit' color='warning' size='small'>
            <Icon icon='solar:pen-new-round-bold-duotone' />
          </IconButton>
          <IconButton onClick={() => row.actions.onDelete()} aria-label='edit' color='error' size='small'>
            <Icon icon='solar:trash-bin-trash-bold-duotone' />
          </IconButton>
        </>
      )
    }
  }
]

type RoleGridProps = {
  rows: RowItem[]
  loading: boolean
  pageSize: number
  page: number
  rowCount: number
  onPageChange: (model: GridPaginationModel, details: GridCallbackDetails) => void
}

interface RowItem {
  id: number
  name: string
  actions: {
    onDelete: VoidFunction
    onUpdate: VoidFunction
  }
}

export { type RowItem }

export default function RoleLevelDatagrid(props: RoleGridProps) {
  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        disableColumnMenu
        loading={props.loading}
        rows={props.rows}
        columns={columns}
        paginationMode='server'
        rowCount={props.rowCount}
        pageSizeOptions={[5, 10, 25]}
        onPaginationModelChange={props.onPageChange}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: props.pageSize,
              page: props.page
            }
          }
        }}
        disableRowSelectionOnClick
      />
    </Box>
  )
}
