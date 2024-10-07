import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox, Divider,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {Form, Formik} from 'formik';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiPlan from "../../api/plan";
import Utils, {deleteAllIdSame} from "../../constants/utils";
import apiOrganization from "../../api/organization";
import {convertToAutoComplete} from "../../constants/common";
import apiCategory from "../../api/category";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default function CreateUpdatePlan(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [listOrganization, setListOrganization] = useState([])
    const [blockOrganizationId, setBlockOrganizationId] = useState('')
    const [listTrainingType, setListTrainingType] = useState([]);
    const [allTrainingType, setAllTrainingType] = useState([]);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;


    const [info, setInfo] = useState({
        // blockOrganization: '',
        // unitOrganization: '',
        name: '',
        code: '',
        trainingTypes: '',
        planTime: '',
        notes: '',
    })


//=====================================================================================================
    useEffect(() => {
        getCategoryApi({
            paging: false,
            type: "TrainingType"
        }).then(r => {if(r.data.responses != null) setAllTrainingType(r.data.responses)})
    },[])
    // useEffect(() => {
    //     getOrganization().then(r => {
    //         setListOrganization(convertToAutoComplete(r.data, 'name'));
    //     })
    // }, [])
    useEffect(() => {
        if (location.get('id')) {
            setIdUpdate(location.get('id'));
        }
        if (isUpdate && idUpdate) {
            getDetailApi(idUpdate).then(r => {
                setListTrainingType(r.data.trainingTypes)
                setInfo(r.data)
            }).catch(e => {})
        }

    }, [location, idUpdate])
//=====================================================================================================

    function onSubmitFunction(values) {
        let data = {
            // blockOrganizationId: values.blockOrganizationId ?? '',
            // unitOrganizationId: values.unitOrganizationId ?? '',
            name: values.name ?? '',
            code: values.code ?? '',
            trainingTypeIds: listTrainingType.map(item => item.id) ?? '',
            planTime: values.planTime ?? '',
            notes: values.notes ?? '',
        }
        console.log(data)
        if (!isUpdate) {
            createPlanApi(data).then(r => {
                toast.success('Thêm kế hoạch thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/plan';
                }, 1100);

            }).catch(e => {
                toast.error('Thêm kế hoạch không thành công', Utils.options);
            })
        } else {
            if (isUpdate && idUpdate) {
                updatePlanApi(data, idUpdate).then(r => {
                    toast.success('Cập nhật kế hoạch thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/plan';
                    }, 1100);

                }).catch(e => {
                    toast.error('Cập nhật kế hoạch không thành công', Utils.options);
                })
            }
        }
    }

//=====================================================================================================
    const back = () => {
        navigate('/plan')
    }
