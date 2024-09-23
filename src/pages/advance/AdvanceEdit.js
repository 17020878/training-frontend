import React, {useEffect, useState} from "react";
import {
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

export default function AdvanceEdit(props) {
    const navigate = useNavigate();
    const [selectedNodeKeysGroupExpense, setSelectedNodeKeysGroupExpense] = useState(0);
    const [expandedKeysGroupExpense, setExpandedKeysGroupExpense] = useState({0: true});
    const [selectedNodeKeysOrganization, setSelectedNodeKeysOrganization] = useState(0);
    const [expandedKeysOrganization, setExpandedKeysOrganization] = useState({0: true});
    const [location, setLocation] = useSearchParams();
    const [submitValue, setSubmitValue] = useState('');
    const [listRole, setListRole] = useState([])
    const [listGroupExpense, setListGroupExpense] = useState([])
    const [listUnitSpend, setListUnitSpend] = useState([])
    const [listPaymentType, setListPaymentType] = useState([])
    const [listPlan, setListPlan] = useState([])
    const [listPurpose, setListPurpose] = useState([])
    const [listOccurrence, setListOccurrence] = useState([])
    const [listUnitPay, setListUnitPay] = useState([])
    const [listClue, setListClue] = useState([])
    const [listGroupExpenseTree, setListGroupExpenseTree] = useState([])
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [listFileLocal, setListFileLocal] = useState([])
    const [listLink, setListLink] = useState([])
    const [listLinkServer, setListLinkServer] = useState([])
    const [listDeleteLinkServer, setListDeleteLinkServer] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [info, setInfo] = useState({
        id: 0,
        name: "",
        description: "",
        date: new dayjs(),
        amount: 0
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
    });

    const backList = () => {
        navigate('/advance')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                getListExpense({
                    id: Number(location.get('id')),
                    paging: false,
                }).then(r => {
                    setInfo(r.data)
                    setSelectedNodeKeysOrganization(r.data.organization.id)
                    setListFileServer(r.data.documents)
                })
            } else navigate('/advance')
        }

    }, [location]);

    useEffect(() => {

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
    const submitForm = (value) => {
        value.organizationId = selectedNodeKeysOrganization;
        let formData = new FormData();
        formData.append('name',value.name)
        formData.append('date',value.date)
        formData.append('description',value.description)
        formData.append('amount',value.amount)
        formData.append('organizationId',selectedNodeKeysOrganization)
        for (let i = 0; i < listFileLocal.length; i++) {
            formData.append('files', listFileLocal[i])
        }
        for (let i = 0; i < listDeletedAttachment.length; i++) {
            formData.append('listDeletedAttachment', listDeletedAttachment[i])
        }
        if (isUpdate) {
            formData.append('id',location.get('id'))
            updateExpenseApi(formData).then((r) => {
                toast.success("Cập nhật thành công");
                back()
            }).then(e => {
                console.log(e)
            })
        } else {
            createExpenseApi(formData).then((r) => {
                toast.success("Thêm mới thành công");
                back()
            }).then(e => {
                console.log(e)
            })
        }

    }

    const back = () => {
        navigate('/advance')
    }
    const getOrganization = () => {
        return apiOrganization.getOrganizationByUser()
    }

    const getListExpense = (body) => {
        return apiAdvance.getAdvanceById(body)
    }
    const createExpenseApi = (body) => {
        return apiAdvance.createAdvance(body)
    }
    const updateExpenseApi = (body) => {
        return apiAdvance.updateAdvance(body)
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

    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
    };
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
                        description: info.description,
                        amount: info.amount,
                        date: isUpdate ? dayjs(info.date) : info.date,
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
                                        <div>Thông tin chung</div>
                                    </div>
                                    <Grid container spacing={4}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Tên tạm ứng
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
                                            <div className={'label-input'}>Số tiền
                                                <span className={'error-message'}>*</span></div>
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
                                        <Grid item xs={6} md={3}>
                                            <div className={'label-input'}>Ghi chú</div>
                                            <TextField
                                                size={"small"}

                                                className={'formik-input'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                multiline
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}

                                            />
                                        </Grid>
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
                                        <Grid item xs={6} md={12}>
                                            <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                                <Button style={{marginRight: '10px'}} onClick={backList}
                                                        variant="outlined">Hủy</Button>
                                                <Button variant="contained"
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
