import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, Divider, FormControl, Grid, MenuItem, Select, TextField} from "@mui/material";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import apiRole from "../../api/role";
import apiUser from "../../api/user";
import { toast, ToastContainer } from "react-toastify";
import {TreeSelect} from "primereact/treeselect";
import {buildTreeAsset, sortTreeData} from "../../constants/utils";
import apiOrganization from "../../api/organization";

export default function UserEdit(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [submitValue, setSubmitValue] = useState('');
    const [listRole,setListRole] = useState([])
    const [info, setInfo] = useState({
        "id": 0,
        "username": "",
        "jobTitle": "",
        "phoneNumber": "",
        "email": "",
        "fullName": "",
        "role": {
            "id": 0,
            "name": "",
            "code": "",
        },
        "organization": {
            id:0,
            name:""
        }
    },)
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        username: yup
            .string()
            .trim()
            .required('Không được để trống'),
        jobTitle: yup
            .string()
            .trim()
            .required('Không được để trống'),
        phoneNumber: yup
            .string()
            .trim()
            .required('Không được để trống'),
        email: yup
            .string()
            .trim()
            .required('Không được để trống'),
        fullName: yup
            .string()
            .trim()
            .required('Không được để trống'),
        password: yup
            .string()
            .trim()
            .required('Không được để trống'),
    });
    const validationSchemaUpdate = yup.object({
        username: yup
            .string()
            .trim()
            .required('Không được để trống'),
        jobTitle: yup
            .string()
            .trim()
            .required('Không được để trống'),
        phoneNumber: yup
            .string()
            .trim()
            .required('Không được để trống'),
        email: yup
            .string()
            .trim()
            .required('Không được để trống'),
        fullName: yup
            .string()
            .trim()
            .required('Không được để trống'),

    });
    const [selectedNodeKeysOrganization, setSelectedNodeKeysOrganization] = useState(0);
    const [selectedNodeKeysPermissionOrganization, setSelectedNodeKeysPermissionOrganization] = useState('');
    const [expandedKeysOrganization, setExpandedKeysOrganization] = useState({0: true});
    const [listOrganizationTree,setListOrganizationTree]= useState([])

    const backList = () => {
        navigate('/user')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                getUserApi({
                    id: Number(location.get('id')),
                    paging:false,
                }).then(r=>{
                    setInfo(r.data.responses[0])
                    if(r.data.responses[0].permissionOrganizationIds!=null) {
                        setSelectedNodeKeysPermissionOrganization(convertListToPermissionOrganization(r.data.responses[0].permissionOrganizationIds))
                    }
                    setSelectedNodeKeysOrganization(r.data.responses[0].organization.id)
                })
            } else navigate('/user')
        }

    }, [location]);

    useEffect(()=>{
        getListRole({
            paging:false
        }).then(r=>{
            setListRole(r.data.responses)
        })
        getOrganization().then(r=>{
            let convert = buildTreeAsset(r.data)
            setListOrganizationTree(convert)
        })
    },[])

    const submitForm = (value) => {
        if(isUpdate){
            value.id=  Number(location.get('id'));
            value.organizationId = selectedNodeKeysOrganization;
            value.permissionOrganizationIds = convertPermissionOrganizationToList();
            updateUserApi(value).then((r)=>{
                toast.success("Cập nhật thành công");
                back()
            }).catch(e=>{})
        }
        else {
            value.organizationId = selectedNodeKeysOrganization;
            value.permissionOrganizationIds = convertPermissionOrganizationToList();

            createUserApi(value).then((r)=>{
                toast.success("Thêm mới thành công");
                back()
            }).catch(e=>{
               let err = JSON.parse(e.request.response);
               toast.error(err.status.message)
                // console.log(a)
            })
        }

    }
    useEffect(()=>{

    },[selectedNodeKeysPermissionOrganization])
    const convertListToPermissionOrganization = (list) => {
        let result = {

        }
        for (let i = 0;i<list.length;i++){
            result[list[i]]={
                checked: true
            }
        }
        return result;
    }
    const convertPermissionOrganizationToList = () => {
        let listKey = []
        for (const id in selectedNodeKeysPermissionOrganization) {
            if (selectedNodeKeysPermissionOrganization[id].checked == true) {
                listKey.push(Number(id))
            }
        }
        return listKey;
    }
    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
    };
    const back = () => {
        navigate('/user')
    }
    const getListRole = (body) => {
      return apiRole.getListRole(body)
    }
    const createUserApi = (body) => {
        return apiUser.createUser(body)
    }
    const updateUserApi = (body) => {
        return apiUser.updateUser(body)
    }
    const getUserApi = (body) => {
        return apiUser.getListUser(body);
    }
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
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
                        username:info.username,
                        jobTitle:info.jobTitle,
                        phoneNumber:info.phoneNumber,
                        email:info.email,
                        fullName:info.fullName,
                        roleId:info.role.id,
                        roleName:info.role.name,
                    }}
                    validationSchema={isUpdate?validationSchemaUpdate:validationSchema}
                    onSubmit={
                        (values, actions) => {
                            console.log("Values: ",values)
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
                                    <Grid container spacing={4}>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Họ và tên
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='fullName'
                                                name='fullName'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.fullName}
                                                onChange={handleChange}
                                                error={touched.fullName && Boolean(errors.fullName)}
                                                helperText={touched.fullName && errors.fullName}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Tên đăng nhập
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='username'
                                                name='username'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.username}
                                                onChange={handleChange}
                                                error={touched.username && Boolean(errors.username)}
                                                helperText={touched.username && errors.username}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Email
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='email'
                                                name='email'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.email}
                                                onChange={handleChange}
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Chức danh
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='jobTitle'
                                                name='jobTitle'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.jobTitle}
                                                onChange={handleChange}
                                                error={touched.jobTitle && Boolean(errors.jobTitle)}
                                                helperText={touched.jobTitle && errors.jobTitle}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Số điện thoại
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='phoneNumber'
                                                name='phoneNumber'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.phoneNumber}
                                                onChange={handleChange}
                                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                                helperText={touched.phoneNumber && errors.phoneNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Đơn vị
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
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Nhóm quyền<span
                                                className={'error-message'}>*</span>
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="roleId"
                                                    id='roleId'
                                                    name='roleId'
                                                    value={values.roleId}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            setFieldValue('roleId', event.target.value);
                                                        }
                                                    }}
                                                    size={"small"}>
                                                    {
                                                        listRole.map((item)=>(
                                                            <MenuItem value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Phạm vi truy cập
                                            </div>
                                            <TreeSelect
                                                {...filterOptions} filterMode="strict"
                                                selectionMode="checkbox"
                                                // filterMode="strict"
                                                value={selectedNodeKeysPermissionOrganization}
                                                onChange={(e) => {
                                                    setSelectedNodeKeysPermissionOrganization(e.value)
                                                }}
                                                options={sortTreeData(listOrganizationTree)}
                                                expandedKeys={expandedKeysOrganization}
                                                onToggle={(e) => setExpandedKeysOrganization(e.value)}
                                                style={{width: '100%', zIndex: '1000000 !important', overflow: 'auto'}}
                                                className="md:w-20rem w-full"
                                                placeholder=""></TreeSelect>
                                        </Grid>
                                        {
                                            isUpdate?"":   <Grid item xs={6} md={6}>
                                                <div className={'label-input'}>Mật khẩu
                                                    <span className={'error-message'}>*</span></div>
                                                <TextField
                                                    size={"small"}
                                                    id='password'
                                                    name='password'
                                                    className={'formik-input'}
                                                    // variant="standard"
                                                    value={values.password}
                                                    type={"password"}
                                                    onChange={handleChange}
                                                    error={touched.password && Boolean(errors.password)}
                                                    helperText={touched.password && errors.password}
                                                />
                                            </Grid>
                                        }

                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Ghi chú</div>
                                            <TextField
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
