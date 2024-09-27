import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox, Divider,
    FormControl,
    FormHelperText,
    Grid, InputAdornment,
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
import apiTraining from "../../api/training";
import Utils, {deleteAllIdSame} from "../../constants/utils";
import apiCategory from "../../api/category";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import apiLecturer from "../../api/lecturer";
import apiStudent from "../../api/student";
import {convertToAutoComplete} from "../../constants/common";
import apiOrganization from "../../api/organization";
import apiPlan from "../../api/plan";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {NumericFormat} from "react-number-format";

export default function CreateUpdateTraining(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [allLecturers, setAllLecturers] = useState([]);
    const [listLecturers, setListLecturers] = useState([]);
    const [listStudentsObject, setListStudentsObject] = useState([]);
    const [allStudentsObject, setAllStudentsObject] = useState([]);
    const [listLecturersObject, setListLecturersObject] = useState([]);
    const [allLecturersObject, setAllLecturersObject] = useState([]);
    const [organizationLocation, setOrganizationLocation] = useState([]);
    const [formTraining, setFormTraining] = useState([]);
    const [listOrganization, setListOrganization] = useState([])
    const [listBlockOrganization, setListBlockOrganization] = useState([])
    const [listUnitOrganization, setListUnitOrganization] = useState([])
    const [plan, setPlan] = useState([]);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;
    const [lecturerExpense, setlecturerExpense] = useState('')
    const [expenseAllLecturer, setExpenseAllLecturer] = useState('')
    const [logisticsExpense, setLogisticsExpense] = useState('')
    const [lunchExpense, setLunchExpense] = useState('')
    const [totalExpense, setTotalExpense] = useState('')
    const [info, setInfo] = useState({
        plan: '',
        blockOrganizations: '',
        unitOrganizations: '',
        name: '',
        code: '',
        target: '',
        content: '',
        estimateDurationOfClass: '',
        totalEstimateDuration: '',
        estimateStudent: '',
        realStudentOfClass: '',
        numberOfClasses: '',
        lecturers: '',
        lecturerObjects: '',
        studentObjects: '',
        formTraining: '',
        formOfImplement: '',
        organizationLocation: '',
        lecturerExpense: '',
        logisticsExpense: '',
        lunchExpense: '',
        totalExpense: '',
        startDate: '',
        endDate: '',
        notes: '',
    })


//=====================================================================================================
    useEffect(() => {
        getOrganization().then(r => {
            setListOrganization(convertToAutoComplete(r.data, 'name'));
        })
    }, [])
    useEffect(() => {
        getAllLecturerApi().then(r => {
            setAllLecturers(r.data)
        })
        getAllPlanApi().then(r => {
            setPlan(r.data)
        })
        getCategoryApi({
            paging: false,
            type: "StudentObject"
        }).then(r => {
            if (r.data.responses != null) setAllStudentsObject(r.data.responses)
        })
        getCategoryApi({
            paging: false,
            type: "LecturerObject"
        }).then(r => {
            if (r.data.responses != null) setAllLecturersObject(r.data.responses)
        })
        getCategoryApi({
            paging: false,
            type: "FormTraining"
        }).then(r => {
            if (r.data.responses != null) setFormTraining(r.data.responses)
        })
        getCategoryApi({
            paging: false,
            type: "OrganizationLocation"
        }).then(r => {
            if (r.data.responses != null) setOrganizationLocation(r.data.responses)
        })

        if (location.get('id')) {
            getDetailApi(location.get('id')).then(r => {
                setInfo(r.data)
                setListLecturers(r.data.lecturers)
                setListBlockOrganization(r.data.blockOrganizations)
                setListUnitOrganization(r.data.unitOrganizations)
                setListLecturersObject(r.data.lecturerObjects)
                setListStudentsObject(r.data.studentObjects)
                setlecturerExpense(r.data.lecturerExpense)
                setLogisticsExpense(r.data.logisticsExpense)
                setLunchExpense(r.data.lunchExpense)
                setTotalExpense(r.data.totalExpense)
            }).catch(e => {
            })
            setIdUpdate(location.get('id'));
        }

    }, [])

//=====================================================================================================
    function onSubmitFunction(values) {
        let data = {
            planId: values.planId ?? '',
            blockOrganizationIds: listBlockOrganization.map(item => item.id) ?? '',
            unitOrganizationIds: listUnitOrganization.map(item => item.id) ?? '',
            name: values.name ?? '',
            code: values.code ?? '',
            target: values.target ?? '',
            content: values.content ?? '',
            estimateDurationOfClass: values.estimateDurationOfClass ?? '',
            totalEstimateDuration: values.totalEstimateDuration ?? '',
            estimateStudent: values.estimateStudent ?? '',
            realStudentOfClass: values.realStudentOfClass ?? '',
            numberOfClasses: values.numberOfClasses ?? '',
            lecturerIds: listLecturers.map(item => item.id) ?? '',
            lecturerObjectIds: listLecturersObject.map(item => item.id) ?? '',
            studentObjectIds: listStudentsObject.map(item => item.id) ?? '',
            formTrainingId: values.formTrainingId ?? '',
            formOfImplement: values.formOfImplement ?? '',
            organizationLocationId: values.organizationLocationId ?? '',
            // lecturerExpense: values.lecturerExpense ?? '',
            // expenseAllLecturer: values.expenseAllLecturer ?? '',
            // logisticsExpense: values.logisticsExpense ?? '',
            // lunchExpense: values.lunchExpense ?? '',
            // totalExpense: total ?? '',
            startDate: values.startDate ?? '',
            endDate: values.endDate ?? '',
            notes: values.notes ?? '',
        }
        console.log(data);
        if (!isUpdate) {
            createTrainingApi(data).then(r => {
                toast.success('Thêm khóa đào tạo thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/training';
                }, 1100);
            }).catch(e => {
                toast.error('Thêm khóa đào tạo không thành công', Utils.options);
            })
        } else {
            if (isUpdate && location.get('id')) {
                updateTrainingApi(data, location.get('id')).then(r => {
                    toast.success('Cập nhật khóa đào tạo thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/training';
                    }, 1100);
                }).catch(e => {
                    toast.error('Cập nhật khóa đào tạo không thành công', Utils.options);
                })
            }
        }
    }
