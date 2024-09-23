import {
    Button, Checkbox,
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
import {useNavigate, useSearchParams} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiRole from "../../api/role";
export default function PermissionPage() {
    const navigate = useNavigate();
    const [result, setResult] = useState([])
    const [convertResult, setConvertResult] = useState([])
    const [location, setLocation] = useSearchParams();

    const [infoRole, setInfoRole] = useState({
        "id": 0,
        "name": "",
        "code": "",
        "description": "",
        "permissions":[]
    },)
    useEffect(() => {
        if (location.get('id')) {
            getRolePermissionApi({
                id: Number(location.get('id')),
            }).then(r => {
                setInfoRole(r.data)
            })
        } else navigate('/role')

    }, [location]);
    useEffect(()=>{
        getListPermissionApi().then(r=>{
            setResult(r.data)
        })
    },[])
    const checkPermission = () => {

    }
   useEffect(()=>{
       let copyResult = [...result];
       for(let i = 0;i<copyResult.length;i++){
           copyResult[i].isChecked = false;
           for (let j=0;j<infoRole.permissions.length;j++){
               if(copyResult[i].id === infoRole.permissions[j].id){
                   copyResult[i].isChecked = true;
                   break;
               }
           }
       }
       setConvertResult(copyResult);
   },[infoRole,result])
    const handleUpdate = () => {
      let ids = [];
      for(let i=0;i<convertResult.length;i++){
          if(convertResult[i].isChecked){
              ids.push(convertResult[i].id)
          }
      }
        setPermissionApi({
            roleId:infoRole.id,
            ids:ids
        }).then(r=>{
            toast.success("Phân quyền thành công")
        })
    }
    const backList = () => {
        navigate('/role')
    }
    const getRolePermissionApi = (body) => {
        return apiRole.getRolePermission(body);
    }
    const handleOnchangeCheckbox = (event,index) => {
      setConvertResult([...convertResult.slice(0,index),{...convertResult[index],isChecked:event.target.checked},...convertResult.slice(index+1)])
    }
    const getListPermissionApi = () => {
        return apiRole.getListPermission()
    }
    const setPermissionApi = (data) => {
        return apiRole.setPermission(data)
    }
    return (
        <div className={'main-content'}>
            <div className={'wrapper-table'}>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        Quản lý quyền:{" "+infoRole.name}
                        {/*<div>*/}
                        {/*    <Button onClick={()=>{navigate("/role/create")}} variant="outlined" startIcon={<ControlPointIcon />}>*/}
                        {/*        Thêm mới*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                    <TableContainer className={'table-container'}>
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{width:'20px'}}>STT</TableCell>
                                    <TableCell>Chức năng</TableCell>
                                    <TableCell>Mã chức năng</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    <TableCell style={{width:'30px',textAlign:"center"}}>Trạng thái</TableCell>
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
                                    convertResult.map((item,index)=>(
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                   <div>{index+1}</div>
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
                                                <TableCell>
                                                    <div style={{textAlign:"center"}}><Checkbox checked={item.isChecked} onClick={(event)=>{handleOnchangeCheckbox(event,index)}}></Checkbox></div>
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
                        justifyContent: 'center',
                        marginTop:"5px"
                    }}>
                        <div className={''} style={{display: "flex", justifyContent: "center"}}>
                            <Button style={{marginRight: '10px'}} onClick={backList}
                                    variant="outlined">Hủy</Button>
                            <Button variant="contained" onClick={handleUpdate}
                                    >Lưu</Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>)
}