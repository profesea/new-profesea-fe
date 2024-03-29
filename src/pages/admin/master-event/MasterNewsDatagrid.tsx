import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import Icon from 'src/@core/components/icon'
import Link from 'next/link';

const columns: GridColDef[] = [
  { field: 'no', headerName: '#', sortable: true, minWidth: 10 },
  { field: 'title', headerName: 'Title', sortable: true, minWidth: 300 },
  { field: 'organizer', headerName: 'Organizer', sortable: true, minWidth: 200 },
  { field: 'date', headerName: 'Date', sortable: true, minWidth: 200 },
  { field: 'time', headerName: 'Time', sortable: true, minWidth: 200 },
  { field: 'venue', headerName: 'Venue', sortable: true, minWidth: 200 },
  { field: 'meet', headerName: 'Link', sortable: true, minWidth: 200 },
  {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    renderCell: cell => {
      const { row } = cell

      return (
        <>
          <Link href={'/admin/master-event/edit/?id=' + row.id}>
            <IconButton aria-label='edit' color='warning' size='small'>
              <Icon icon='solar:pen-new-round-bold-duotone' />
            </IconButton>
          </Link>
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
  title: string
  organizer: string
  date: string
  time: string
  venue: string
  meet: string
  actions: {
    onDelete: VoidFunction
  }
}

export {
    type RowItem,
}

export default function AccountDatagrid(props: RoleGridProps) {
    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                disableColumnMenu
                loading={props.loading}
                rows={props.rows}
                columns={columns}
                paginationMode="server"
                rowCount={props.rowCount}
                pageSizeOptions={[10, 25, 50, 100, 250]}
                onPaginationModelChange={props.onPageChange}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: props.pageSize,
                            page: props.page,
                        },
                    },
                }}
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
            />
        </Box>
    );
}