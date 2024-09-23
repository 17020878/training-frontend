import React, {useEffect, useState} from 'react'
import { HashLoader } from 'react-spinners'
import { css } from "@emotion/react";
import { Button } from '@mui/material';
import {useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
const Forbidden = () => {
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    useEffect(()=>{
        if(currentUser.roles.length>0){
            if(currentUser.roles.includes("view_dashboard")){
                navigate('/dashboard');
            }
            else if(currentUser.roles.includes("view_expense")){
                navigate('/expense')
            }
            else if(currentUser.roles.includes("view_group")) {
                navigate('/group-expense')
            }
            else if(currentUser.roles.includes("view_category")) {
                navigate('/clue')
            }
            else if(currentUser.roles.includes("view_user")) {
                navigate('/user')
            }
            else if(currentUser.roles.includes("view_role")) {
                navigate('/role')
            }
            else if(currentUser.roles.includes("view_organization")) {
                navigate('/organization')
            }
            else if(currentUser.roles.includes("view_login")) {
                navigate('/login-history')
            }


        }
    },[currentUser])
    return (
        <main>
            <div className='errors'>
                <img

                    src={require('../../assets/img/forbidden.svg').default}
                />
                <div className='title-error'>Xin lỗi, bạn không có quyền truy cập trang này</div>
                {/*<Button   onClick={backToHome}>Quay lại trang chủ</Button>*/}
            </div>
        </main>
    )
}

export default Forbidden