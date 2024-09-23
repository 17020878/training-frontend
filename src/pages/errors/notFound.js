import React, { useState } from 'react'
import { Button } from '@mui/material';
const NotFound = () => {
    const backToHome = ()=>{
        window.location = "/home/manager-meeting"
    }
    return (
        <main>
            <div className={'wrapper-loading'}>
                <div className={'main-container-content forbidden'}>
                    <div className='errors'>
                        {/*<img*/}

                        {/*    src={require('../../assets/img/404.svg').default}*/}
                        {/*/>*/}
                        <div className='title-error'>Xin lỗi, không tìm thấy trang bạn đang tìm kiếm</div>
                        <Button variant="contained" className={'vmp-btn'} onClick={backToHome}>Quay lại trang chủ</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NotFound