import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormHelperText,
    Grid, InputAdornment, Menu,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField, Tooltip
} from "@mui/material";
import {Form, Formik} from 'formik';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiTrainingClass from "../../api/training-class";
import Utils, {
    convertArr,
    deleteAllIdSame,
    formatVND,
    getDateTimeFromTimestamp,
    getNameToId
} from "../../constants/utils";
import {sexData, tableName} from "../../constants/json_define";
import apiOrganization from "../../api/organization";
import {convertToAutoComplete} from "../../constants/common";
import apiCategory from "../../api/category";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import apiLecturer from "../../api/lecturer";
import apiStudent from "../../api/student";
import apiTraining from "../../api/training";
import ModalListStudent from "./ModalListStudent";
import {NumericFormat} from "react-number-format";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingColumnTable from "../../components/SettingColumnTable";
import apiTableConfig from "../../api/tableConfig";
import {DeleteIcon, UpdateIcon} from "../../constants/icon-define";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default function CreateUpdateTrainingClass(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [allLecturers, setAllLecturers] = useState([]);
    const [allLecturersDefine, setAllLecturersDefine] = useState([]);
    const [listLecturers, setListLecturers] = useState([]);
    const [organizationLocation, setOrganizationLocation] = useState([]);
    const [studentObject, setStudentObject] = useState([]);
    const [allTraining, setAllTraining] = useState([]);
    const [listOrganization, setListOrganization] = useState([])
    const [listBlockOrganization, setListBlockOrganization] = useState([])
    const [listUnitOrganization, setListUnitOrganization] = useState([])
    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = useState(false)
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [lecturerExpense, setLecturerExpense] = useState('')
    const [logisticsExpense, setLogisticsExpense] = useState('')
    const [trainingId, setTrainingId] = useState(null)
    const [lunchExpense, setLunchExpense] = useState('')
    const [totalExpense, setTotalExpense] = useState('')
    const [anchorElSettingTable, setAnchorElSettingTable] = useState(null);
    const [studentIdDelete, setStudentIdDelete] = useState('');
    const openSettingTable = Boolean(anchorElSettingTable);
    const [isRefreshConfigTable, setIsRefreshConfigTable] = useState(false)
    const [columns, setColumns] = useState([])
    const [listStudentsObject, setListStudentsObject] = useState([]);
    const [allStudentsObject, setAllStudentsObject] = useState([]);
    const [listLecturersObject, setListLecturersObject] = useState([]);
    const [allLecturersObject, setAllLecturersObject] = useState([]);
    const [openModalDel, setOpenModalDel] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 1000,
        rows: [],
        total: 0
    });
    const [info, setInfo] = useState({
        blockOrganizations: '',
        unitOrganizations: '',
        name: '',
        code: '',
        training: '',
        lecturers: '',
        organizationLocation: '',
        studentObject: '',
        students: '',
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
        getConfigTableApi(getNameToId(tableName, 6)).then(r => {
            let list = r.data;
            list.sort((a, b) => a.index - b.index);
            setColumns(list);
        })
    }, [isRefreshConfigTable])
    useEffect(() => {
        getAllTrainingApi().then(r => {
            setAllTraining(r.data)
        })
    },[])
    useEffect(() => {
        if (location.get('id')) {
            getDetailApi(location.get('id')).then(r => {
                const item = allTraining.find(entry => entry.id === r.data.training.id);
                setListOrganization([
                    ...item.blockOrganizations,
                    ...item.unitOrganizations
                ]);
                setInfo(r.data)
                setListBlockOrganization(r.data.blockOrganizations)
                setListUnitOrganization(r.data.unitOrganizations)
                setListLecturers(r.data.lecturers)
                setLecturerExpense(r.data.lecturerExpense)
                setLogisticsExpense(r.data.logisticsExpense)
                setLunchExpense(r.data.lunchExpense)
                setTotalExpense(r.data.totalExpense)
                setAllStudentsObject((allTraining.find(item => item.id === r.data.training.id)).studentObjects)
                setAllLecturersObject((allTraining.find(item => item.id === r.data.training.id)).lecturerObjects)
                //setAllLecturersDefine((allTraining.find(item => item.id === r.data.training.id)).lecturers)
                setListLecturersObject(r.data.lecturerObjects)
                setListStudentsObject(r.data.studentObjects)
                let arr = convertArr(r.data.students, listResult)
                setListResult({...listResult, rows: arr, total: r.data.students.length});
            }).catch(e => {
            })
            setIdUpdate(location.get('id'));
        }

    },[allTraining])
    useEffect(() => {
        if(trainingId){
            getAllLecturerApi().then(r => {
                setAllLecturersDefine(((allTraining.find(item => item.id === trainingId)).lecturers).map(sub => {
                    return r.data.find(individual => individual.id === sub.id);
                }))
            })
        }

    },[trainingId])
    useEffect(() => {
        const listLecturerObjectIds = listLecturersObject.map(item => item.id); //ids đối tượng gv
        setAllLecturers(allLecturersDefine.filter(item => listLecturerObjectIds.includes(item.lecturerObject.id))) //set all giảng viên
    },[listLecturersObject])
    useEffect(() => {
        getCategoryApi({
            paging: false,
            type: "OrganizationLocation"
        }).then(r => {
            if (r.data.responses != null) setOrganizationLocation(r.data.responses)
        })
    }, [])
