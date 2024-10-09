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
    TextField,
    Typography
} from "@mui/material";
import {Form, Formik} from 'formik';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiLink from "../../api/link";
import Utils, {buildInputTree, buildTreeAsset} from "../../constants/utils";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {sexData} from "../../constants/json_define";
import apiOrganization from "../../api/organization";
import {convertToAutoComplete} from "../../constants/common";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import apiCategory from "../../api/category";
import apiTraining from "../../api/training";
import apiTrainingClass from "../../api/training-class";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import apiDocument from "../../api/document";

export default function CreateUpdateLink(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [listFileLocal, setListFileLocal] = useState([])
    const [training, setTraining] = useState([]);
    const [trainingClass, setTrainingClass] = useState([]);
    const [listFileServer, setListFileServer] = useState([])
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [trainingId, setTrainingId] = useState(null)


    const [info, setInfo] = useState({
        name: '',
        path: '',
        creator: '',
        introText: '',
        training: '',
        trainingClass: '',
        notes: '',
    })


//=====================================================================================================
    useEffect(() => {
        getTrainingApi().then(r => {
            setTraining(r.data)
        })
    },[])
    useEffect(() => {
        if(trainingId){
            getAllTrainingClassByTrainingApi(trainingId).then(r => {
                setTrainingClass(r.data)
            })
        }
    },[trainingId])
    useEffect(() => {
        if (location.get('id')) {
            setIdUpdate(location.get('id'));
        }
        if (isUpdate && idUpdate) {
            getDetailApi(idUpdate).then(r => {
                setInfo(r.data)
                setListFileServer(r.data.documents)
            }).catch(e => {
            })
        }

    }, [location, idUpdate])
//=====================================================================================================
    const handleDownloadFile = (id,type,name) => {
        downloadFileApi(id, type)
            .then(response => {
                const blob=new Blob([response], {type:"application/pdf"});
                const link = document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link.download=name;
                link.click();
            }).catch(error => {
            console.error('Error:', error);
        });
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
    function onSubmitFunction(values) {
        let formData = new FormData();
        for (let i = 0; i < listFileLocal.length; i++) {
            formData.append('files', listFileLocal[i])
        }
        formData.append("name", values.name)
        formData.append("path", values.path)
        formData.append("creator", values.creator)
        formData.append("introText", values.introText)
        formData.append("trainingId", values.trainingId)
        formData.append("trainingClassId", values.trainingClassId)
        formData.append("notes", values.notes)

        if (!isUpdate) {
            createLinkApi(formData).then(r => {
                toast.success('Thêm nguồn đăng ký thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/link';
                }, 1100);
            }).catch(e => {
                toast.error('Thêm nguồn đăng ký không thành công', Utils.options);
            })
        } else {
            if (isUpdate && idUpdate) {
                formData.append("id", location.get('id'));
                updateLinkApi(formData).then(r => {
                    toast.success('Cập nhật nguồn đăng ký thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/link';
                    }, 1100);
                }).catch(e => {
                    toast.error('Cập nhật nguồn đăng ký không thành công', Utils.options);
                })
            }
        }
    }
//=====================================================================================================
    const back = () => {
        navigate('/link')
    }
//=====================================================================================================
    const createLinkApi = (data) => {
        return apiLink.createLink(data);
    }
    const downloadFileApi = (id, type) => {
        return apiDocument.downloadFile(id, type);
    }
    const getTrainingApi = () => {
        return apiTraining.getAllTraining();
    }
    const getAllTrainingClassByTrainingApi = (trainingId) => {
        return apiTrainingClass.getAllTrainingClassByTraining(trainingId);
    }
    const updateLinkApi = (data, idUpdate) => {
        return apiLink.updateLink(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiLink.getDetailLink(idUpdate);
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
                    // validationSchema={validationLink}
                    enableReinitialize
                    initialValues={{
                        name: idUpdate ? info.name : '',
                        path: idUpdate ? info.path : '',
                        creator: idUpdate ? info.creator : '',
                        introText: idUpdate ? info.introText : '',
                        trainingId: idUpdate ? info.training.id : '',
                        trainingClassId: idUpdate ? info.trainingClass.id : '',
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
                                            <div className={'label-input'}>Tên nguồn đăng ký<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Tên nguồn đăng ký'}
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Account tạo link<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='creator'
                                                name='creator'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Account tạo link'}
                                                value={values.creator}
                                                onChange={handleChange}
                                                error={touched.creator && Boolean(errors.creator)}
                                                helperText={touched.creator && errors.creator}
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
                                                    onChange={event => {
                                                        setFieldValue('trainingId', event.target.value)
                                                        setTrainingId(event.target.value)
                                                    }}
                                                    size={"small"}>
                                                    {training.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.trainingId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Lớp đào tạo<span
                                                className={'error-message'}>*</span></div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="is_infinite_label"
                                                    id='trainingClassId'
                                                    name='trainingClassId'
                                                    value={values.trainingClassId}
                                                    onChange={handleChange}
                                                    size={"small"}>
                                                    {trainingClass.map((item) =>
                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.trainingClassId}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <Divider/>
                                        </Grid>
                                    </Grid>
                                    <div className={'label-group-input'}>
                                        <div>Nội dung</div>
                                    </div>
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Giới thiệu<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                sx={{
                                                    '& textarea': {
                                                        minHeight: '80px',
                                                    },
                                                    width: '100%'
                                                }}
                                                multiline
                                                size={"small"}
                                                id='introText'
                                                name='introText'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Giới thiệu'}
                                                value={values.introText}
                                                onChange={handleChange}
                                                error={touched.introText && Boolean(errors.introText)}
                                                helperText={touched.introText && errors.introText}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Đường dẫn link<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                sx={{
                                                    '& textarea': {
                                                        minHeight: '80px',
                                                    },
                                                    width: '100%'
                                                }}
                                                multiline
                                                size={"small"}
                                                id='path'
                                                name='path'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Đường dẫn link'}
                                                value={values.path}
                                                onChange={handleChange}
                                                error={touched.path && Boolean(errors.path)}
                                                helperText={touched.path && errors.path}
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
                                                                <div className={'delete-file'}><DeleteForeverIcon
                                                                    style={{cursor: "pointer",color: "#ff5353", width: "26px",height: "26px"}}
                                                                    color={"error"}
                                                                    onClick={() => {
                                                                        deleteFileLocal(e.name)
                                                                    }}></DeleteForeverIcon></div>
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
                                                                <div className={'flexGroup2'}>
                                                                    <DownloadIcon
                                                                        style={{color: "#000",width: "26px",height: "26px"}}
                                                                        onClick={() => handleDownloadFile(idUpdate, 'trainingDocument',e.name)}></DownloadIcon>
                                                                    <div className={'ml5'}><DeleteForeverIcon
                                                                        style={{cursor: "pointer",color: "#ff5353", width: "26px",height: "26px"}}
                                                                        color={"error"}
                                                                        onClick={() => {
                                                                            deleteFileServer(e.id, e.name)
                                                                        }}></DeleteForeverIcon></div>
                                                                </div>

                                                            </div>
                                                            <Divider light/>
                                                        </>

                                                    ))
                                                }
                                            </div>

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