//=====================================================================================================
    const back = () => {
        navigate('/training')
    }
//=====================================================================================================
    const createTrainingApi = (data) => {
        return apiTraining.createTraining(data);
    }
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
    const updateTrainingApi = (data, idUpdate) => {
        return apiTraining.updateTraining(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiTraining.getDetailTraining(idUpdate);
    }
    const getAllLecturerApi = () => {
        return apiLecturer.getAllLecturer();
    }
    const getAllPlanApi = () => {
        return apiPlan.getAllPlan();
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
                    // validationSchema={validationtraining}
                    enableReinitialize
                    initialValues={{
                        planId: idUpdate ? info.plan.id : '',
                        blockOrganizations: idUpdate ? info.blockOrganizations : '',
                        unitOrganizations: idUpdate ? info.unitOrganizations : '',
                        name: idUpdate ? info.name : '',
                        code: idUpdate ? info.code : '',
                        target: idUpdate ? info.target : '',
                        content: idUpdate ? info.content : '',
                        estimateDurationOfClass: idUpdate ? info.estimateDurationOfClass : '',
                        totalEstimateDuration: idUpdate ? info.totalEstimateDuration : '',
                        estimateStudent: idUpdate ? info.estimateStudent : '',
                        realStudentOfClass: idUpdate ? info.realStudentOfClass : '',
                        numberOfClasses: idUpdate ? info.numberOfClasses : '',
                        lecturers: idUpdate ? info.lecturers : '',
                        lecturerObjects: idUpdate ? info.lecturerObjects : '',
                        studentObjects: idUpdate ? info.studentObjects : '',
                        formTrainingId: idUpdate ? info.formTraining.id : '',
                        formOfImplement: idUpdate ? info.formOfImplement : '',
                        organizationLocationId: idUpdate ? info.organizationLocation.id : '',
                        lecturerExpense: idUpdate ? info.lecturerExpense : '',
                        //expenseAllLecturer: idUpdate ? info.expenseAllLecturer : '',
                        logisticsExpense: idUpdate ? info.logisticsExpense : '',
                        lunchExpense: idUpdate ? info.lunchExpense : '',
                        totalExpense: idUpdate ? info.totalExpense : '',
                        startDate: idUpdate ? info.startDate : '',
                        endDate: idUpdate ? info.endDate : '',
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
                                            <div className={'label-input'}>Tên khóa đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Tên khóa đào tạo'}
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mã khóa đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='code'
                                                name='code'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Mã khóa đào tạo'}
                                                value={values.code}
                                                onChange={handleChange}
                                                error={touched.code && Boolean(errors.code)}
                                                helperText={touched.code && errors.code}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Kế hoạch<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='planId'
                                                    name='planId'
                                                    value={values.planId}
                                                    onChange={handleChange}
                                                    size={"small"}>
                                                    {plan.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.planId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Khối<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={listOrganization.filter(item => item.parentId === 0)}
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
                                                                    checked={listBlockOrganization.filter(item => item.id === option.id).length > 0}
                                                                />
                                                                {option.name}
                                                            </li>
                                                        );
                                                    }}
                                                    value={listBlockOrganization}
                                                    onChange={(event, values, changeReason, changeDetails) => {
                                                        setListBlockOrganization(deleteAllIdSame(values))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Đơn vị<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={listOrganization.filter(item1 =>
                                                        listBlockOrganization.some(item2 => item1.parentId === item2.id)
                                                    )}
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
                                                                    checked={listUnitOrganization.filter(item => item.id === option.id).length > 0}
                                                                />
                                                                {option.name}
                                                            </li>
                                                        );
                                                    }}
                                                    value={listUnitOrganization}
                                                    onChange={(event, values, changeReason, changeDetails) => {
                                                        setListUnitOrganization(deleteAllIdSame(values))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
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
                                            <div className={'label-input'}>Thời lượng dự kiến/lớp (giờ)<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                type={"number"}
                                                size={"small"}
                                                id='estimateDurationOfClass'
                                                name='estimateDurationOfClass'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Thời lượng dự kiến/lớp (giờ)'}
                                                value={values.estimateDurationOfClass}
                                                onChange={handleChange}
                                                error={touched.estimateDurationOfClass && Boolean(errors.estimateDurationOfClass)}
                                                helperText={touched.estimateDurationOfClass && errors.estimateDurationOfClass}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Tổng thời lượng dự kiến(giờ)<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                type={"number"}
                                                size={"small"}
                                                id='totalEstimateDuration'
                                                name='totalEstimateDuration'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Tổng thời lượng dự kiến'}
                                                value={values.totalEstimateDuration}
                                                onChange={handleChange}
                                                error={touched.totalEstimateDuration && Boolean(errors.totalEstimateDuration)}
                                                helperText={touched.totalEstimateDuration && errors.totalEstimateDuration}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Học viên dự kiến<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                type={"number"}
                                                size={"small"}
                                                id='estimateStudent'
                                                name='estimateStudent'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Học viên dự kiến'}
                                                value={values.estimateStudent}
                                                onChange={handleChange}
                                                error={touched.estimateStudent && Boolean(errors.estimateStudent)}
                                                helperText={touched.estimateStudent && errors.estimateStudent}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Học viên thực tế/lớp<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                type={"number"}
                                                size={"small"}
                                                id='realStudentOfClass'
                                                name='realStudentOfClass'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Học viên thực tế/lớp'}
                                                value={values.realStudentOfClass}
                                                onChange={handleChange}
                                                error={touched.realStudentOfClass && Boolean(errors.realStudentOfClass)}
                                                helperText={touched.realStudentOfClass && errors.realStudentOfClass}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Số lượng lớp<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                type={"number"}
                                                size={"small"}
                                                id='numberOfClasses'
                                                name='numberOfClasses'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Số lượng lớp'}
                                                value={values.numberOfClasses}
                                                onChange={handleChange}
                                                error={touched.numberOfClasses && Boolean(errors.numberOfClasses)}
                                                helperText={touched.numberOfClasses && errors.numberOfClasses}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Danh sách giảng viên<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={allLecturers}
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
                                                                    checked={listLecturers.filter(item => item.id === option.id).length > 0}
                                                                />
                                                                {option.name}
                                                            </li>
                                                        );
                                                    }}
                                                    value={listLecturers}
                                                    onChange={(event, values, changeReason, changeDetails) => {
                                                        setListLecturers(deleteAllIdSame(values))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Đối tượng giảng viên<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={allLecturersObject}
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
                                                                    checked={listLecturersObject.filter(item => item.id === option.id).length > 0}
                                                                />
                                                                {option.name}
                                                            </li>
                                                        );
                                                    }}
                                                    value={listLecturersObject}
                                                    onChange={(event, values, changeReason, changeDetails) => {
                                                        setListLecturersObject(deleteAllIdSame(values))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Đối tượng học viên<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={allStudentsObject}
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
                                                                    checked={listStudentsObject.filter(item => item.id === option.id).length > 0}
                                                                />
                                                                {option.name}
                                                            </li>
                                                        );
                                                    }}
                                                    value={listStudentsObject}
                                                    onChange={(event, values, changeReason, changeDetails) => {
                                                        setListStudentsObject(deleteAllIdSame(values))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Hình thức đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='formTrainingId'
                                                    name='formTrainingId'
                                                    value={values.formTrainingId}
                                                    onChange={handleChange}
                                                    size={"small"}>
                                                    {formTraining.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.formTrainingId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Địa điểm đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='organizationLocationId'
                                                    name='organizationLocationId'
                                                    value={values.organizationLocationId}
                                                    onChange={handleChange}
                                                    size={"small"}>
                                                    {organizationLocation.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.organizationLocationId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Hình thức thực hiện<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='formOfImplement'
                                                name='formOfImplement'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Hình thức thực hiện'}
                                                value={values.formOfImplement}
                                                onChange={handleChange}
                                                error={touched.formOfImplement && Boolean(errors.formOfImplement)}
                                                helperText={touched.formOfImplement && errors.formOfImplement}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Ngày bắt đầu<span
                                                className={'error-message'}>*</span></div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'date-news formik-input'}
                                                    inputFormat="DD-MM-YYYY"
                                                    format="DD-MM-YYYY"
                                                    value={values.startDate}
                                                    onChange={values => props.setFieldValue("startDate", values)
                                                        // setTimeSearch(values)
                                                    }
                                                    error={touched.startDate && Boolean(errors.startDate)}
                                                    helperText={touched.startDate && errors.startDate}
                                                    renderInput={(params) => <TextField
                                                        size={"small"}  {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Ngày kết thúc<span
                                                className={'error-message'}>*</span></div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'date-news formik-input'}
                                                    inputFormat="DD-MM-YYYY"
                                                    format="DD-MM-YYYY"
                                                    value={values.endDate}
                                                    onChange={values => props.setFieldValue("endDate", values)
                                                        // setTimeSearch(values)
                                                    }
                                                    error={touched.endDate && Boolean(errors.endDate)}
                                                    helperText={touched.endDate && errors.endDate}
                                                    renderInput={(params) => <TextField
                                                        size={"small"}  {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <Divider/>
                                        </Grid>
                                    </Grid>
                                    {
                                        lecturerExpense && logisticsExpense && lunchExpense
                                            ? <div className={'label-group-input'}>
                                                <div>Chi phí</div>
                                            </div>
                                            : ''
                                    }
                                    {
                                        lecturerExpense && logisticsExpense && lunchExpense
                                            ? <Grid container spacing={2.5}>
                                                {
                                                    lecturerExpense
                                                    ? <Grid item xs={6} md={3}>
                                                            <div className={'label-input'}>Chi phí giảng viên</div>
                                                            <NumericFormat
                                                                disabled
                                                                id='lecturerExpense'
                                                                name='lecturerExpense'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.lecturerExpense}
                                                                customInput={TextField}
                                                                error={touched.lecturerExpense && Boolean(errors.lecturerExpense)}
                                                                helperText={touched.lecturerExpense && errors.lecturerExpense}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                            />
                                                        </Grid>
                                                    : ''
                                                }
                                                {
                                                    logisticsExpense
                                                        ? <Grid item xs={6} md={3}>
                                                            <div className={'label-input'}>Chi phí hậu cần</div>
                                                            <NumericFormat
                                                                disabled
                                                                id='logisticsExpense'
                                                                name='logisticsExpense'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.logisticsExpense}
                                                                customInput={TextField}
                                                                error={touched.logisticsExpense && Boolean(errors.logisticsExpense)}
                                                                helperText={touched.logisticsExpense && errors.logisticsExpense}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                            />
                                                        </Grid>
                                                        : ''
                                                }
                                                {
                                                    lunchExpense
                                                        ? <Grid item xs={6} md={3}>
                                                            <div className={'label-input'}>Chi phí ăn trưa</div>
                                                            <NumericFormat
                                                                disabled
                                                                id='lunchExpense'
                                                                name='lunchExpense'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.lunchExpense}
                                                                customInput={TextField}
                                                                error={touched.lunchExpense && Boolean(errors.lunchExpense)}
                                                                helperText={touched.lunchExpense && errors.lunchExpense}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                            />
                                                        </Grid>
                                                        : ''
                                                }
                                                {
                                                    totalExpense
                                                        ? <Grid item xs={6} md={3}>
                                                            <div className={'label-input'}>Tổng chi phí</div>
                                                            <NumericFormat
                                                                disabled
                                                                id='totalExpense'
                                                                name='totalExpense'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.totalExpense}
                                                                customInput={TextField}
                                                                error={touched.totalExpense && Boolean(errors.totalExpense)}
                                                                helperText={touched.totalExpense && errors.totalExpense}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                            />
                                                        </Grid>
                                                        : ''
                                                }
                                                <Grid item xs={6} md={12}>
                                                    <Divider/>
                                                </Grid>
                                            </Grid>
                                            : ''
                                    }
                                    <div className={'label-group-input'}>
                                        <div>Nội dung chi tiết</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mục tiêu</div>
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
                                                id='target'
                                                name='target'
                                                className={'formik-input'}
                                                placeholder={'Ghi chú'}
                                                value={values.target}
                                                onChange={handleChange}
                                                error={touched.target && Boolean(errors.target)}
                                                helperText={touched.target && errors.target}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Nội dung</div>
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
                                                id='content'
                                                name='content'
                                                className={'formik-input'}
                                                placeholder={'Ghi chú'}
                                                value={values.content}
                                                onChange={handleChange}
                                                error={touched.content && Boolean(errors.content)}
                                                helperText={touched.content && errors.content}
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
