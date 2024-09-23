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
import apiOrganization from "../../api/organization";
import {buildTreeAsset, sortTreeData} from "../../constants/utils";
import {Tree} from "primereact/tree";
import ModalEditOrganization from "./ModalEditOrganization";
import {TreeSelect} from "primereact/treeselect";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {DeleteIcon, UpdateIcon} from "../../constants/icon-define";
export default function OrganizationPage() {
    const currentUser = useSelector(state => state.currentUser)
    const [listOrganization,setListOrganization]= useState([])
    const [listOrganizationTree,setListOrganizationTree]= useState([])
    const [currentOrganization,setCurrentOrganization]= useState({})
    const [listChildren,setListChildren]= useState([])
    const [selectedNodeKey, setSelectedNodeKey] = useState(0);
    const [expandedKeys, setExpandedKeys] = useState({0: true});
    const [openModalEdit,setOpenModalEdit] = useState(false)
    const [isUpdate,setIsUpdate] = useState(false)
    const [isRefresh,setIsRefresh] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel,setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const [updateOrganization,setUpdateOrganization] = useState({
        name: '',
        code: '',
        description: '',
        parentId: null,
    })
    useEffect(()=>{
        let children = [];
        for(let i=0;i<listOrganization.length;i++) {
            if(selectedNodeKey==listOrganization[i].id){
                setCurrentOrganization(listOrganization[i])
            }
            if(listOrganization[i].parentId ==selectedNodeKey ){
                children.push(listOrganization[i])
            }
        }
        setListChildren(children)
    },[selectedNodeKey,listOrganization])
    useEffect(()=>{
        getOrganization().then(r=>{
            setListOrganization(r.data)
            let convert = buildTreeAsset(r.data)
            setListOrganizationTree(convert)
        })
    },[isRefresh])
    useEffect(()=>{
        if(isUpdate){

        }
    },[isUpdate])
    const handleCloseModalEdit = () => {
        setIsUpdate(false)
        setOpenModalEdit(false)
    }
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
    const deleteOrganizationApi = (body) => {
        return apiOrganization.deleteOrganization(body)
    }
    const [filterValue, setFilterValue] = useState('');

    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
        filterValue: filterValue,

    };
    const submitDel = () => {
        deleteOrganizationApi({
            id: idDel
        }).then(r=>{
            setIsRefresh(!isRefresh)
            toast.success("Xóa thành công")
        }).catch(e=>{
            toast.error("Đơn vị có chứa đơn vị trực thuộc hoặc người dùng")
        })
    }
    return (
        <div className={'organization-wrapper'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete} handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
            <ModalEditOrganization updateOrganization={updateOrganization} isRefresh={isRefresh} setIsRefresh={setIsRefresh}  listOrganizationTree={listOrganizationTree} isUpdate={isUpdate} openModalEdit={openModalEdit} handleCloseModalEdit={handleCloseModalEdit}></ModalEditOrganization>
            <div className={'organization-header'}>
                <div className={'organization-header-title'}>
                    Cơ cấu tổ chức
                </div>

                <div>
                    {
                        currentUser.roles.includes('create_organization')?
                            <Button onClick={()=>{setOpenModalEdit(true)}} variant="outlined" startIcon={<ControlPointIcon />}>
                                Thêm cơ cấu
                            </Button>:""
                    }

                </div>
            </div>
            <div className={'organization-content'}>
                <div className={'organization-left'}>
                    <Tree
                        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
                        selectionMode="single" selectionKeys={selectedNodeKey} onSelectionChange={(e) => setSelectedNodeKey(e.value)}  value={sortTreeData(listOrganizationTree)} filter filterMode="strict" filterPlaceholder="Tìm kiếm" className="w-full md:w-30rem" />
                </div>
                <div className={'organization-right'}>
                    <div className={'info-organization'}>
                        <div className={'organization-header-title'}>
                            {currentOrganization.name}
                            {
                                currentUser.roles.includes('edit_organization')?
                                    <Tooltip title={'Cập nhật'}>
                                        <DriveFileRenameOutlineIcon onClick={()=>{
                                            setUpdateOrganization(currentOrganization);
                                            setIsUpdate(true)
                                            setOpenModalEdit(true)
                                        }}/>
                                    </Tooltip>:""
                            }


                        </div>
                        <div className={'organization-group-info'}>
                            <div className={'organization-group-info-item'}>
                                <div className={'organization-group-info-item-label'}>Mã đơn vị:</div>
                                <div className={'organization-group-info-item-value'}>{currentOrganization.code}</div>
                            </div>
                            <div className={'organization-group-info-item'}>
                                <div className={'organization-group-info-item-label'}>Ghi chú: </div>
                                <div className={'organization-group-info-item-value'}>{currentOrganization.description}</div>
                            </div>
                        </div>
                    </div>
                    <div className={'children-organization'}>
                        <div className={'table-content'}>
                            <div className={'table-content-title'}>
                                Đơn vị trực thuộc
                            </div>
                            <TableContainer className={'table-container'}>
                                <Table stickyHeader className={"table-custom"}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{width:'30px'}} align="center">STT</TableCell>
                                            <TableCell>Tên đơn vị</TableCell>
                                            <TableCell>Mã đơn vị</TableCell>
                                            <TableCell>Ghi chú</TableCell>
                                            {
                                                currentUser.roles.includes('edit_organization')||currentUser.roles.includes('delete_organization')?
                                                    <TableCell className={"action-header"} style={{width:'150px'}}>Thao tác</TableCell>:""
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{overflowY: "auto"}}>
                                        {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                        {/*    <CircularProgress size={30}></CircularProgress>*/}
                                        {/*</div>*/}
                                        <div
                                            className={`message-table-empty ${listChildren.length === 0  ? 'mt-30' : 'hidden'}`}>Không
                                            có dữ liệu
                                        </div>
                                        {
                                            listChildren.map((item,index)=>(
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
                                                        {
                                                            currentUser.roles.includes('edit_organization')||currentUser.roles.includes('delete_organization')?
                                                                <TableCell className={"action"}>
                                                                    <div style={{display:'flex',justifyContent:'center'}} className={"icon-action"}>
                                                                        {
                                                                            currentUser.roles.includes('edit_organization')?
                                                                                <Tooltip title="Cập nhật"
                                                                                         onClick={()=>{
                                                                                             setUpdateOrganization(item);
                                                                                             setIsUpdate(true);
                                                                                             setOpenModalEdit(true);
                                                                                         }}>
                                                                                    <div><UpdateIcon/></div>
                                                                                </Tooltip>:""
                                                                        }
                                                                        {
                                                                            currentUser.roles.includes('delete_organization')?
                                                                                <Tooltip className={'deleteButton'} title="Xóa"
                                                                                         onClick={()=>{
                                                                                             setIdDel(item.id)
                                                                                             setOpenModalDelete(true)

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

                        </div>

                    </div>
                </div>
            </div>

        </div>)
}