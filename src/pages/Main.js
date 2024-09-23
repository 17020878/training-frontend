import React, {useEffect} from "react";
import {Outlet, useNavigate, useSearchParams} from 'react-router-dom';
import Nav from "../components/Nav";
import Header from "../components/Header";
import {updateRole, updateUserInfo} from "../store/user/userSlice";
import {useDispatch} from "react-redux";
import apiUser from "../api/user";


export default function Main() {
    const dispatch = useDispatch();
    useEffect(()=>{
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
    },[])
    const getUserInfo = () => {
        return apiUser.getUserInfo(null);
    }
    return (
        <div className={'main'}>
            <Nav></Nav>
            <div className={'wrapper-main'} >
                <Header></Header>
                <div className={'main-body'}>
                        <Outlet/>
                </div>
            </div>
        </div>
    );
};