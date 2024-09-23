import DialogContent from "@mui/material/DialogContent";
import {Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


export default function ModalConfirm(props) {
    const {open, handleCloseModal, name, submit} = props
    const handleSubmit = () => {
        handleCloseModal();
        submit();
    }
    useEffect(() => {

    }, [open])

    return (
        <div>
            <Dialog open={open} onClose={handleCloseModal} className={'popup-comfirm'}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Xác nhận
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={"model-project"}>
                    <div className="form-input">
                        <div className="label confirm-delete-dataset">
                            <div>Bạn có chắc chắn muốn thực hiện thao tác này?</div>
                            {/*<strong className={"text-bold"}>{name}</strong>*/}
                        </div>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*}*/}
                    <Button  onClick={submit} variant={'contained'} color={"error"}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}