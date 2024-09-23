import React, {useEffect, useState} from "react";
import {
    Autocomplete,
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
import apiStudent from "../../api/student";
import Utils, {buildInputTree, buildTreeAsset} from "../../constants/utils";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {sexData} from "../../constants/json_define";
import apiOrganization from "../../api/organization";
import {convertToAutoComplete} from "../../constants/common";

export default function CreateUpdateStudent(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [sex, setSex] = useState(0);
    const [listOrganization, setListOrganization] = useState([])
    const [blockOrganizationId, setBlockOrganizationId] = useState('')
    const [unitOrganizationId, setUnitOrganizationId] = useState('')
    const [departmentOrganizationId, setDepartmentOrganizationId] = useState('')


    const [info, setInfo] = useState({
        name: '',
        dateOfBirth: '',
        sex: '',
        blockOrganization: '',
        unitOrganization: '',
        departmentOrganization: '',
        jobTitle: '',
        phone: '',
        email: '',
        notes: '',
    })


//=====================================================================================================

    useEffect(() => {
        getOrganization().then(r => {
            setListOrganization(convertToAutoComplete(r.data, 'name'));
        })
    }, [])
    useEffect(() => {
        if (location.get('id')) {
            setIdUpdate(location.get('id'));
        }
        if (isUpdate && idUpdate) {
            getDetailApi(idUpdate).then(r => {
                setInfo(r.data)
                setSex(r.data.sex);
            }).catch(e => {
            })
        }

    }, [location, idUpdate])
//=====================================================================================================
    const handleChangeSex = e => {
        setSex(e.target.value);
    };

    function onSubmitFunction(values) {
        let data = {
            "name": values.name ?? '',
            "dateOfBirth": values.dateOfBirth ?? '',
            "sex": sex,
            "blockOrganizationId": values.blockOrganizationId ?? '',
            "unitOrganizationId": values.unitOrganizationId ?? '',
            "departmentOrganizationId": values.departmentOrganizationId ?? '',
            "jobTitle": values.jobTitle ?? '',
            "phone": values.phone ?? '',
            "email": values.email ?? '',
            "notes": values.notes ?? '',
        }
        console.log(data)
        if (!isUpdate) {
            createStudentApi(data).then(r => {
                toast.success('Thêm học viên thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/student';
                }, 1100);

            }).catch(e => {
                toast.error('Thêm học viên không thành công', Utils.options);
            })
        } else {
            if (isUpdate && idUpdate) {
                updateStudentApi(data, idUpdate).then(r => {
                    toast.success('Cập nhật học viên thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/student';
                    }, 1100);

                }).catch(e => {
                    toast.error('Cập nhật học viên không thành công', Utils.options);
                })
            }
        }
    }

//=====================================================================================================
    const back = () => {
        navigate('/student')
    }
