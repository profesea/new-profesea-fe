import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { Chip, Grid, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

const columns: GridColDef[] = [
  { field: 'no', headerName: '#', sortable: true, width: 50 },
  { field: 'category_name', headerName: 'Job Category', sortable: true, minWidth: 200 },
  { field: 'role_type', headerName: 'Job Title', sortable: true, minWidth: 200 },
  { field: 'level_name', headerName: 'Role Level', sortable: true, minWidth: 130 },
  { field: 'company_name', headerName: 'Company Name', sortable: true, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    sortable: false,
    minWidth: 150,
    renderCell: cell => {
      const { row } = cell

      return (
        <>
          <Chip label={row.status} color='secondary' size='small' />
        </>
      )
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    minWidth: 150,
    renderCell: cell => {
      const { row } = cell
      const companyNameUrl = row.company_name.toLowerCase().split(' ').join('-') ?? ''
      const jobTitleUrl = row.job_title ? row.job_title?.toLowerCase().split(' ').join('-') : ''

      return (
        <>
          <IconButton
            href={`/candidate/job/${companyNameUrl}/${row.job_id}/${jobTitleUrl}`}
            aria-label='view'
            color='secondary'
            size='small'
          >
            <Icon icon='solar:eye-scan-bold-duotone' style={{ fontSize: '24px' }} />
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
  role_type: string
  company_name: string
  category_name: string
  level_name: string
  status: string
}

export { type RowItem }

export default function AccountDatagrid(props: RoleGridProps) {
  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        disableColumnMenu
        loading={props.loading}
        rows={props.rows}
        columns={columns}
        paginationMode='server'
        rowCount={0}
        pageSizeOptions={[10, 25, 50, 100, 250]}
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
        getRowId={row => row.id}
        slots={{ noRowsOverlay: customNoRowsOverlay }}
      />
    </Box>
  )
}

function customNoRowsOverlay() {
  return (
    <Grid
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
    >
      <Box mt={1}>No Job has been applied for</Box>
    </Grid>
  )
}
