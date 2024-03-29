import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import Icon from 'src/@core/components/icon'
import Link from 'next/link';

const columns: GridColDef[] = [
    { field: 'no', headerName: '#', sortable: true , width: 50},
    { field: 'title', headerName: 'Title', sortable: true , minWidth: 250},
    // { field: 'schedule', headerName: 'Schedule', sortable: false, minWidth: 150 },
    { field: 'category', headerName: 'Category', sortable: false, minWidth: 250 },
    { field: 'short_description', headerName: 'Description', sortable: false, minWidth: 300 },
    {
        field: 'action',
        headerName: 'Action',
        sortable: false,
        minWidth: 150,
        renderCell: (cell) => {
            const { row } = cell;

            return (
                <>
                    <Link href={`/admin/training-management-instant/joined/${row.id}`}>
                        <IconButton aria-label='view' color='info' size='small'>
                            <Icon icon='mdi:user' />
                        </IconButton>
                    </Link>
                    <Link href={`/admin/training-management-instant/settings/${row.id}`}>
                        <IconButton aria-label='view' color='secondary' size='small'>
                            <Icon icon='mdi:gear' />
                        </IconButton>
                    </Link>                        
                    <IconButton onClick={() => row.actions.onUpdate()} aria-label='edit' color='warning' size='small'>
                        <Icon icon='solar:pen-new-round-bold-duotone' />
                    </IconButton>
                    <IconButton onClick={() => row.actions.onDelete()} aria-label='edit' color='error' size='small'>
                        <Icon icon='solar:trash-bin-trash-bold-duotone' />
                    </IconButton>
                </>
            );
        }
    },
];

type RoleGridProps = {
    rows: RowItem[];
    loading: boolean;
    pageSize: number;
    page: number;
    rowCount: number;
    onPageChange: (model: GridPaginationModel, details: GridCallbackDetails) => void;
}

interface RowItem {
    id:number,
    title: string,
    schedule: string,
    category: string,
    short_description: string,
    actions: {
        onDelete: VoidFunction,
        onUpdate: VoidFunction,
    };
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