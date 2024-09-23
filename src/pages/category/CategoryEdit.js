import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, Divider, FormControl, Grid, MenuItem, Select, TextField} from "@mui/material";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import apiRole from "../../api/role";
import apiUser from "../../api/user";
import { toast, ToastContainer } from "react-toastify";
import apiCategory from "../../api/category";

export default function CategoryEdit(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [submitValue, setSubmitValue] = useState('');
    const [listRole,setListRole] = useState([])
    const [info, setInfo] = useState({
        "id": 0,
        "name": "",
        "description": "",
    },)
    const {isUpdate,type} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống'),

    });
    const backList = () => {
        window.history.back();
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                getUserApi({
                    id: Number(location.get('id')),
                    type: type,
                    paging:false,
                }).then(r=>{
                    setInfo(r.data.responses[0])
                })
            } else navigate('/user')
        }

    }, [location]);



    const submitForm = (value) => {
        value.type = type
        if(isUpdate){
            value.id=  Number(location.get('id'));
            updateUserApi(value).then((r)=>{
                toast.success("Cập nhật thành công");
                back()
            }).then(e=>{
                console.log(e)
            })
        }
        else {
            createUserApi(value).then((r)=>{
                toast.success("Thêm mới thành công");
                back()
            }).then(e=>{
                console.log(e)
            })
        }

    }

    const back = () => {
        window.history.back();
    }

    const createUserApi = (body) => {
        return apiCategory.createCategory(body)
    }
    const updateUserApi = (body) => {
        return apiCategory.updateCategory(body)
    }
    const getUserApi = (body) => {
        return apiCategory.getCategory(body);
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
                        name:info.name,
                        description:info.description,

                    }}
                    validationSchema={validationSchema}
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
                                            <div className={'label-input'}>Tên
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
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Ghi chú
                                                <span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='description'
                                                name='description'
                                                className={'formik-input'}
                                                // variant="standard"
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
