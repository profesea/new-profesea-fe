import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { HttpClient } from 'src/services'
import { getCleanErrorMessage } from 'src/utils/helpers'
import { CircularProgress } from '@mui/material'
import Job from 'src/contract/models/job'
import Degree from 'src/contract/models/degree'
import JobCategory from 'src/contract/models/job_category'
import RoleLevel from 'src/contract/models/role_level'
import RoleType from 'src/contract/models/role_type'
import { styled } from '@mui/material/styles'
import { Autocomplete, TextareaAutosize } from '@mui/material'

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};
const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    font-family: Poppins;
    font-size: 0.770rem;
    font-weight: 200;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  
    &:hover {
      border-color: ${grey[400]};
    }
  
    &:focus {
      border-color: ${grey[400]};
      box-shadow: 0 0 0 2px ${theme.palette.mode === 'dark' ? grey[200] : grey[500]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})


type EditProps = {
    selectedItem: Job;
    visible: boolean;
    onCloseClick: VoidFunction;
    onStateChange: VoidFunction;
};



const DialogEdit = (props: EditProps) => {
    const [onLoading, setOnLoading] = useState(false);
    const [EduId, setEduId] = useState(props.selectedItem?.degree?.id);
    const [LevelId, setLevelId] = useState(props.selectedItem?.rolelevel_id);
    const [TypeId, setTypeId] = useState(props.selectedItem?.roletype_id);
    const [CatId, setCatId] = useState(props.selectedItem?.category_id);

    const [JobCategory, getJobCategory] = useState<any[]>([]);
    const [Education, getEducation] = useState<any[]>([]);
    const [RoleLevel, getRoleLevel] = useState<any[]>([]);
    const [RoleType, getRoleType] = useState<any[]>([]);
    const combobox = async () => {
        const res = await HttpClient.get(`/public/data/role-level?search=&page=1&take=250`);
        if (res.status != 200) {
            throw res.data.message ?? "Something went wrong!";
        }
        getRoleLevel(res.data.roleLevels.data);

        const res1 = await HttpClient.get(`/public/data/role-type?search=&page=1&take=250`);
        if (res1.status != 200) {
            throw res.data.message ?? "Something went wrong!";
        }
        getRoleType(res1.data.roleTypes.data);

        const res2 = await HttpClient.get(`/job-category?search=&page=1&take=250`);
        if (res2.status != 200) {
            throw res2.data.message ?? "Something went wrong!";
        }
        getJobCategory(res2.data.categories.data);

        const res3 = await HttpClient.get(`/public/data/degree`);
        if (res3.status != 200) {
            throw res3.data.message ?? "Something went wrong!";
        }
        getEducation(res3.data.degrees);
    }

    useEffect(() => {
        combobox()
    }, [])


    const {
        register,
        handleSubmit,
    } = useForm<Job>({
        mode: 'onBlur'
    })



    const onSubmit = async (formData: Job) => {
        const { license, salary_start, salary_end, experience, description } = formData

        const json = {
            "rolelevel_id": LevelId,
            "roletype_id": TypeId,
            "edugrade_id": EduId,
            "category_id": CatId,
            "license": license,
            "salary_start": salary_start,
            "salary_end": salary_end,
            "experience": experience,
            "description": description
        }

        setOnLoading(true);
        try {
            const resp = await HttpClient.patch(`/job/${props.selectedItem.id}`, json);
            if (resp.status != 200) {
                throw resp.data.message ?? "Something went wrong!";
            }

            props.onCloseClick();
            toast.success(`Updated successfully!`);
        } catch (error) {
            toast.error(`Opps ${getCleanErrorMessage(error)}`);
        }

        setOnLoading(false);
        props.onStateChange();
    }

    // console.log(props)

    return (
        <Dialog
            fullWidth
            open={props.visible}
            maxWidth='sm'
            scroll='body'
            onClose={props.onCloseClick}
            TransitionComponent={Transition}
        >
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}  >
                <DialogContent
                    sx={{
                        position: 'relative',
                        pb: theme => `${theme.spacing(8)} !important`,
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <IconButton size='small' onClick={props.onCloseClick} sx={{ position: 'absolute', right: '1rem', top: '1rem' }} >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                            Edit Job
                        </Typography>
                        <Typography variant='body2'>Edit Job</Typography>
                    </Box>

                    <Grid container columnSpacing={'1'} rowSpacing={'2'} >
                        <Grid item md={12} xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-level"
                                value={props.selectedItem.role_type}
                                options={RoleType}
                                {...register("role_type")}
                                getOptionLabel={(option: RoleType) => option.name}
                                renderInput={(params) => <TextField {...params} label="Role Type" />}
                                onChange={(event: any, newValue: RoleType | null) => (newValue?.id) ? setTypeId(newValue.id) : setTypeId(0)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-level"
                                value={props.selectedItem.rolelevel}
                                options={RoleLevel}
                                getOptionLabel={(option: RoleLevel) => option.levelName}
                                renderInput={(params) => <TextField {...params} label="Role Level" />}
                                onChange={(event: any, newValue: RoleLevel | null) => (newValue?.id) ? setLevelId(newValue.id) : setLevelId(0)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                value={props.selectedItem.category}
                                options={JobCategory}
                                {...register("category")}
                                getOptionLabel={(option: JobCategory) => option.name}
                                renderInput={(params) => <TextField {...params} label="Job Category" />}
                                onChange={(event: any, newValue: JobCategory | null) => (newValue?.id) ? setCatId(newValue.id) : setCatId(0)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                value={props.selectedItem.degree}
                                options={Education}
                                {...register("degree")}
                                getOptionLabel={(option: Degree) => option.name}
                                renderInput={(params) => <TextField {...params} label="Education" />}
                                onChange={(event: any, newValue: Degree | null) => (newValue?.id) ? setEduId(newValue.id) : setEduId(0)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <TextField defaultValue={props.selectedItem.license} id="license" label="License" variant="outlined" fullWidth {...register("license")} />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <TextField defaultValue={props.selectedItem.salary_start} id="salary_start" label="Salary From" variant="outlined" fullWidth  {...register("salary_start")} />
                        </Grid>
                        <Grid item md={6} xs={12} >
                            <TextField defaultValue={props.selectedItem.salary_end} id="salary_end" label="Salary To" variant="outlined" fullWidth {...register("salary_end")} />
                        </Grid>
                        <Grid item md={12} xs={12} >
                            <TextField defaultValue={props.selectedItem.experience} id="experience" label="Experience" variant="outlined" fullWidth {...register("experience")} />
                        </Grid>
                        <Grid item md={12} xs={12} >
                            <StyledTextarea defaultValue={props.selectedItem.description} aria-label="empty textarea" placeholder="Job Description" minRows={'3'} title='jobdesc' sx={{ mb: 6 }} {...register("description")} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                        {onLoading ? (<CircularProgress size={25} style={{ color: 'white' }} />) : "Submit"}
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={props.onCloseClick}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default DialogEdit