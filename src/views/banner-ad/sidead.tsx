import { Grid } from "@mui/material"

const SideAd = () => {

    return <Grid xs={12} container display={'flex'} sx={{
        direction: "row",
        justifyContent: "flex-start",
        alignContent: 'top',
        alignItems: "stretch"
    }}>
        <Grid xs={12}>
            <Grid xs={12} sx={{
                boxSizing: 'border-box',
                background: '#FFFFFF',
                border: '1px solid rgba(76, 78, 100, 0.12)',
                borderRadius: '20px',
                p: 4,
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'left',
                marginBottom: '10px',
                height: '197px',
                wrap: 'nowrap'
            }}></Grid>
            <Grid xs={12} sx={{
                boxSizing: 'border-box',
                background: '#FFFFFF',
                border: '1px solid rgba(76, 78, 100, 0.12)',
                borderRadius: '20px',
                p: 4,
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'left',
                marginBottom: '10px',
                height: '197px',
                wrap: 'nowrap'
            }}></Grid>
            <Grid xs={12} sx={{
                boxSizing: 'border-box',
                background: '#FFFFFF',
                border: '1px solid rgba(76, 78, 100, 0.12)',
                borderRadius: '20px',
                p: 4,
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'left',
                marginBottom: '10px',
                height: '197px',
                wrap: 'nowrap'
            }}></Grid>
        </Grid>
    </Grid>
}

export default SideAd;