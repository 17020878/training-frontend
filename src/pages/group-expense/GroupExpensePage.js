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
import ModalEditOrganization from "./ModalEditGroupExpense";
import {TreeSelect} from "primereact/treeselect";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import apiGroupExpense from "../../api/group-expense";
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";

export default function GroupExpensePage() {
    const currentUser = useSelector(state => state.currentUser)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel,setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const [listGroupExpense, setListGroupExpense] = useState([])
    const [listGroupExpenseTree, setListGroupExpenseTree] = useState([])
    const [currentOrganization, setCurrentOrganization] = useState({})
    const [listChildren, setListChildren] = useState([])
    const [selectedNodeKey, setSelectedNodeKey] = useState(0);
    const [expandedKeys, setExpandedKeys] = useState({0: true});
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [updateOrganization, setUpdateOrganization] = useState({
        name: '',
        code: '',
        description: '',
        parentId: null,
    })
    useEffect(() => {
        let children = [];
        for (let i = 0; i < listGroupExpense.length; i++) {
            if (selectedNodeKey == listGroupExpense[i].id) {
                setCurrentOrganization(listGroupExpense[i])
            }
            if (listGroupExpense[i].parentId == selectedNodeKey) {
                children.push(listGroupExpense[i])
            }
        }
        setListChildren(children)
    }, [selectedNodeKey, listGroupExpense])
    useEffect(() => {
        getGroupExpense().then(r => {
            setListGroupExpense(r.data)
            let convert = buildTreeAsset(r.data)
            setListGroupExpenseTree(convert)
        })
    }, [isRefresh])
    useEffect(() => {
        if (isUpdate) {

        }
    }, [isUpdate])
    const handleCloseModalEdit = () => {
        setIsUpdate(false)
        setOpenModalEdit(false)
    }
    const getGroupExpense = () => {
        return apiGroupExpense.getGroupExpense()
    }
    const deleteOrganizationApi = (body) => {
        return apiGroupExpense.deleteGroupExpense(body)
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
        }).then(r => {
            setIsRefresh(!isRefresh)
            toast.success("Xóa thành công")
        }).catch(e => {
            toast.error("Vui lòng xóa các phụ thuộc trước")
        })
    }
    return (
        <div className={'organization-wrapper'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete} handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>

            <ModalEditOrganization updateOrganization={updateOrganization} isRefresh={isRefresh}
                                   setIsRefresh={setIsRefresh} listGroupExpenseTree={listGroupExpenseTree}
                                   isUpdate={isUpdate} openModalEdit={openModalEdit}
                                   handleCloseModalEdit={handleCloseModalEdit}></ModalEditOrganization>
            <div className={'organization-header'}>
                <div className={'organization-header-title'}>
                    Nhóm chi phí
                </div>

                <div>
                    {
                        currentUser.roles.includes('create_group') ?
                            <Button onClick={() => {
                                setOpenModalEdit(true)
                            }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                Thêm nhóm chi phí
                            </Button> : ""
                    }

                </div>
            </div>
            <div className={'organization-content'}>
                <div className={'organization-left'}>
                    <Tree
                        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
                        selectionMode="single" selectionKeys={selectedNodeKey}
                        onSelectionChange={(e) => setSelectedNodeKey(e.value)} value={sortTreeData(listGroupExpenseTree)} filter
                        filterMode="strict" filterPlaceholder="Tìm kiếm" className="w-full md:w-30rem"/>
                </div>
                <div className={'organization-right'}>
                    <div className={'info-organization'}>
                        <div className={'organization-header-title'}>
                            {currentOrganization.name}
                            {
                                currentUser.roles.includes('edit_group') ?
                                    <Tooltip title={'Cập nhật'}>
                                        <DriveFileRenameOutlineIcon onClick={() => {
                                            setUpdateOrganization(currentOrganization);
                                            setIsUpdate(true)
                                            setOpenModalEdit(true)
                                        }}/>
                                    </Tooltip> : ""
                            }


                        </div>
                        <div className={'organization-group-info'}>
                            <div className={'organization-group-info-item'}>
                                <div className={'organization-group-info-item-label'}>Mã:</div>
                                <div className={'organization-group-info-item-value'}>{currentOrganization.code}</div>
                            </div>
                            <div className={'organization-group-info-item'}>
                                <div className={'organization-group-info-item-label'}>Ghi chú:</div>
                                <div
                                    className={'organization-group-info-item-value'}>{currentOrganization.description}</div>
                            </div>
                        </div>
                    </div>
                    <div className={'children-organization'}>
                        <div className={'table-content'}>
                            <div className={'table-content-title'}>
                                Nhóm con
                            </div>
                            <TableContainer className={'table-container'}>
                                <Table stickyHeader className={"table-custom"}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{width: '30px'}} align="center">STT</TableCell>
                                            <TableCell>Tên</TableCell>
                                            <TableCell>Mã</TableCell>
                                            <TableCell>Ghi chú</TableCell>
                                            {
                                                currentUser.roles.includes('edit_group') || currentUser.roles.includes('delete_group') ?
                                                    <TableCell className={"action-header"} style={{width: '50px'}}>Thao tác</TableCell>
                                                    : ""
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{overflowY: "auto"}}>
                                        {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                        {/*    <CircularProgress size={30}></CircularProgress>*/}
                                        {/*</div>*/}
                                        <div
                                            className={`message-table-empty ${listChildren.length === 0 ? 'mt-30' : 'hidden'}`}>Không
                                            có dữ liệu
                                        </div>
                                        {
                                            listChildren.map((item, index) => (
                                                <>
                                                    <TableRow>
                                                        <TableCell>
                                                            <div>{index + 1}</div>
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
                                                            currentUser.roles.includes('edit_group') || currentUser.roles.includes('delete_group')?
                                                                <TableCell className={"action"}>
                                                                    <div style={{display: 'flex', justifyContent: 'center'}}>
                                                                        {
                                                                            currentUser.roles.includes('edit_group')?
                                                                                <Tooltip title={"Cập nhật"}>
                                                                                    <EditIcon
                                                                                        style={{color: "#1e1e44", marginRight: "10px"}}
                                                                                        onClick={() => {
                                                                                            // navigate(`/role/update?id=${item.id}`)
                                                                                            setUpdateOrganization(item);
                                                                                            setIsUpdate(true);
                                                                                            setOpenModalEdit(true);
                                                                                        }}
                                                                                    ></EditIcon>
                                                                                </Tooltip>:""
                                                                        }
                                                                        {
                                                                            currentUser.roles.includes('delete_group')?
                                                                                <Tooltip title={"Xóa"}>
                                                                                    <DeleteForeverIcon onClick={() => {
                                                                                        setIdDel(item.id)
                                                                                        setOpenModalDelete(true)

                                                                                    }} color={"error"}>
                                                                                    </DeleteForeverIcon>
                                                                                </Tooltip>:""
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