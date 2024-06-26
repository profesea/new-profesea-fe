import React from 'react'
import Box from '@mui/material/Box'
import { Grid, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ManageAccount from 'src/layouts/components/ManageAccount'

const Candidate = () => {
    const Theme = useTheme()
    const hidden = useMediaQuery(Theme.breakpoints.down('md'))

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} sx={
                    !hidden
                        ? {
                            p: 4,
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                            alignContent: 'top',
                            marginBottom: '10px'
                        }
                        : {}
                }>
                    <Grid item xs={12}>
                        <Grid container sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            boxSizing: 'border-box',
                            background: '#ffeae9',
                            border: '1px solid rgba(76, 78, 100, 0.12)',
                            borderRadius: '20px',
                            marginTop: '10px',
                            direction: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'top',
                            alignContent: 'top'
                        }}>
                            <Grid item xs={12}>
                                <ManageAccount />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

Candidate.acl = {
    action: 'read',
    subject: 'home'
}

export default Candidate
