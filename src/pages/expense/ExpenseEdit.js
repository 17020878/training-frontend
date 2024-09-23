import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl, FormHelperText,
    Grid, Icon,
    InputAdornment,
    MenuItem,
    Select,
    TextField, Typography
} from "@mui/material";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import apiRole from "../../api/role";
import apiUser from "../../api/user";
import {toast, ToastContainer} from "react-toastify";
import apiCategory from "../../api/category";
import {buildInputTree, buildTreeAsset, getTitleFromCodeCategory, sortTreeData} from "../../constants/utils";
import {TreeSelect} from "primereact/treeselect";
import apiGroupExpense from "../../api/group-expense";
import apiOrganization from "../../api/organization";
import {NumericFormat} from "react-number-format";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiExpense from "../../api/expense";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import apiAdvance from "../../api/advance";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import {convertCustomToAutoComplete, convertToAutoComplete} from "../../constants/common";
import {ItemExpenseDetail} from "./ItemExpenseDetail";
import Axios from "axios";
import API_MAP from "../../constants/api";
import FileDownload from "js-file-download";
import apiLineItem from "../../api/line-item";
export default function ExpenseEdit(props) {
    const navigate = useNavigate();
    const [isExport,setIsExport] = useState(false);
    const [selectedNodeKeysLineItem, setSelectedNodeKeysLineItem] = useState(null);
    const [expandedKeysLineItem, setExpandedKeysLineItem] = useState({0: true});

    const [selectedNodeKeysGroupExpense, setSelectedNodeKeysGroupExpense] = useState(0);
    const [expandedKeysGroupExpense, setExpandedKeysGroupExpense] = useState({0: true});
    const [selectedNodeKeysOrganization, setSelectedNodeKeysOrganization] = useState(0);
    const [expandedKeysOrganization, setExpandedKeysOrganization] = useState({0: true});
    const [location, setLocation] = useSearchParams();
    const [submitValue, setSubmitValue] = useState('');
    const [listRole, setListRole] = useState([])
    const [listGroupExpense, setListGroupExpense] = useState([])
    const [listLineItem, setListLineItem] = useState([])
    const [listUnitSpend, setListUnitSpend] = useState([])
    const [listPaymentType, setListPaymentType] = useState([])
    const [listPlan, setListPlan] = useState([])
    const [listPurpose, setListPurpose] = useState([])
    const [listOccurrence, setListOccurrence] = useState([])
    const [listUnitPay, setListUnitPay] = useState([])
    const [listClue, setListClue] = useState([])
    const [listGroupExpenseTree, setListGroupExpenseTree] = useState([])
    const [listLineItemTree, setListLineItemTree] = useState([])
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [listFileLocal, setListFileLocal] = useState([])
    const [listLink, setListLink] = useState([])
    const [listLinkServer, setListLinkServer] = useState([])
    const [listDeleteLinkServer, setListDeleteLinkServer] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [listAdvance,setListAdvance] = useState([])
    const [listExpenseDetail,setListExpenseDetail] = useState([
        {
            name:"",
            amount:0,
            description:""
        }
    ])
    const [info, setInfo] = useState({
        id: 0,
        name: "",
        description: "",
        date: new dayjs(),
        groupExpense: {
            id: 0,
            name: "",
        },
        unitSpend: {
            id: 0,
            name: "",
        },
        plan: {
            id: 1248,
            name: "",
        },
        purpose: {
            id: 731,
            name: ""
        },
        occurrence: {
            id: 725,
            name: ""
        },
        unitPay: {
            id: "",
            name: "",
        },
        paymentType: {
            id: "",
            name: "",
        },
        advance:{
            id:"",
            name:""
        },
        clue: {
            id: "",
            name: "",
        },
        payDate: new dayjs(),
        bill: "",
        urlFile: "",
        expense: 0,
        amount: 0,
        code:"",
        expenseItem:""
    },)
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        amount: yup
            .string()
            .trim()
            .required('Không được để trống'),
        planId: yup
            .string()
            .trim()
            .required('Không được để trống'),
        purposeId: yup
            .string()
            .trim()
            .required('Không được để trống'),
        occurrenceId: yup
            .string()
            .trim()
            .required('Không được để trống'),
        unitPayId: yup
            .string()
            .trim()
            .required('Không được để trống'),
    });

    const backList = () => {
        navigate('/expense')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                getListExpense({
                    id: Number(location.get('id')),
                    paging: false,
                }).then(r => {
                    setInfo(r.data)
                    if(r.data.expenseDetails!=null){
                        if(r.data.expenseDetails.length>0)
                        setListExpenseDetail(r.data.expenseDetails)
                    }
                    setSelectedNodeKeysGroupExpense(r.data.groupExpense.id)
                    setSelectedNodeKeysOrganization(r.data.unitSpend.id)
                    setSelectedNodeKeysLineItem(r.data.lineItem.id)
                    setListFileServer(r.data.documents)
                })
            } else navigate('/expense')
        }

    }, [location]);

    useEffect(() => {
        getCategoryApi({
            paging: false,
            type: "Clue"
        }).then(r => {
            setListClue(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,clue:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "Occurrence"
        }).then(r => {
            setListOccurrence(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,occurrence:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "PaymentType"
        }).then(r => {
            setListPaymentType(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,paymentType:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "Plan"
        }).then(r => {
            setListPlan(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,plan:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "Purpose"
        }).then(r => {
            setListPurpose(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,purpose:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "UnitPay"
        }).then(r => {
            setListUnitPay(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,unitPay:{id:r.data.responses[0].id}})
            // }
        })
        getListAdvance().then(r=>{
            let result = [];
            for (let i = 0;i<r.data.length;i++){
                if(r.data[i].isActive==true){
                    let item = r.data[i];
                    item.name = moment(r.data[i].date).format('DD-MM-YYYY')+": "+r.data[i].name
                    result.push(r.data[i])
                }
            }
            setListAdvance(convertToAutoComplete(result,'name'))
        })
        getGroupExpense().then(r => {
            setListGroupExpense(r.data)
            let convert = buildTreeAsset(r.data)
            setListGroupExpenseTree(convert)
            if (!isUpdate) {
                let inputTree = buildInputTree(buildInputTree(r.data))
                for (let i = 0; i < inputTree.length; i++) {
                    if (inputTree[i].parentId == null) {
                        setSelectedNodeKeysGroupExpense(inputTree[i].id)
                        setExpandedKeysGroupExpense(
                            {
                                [inputTree[i].id]: true
                            }
                        )
                    }
                }
            }
        })
        getLineItem().then(r => {
            let result = r.data;
            console.log("result1",result)
            for (let i =0;i<result.length;i++){
                result[i].name=result[i].code+": "+result[i].name
            }
            console.log("result2",result)

            setListLineItem(result)
            let convert = buildTreeAsset(result)
            setListLineItemTree(convert)
            if (!isUpdate) {
                let inputTree = buildInputTree(buildInputTree(result))
                for (let i = 0; i < inputTree.length; i++) {
                    if (inputTree[i].parentId == null) {
                        // setSelectedNodeKeysLineItem(inputTree[i].id)
                        setExpandedKeysLineItem(
                            {
                                [inputTree[i].id]: true
                            }
                        )
                    }
                }
            }
        })
        getOrganization().then(r => {
            let convert = buildTreeAsset(buildInputTree(r.data))
            setListOrganizationTree(convert)

            if (!isUpdate) {
                let inputTree = buildInputTree(buildInputTree(r.data))
                for (let i = 0; i < inputTree.length; i++) {
                    if (inputTree[i].parentId == null) {
                        setSelectedNodeKeysOrganization(inputTree[i].id)
                        setExpandedKeysOrganization(
                            {
                                [inputTree[i].id]: true
                            }
                        )
                    }
                }
            }
        })
    }, [])
    const uploadFile = () => {
        var el = window._protected_reference = document.createElement("INPUT");
        el.type = "file";
        // el.accept = "image/*,.txt";
        el.multiple = "multiple";
        el.addEventListener('change', function (ev2) {
            let result = [];
            let resultFiles = [];
            if (el.files.length) {
                for (let i = 0; i < el.files.length; i++) {
                    if (!checkFileLocaleAlready(el.files[i].name)) {
                        resultFiles.push(el.files[i])
                    }
                }
            }
            new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();

                }, 1000);

                let copyState = [...listFileLocal];
                // copyState.concat(resultFiles)
                copyState.push.apply(copyState, resultFiles);

                setListFileLocal(copyState)
            })
                .then(function () {
                    // clear / free reference
                    el = window._protected_reference = undefined;
                });
        });

        el.click();
    }
    const checkFileLocaleAlready = (name) => {
        let index = listFileLocal.findIndex(e => e.name === name)
        let index2 = listFileServer.findIndex(e => e.file_name === name)
        if (index2 !== -1) {
            return true
        }
        if (index !== -1) {
            return true
        }
        return false;
    }
    const submitForm = (value) => {
        value.groupExpenseId = selectedNodeKeysGroupExpense;
        value.unitSpendId = selectedNodeKeysOrganization;
        console.log(value)
        let formData = new FormData();
        for (let i = 0; i < listFileLocal.length; i++) {
            formData.append('files', listFileLocal[i])
        }
        if(selectedNodeKeysLineItem!=null){
            formData.append('lineItemId', selectedNodeKeysLineItem)
        }
        formData.append("groupExpenseId", selectedNodeKeysGroupExpense)
        formData.append("unitSpendId", selectedNodeKeysOrganization)
        formData.append("name", value.name);
        formData.append("code", value.code);
        formData.append("expenseItem", value.expenseItem);
        formData.append("description", value.description);
        if(value.clueId!=null)
        formData.append("clueId", value.clueId);
        formData.append("occurrenceId", value.occurrenceId);
        if(value.paymentTypeId!=null)
        formData.append("paymentTypeId", value.paymentTypeId);

        formData.append("planId", value.planId);
        formData.append("purposeId", value.purposeId);
        formData.append("unitPayId", value.unitPayId);
        formData.append("amount", value.amount);
        formData.append("bill", value.bill);
        formData.append("date", value.date);
        formData.append("payDate", value.payDate);
        if(value.advanceId!=null&&value.advanceId!='')
            formData.append("advanceId", value.advanceId);
        for (let i = 0; i < listDeletedAttachment.length; i++) {
            formData.append('listDeletedAttachment', listDeletedAttachment[i])
        }
        listExpenseDetail.forEach((item, index) => {
            if(item.name.trim()!=''){
                formData.append(`expenseDetails[${index}].description`, item.description);
                formData.append(`expenseDetails[${index}].name`, item.name);
                formData.append(`expenseDetails[${index}].amount`, item.amount);
            }
        })
        if (isUpdate) {
            formData.append("id", location.get('id'));
            updateExpenseApi(formData).then((r) => {
                toast.success("Cập nhật thành công");
                if (isExport){
                    exportExcelPay(location.get('id'))
                }
                back()
            }).then(e => {
                console.log(e)
            })
        } else {
            createExpenseApi(formData).then((r) => {
                toast.success("Thêm mới thành công");
                if (isExport){
                    exportExcelPay(r.data.id)
                }
                back()
            }).then(e => {
                console.log(e)
            })
        }

    }
    const deleteFileLocal = (name) => {
        let arr = [...listFileLocal]
        let indexRemove = listFileLocal.findIndex(e => e.name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileLocal(arr)
        }

    }
    const deleteFileServer = (id, name) => {
        let arr = [...listFileServer]
        let indexRemove = listFileServer.findIndex(e => e.name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileServer(arr)
        }
        let copyListDeleteServer = [...listDeletedAttachment]
        copyListDeleteServer.push(id)
        setListDeletedAttachment(copyListDeleteServer)
    }
    const updateListExpenseDetail = (item,index) => {
        console.log(item)
        console.log(index)

        if(item ==null){
            setListExpenseDetail([...listExpenseDetail.slice(0,index),...listExpenseDetail.slice(index+1)])
        }
        else
        setListExpenseDetail([...listExpenseDetail.slice(0,index),item,...listExpenseDetail.slice(index+1)])
    }
    const saveAndExportExcel = ()=>{

    }

    const back = () => {
        navigate('/expense')
    }
    const getOrganization = () => {
        return apiOrganization.getOrganizationByUser()
    }
    const getGroupExpense = () => {
        return apiGroupExpense.getGroupExpense()
    }
    const getLineItem= () => {
        return apiLineItem.getLineItem()
    }
    const getListExpense = (body) => {
        return apiExpense.getExpenseById(body)
    }
    const createExpenseApi = (body) => {
        return apiExpense.createExpense(body)
    }
    const updateExpenseApi = (body) => {
        return apiExpense.updateExpense(body)
    }
    const updateUserApi = (body) => {
        return apiUser.updateUser(body)
    }
    const getUserApi = (body) => {
        return apiUser.getListUser(body);
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
    const getListAdvance = () => {
      return apiAdvance.getAdvanceAll()
    }
    const filterOptions = {
        showClear:true,
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
    };
    const exportExcelPay = (id) => {
        console.log("tutt")
        // setLoadingExport(true)
        Axios.post(API_MAP.EXPORT_EXCEL_PAY, {
            id: id,
        }, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`},
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);

        }).catch(e => {
        })
    }
    useEffect(()=>{
        if(isExport){

        }
    },[isExport])
    return (
        <div className={'main-content'}>

            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>{isUpdate ? 'Cập nhật' : 'Thêm mới'} </h4>
                </div>
                <Divider light/>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: info.name,
                        code: info.code||'',
                        expenseItem: info.expenseItem||'',
                        description: info.description,
                        clueId: info.clue!=null?info.clue.id:null,
                        occurrenceId: info.occurrence.id,
                        paymentTypeId: info.paymentType!=null?info.paymentType.id:null,
                        advanceId: info.advance!=null?info.advance.id:"",
                        advanceName: info.advance!=null?info.advance.name:"",
                        planId: info.plan.id,
                        purposeId: info.purpose.id,
                        unitPayId: info.unitPay.id,
                        amount: info.amount,
                        bill: info.bill,
                        date: isUpdate ? dayjs(info.date) : info.date,
                        payDate: isUpdate ? dayjs(info.payDate) : info.payDate,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            console.log("Values: ", values)
                            submitForm(values)
                        }
                    }
                >
                    {props => {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            setFieldValue,
                            handleSubmit
                        } = props;
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <div className={'label-group-input'}>
                                        <div>Thông tin chung </div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Tên chi phí
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Nhóm chi phí
                                                <span className={'error-message'}>*</span></div>
                                            <TreeSelect
                                                {...filterOptions} filterMode="strict"
                                                // filterMode="strict"
                                                value={selectedNodeKeysGroupExpense}
                                                onChange={(e) => {
                                                    setSelectedNodeKeysGroupExpense(e.value)
                                                }}
                                                options={sortTreeData(listGroupExpenseTree)}
                                                expandedKeys={expandedKeysGroupExpense}
                                                onToggle={(e) => setExpandedKeysGroupExpense(e.value)}
                                                style={{width: '100%', zIndex: '1000000 !important', overflow: 'auto'}}
                                                className="md:w-20rem w-full"
                                                placeholder="Nhóm chi phí"></TreeSelect>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Ngày đề nghị
                                                <span className={'error-message'}>*</span></div>
                                            <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'new-date-apply'}
                                                    style={{width: '100% !important', height: '30px'}}
                                                    inputFormat="DD-MM-YYYY"
                                                    value={values.date}
                                                    onChange={value => props.setFieldValue("date", value)}
                                                    error={touched.date && Boolean(errors.date)}
                                                    helperText={touched.date && errors.date}
                                                    renderInput={(params) => <TextField size={"small"}
                                                                                        fullWidth {...params} />}
                                                />
                                            </LocalizationProvider>

                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Đơn vị đề nghị
                                                <span className={'error-message'}>*</span></div>
                                            <TreeSelect
                                                {...filterOptions} filterMode="strict"
                                                // filterMode="strict"
                                                value={selectedNodeKeysOrganization}
                                                onChange={(e) => {
                                                    setSelectedNodeKeysOrganization(e.value)
                                                }}
                                                options={sortTreeData(listOrganizationTree)}
                                                expandedKeys={expandedKeysOrganization}
                                                onToggle={(e) => setExpandedKeysOrganization(e.value)}
                                                style={{width: '100%', zIndex: '1000000 !important', overflow: 'auto'}}
                                                className="md:w-20rem w-full"
                                                placeholder="Đơn vị chi"></TreeSelect>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>{getTitleFromCodeCategory("UnitPay")}<span
                                                className={'error-message'}>*</span>
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='unitPayId'
                                                    name='unitPayId'
                                                    value={values.unitPayId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            setFieldValue('unitPayId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    {
                                                        listUnitPay.map((item) => (
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText style={{marginLeft: '15px'}}
                                                                className={'error-message'}>{touched.unitPayId && Boolean(errors.unitPayId) ? "Không được để trống" : ""}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Số tiền</div>
                                            <NumericFormat
                                                id='amount'
                                                name='amount'
                                                className={'formik-input text-right'}
                                                size={"small"}
                                                value={values.amount}
                                                customInput={TextField}
                                                error={touched.amount && Boolean(errors.amount)}
                                                helperText={touched.amount && errors.amount}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                }}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue)) {
                                                        setFieldValue('amount', floatValue)
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid  item xs={6} md={12}>
                                            <Divider/>
                                        </Grid>
                                    </Grid>
                                    <div className={'label-group-input'}>
                                        <div>Hỗ trợ thống kê</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>{getTitleFromCodeCategory("Purpose")}<span
                                                className={'error-message'}>*</span>
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='purposeId'
                                                    name='purposeId'
                                                    value={values.purposeId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            setFieldValue('purposeId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    {
                                                        listPurpose.map((item) => (
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText style={{marginLeft: '15px'}}
                                                                className={'error-message'}>{touched.purposeId && Boolean(errors.purposeId) ? "Không được để trống" : ""}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>{getTitleFromCodeCategory("Occurrence")}<span
                                                className={'error-message'}>*</span>
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='occurrenceId'
                                                    name='occurrenceId'
                                                    value={values.occurrenceId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            setFieldValue('occurrenceId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    {
                                                        listOccurrence.map((item) => (
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText style={{marginLeft: '15px'}}
                                                                className={'error-message'}>{touched.occurrenceId && Boolean(errors.occurrenceId) ? "Không được để trống" : ""}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>{getTitleFromCodeCategory("Plan")}<span
                                                className={'error-message'}>*</span>
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='planId'
                                                    name='planId'
                                                    value={values.planId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            setFieldValue('planId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    {
                                                        listPlan.map((item) => (
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText style={{marginLeft: '15px'}}
                                                                className={'error-message'}>{touched.planId && Boolean(errors.planId) ? "Không được để trống" : ""}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid  item xs={6} md={12}>
                                            <Divider/>
                                        </Grid>
                                    </Grid>
                                    <div className={'label-group-input'}>
                                        <div>Lưu trữ và tham chiếu</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Số hóa đơn
                                            </div>
                                            <TextField
                                                size={"small"}
                                                id='bill'
                                                name='bill'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.bill}
                                                onChange={handleChange}
                                                error={touched.bill && Boolean(errors.bill)}
                                                helperText={touched.bill && errors.bill}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Khoản mục
                                               </div>
                                            <div className={'custom-tree-select'}>
                                                <TreeSelect
                                                    {...filterOptions} filterMode="strict"
                                                    // filterMode="strict"
                                                    value={selectedNodeKeysLineItem}
                                                    onChange={(e) => {
                                                        setSelectedNodeKeysLineItem(e.value)
                                                    }}
                                                    options={sortTreeData(listLineItemTree)}
                                                    expandedKeys={expandedKeysLineItem}
                                                    onToggle={(e) => setExpandedKeysLineItem(e.value)}
                                                    style={{width: '100%', zIndex: '1000000 !important', overflow: 'auto'}}
                                                    className="md:w-20rem w-full"
                                                    placeholder="Khoản mục"
                                                    showClear
                                                    filterInputProps={{ allowSpaces: true }}
                                                ></TreeSelect>
                                                {
                                                    selectedNodeKeysLineItem!=null?
                                                        <div onClick={()=>{
                                                        setSelectedNodeKeysLineItem(null)}
                                                        } className={'clear-tree-select'}>

                                                            <CloseIcon style={{color:"#6c757d"}}/>
                                                        </div>:''
                                                }

                                            </div>

                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div
                                                className={'label-input'}>{getTitleFromCodeCategory("PaymentType")}
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='paymentTypeId'
                                                    name='paymentTypeId'
                                                    value={values.paymentTypeId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            if( event.target.value==-1){
                                                                setFieldValue('paymentTypeId', null);
                                                            }else
                                                            setFieldValue('paymentTypeId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                                                    {
                                                        listPaymentType.map((item) => (
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText style={{marginLeft: '15px'}}
                                                                className={'error-message'}>{touched.paymentTypeId && Boolean(errors.paymentTypeId) ? "Không được để trống" : ""}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div
                                                className={'label-input'}>Tạm ứng
                                            </div>
                                            {/*<FormControl fullWidth>*/}
                                            {/*    <Select*/}
                                            {/*        id='advanceId'*/}
                                            {/*        name='advanceId'*/}
                                            {/*        value={values.advanceId}*/}
                                            {/*        onChange={(event) => {*/}
                                            {/*            if (event.target.value) {*/}
                                            {/*                if( event.target.value==-1){*/}
                                            {/*                    setFieldValue('advanceId', null);*/}
                                            {/*                }else*/}
                                            {/*                setFieldValue('advanceId', event.target.value);*/}
                                            {/*            }*/}
                                            {/*        }}*/}
                                            {/*        size={"small"}>*/}
                                            {/*        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>*/}
                                            {/*        {*/}
                                            {/*            listAdvance.map((item) => (*/}
                                            {/*                <MenuItem value={item.id}>{item.name}</MenuItem>*/}
                                            {/*            ))*/}
                                            {/*        }*/}

                                            {/*    </Select>*/}

                                            {/*</FormControl>*/}

                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={listAdvance}
                                                value={{
                                                    id: values.advanceId,
                                                    label: values.advanceName
                                                }
                                                }

                                                renderInput={(params) => < TextField  {...params}
                                                                                      id='advanceId'
                                                                                      name='advanceId'
                                                                                      placeholder=""
                                                                                      error={touched.advanceId && Boolean(errors.advanceId)}
                                                                                      helperText={touched.advanceId && errors.advanceId}/>}
                                                size={"small"}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        setFieldValue('advanceId', newValue.id)
                                                        setFieldValue('advanceName', newValue.label)

                                                    } else {
                                                        setFieldValue('advanceId', '')
                                                        setFieldValue('advanceName', '')

                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>{getTitleFromCodeCategory("Clue")}
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='clueId'
                                                    name='clueId'
                                                    value={values.clueId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            if( event.target.value==-1){
                                                                setFieldValue('clueId', null);
                                                            }else
                                                            setFieldValue('clueId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                                                    {
                                                        listClue.map((item) => (
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>

                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Ngày nhập liệu
                                                </div>
                                            <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    className={'new-date-apply'}
                                                    style={{width: '100% !important', height: '30px'}}
                                                    inputFormat="DD-MM-YYYY"
                                                    value={values.payDate}
                                                    onChange={value => props.setFieldValue("payDate", value)}
                                                    error={touched.payDate && Boolean(errors.payDate)}
                                                    helperText={touched.payDate && errors.payDate}
                                                    renderInput={(params) => <TextField size={"small"}
                                                                                        fullWidth {...params} />}
                                                />
                                            </LocalizationProvider>

                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Ghi chú</div>
                                            <TextField
                                                size={"small"}

                                                className={'formik-input'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                // multiline
                                                // rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}

                                            />
                                        </Grid>
                                        {/*<Grid item xs={6} md={3}>*/}
                                        {/*    <div className={'label-input'}>Mục chi tiêu</div>*/}
                                        {/*    <TextField*/}
                                        {/*        size={"small"}*/}
                                        
                                        {/*        className={'formik-input'}*/}
                                        {/*        // variant="standard"*/}
                                        {/*        id='expenseItem'*/}
                                        {/*        name='expenseItem'*/}
                                        {/*        // multiline*/}
                                        {/*        // rows={5}*/}
                                        {/*        value={values.expenseItem}*/}
                                        {/*        onChange={handleChange}*/}
                                        
                                        
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}
                                                 style={{display: "flex", alignItems: "center"}}>Tập đính
                                                kèm <ControlPointIcon style={{cursor: "pointer", marginLeft: '10px'}}
                                                                      color="primary"
                                                                      onClick={uploadFile}> </ControlPointIcon></div>
                                            <div className={'list-file'}>
                                                {
                                                    listFileLocal.map((e) => (
                                                        <>
                                                            <div className={'item-file'}>
                                                                <div className={'name-file '}>{e.name}</div>
                                                                <div className={'delete-file'}><DeleteOutlineIcon
                                                                    style={{cursor: "pointer"}}
                                                                    color={"error"}
                                                                    onClick={() => {
                                                                        deleteFileLocal(e.name)
                                                                    }}></DeleteOutlineIcon></div>
                                                            </div>
                                                            <Divider light/>
                                                        </>

                                                    ))
                                                }
                                                {
                                                    listFileServer.map((e) => (
                                                        <>
                                                            <div className={'item-file'}>
                                                                <div className={'name-file '}>{e.name}</div>
                                                                <div className={'delete-file'}><DeleteOutlineIcon
                                                                    style={{cursor: "pointer"}}
                                                                    color={"error"}
                                                                    onClick={() => {
                                                                        deleteFileServer(e.id, e.name)
                                                                    }}></DeleteOutlineIcon></div>
                                                            </div>
                                                            <Divider light/>
                                                        </>

                                                    ))
                                                }
                                            </div>

                                        </Grid>
                                        <Grid  item xs={6} md={12}>
                                            <Divider/>
                                        </Grid>

                                    </Grid>
                                    <div className={'label-group-input'}>
                                        <div>Chi tiết chi phí</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={6} md={12}>
                                            <div className={'wrapper-border'}>
                                                <div className={'wrapper-border-header'}>
                                                    <h4 > Các chi phí con</h4>
                                                    <Button
                                                        onClick={()=>{
                                                            let convert = [...listExpenseDetail]
                                                            convert.push(  {
                                                                name:"",
                                                                amount:0,
                                                                description:""
                                                            })
                                                            setListExpenseDetail(convert)
                                                        }}
                                                        // variant="outlined"
                                                            startIcon={<AddIcon/>}>
                                                        Thêm
                                                    </Button>
                                                </div>
                                                <div className={'wrapper-expense-detail'}>
                                                    <Grid container={true} spacing={1.5}>
                                                        {
                                                            listExpenseDetail.map((item,index)=>(
                                                                <ItemExpenseDetail updateListExpenseDetail={updateListExpenseDetail} item = {item} index={index}></ItemExpenseDetail>
                                                            ))
                                                        }


                                                    </Grid>
                                                </div>
                                            </div>

                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <div className={''} style={{display: "flex", justifyContent: "center",marginBottom:'10px'}}>
                                                <Button style={{marginRight: '10px'}} onClick={backList}
                                                        variant="outlined">Hủy</Button>
                                                <Button variant="contained"
                                                        style={{marginRight: '10px'}}

                                                        onClick={(e) => {
                                                            // Xử lý logic riêng cho nút thứ 2
                                                            setIsExport(true)
                                                            handleSubmit(e);
                                                        }}
                                                        type='submit'>Lưu và xuất excel</Button>
                                                <Button variant="contained"
                                                        onClick={(e) => {
                                                            // Xử lý logic riêng cho nút thứ 2
                                                            setIsExport(false)
                                                            handleSubmit(e);
                                                        }}
                                                        type='submit'>Lưu</Button>

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
