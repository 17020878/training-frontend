import React, { useState } from 'react'
import { HashLoader } from 'react-spinners'
import { css } from "@emotion/react";
import { Button } from '@mui/material';
const ErrorServer = () => {

    const backToHome = ()=>{
        window.location = "/home/manager-meeting"
    }
    return (
        <main>
            <div className={'wrapper-loading'}>
                <div className={'main-container-content forbidden'}>
                    <div className='errors'>
                        {/*<img*/}
                        {/*    */}
                        {/*    src={require('../../assets/img/500.svg').default}*/}
                        {/*/>*/}
                        <div className='title-error'>Lỗi liên kết máy chủ, vui lòng thử lại sau</div>
                        <Button variant="contained" className={'vmp-btn'} onClick={backToHome}>Quay lại trang chủ</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ErrorServer