//=====================================================================================================
    const createStudentApi = (data) => {
        return apiStudent.createStudent(data);
    }
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
    const updateStudentApi = (data, idUpdate) => {
        return apiStudent.updateStudent(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiStudent.getDetailStudent(idUpdate);
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
                    // validationSchema={validationStudent}
                    enableReinitialize
                    initialValues={{
                        name: idUpdate ? info.name : '',
                        dateOfBirth: idUpdate ? dayjs.unix(info.dateOfBirth / 1000) : '',
                        sex: idUpdate ? info.sex : '',
                        blockOrganizationId: idUpdate ? info.blockOrganization.id : '',
                        blockOrganizationName: idUpdate ? info.blockOrganization.name : '',
                        unitOrganizationId: idUpdate ? info.unitOrganization.id : '',
                        unitOrganizationName: idUpdate ? info.unitOrganization.name : '',
                        departmentOrganizationId: idUpdate ? info.departmentOrganization.id : '',
                        departmentOrganizationName: idUpdate ? info.departmentOrganization.name : '',
                        jobTitle: idUpdate ? info.jobTitle : '',
                        phone: idUpdate ? info.phone : '',
                        email: idUpdate ? info.email : '',
                        notes: idUpdate ? info.notes : '',
                    }}
                    onSubmit={
                        async (values) => {
                            onSubmitFunction(values);
                        }
                    }>
                    {props => {
                        const {setFieldValue, values, touched, errors, handleChange, handleSubmit} = props;
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <Grid container spacing={2.5}>
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
                                            <div className={'label-input'}>Năm sinh<span
                                                className={'error-message'}>*</span></div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'date-news formik-input'}
                                                    inputFormat="DD-MM-YYYY"
                                                    format="DD-MM-YYYY"
                                                    value={values.dateOfBirth}
                                                    onChange={values => props.setFieldValue("dateOfBirth", values)
                                                        // setTimeSearch(values)
                                                    }
                                                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                                                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                                                    renderInput={(params) => <TextField
                                                        size={"small"}  {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Giới tính<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='sex'
                                                    name='sex'
                                                    value={sex}
                                                    onChange={handleChangeSex}
                                                    size={"small"}>
                                                    {sexData.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.sex}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div
                                                className={'label-input'}>Khối
                                            </div>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={listOrganization.filter(item => item.parentId === 0)}
                                                value={{
                                                    id: values.blockOrganizationId,
                                                    label: values.blockOrganizationName
                                                }}
                                                renderInput={(params) => < TextField  {...params}
                                                                                      id='blockOrganizationId'
                                                                                      name='blockOrganizationId'
                                                                                      placeholder="Khối"
                                                                                      error={touched.blockOrganizationId && Boolean(errors.blockOrganizationId)}
                                                                                      helperText={touched.blockOrganizationId && errors.blockOrganizationId}/>}
                                                size={"small"}
                                                onChange={(event, newValue) => {
                                                    if(newValue) {
                                                        setFieldValue('blockOrganizationId', newValue.id)
                                                        setFieldValue('blockOrganizationName', newValue.label)
                                                        setBlockOrganizationId(newValue.id);
                                                    } else {
                                                        setFieldValue('blockOrganizationId', '')
                                                        setFieldValue('blockOrganizationName', '')
                                                        setFieldValue('unitOrganizationId', '')
                                                        setFieldValue('unitOrganizationName', '')
                                                        setFieldValue('departmentOrganizationId', '')
                                                        setFieldValue('departmentOrganizationName','')
                                                        setBlockOrganizationId('');
                                                        setUnitOrganizationId('')
                                                        setDepartmentOrganizationId('')
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Đơn vị</div>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={listOrganization.filter(item => item.parentId === blockOrganizationId)}
                                                value={{
                                                    id: values.unitOrganizationId,
                                                    label: values.unitOrganizationName
                                                }}
                                                renderInput={(params) => < TextField  {...params}
                                                                                      id='unitOrganizationId'
                                                                                      name='unitOrganizationId'
                                                                                      placeholder="Đơn vị"
                                                                                      error={touched.unitOrganizationId && Boolean(errors.unitOrganizationId)}
                                                                                      helperText={touched.unitOrganizationId && errors.unitOrganizationId}/>}
                                                size={"small"}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        setFieldValue('unitOrganizationId', newValue.id)
                                                        setFieldValue('unitOrganizationName', newValue.label)
                                                        setUnitOrganizationId(newValue.id);

                                                    } else {
                                                        setFieldValue('unitOrganizationId', '')
                                                        setFieldValue('unitOrganizationName', '')
                                                        setFieldValue('departmentOrganizationId', '')
                                                        setFieldValue('departmentOrganizationName', '')
                                                        setUnitOrganizationId('');
                                                        setDepartmentOrganizationId('');

                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Phòng ban</div>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={listOrganization.filter(item => item.parentId === unitOrganizationId)}
                                                value={{
                                                    id: values.departmentOrganizationId,
                                                    label: values.departmentOrganizationName
                                                }}
                                                renderInput={(params) => < TextField  {...params}
                                                                                      id='departmentOrganizationId'
                                                                                      name='departmentOrganizationId'
                                                                                      placeholder="Phòng ban"
                                                                                      error={touched.departmentOrganizationId && Boolean(errors.departmentOrganizationId)}
                                                                                      helperText={touched.departmentOrganizationId && errors.departmentOrganizationId}/>}
                                                size={"small"}
                                                onChange={(event, newValue) => {
                                                    console.log(newValue)
                                                    if(newValue) {
                                                        setFieldValue('departmentOrganizationId', newValue.id)
                                                        setFieldValue('departmentOrganizationName', newValue.label)
                                                        setDepartmentOrganizationId(newValue.id)
                                                    }
                                                    else {
                                                        setFieldValue('departmentOrganizationId', '')
                                                        setFieldValue('departmentOrganizationName', '')
                                                        setDepartmentOrganizationId('')
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Chức danh<span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                type={"text"}
                                                id='jobTitle'
                                                name='jobTitle'
                                                className={'formik-input'}
                                                placeholder={'Chức danh'}
                                                value={values.jobTitle}
                                                onChange={handleChange}
                                                error={touched.jobTitle && Boolean(errors.jobTitle)}
                                                helperText={touched.jobTitle && errors.jobTitle}
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
                                            <div className={'label-input'}>Ghi chú</div>
                                            <TextField
                                                size={"small"}
                                                sx={{
                                                    '& textarea': {
                                                        minHeight: '80px',
                                                    },
                                                    width: '100%'
                                                }}
                                                multiline
                                                type={'description'}
                                                id='notes'
                                                name='notes'
                                                className={'formik-input'}
                                                placeholder={'Ghi chú'}
                                                value={values.notes}
                                                onChange={handleChange}
                                                error={touched.notes && Boolean(errors.notes)}
                                                helperText={touched.notes && errors.notes}
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
