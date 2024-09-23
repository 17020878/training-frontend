import DialogContent from "@mui/material/DialogContent";
import {Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


export default function ModalConfirmDel(props) {
    const {openModalDel, handleCloseModalDel, submitDelete} = props
    const [valueInput, setValueInput] = useState('');
    const handleChangeInput = (event) => {
        setValueInput(event.target.value);
    }
    const submit = () => {
        handleCloseModalDel();
        submitDelete();
        setValueInput('')
    }
    useEffect(() => {
        setValueInput('')
        // alert(name)

    }, [openModalDel])
    useEffect(()=>{

    },[valueInput])
    return (
        <div>
            <Dialog open={openModalDel} onClose={handleCloseModalDel}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Xác nhận xóa
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalDel}
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
                            <div>Bạn có chắc chắn muốn xóa bản ghi này?</div>
                            {/*<strong className={"text-bold"}>{name}</strong>*/}
                        </div>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseModalDel}>
                        Hủy
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*}*/}
                    <Button  onClick={submit} variant={'contained'} color={"error"}>Xóa</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}