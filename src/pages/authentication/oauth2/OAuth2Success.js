import React, {useEffect, useState} from "react";
import {Link, NavLink, Outlet, useLocation, useSearchParams} from 'react-router-dom';
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
import {logout, updateRole, updateToken, updateUserInfo, updateUsername} from "../../../store/user/userSlice";
import {OPTION_TOAST} from "../../../constants/common";
import apiUser from "../../../api/user";
import Axios from "axios";

export default function Oauth2Success() {
    const navigate = useNavigate();
    const [param, setParam] = useSearchParams();
    const currentUser = useSelector(state => state.currentUser)
    const dispatch = useDispatch();
    useEffect(()=>{
        if(param.get("accessToken")&&param.get("accessTokenExp")&&param.get("refreshToken")&&param.get("refreshTokenExp")){
            console.log(param.get("accessToken"))
            console.log(param.get("accessTokenExp"))
            console.log(param.get("refreshToken"))
            console.log(param.get("refreshTokenExp"))
            localStorage.setItem('accessToken', param.get("accessToken"))
            localStorage.setItem('accessTokenExp', param.get("accessTokenExp"))
            localStorage.setItem('refreshToken', param.get("refreshToken"))
            localStorage.setItem('refreshTokenExp', param.get("refreshTokenExp"))
            dispatch(updateToken(param.get("accessToken")))
            Axios.post(API_MAP.GET_USER_INFO, {},{
                headers: { 'Authorization': `Bearer ${param.get("accessToken")}` },
            }).then(r => {
                let userInfo = r.data.data
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
                setTimeout(()=>{
                    navigate("/")

                },500)
            }).catch(e=>{
                // window.location.reload();
                // localStorage.clear()
            })
        }
    },[param])
    const getUserInfo = () => {
        return apiUser.getUserInfo(null);
    }
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>

    );
};