import {
    Box,
    Button, CircularProgress,
    Grid, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Form, Formik} from "formik";
import {toast} from "react-toastify";
import * as yup from 'yup';
import {TreeSelect} from "primereact/treeselect";
import apiOrganization from "../../api/organization";
import {currencyFormatter, getTitleFromCodeCategory, sortTreeData} from "../../constants/utils";
import DialogContent from "@mui/material/DialogContent";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import apiExpense from "../../api/expense";
import moment from "moment/moment";
import Axios from "axios";
import API_MAP from "../../constants/api";
import FileDownload from "js-file-download";
import ClearIcon from '@mui/icons-material/Clear';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";

const ModalExpense = (props) => {
    const [idDel, setIdDel] = useState(-1)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const currentUser = useSelector(state => state.currentUser)
    const { openModal, handleCloseModal,info} = props;
    const [result,setResult] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [limitOfPage, setLimitOfPage] = useState(20)
    const [totalPage, setTotalPage] = useState(0)
    const [loadingExport, setLoadingExport] = useState(false)
    const navigate = useNavigate();
    const [total,setTotal] = useState(0);
    const [isRefresh,setIsRefresh] = useState(false)
    useEffect(()=>{
        if (info.id){
            getExpense({
                pageSize: limitOfPage,
                pageIndex: currentPage,
                paging: true,
                advanceId:info.id,
            }).then(r => {
                if (r.data.responses) {
                    let data = r.data.responses;
                    setResult(data);
                    setTotalPage(r.data.page.total_pages)

                } else {
                    setResult([]);
                }
            })

        }

    },[info,currentPage,isRefresh])
    useEffect(()=>{
        getExpense({
            pageSize: limitOfPage,
            pageIndex: currentPage,
            paging: false,
            advanceId:info.id,
        }).then(r => {
            if (r.data.responses) {
                let data = r.data.responses;
                let sum = 0;
                for (let i = 0;i<data.length;i++){
                    sum = sum+data[i].amount
                }
                setTotal(sum)
            } else {
                setTotal(0)
            }
        })
    },[info,isRefresh])
    const exportExcel = () => {
        setLoadingExport(true)
        // setLoadingExport(true)
        Axios.post(API_MAP.EXPORT_EXCEL_ADVANCE, {
            advanceId: info.id,
            pageSize: 1000,
            pageIndex: currentPage,
            paging: false,
        }, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`},
            responseType: 'blob'
        }).then(response => {

            setLoadingExport(false)
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);

        }).catch(e => {
            setLoadingExport(false)
        })
    }
    const getExpense = (body) => {
      return apiExpense.getExpenseAll(body)
    }
    const clearExpense = (body) => {
        return apiExpense.clearAdvance(body)
    }
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const submitDel = () => {
        if (idDel != -1)
            clearExpense({
                id: idDel
            }).then(r => {
                handleCloseModalDel()
                setIsRefresh(!isRefresh)
                toast.success("Xóa thành công")
            }).catch(e => {
                handleCloseModalDel()
                toast.error("Vui lòng xóa các phụ thuộc trước")
            })
    }
    useEffect(()=>{
        console.log("result",result)
        console.log("info",info)
    },[result,info])
    return (

        <div>
            <Dialog className={"modal"} open={openModal} onClose={handleCloseModal}  maxWidth="xl">
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Danh sách chi phí
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
                <div className={'modal-body'}>
                    <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete}
                                     handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
                    <div className={'table-content'}>
                        <div className={'table-content-title'} style={{paddingLeft:'15px',marginBottom:'0px'}}>
                            {info.name+":"}
                            <div style={{marginRight:'5px',height:'35px'}} >
                                {
                                    loadingExport ? <CircularProgress
                                            size={25}></CircularProgress> :
                                        <Button onClick={() => {
                                            exportExcel();
                                        }} variant="outlined" startIcon={<VerticalAlignBottomIcon/>}>
                                            Xuất quyết toán hoàn ứng
                                        </Button>
                                }

                            </div>
                        </div>
                        <div className={'flex'} style={{paddingLeft:'15px',marginBottom:'10px'}}>
                            <div className={'flex'} style={{alignItems:'center'}}>
                                <div>
                                    Tổng tiền tạm ứng:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(info.amount)}
                                </div>
                            </div>
                            <div className={'flex'} style={{alignItems:'center',marginLeft:'15px'}}>
                                <div>
                                    Số tiền đã dùng:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(total)}
                                </div>
                            </div>
                            <div className={'flex'} style={{alignItems:'center',marginLeft:'15px'}}>
                                <div>
                                    Số tiền còn lại:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(info.amount-total)}
                                </div>
                            </div>
                            <div className={'flex'} style={{alignItems:'center',marginLeft:'15px'}}>
                                <div>
                                    Số tiền chi thêm:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(total-info.amount)}
                                </div>
                            </div>
                        </div>
                        <TableContainer className={'table-container'} style={{maxHeight:"500px"}}>
                            <Table stickyHeader className={"table-custom"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{width: '30px'}} align="center">STT</TableCell>
                                        <TableCell>Ngày đề nghị </TableCell>
                                        <TableCell>Tên </TableCell>
                                        <TableCell>Nhóm chi phí</TableCell>
                                        <TableCell style={{minWidth: '150px'}}>Số tiền</TableCell>
                                        <TableCell>Người tạo</TableCell>
                                        <TableCell>Mã khoản mục</TableCell>
                                        <TableCell>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{overflowY: "auto"}}>
                                    {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                    {/*    <CircularProgress size={30}></CircularProgress>*/}
                                    {/*</div>*/}
                                    <div
                                        className={`message-table-empty ${result.length === 0 ? 'mt-30' : 'hidden'}`}>
                                        <div>
                                            Hiện tại chưa khai báo bất kỳ chi phí nào cho khoản tạm ứng này.
                                        </div>
                                        <div  style={{display:'flex'}}>
                                            Vui lòng chuyển sang tab&ensp;<div onClick={()=>{
                                            navigate('/expense')
                                        }} style={{textDecoration:'underline',color:'#F16F21',cursor:'pointer'}}>Chi phí</div>&ensp;để khai báo các chi phí liên quan.
                                        </div>
                                         </div>
                                    {
                                        result.map((item, index) => (
                                            <>
                                                <TableRow>
                                                    <TableCell>
                                                        <div>{index + 1 + ((currentPage - 1) * limitOfPage)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{moment(item.date).format('DD-MM-YYYY')}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{item.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{item.groupExpense!=null? item.groupExpense.name:''}</div>
                                                    </TableCell>
                                                    <TableCell style={{textAlign: 'right'}}>
                                                        <div>{currencyFormatter(item.amount)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{item.fullName}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{item.lineItem!=null?item.lineItem.code:""}</div>
                                                    </TableCell>
                                                    <TableCell style={{textAlign:'center'}}>
                                                        {
                                                            currentUser.roles.includes('edit_advance') ?
                                                                <Tooltip title={"Xóa phụ thuộc"}>
                                                                    <ClearIcon onClick={() => {
                                                                        setIdDel(item.id);
                                                                        setOpenModalDelete(true)
                                                                    }} color={"error"}>
                                                                    </ClearIcon>
                                                                </Tooltip> : ""
                                                        }
                                                    </TableCell>

                                                </TableRow>
                                            </>
                                        ))
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: 'end',
                            marginTop: "5px"
                        }}>
                            <Pagination
                                page={currentPage}
                                onChange={(e, value) => {
                                    setCurrentPage(value)
                                }}
                                count={totalPage}
                                // count={13}
                                // variant="outlined" shape="rounded"
                                color="primary"/>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default ModalExpense;