//=====================================================================================================
    function onSubmitFunction(values) {
        let data = {
            blockOrganizationIds: listBlockOrganization.map(item => item.id) ?? '',
            unitOrganizationIds: listUnitOrganization.map(item => item.id) ?? '',
            name: values.name ?? '',
            code: values.code ?? '',
            trainingId: values.trainingId ?? '',
            lecturerIds: listLecturers.map(item => item.id) ?? '',
            organizationLocationId: values.organizationLocationId ?? '',
            lecturerObjectIds: listLecturersObject.map(item => item.id) ?? '',
            studentObjectIds: listStudentsObject.map(item => item.id) ?? '',
            studentIds: listResult.rows.map(item => item.id) ?? '',
            startDate: values.startDate ?? '',
            endDate: values.endDate ?? '',
            notes: values.notes ?? '',
        }
        if (!isUpdate) {
            createTrainingClassApi(data).then(r => {
                toast.success('Thêm lớp đào tạo thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/training-class';
                }, 1100);
            }).catch(e => {
                toast.error('Thêm lớp đào tạo không thành công', Utils.options);
            })
        } else {
            if (isUpdate && location.get('id')) {
                updateTrainingClassApi(data, location.get('id')).then(r => {
                    toast.success('Cập nhật lớp đào tạo thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/training-class';
                    }, 1100);
                }).catch(e => {
                    toast.error('Cập nhật lớp đào tạo không thành công', Utils.options);
                })
            }
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleCloseModalEdit = () => {
        setOpenModalEdit(false)
    }
    const handleUpdateListStudent = (data) => {
        console.log(data)
        setListResult({...listResult, rows: data, total: data.length});
        //setListStudents(data);
    }
    const handleClickNotification = (event) => {
        setAnchorElSettingTable(event.currentTarget);
    };
    const handleCloseNotification = () => {
        setAnchorElSettingTable(null);
    };
    const deleteStudentBtn = (e) => {
        setOpenModalDel(true)
        setStudentIdDelete(e)
    }
    const submitDelete = () => {
        setListResult({...listResult, rows: listResult.rows.filter(item => item.id !== studentIdDelete), total: (listResult.rows.length -1)})
    }
//=====================================================================================================
    const back = () => {
        navigate('/training-class')
    }
