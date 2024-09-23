import {
    Button,
    CircularProgress, Divider, Pagination, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, Tooltip
} from "@mui/material";
import apiUser from "../../api/user";
import React, {useEffect, useState} from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiRole from "../../api/role";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {DeleteIcon, UpdateIcon} from "../../constants/icon-define";
export default function RolePage() {
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1)
    const [limitOfPage, setLimitOfPage] = useState(20)
    const [result, setResult] = useState([])
    const [searchRoleName, setSearchRoleName] = useState("")
    const [searchRoleCode, setSearchRoleCode] = useState("")
    const [totalPage, setTotalPage] = useState(0)
    const [search, setSearch] = useState(true)
    const [isRefreshTable, setRefreshTable] = useState(true)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel,setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    useEffect(() => {
        submitSearch()
    }, [])
    const submitSearch = () => {
        getRoleApi({
            name: searchRoleName,
            code: searchRoleCode,
            pageSize: limitOfPage,
            pageIndex: currentPage,
            paging: true
        }).then(r => {
            console.log(r.data);
            if(r.data.responses){
                setResult(r.data.responses);
                setTotalPage(r.data.page.total_pages)
            }
            else {
                setResult([]);
                setTotalPage(0)
            }

        })
    }
    useEffect(() => {
        submitSearch()
    }, [ currentPage, isRefreshTable])
    const getRoleApi = (body) => {
        return apiRole.getListRole(body);
    }

    const deleteRoleApi = (body) => {
        return apiRole.deleteRole(body)
    }
    const submitDel = () => {
        deleteRoleApi({
            id: idDel
        }).then(r=>{
            submitSearch()
            toast.success("Xóa thành công")
        })
    }
    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete} handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
            <div className={'wrapper-table'}>
                <div className={'table-search'}>
                    <div className={'table-content-title'}>Thông tin tìm kiếm</div>
                    <div className={'table-search-btn'}>
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>Tên nhóm quyền</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchRoleName}
                                onChange={(e) =>{
                                    setSearchRoleName(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:"20px"}}>
                            <div className={'label-input'}>Mã nhóm quyền</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchRoleCode}
                                onChange={(e) =>{
                                    setSearchRoleCode(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{marginLeft:"20px",marginTop:'16px'}}>
                            <Button variant={"outlined"} onClick={submitSearch}>Thông tin tìm kiếm</Button>
                        </div>
                    </div>
                    <Divider ></Divider>
                </div>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        Nhóm quyền
                        <div>
                            {
                                currentUser.roles.includes('create_role')? <Button onClick={()=>{navigate("/role/create")}} variant="outlined" startIcon={<ControlPointIcon />}>
                                    Thêm mới
                                </Button>:""
                            }

                        </div>
                    </div>
                    <TableContainer className={'table-container'}>
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:'30px'}} align="center">STT</TableCell>
                                    <TableCell>Tên nhóm quyền</TableCell>
                                    <TableCell>Mã nhóm quyền</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    {
                                        currentUser.roles.includes('edit_role')||currentUser.roles.includes('delete_role')?
                                            <TableCell className={"action-header"} style={{width:'150px'}}>Thao tác</TableCell>
                                            :""
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                {/*    <CircularProgress size={30}></CircularProgress>*/}
                                {/*</div>*/}
                                <div
                                    className={`message-table-empty ${result.length === 0  ? 'mt-30' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>
                                {
                                    result.map((item,index)=>(
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                   <div>{index+1+((currentPage-1)*limitOfPage)}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.code}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.description}</div>
                                                </TableCell>
                                                {
                                                    currentUser.roles.includes('edit_role')||currentUser.roles.includes('delete_role')?
                                                        <TableCell className={"action"}>
                                                            <div style={{display:'flex',justifyContent:'center'}} className={"icon-action"}>
                                                                {
                                                                    currentUser.roles.includes('edit_role')?
                                                                        <Tooltip title={"Phân quyền"}>
                                                                            <AssignmentTurnedInIcon style={{color:"#1e1e44",marginRight:"10px"}} onClick={()=>{navigate(`/role/permission?id=${item.id}`)}}></AssignmentTurnedInIcon>
                                                                        </Tooltip>:""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('edit_role')?
                                                                        <Tooltip title="Cập nhật"
                                                                                 onClick={()=>{navigate(`/role/update?id=${item.id}`)}}>
                                                                            <div><UpdateIcon/></div>
                                                                        </Tooltip> :""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('delete_role')?
                                                                        <Tooltip className={'deleteButton'} title="Xóa"
                                                                                 onClick={()=>{
                                                                                     setIdDel(item.id)
                                                                                     setOpenModalDelete(true);

                                                                                 }}>
                                                                            <div><DeleteIcon/></div>
                                                                        </Tooltip> :""
                                                                }



                                                            </div>
                                                        </TableCell>:""
                                                }

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
                        marginTop:"5px"
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
        </div>)
}