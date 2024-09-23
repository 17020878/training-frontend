import React, {useEffect, useState} from "react";
import {Box, Button, Divider, FormControl, FormHelperText, Grid, MenuItem, Select, TextField} from "@mui/material";
import {Form, Formik} from 'formik';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiVendor from "../../api/vendor";
import Utils from "../../constants/utils";
import apiOrganization from "../../api/organization";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import apiCategory from "../../api/category";

export default function CreateUpdateVendor(props) {
    const dispatch = useDispatch();
    const [location, setLocation] = useSearchParams();
    const navigate = useNavigate();
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const [listFileLocal, setListFileLocal] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])


    const [info, setInfo] = useState({
        name: '',
        mst: '',
        address: '',
        website: '',
        serviceProvided: '',
        clue: '',
        phone: '',
        email: '',
        generalRating: '',
        notes: '',
    })


//=====================================================================================================
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
        formData.append("mst", values.mst)
        formData.append("address", values.address)
        formData.append("website", values.website)
        formData.append("serviceProvided", values.serviceProvided)
        formData.append("clue", values.clue)
        formData.append("phone", values.phone)
        formData.append("email", values.email)
        formData.append("generalRating", values.generalRating)
        formData.append("notes", values.notes)

        if (!isUpdate) {
            createVendorApi(formData).then(r => {
                toast.success('Thêm nhà cung cấp thành công', Utils.options);
                setTimeout(() => {
                    window.location.href = '/vendor';
                }, 1100);
            }).catch(e => {
                toast.error('Thêm nhà cung cấp không thành công', Utils.options);
            })
        } else {
            if (isUpdate && idUpdate) {
                formData.append("id", location.get('id'));
                updateVendorApi(formData).then(r => {
                    toast.success('Cập nhật nhà cung cấp thành công', Utils.options);
                    setTimeout(() => {
                        window.location.href = '/vendor';
                    }, 1100);
                }).catch(e => {
                    toast.error('Cập nhật nhà cung cấp không thành công', Utils.options);
                })
            }
        }
    }

//=====================================================================================================
    const back = () => {
        navigate('/vendor')
    }
//=====================================================================================================
    const createVendorApi = (data) => {
        return apiVendor.createVendor(data);
    }
    const updateVendorApi = (data, idUpdate) => {
        return apiVendor.updateVendor(data, idUpdate);
    }
    const getDetailApi = (idUpdate) => {
        return apiVendor.getDetailVendor(idUpdate);
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
                    // validationSchema={validationvendor}
                    enableReinitialize
                    initialValues={{
                        name: idUpdate ? info.name : '',
                        mst: idUpdate ? info.mst : '',
                        address: idUpdate ? info.address : '',
                        website: idUpdate ? info.website : '',
                        serviceProvided: idUpdate ? info.serviceProvided : '',
                        clue: idUpdate ? info.clue : '',
                        phone: idUpdate ? info.phone : '',
                        email: idUpdate ? info.email : '',
                        generalRating: idUpdate ? info.generalRating : '',
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
                                            <div className={'label-input'}>Tên nhà cung cấp<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Tên nhà cung cấp'}
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Mã số thuế<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='mst'
                                                name='mst'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Mã số thuế'}
                                                value={values.mst}
                                                onChange={handleChange}
                                                error={touched.mst && Boolean(errors.mst)}
                                                helperText={touched.mst && errors.mst}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Địa chỉ<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='address'
                                                name='address'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Địa chỉ'}
                                                value={values.address}
                                                onChange={handleChange}
                                                error={touched.address && Boolean(errors.address)}
                                                helperText={touched.address && errors.address}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Website<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='website'
                                                name='website'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Website'}
                                                value={values.website}
                                                onChange={handleChange}
                                                error={touched.website && Boolean(errors.website)}
                                                helperText={touched.website && errors.website}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Dịch vụ cung cấp<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='serviceProvided'
                                                name='serviceProvided'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Dịch vụ cung cấp'}
                                                value={values.serviceProvided}
                                                onChange={handleChange}
                                                error={touched.serviceProvided && Boolean(errors.serviceProvided)}
                                                helperText={touched.serviceProvided && errors.serviceProvided}
                                            />
                                        </Grid>

                                        <Grid item xs={4} md={3}>
                                            <div className={'label-input'}>Đầu mối liên hệ<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='clue'
                                                name='clue'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Đầu mối liên hệ'}
                                                value={values.clue}
                                                onChange={handleChange}
                                                error={touched.clue && Boolean(errors.clue)}
                                                helperText={touched.clue && errors.clue}
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
                                            <div className={'label-input'}>Đánh giá chung<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='generalRating'
                                                name='generalRating'
                                                className={'formik-input'}
                                                InputLabelProps={{
                                                    style: {color: '#271052'},
                                                }}
                                                placeholder={'Đánh giá chung'}
                                                value={values.generalRating}
                                                onChange={handleChange}
                                                error={touched.generalRating && Boolean(errors.generalRating)}
                                                helperText={touched.generalRating && errors.generalRating}
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