//=====================================================================================================
    const createTrainingClassApi = (data) => {
        return apiTrainingClass.createTrainingClass(data);
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
    const updateTrainingClassApi = (data, idUpdate) => {
        return apiTrainingClass.updateTrainingClass(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiTrainingClass.getDetailTrainingClass(idUpdate);
    }
    const getAllLecturerApi = () => {
        return apiLecturer.getAllLecturer();
    }
    const getAllTrainingApi = () => {
        return apiTraining.getAllTraining();
    }
    const getConfigTableApi = (tableName) => {
        return apiTableConfig.get(tableName)
    }
//=====================================================================================================
    return (
        <div className={'main-content'}>
            <ModalListStudent
                listOrganizations={[...listBlockOrganization, ...listUnitOrganization, {"id": 0, "name": "TOÀN HỆ THỐNG"}]}
                listStudentsParent={listResult.rows}
                handleUpdateListStudent={handleUpdateListStudent}
                openModalEdit={openModalEdit}
                studentObjects={listStudentsObject}
                listUnitOrganizations={listUnitOrganization}
                handleCloseModalEdit={handleCloseModalEdit}>
            </ModalListStudent>
            <ModalConfirmDel
                openModalDel={openModalDel}
                handleCloseModalDel={handleCloseModalDel}
                submitDelete={submitDelete}>
            </ModalConfirmDel>
            <div className={'main-content-body'}>
                <Formik
                    // validationSchema={validationtraining-class}
                    enableReinitialize
                    initialValues={{
                        blockOrganizations: idUpdate ? info.blockOrganizations : '',
                        unitOrganizations: idUpdate ? info.unitOrganizations : '',
                        name: idUpdate ? info.name : '',
                        code: idUpdate ? info.code : '',
                        trainingId: idUpdate ? info.training.id : '',
                        lecturers: idUpdate ? info.lecturers : '',
                        organizationLocationId: idUpdate ? info.organizationLocation.id : '',
                        lecturerObjects: idUpdate ? info.lecturerObjects : '',
                        studentObjects: idUpdate ? info.studentObjects : '',
                        students: idUpdate ? info.students : '',
                        lecturerExpense: idUpdate ? info.lecturerExpense : '',
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
                                <div className={'flexGroup2'}>
                                    <Button className={'button-back'} onClick={back} style={{marginBottom: '10px'}}
                                            variant="text"
                                            startIcon={<KeyboardBackspaceIcon/>}>
                                        Quay lại
                                    </Button>
                                    <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                        <Button className={'cancel-button button-header'} style={{marginRight: '10px'}}
                                                onClick={back}
                                                variant="outlined"><HighlightOffIcon></HighlightOffIcon>Hủy</Button>
                                        <Button className={'button-header'} variant="contained" type='submit'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                 viewBox="0 0 30 30" fill="none">
                                                <path
                                                    d="M21.25 3.75H6.25C4.8625 3.75 3.75 4.875 3.75 6.25V23.75C3.75 25.125 4.8625 26.25 6.25 26.25H23.75C25.125 26.25 26.25 25.125 26.25 23.75V8.75L21.25 3.75ZM23.75 23.75H6.25V6.25H20.2125L23.75 9.7875V23.75ZM15 15C12.925 15 11.25 16.675 11.25 18.75C11.25 20.825 12.925 22.5 15 22.5C17.075 22.5 18.75 20.825 18.75 18.75C18.75 16.675 17.075 15 15 15ZM7.5 7.5H18.75V12.5H7.5V7.5Z"
                                                    fill="#1F2251"/>
                                            </svg>
                                            Lưu</Button>
                                    </div>
                                </div>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <div className={'label-group-input'}>
                                        <div>Thông tin chung</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Tên lớp đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Tên lớp đào tạo'}
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mã lớp đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='code'
                                                name='code'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Mã lớp đào tạo'}
                                                value={values.code}
                                                onChange={handleChange}
                                                error={touched.code && Boolean(errors.code)}
                                                helperText={touched.code && errors.code}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Khóa đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='trainingId'
                                                    name='trainingId'
                                                    value={values.trainingId}
                                                    onChange={(event) => {
                                                        setFieldValue('trainingId', event.target.value);
                                                        //setListBlockOrganization(training.find(entry => entry.id === event.target.value).blockOrganizations);
                                                        const item = allTraining.find(entry => entry.id === event.target.value);
                                                        if (item) {
                                                            setListOrganization([
                                                                ...item.blockOrganizations,
                                                                ...item.unitOrganizations
                                                            ]);
                                                            setAllStudentsObject(item.studentObjects)
                                                            setAllLecturersObject(item.lecturerObjects)
                                                            setTrainingId(event.target.value)
                                                            setListLecturersObject([])
                                                            setListStudentsObject([])
                                                            setListLecturers([])
                                                        }

                                                        //setListOrganization([...item.blockOrganizations, ...item.unitOrganizations])
                                                    }}
                                                    size={"small"}>
                                                    {allTraining.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.trainingId}</FormHelperText>
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
                                            <div className={'label-input'}>Khối<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    size={"small"}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    className={'multi-select-search'}
                                                    options={listOrganization.filter(item => item.parentId === 0 || item.parentId === null)}
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
                                                        setListBlockOrganization(deleteAllIdSame(values, 'id'))
                                                        setListUnitOrganization([])
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
                                                        setListUnitOrganization(deleteAllIdSame(values, 'id'))
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
                                                        setListLecturersObject(deleteAllIdSame(values, 'id'))
                                                        setListLecturers([])
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
                                                        setListStudentsObject(deleteAllIdSame(values, 'id'))
                                                    }}
                                                    renderInput={(params) => <TextField
                                                        className={'multi-select-search-text'} {...params} />}
                                                />
                                            </FormControl>
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
                                                        setListLecturers(deleteAllIdSame(values, 'id'))
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
                                    <div className={'flexGroup2 mt10'}>
                                        <div className={'label-group-input'}>
                                            <div>Danh sách học viên</div>
                                        </div>
                                        <div className={'flexGroup2'}>
                                            <Tooltip className={'icon-config-table'} title={"Cài đặt hiển thị"}>
                                                <SettingsIcon onClick={handleClickNotification}/>
                                            </Tooltip>
                                            <Menu
                                                id="icon-notification"
                                                anchorEl={anchorElSettingTable}
                                                open={openSettingTable}
                                                onClose={handleCloseNotification}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}>
                                                <SettingColumnTable columns={columns}
                                                                    nameTable={getNameToId(tableName,6)}
                                                                    isRefreshConfigTable={isRefreshConfigTable}
                                                                    setIsRefreshConfigTable={setIsRefreshConfigTable}
                                                >
                                                </SettingColumnTable>
                                            </Menu>
                                            <Button onClick={() => {
                                                setOpenModalEdit(true)
                                            }} className={`${(listUnitOrganization.length === 0 || listStudentsObject.length === 0) ? 'button-disabled' : ''} button-header ml15`} variant="contained" type='button'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                     viewBox="0 0 30 30" fill="none">
                                                    <path
                                                        d="M21.25 3.75H6.25C4.8625 3.75 3.75 4.875 3.75 6.25V23.75C3.75 25.125 4.8625 26.25 6.25 26.25H23.75C25.125 26.25 26.25 25.125 26.25 23.75V8.75L21.25 3.75ZM23.75 23.75H6.25V6.25H20.2125L23.75 9.7875V23.75ZM15 15C12.925 15 11.25 16.675 11.25 18.75C11.25 20.825 12.925 22.5 15 22.5C17.075 22.5 18.75 20.825 18.75 18.75C18.75 16.675 17.075 15 15 15ZM7.5 7.5H18.75V12.5H7.5V7.5Z"
                                                        fill="#1F2251"/>
                                                </svg>
                                                Thêm học viên</Button>
                                        </div>

                                    </div>
                                    <div className={'main-content-body-result mt10'}>
                                        <TableContainer className={'table-est'} sx={{maxHeight: 440}}>
                                            {loading
                                                ? <div className={'message-table-empty-loading'}>
                                                    <CircularProgress size={30}
                                                                      style={{color: '#1f2251'}}></CircularProgress>
                                                    <div className={'message-table-empty-sof'}>Đang tải dữ liệu
                                                    </div>
                                                </div>
                                                : listResult.rows.length > 0
                                                    ? <Table stickyHeader className={"table-custom"}>
                                                        <TableHead className={'super-app-theme--header'}>
                                                            <TableRow>
                                                                <TableCell style={{minWidth: 70}}
                                                                           align="center">STT</TableCell>
                                                                {columns.map((column, columnIndex) => {
                                                                    if (column.visible) {
                                                                        return <TableCell style={{minWidth: 200}}>{column.name}</TableCell>
                                                                    }
                                                                })}
                                                                <TableCell style={{minWidth: 120}}
                                                                           align="center">Chi phí</TableCell>
                                                                <TableCell className={'action-header'} align="center"></TableCell>

                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody className={'super-app-theme--body'}>
                                                            {loading
                                                                ? <div className={'message-table-empty-loading'}>
                                                                    <CircularProgress size={30}></CircularProgress>
                                                                    <div className={'message-table-empty-sof'}>Không
                                                                        có dữ liệu
                                                                    </div>
                                                                </div>
                                                                : ''
                                                            }
                                                            {listResult.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                                                                <>
                                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                                        <TableCell rowSpan={1}
                                                                                   align="center">{(item.stt)}</TableCell>
                                                                        {columns.map((column, columnIndex) => {
                                                                            if (column.visible) {
                                                                                if (column.code === 'lecturers' || column.code === 'lecturerObjects' || column.code === 'studentObjects') {
                                                                                    return (
                                                                                        <TableCell key={columnIndex} rowSpan={1}>
                                                                                            {item[column.code].map((cc, index) => (
                                                                                                <p key={index}>{cc.name}</p>
                                                                                            ))}
                                                                                        </TableCell>
                                                                                    );
                                                                                } else if (column.code === 'blockOrganization' ||
                                                                                    column.code === 'unitOrganization' ||
                                                                                    column.code === 'trainingType' ||
                                                                                    column.code === 'plan' ||
                                                                                    column.code === 'formTraining' ||
                                                                                    column.code === 'organizationLocation') {
                                                                                    return (
                                                                                        <TableCell key={columnIndex} rowSpan={1}>
                                                                                            {item[column.code].name}
                                                                                        </TableCell>
                                                                                    );
                                                                                }else if (column.code === 'expensePerLecturer' ||
                                                                                    column.code === 'expenseAllLecturer' ||
                                                                                    column.code === 'logisticsExpense' ||
                                                                                    column.code === 'lunchExpense' ||
                                                                                    column.code === 'totalExpense') {
                                                                                    return (
                                                                                        <TableCell key={columnIndex} rowSpan={1}>
                                                                                            {formatVND(item[column.code])}
                                                                                        </TableCell>
                                                                                    );
                                                                                } else if (column.code === 'startDate' || column.code === 'endDate' || column.code === 'dateOfBirth') {
                                                                                    return (
                                                                                        <TableCell key={columnIndex} rowSpan={1}>
                                                                                            {getDateTimeFromTimestamp(item[column.code])}
                                                                                        </TableCell>
                                                                                    );
                                                                                } else if (column.code === 'planTime') {
                                                                                    return (
                                                                                        <TableCell rowSpan={1}>{new Date(item[column.code]).getFullYear()}</TableCell>
                                                                                    );
                                                                                }else {
                                                                                    return (
                                                                                        <TableCell key={columnIndex} rowSpan={1}>
                                                                                            {item[column.code]}
                                                                                        </TableCell>
                                                                                    );
                                                                                }
                                                                            }
                                                                            return "";
                                                                        })}
                                                                        <TableCell rowSpan={1}
                                                                                   align="center">{formatVND(totalExpense/parseInt(listResult.rows.length))}</TableCell>
                                                                        <TableCell className={'action-header filter-table'} rowSpan={1} align="center">
                                                                            <div className='icon-action'>
                                                                                <Tooltip className={'deleteButton'} title="Xóa"
                                                                                         onClick={() => deleteStudentBtn(item.id)}>
                                                                                    <div><DeleteIcon/></div>
                                                                                </Tooltip>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                    : <div className={'message-table-empty-group'}>
                                                        <div
                                                            className={`message-table-empty ${listResult.rows.length === 0 ? '' : 'hidden'}`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 className="svg-icon"
                                                                 width="100"
                                                                 height="100"
                                                                 viewBox="0 0 1567 1024" version="1.1">
                                                                <path
                                                                    d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z"
                                                                    fill="#8A96A3"/>
                                                            </svg>
                                                            <p>Không có dữ liệu</p>
                                                        </div>
                                                    </div>
                                            }
                                        </TableContainer>
                                        {
                                            listResult.rows.length > 0
                                                ? <TablePagination
                                                    labelRowsPerPage={"Số hàng mỗi trang:"}
                                                    rowsPerPageOptions={[10, 25, 100]}
                                                    component="div"
                                                    count={listResult.rows.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                                : ''
                                        }
                                    </div>
                                </Box>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}