//=====================================================================================================
    const createPlanApi = (data) => {
        return apiPlan.createPlan(data);
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
    const updatePlanApi = (data, idUpdate) => {
        return apiPlan.updatePlan(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiPlan.getDetailPlan(idUpdate);
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
                    // validationSchema={validationPlan}
                    enableReinitialize
                    initialValues={{
                        // blockOrganizationId: idUpdate ? info.blockOrganization.id : '',
                        // blockOrganizationName: idUpdate ? info.blockOrganization.name : '',
                        // unitOrganizationId: idUpdate ? info.unitOrganization.id : '',
                        // unitOrganizationName: idUpdate ? info.unitOrganization.name : '',
                        name: idUpdate ? info.name : '',
                        code: idUpdate ? info.code : '',
                        trainingTypes: idUpdate ? info.studentObjects : '',
                        planTime: idUpdate ? info.planTime : '',
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
                                    <div className={'label-group-input'}>
                                        <div>Thông tin chung</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Tên kế hoạch<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Tên kế hoạch'}
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mã kế hoạch<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='code'
                                                name='code'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Mã kế hoạch'}
                                                value={values.code}
                                                onChange={handleChange}
                                                error={touched.code && Boolean(errors.code)}
                                                helperText={touched.code && errors.code}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Năm kế hoạch<span
                                                className={'error-message'}>*</span></div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'date-news formik-input'}
                                                    openTo="year"
                                                    views={['year']}
                                                    inputFormat="YYYY"
                                                    format="YYYY"
                                                    value={values.planTime}
                                                    onChange={values => props.setFieldValue("planTime", values)
                                                        // setTimeSearch(values)
                                                    }
                                                    error={touched.planTime && Boolean(errors.planTime)}
                                                    helperText={touched.planTime && errors.planTime}
                                                    renderInput={(params) => <TextField
                                                        size={"small"}  {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        {/*<Grid item xs={6} md={3}>*/}
                                        {/*    <div*/}
                                        {/*        className={'label-input'}>Khối*/}
                                        {/*    </div>*/}
                                        {/*    <Autocomplete*/}
                                        {/*        disablePortal*/}
                                        {/*        id="combo-box-demo"*/}
                                        {/*        options={listOrganization.filter(item => item.parentId === 0)}*/}
                                        {/*        value={{*/}
                                        {/*            id: values.blockOrganizationId,*/}
                                        {/*            label: values.blockOrganizationName*/}
                                        {/*        }}*/}
                                        {/*        renderInput={(params) => < TextField  {...params}*/}
                                        {/*                                              id='blockOrganizationId'*/}
                                        {/*                                              name='blockOrganizationId'*/}
                                        {/*                                              placeholder="Khối"*/}
                                        {/*                                              error={touched.blockOrganizationId && Boolean(errors.blockOrganizationId)}*/}
                                        {/*                                              helperText={touched.blockOrganizationId && errors.blockOrganizationId}/>}*/}
                                        {/*        size={"small"}*/}
                                        {/*        onChange={(event, newValue) => {*/}
                                        {/*            if (newValue) {*/}
                                        {/*                setFieldValue('blockOrganizationId', newValue.id)*/}
                                        {/*                setFieldValue('blockOrganizationName', newValue.label)*/}
                                        {/*                setBlockOrganizationId(newValue.id);*/}
                                        {/*            } else {*/}
                                        {/*                setFieldValue('blockOrganizationId', '')*/}
                                        {/*                setFieldValue('blockOrganizationName', '')*/}
                                        {/*                setFieldValue('unitOrganizationId', '')*/}
                                        {/*                setFieldValue('unitOrganizationName', '')*/}
                                        {/*                setFieldValue('departmentOrganizationId', '')*/}
                                        {/*                setFieldValue('departmentOrganizationName', '')*/}
                                        {/*                setBlockOrganizationId('');*/}
                                        {/*            }*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                        {/*<Grid item xs={6} md={3}>*/}
                                        {/*    <div className={'label-input'}>Đơn vị</div>*/}
                                        {/*    <Autocomplete*/}
                                        {/*        disablePortal*/}
                                        {/*        id="combo-box-demo"*/}
                                        {/*        options={listOrganization.filter(item => item.parentId === blockOrganizationId)}*/}
                                        {/*        value={{*/}
                                        {/*            id: values.unitOrganizationId,*/}
                                        {/*            label: values.unitOrganizationName*/}
                                        {/*        }}*/}
                                        {/*        renderInput={(params) => < TextField  {...params}*/}
                                        {/*                                              id='unitOrganizationId'*/}
                                        {/*                                              name='unitOrganizationId'*/}
                                        {/*                                              placeholder="Đơn vị"*/}
                                        {/*                                              error={touched.unitOrganizationId && Boolean(errors.unitOrganizationId)}*/}
                                        {/*                                              helperText={touched.unitOrganizationId && errors.unitOrganizationId}/>}*/}
                                        {/*        size={"small"}*/}
                                        {/*        onChange={(event, newValue) => {*/}
                                        {/*            if (newValue) {*/}
                                        {/*                setFieldValue('unitOrganizationId', newValue.id)*/}
                                        {/*                setFieldValue('unitOrganizationName', newValue.label)*/}

                                        {/*            } else {*/}
                                        {/*                setFieldValue('unitOrganizationId', '')*/}
                                        {/*                setFieldValue('unitOrganizationName', '')*/}
                                        {/*                setFieldValue('departmentOrganizationId', '')*/}
                                        {/*                setFieldValue('departmentOrganizationName', '')*/}
                                        {/*            }*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Loại khóa đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={allTrainingType}
                                                    disableCloseOnSelect
                                                    getOptionLabel={(option) => option.name}
                                                    renderOption={(props, option, {selected}) => {
                                                        const {key, ...optionProps} = props;
                                                        return (
                                                            <li key={key} {...optionProps}>
                                                                <Checkbox
                                                                    icon={icon}
                                                                    checkedIcon={checkedIcon}
                                                                    style={{marginRight: 8}}
                                                                    checked={listTrainingType.filter(item => item.id === option.id).length > 0}
                                                                />
                                                                {option.name}
                                                            </li>
                                                        );
                                                    }}
                                                    value={listTrainingType}
                                                    onChange={(event, values, changeReason, changeDetails) => {
                                                        setListTrainingType(deleteAllIdSame(values, 'id'))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
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
