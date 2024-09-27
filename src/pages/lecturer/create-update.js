import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {Form, Formik} from 'formik';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiLecturer from "../../api/lecturer";
import Utils from "../../constants/utils";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiCategory from "../../api/category";
export default function CreateUpdateLecturer(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [lecturerObject, setLecturerObject] = useState([]);
    const [info, setInfo] = useState({
        name: '',
        birdOfDate: '',
        expertise: '',
        phone: '',
        email: '',
        position: '',
        workPlace: '',
        experience: '',
        code: '',
        description: '',
        lecturerObject: ''
    })
//=====================================================================================================
    useEffect(() => {
        getCategoryApi({
            paging: false,
            type: "LecturerObject"
        }).then(r => {
            if (r.data.responses != null) setLecturerObject(r.data.responses)
        })
    },[])
    useEffect(() => {
        if (location.get('id')) {
            setIdUpdate(location.get('id'));
        }

        if (isUpdate && idUpdate) {
            getDetailApi(idUpdate).then(r => {
                setInfo(r.data)
            }).catch(e => {
            })
        }

    }, [location, idUpdate])
//=====================================================================================================

    function onSubmitFunction(values) {
        let data = {
            "name": values.name ?? '',
            "birdOfDate": values.birdOfDate ?? '',
            "expertise": values.expertise ?? '',
            "phone": values.phone ?? '',
            "email": values.email ?? '',
            "position": values.position ?? '',
            "lecturerObjectId": values.lecturerObjectId ?? '',
            "workPlace": values.workPlace ?? '',
            "experience": values.experience ?? '',
            "note": values.note ?? '',
            "description": values.description ?? '',
        }
        console.log(data)
        if (!isUpdate) {
            createLecturerApi(data).then(r => {
                toast.success('Thêm giảng viên thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/lecturer';
                }, 1100);

            }).catch(e => {
                toast.error('Thêm giảng viên không thành công', Utils.options);
            })
        } else {
            if (isUpdate && idUpdate) {
                updateLecturerApi(data, idUpdate).then(r => {
                    toast.success('Cập nhật giảng viên thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/lecturer';
                    }, 1100);

                }).catch(e => {
                    toast.error('Cập nhật giảng viên không thành công', Utils.options);
                })
            }
        }
    }

//=====================================================================================================
    const back = () => {
        navigate('/lecturer')
    }
