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
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {DeleteIcon, UpdateIcon} from "../../constants/icon-define";
export default function UserPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1)
    const [limitOfPage, setLimitOfPage] = useState(20)
    const [result, setResult] = useState([])
    const [searchUsername, setSearchUsername] = useState("")
    const [searchFullName, setSearchFullName] = useState("")
    const [totalPage, setTotalPage] = useState(0)
    const [search, setSearch] = useState(true)
    const [isRefreshTable, setRefreshTable] = useState(true)
    const currentUser = useSelector(state => state.currentUser)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel,setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    useEffect(() => {
        submitSearch()
    }, [])
    const submitSearch = () => {
        getUserApi({
            fullName: searchFullName,
            username: searchUsername,
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
    const handleChangeActiveUser = (id,isActive) => {
        changeActiveUserApi({
            id:id,
            isActive:isActive
        }).then(r=>{
            submitSearch();
        })
    }
    const submitDel = () => {
        deleteUserApi({
            id: idDel
        }).then(r=>{
            submitSearch()
            toast.success("Xóa thành công")
        })
    }
    const getUserApi = (body) => {
        return apiUser.getListUser(body);
    }
    const changeActiveUserApi = (body) => {
      return apiUser.changeActiveUser(body)
    }
    const deleteUserApi = (body) => {
        return apiUser.deleteUser(body)
    }
    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete} handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
            <div className={'wrapper-table'}>
                <div className={'table-search'}>
                    <div className={'table-content-title'}>Thông tin tìm kiếm</div>
                    <div className={'table-search-btn'}>
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>Tên người dùng</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchFullName}
                                onChange={(e) =>{
                                    setSearchFullName(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:"20px"}}>
                            <div className={'label-input'}>Tên đăng nhập</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchUsername}
                                onChange={(e) =>{
                                    setSearchUsername(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{marginLeft:"20px",marginTop:'16px'}}>
                            <Button variant={"outlined"} onClick={submitSearch}>Tìm kiếm</Button>
                        </div>
                    </div>
                    <Divider ></Divider>
                </div>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        Tài khoản
                        <div>
                            {
                                currentUser.roles.includes('create_user')? <Button onClick={()=>{navigate("/user/create")}} variant="outlined" startIcon={<ControlPointIcon />}>
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
                                    <TableCell>Tên người dùng</TableCell>
                                    <TableCell>Tên đăng nhập</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Đơn vị</TableCell>
                                    <TableCell>Quyền</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    {
                                        currentUser.roles.includes('edit_user')?
                                            <TableCell style={{width:'30px'}}>Trạng thái</TableCell>
                                            :""
                                    }
                                    {
                                        currentUser.roles.includes('edit_user')||currentUser.roles.includes('delete_user')?
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
                                                   <div>{item.fullName}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.username}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.organization.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.role.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.phoneNumber}</div>
                                                </TableCell>
                                                {currentUser.roles.includes('edit_user')
                                                    ? <TableCell>
                                                            <div>
                                                                <Switch
                                                                    checked={!!item.isActive}
                                                                    onChange={()=>{
                                                                        handleChangeActiveUser(item.id,!item.isActive);
                                                                    }}
                                                                    inputProps={{ 'aria-label': 'controlled' }} />
                                                            </div>
                                                        </TableCell>:""
                                                }

                                                {
                                                    currentUser.roles.includes('edit_user')||currentUser.roles.includes('delete_user')?
                                                        <TableCell className={"action"}>
                                                            <div style={{display:'flex',justifyContent:'center'}} className={"icon-action"}>
                                                                {
                                                                    currentUser.roles.includes('edit_user')?
                                                                        <Tooltip title="Cập nhật"
                                                                                 onClick={()=>{navigate(`/user/update?id=${item.id}`)}}>
                                                                            <div><UpdateIcon/></div>
                                                                        </Tooltip> :""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('delete_user')?
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