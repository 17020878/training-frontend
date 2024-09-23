import React, {useEffect, useState} from "react";
import {Link, NavLink, Outlet, useSearchParams} from 'react-router-dom';
// import { useRouteMatch } from "react-router-dom";
import {Navigate, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import login from "../../../api/auth/login";
import {toast} from "react-toastify";
import API_MAP from "../../../constants/api";
import {Formik, Form} from "formik";
import * as yup from 'yup';
import {Backdrop, Button, CircularProgress, IconButton, InputAdornment, TextField} from "@mui/material";
import {Token, Visibility, VisibilityOff} from "@mui/icons-material";
import {logout, updateRole, updateUserInfo, updateUsername} from "../../../store/user/userSlice";
import {OPTION_TOAST} from "../../../constants/common";
import apiUser from "../../../api/user";

export default function Login() {
    useEffect(()=>{
        localStorage.clear();
    },[])
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.currentUser)
    const dispatch = useDispatch();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleClickShowPass = () => setShowPass(!showPass);
    const [infoLogin, setInfoLogin] = useState({
        username: '',
        password: '',
    })
    const validationSchema = yup.object({
        username: yup
            .string()
            .required("Không được để trống"),
        password: yup
            .string()
            .required("Không được để trống")
    })

    const _handleSubmit = async (e) => {
        // localStorage.clear();'
        setLoading(true)
        try {
            const response = await dispatch(login({
                username: e.username,
                password: e.password,
            })).unwrap();
            toast.success("Đăng nhập thành công", OPTION_TOAST);
            getUserInfo().then(r=>{
                let userInfo = r.data
                dispatch(updateRole(userInfo.permissions))
                dispatch(updateUserInfo(
                    {
                        "id": userInfo.id,
                        "username": userInfo.username,
                        "jobTitle": userInfo.jobTitle,
                        "phoneNumber": userInfo.phoneNumber,
                        "email": userInfo.email,
                        "fullName": userInfo.fullName,
                    }
                ))
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error("Đăng nhập thất bại", OPTION_TOAST);
        }
    }
    const handleLoginSSO = () => {
        window.location=API_MAP.OAUTH2_MICROSOFT
    }
    const getUserInfo = () => {
      return apiUser.getUserInfo(null);
    }
    return (
        <div className="login-container">
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div className="login-form">
                <Formik
                    enableReinitialize
                    initialValues={{
                        username: infoLogin.username,
                        password: infoLogin.password,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        _handleSubmit(values)
                    }}>{props => {
                    const {
                        values,
                        touched,
                        errors,
                        handleSubmit,
                        handleChange,
                        setFieldValue
                    } = props;
                    return (
                        <Form onSubmit={handleSubmit}>
                            <div className="login-logo">
                                <img src={require('../../../assets/img/new-logo.png')} alt="Logo"/>
                            </div>
                            <div className={"login-title"}>
                                Đăng nhập
                            </div>
                            <div className="form-input">
                                <div className={'label'}>Tên đăng nhập<span
                                    className="span-required">*</span></div>
                                <TextField

                                    fullWidth={true}
                                    className="text-field-custom custom-input"
                                    id="username"
                                    name="username"
                                    value={values.username}
                                    hiddenLabel
                                    variant='outlined'
                                    size="small"
                                    onChange={handleChange}
                                    type="text"
                                    autoFocus={true}
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                />
                            </div>
                            <div className="form-input">
                                <div className={'label'}>Mật khẩu<span
                                    className="span-required">*</span></div>
                                <TextField
                                    fullWidth={true}
                                    className="text-field-custom custom-input"
                                    id="password"
                                    name="password"
                                    value={values.password}
                                    size="small"
                                    onChange={handleChange}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    type={showPass ? "text" : "password"}
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPass}
                                                >
                                                    {showPass ? <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                            <div className="form-input align">
                                <Button style={{width: "100%"}} className={'button-amber'} variant={"contained"}
                                        type={"submit"}>
                                    Đăng nhập
                                </Button>
                            </div>
                            <div className={'login-sso'}>
                                <div> <span>Hoặc đăng nhập thông qua SSO</span></div>
                                <Button style={{width: "100%"}} className={'button-sso'} variant={"contained"} onClick={handleLoginSSO}
                                        type={"button"}>
                                    <img src={require('../../../assets/img/microsoft.png')} alt=""/>
                                    Đăng nhập bằng Microsoft
                                </Button>
                            </div>


                        </Form>
                    )
                }}
                </Formik>
            </div>
            <div className={"login-language"}>
                {/*<Language></Language>*/}
            </div>
        </div>
    );
};