//=====================================================================================================
    const createLecturerApi = (data) => {
        return apiLecturer.createLecturer(data);
    }
    const updateLecturerApi = (data, idUpdate) => {
        return apiLecturer.updateLecturer(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiLecturer.getDetailLecturer(idUpdate);
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
//=====================================================================================================
    return (
        <div className={'main-content'}>
            <Button className={'button-back'} onClick={back} style={{marginBottom: '10px'}} variant="text"
                    startIcon={<KeyboardBackspaceIcon/>}>
                Quay lại
            </Button>
            <div className={'main-content-body'}>
                <Formik
                    // validationSchema={validationLecturer}
                    enableReinitialize
                    initialValues={{
                        name: idUpdate ? info.name : '',
                        birdOfDate: idUpdate ? dayjs.unix(info.birdOfDate/1000) : '',
                        expertise: idUpdate ? info.expertise : '',
                        phone: idUpdate ? info.phone : '',
                        email: idUpdate ? info.email : '',
                        position: idUpdate ? info.position : '',
                        workPlace: idUpdate ? info.workPlace : '',
                        experience: idUpdate ? info.experience : '',
                        lecturerObjectId: idUpdate ? info.lecturerObject.id : '',
                        code: idUpdate ? info.code : '',
                        description: idUpdate ? info.description : '',
                    }}
                    onSubmit={
                        async (values) => {
                            onSubmitFunction(values);
                        }
                    }>
                    {props => {
                        const {values, touched, errors, handleChange, handleSubmit} = props;
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Họ và tên<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Họ và tên'}
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mã giảng viên<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='code'
                                                name='code'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Mã giảng viên'}
                                                value={values.code}
                                                onChange={handleChange}
                                                error={touched.code && Boolean(errors.code)}
                                                helperText={touched.code && errors.code}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Đối tượng giảng viên<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='lecturerObjectId'
                                                    name='lecturerObjectId'
                                                    value={values.lecturerObjectId}
                                                    onChange={handleChange}
                                                    size={"small"}>
                                                    {lecturerObject.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.lecturerObjectId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Năm sinh<span
                                                className={'error-message'}>*</span></div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'date-news formik-input'}
                                                    inputFormat="DD-MM-YYYY"
                                                    format="DD-MM-YYYY"
                                                    value={values.birdOfDate}
                                                    onChange={values => props.setFieldValue("birdOfDate", values)
                                                        // setTimeSearch(values)
                                                    }
                                                    error={touched.birdOfDate && Boolean(errors.birdOfDate)}
                                                    helperText={touched.birdOfDate && errors.birdOfDate}
                                                    renderInput={(params) => <TextField
                                                        size={"small"}  {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Chuyên môn<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                type={"text"}
                                                id='expertise'
                                                name='expertise'
                                                className={'formik-input'}
                                                placeholder={'Chuyên môn'}
                                                value={values.expertise}
                                                onChange={handleChange}
                                                error={touched.expertise && Boolean(errors.expertise)}
                                                helperText={touched.expertise && errors.expertise}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Số điện thoại<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                type={"number"}
                                                id='phone'
                                                name='phone'
                                                className={'formik-input'}
                                                placeholder={'Số điện thoại'}
                                                value={values.phone}
                                                onChange={handleChange}
                                                error={touched.phone && Boolean(errors.phone)}
                                                helperText={touched.phone && errors.phone}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Email<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                type={"email"}
                                                id='email'
                                                name='email'
                                                className={'formik-input'}
                                                placeholder={'Email'}
                                                value={values.email}
                                                onChange={handleChange}
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Vị trí<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                type={"text"}
                                                id='position'
                                                name='position'
                                                className={'formik-input'}
                                                placeholder={'Vị trí'}
                                                value={values.position}
                                                onChange={handleChange}
                                                error={touched.position && Boolean(errors.position)}
                                                helperText={touched.position && errors.position}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Nơi làm việc<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                type={"text"}
                                                id='workPlace'
                                                name='workPlace'
                                                className={'formik-input'}
                                                placeholder={'Nơi làm việc'}
                                                value={values.workPlace}
                                                onChange={handleChange}
                                                error={touched.workPlace && Boolean(errors.workPlace)}
                                                helperText={touched.workPlace && errors.workPlace}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Kinh nghiệm</div>
                                            <TextField
                                                sx={{
                                                    '& textarea': {
                                                        minHeight: '80px',
                                                    },
                                                    width: '100%'
                                                }}
                                                multiline
                                                type={'description'}
                                                id='experience'
                                                name='experience'
                                                className={'formik-input'}
                                                placeholder={'Kinh nghiệm'}
                                                value={values.experience}
                                                onChange={handleChange}
                                                error={touched.experience && Boolean(errors.experience)}
                                                helperText={touched.experience && errors.experience}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mô tả</div>
                                            <TextField
                                                sx={{
                                                    '& textarea': {
                                                        minHeight: '80px',
                                                    },
                                                    width: '100%'
                                                }}
                                                multiline
                                                type={'description'}
                                                id='description'
                                                name='description'
                                                className={'formik-input'}
                                                placeholder={'Kinh nghiệm'}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                                <Button className={'cancel-button'} style={{marginRight: '10px'}}
                                                        onClick={back}
                                                        variant="outlined"><HighlightOffIcon></HighlightOffIcon>Hủy</Button>
                                                <Button variant="contained" type='submit'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                         viewBox="0 0 30 30" fill="none">
                                                        <path
                                                            d="M21.25 3.75H6.25C4.8625 3.75 3.75 4.875 3.75 6.25V23.75C3.75 25.125 4.8625 26.25 6.25 26.25H23.75C25.125 26.25 26.25 25.125 26.25 23.75V8.75L21.25 3.75ZM23.75 23.75H6.25V6.25H20.2125L23.75 9.7875V23.75ZM15 15C12.925 15 11.25 16.675 11.25 18.75C11.25 20.825 12.925 22.5 15 22.5C17.075 22.5 18.75 20.825 18.75 18.75C18.75 16.675 17.075 15 15 15ZM7.5 7.5H18.75V12.5H7.5V7.5Z"
                                                            fill="#1F2251"/>
                                                    </svg>
                                                    Thêm</Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}
