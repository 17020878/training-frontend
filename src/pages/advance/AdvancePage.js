import {
    Button,
    CircularProgress, Divider, Menu, Pagination, Switch,
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
import {buildInputTree, buildTreeAsset, currencyFormatter, sortTreeData} from "../../constants/utils";
import {Tree} from "primereact/tree";
import {TreeSelect} from "primereact/treeselect";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import apiExpense from "../../api/expense";
import moment from "moment";
import FileDownload from "js-file-download";
import Axios from "axios";
import API_MAP from "../../constants/api";
import {useDispatch, useSelector} from "react-redux";
import apiGroupExpense from "../../api/group-expense";
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from "@mui/material/IconButton";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import SettingColumnTable from "../../components/SettingColumnTable";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {changeSettingColumnSlice, updateAdvanceSearch, updateExpenseSearch} from "../../store/user/userSlice";
import dayjs from "dayjs";
import apiTableConfig from "../../api/tableConfig";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import apiAdvance from "../../api/advance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ModalExpense from "./ModalExpense";
import icon from '../../assets/img/icon-advance.svg';

export default function AdvancePage() {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser)
    const [listGroupExpenseTree, setListGroupExpenseTree] = useState([])
    const navigate = useNavigate()
    const [listOrganization, setListOrganization] = useState([])
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [selectedGroupExpense, setSelectedGroupExpense] = useState(currentUser.advanceSearch.groupId)
    const [currentOrganization, setCurrentOrganization] = useState({})
    const [listChildren, setListChildren] = useState([])
    const [selectedNodeKey, setSelectedNodeKey] = useState(currentUser.advanceSearch.organizationId);
    const [expandedKeys, setExpandedKeys] = useState(currentUser.advanceSearch.organizationExpanded);
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [isRefreshConfigTable, setIsRefreshConfigTable] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [loadingExport, setLoadingExport] = useState(false)
    const [totalExpense, setTotalExpense] = useState(0)
    const [nameSearch, setNameSearch] = useState(currentUser.advanceSearch.name);
    const [groupExpenseId, setGroupExpenseId] = useState(null);
    const [pageSize, setPageSize] = useState(20)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalExpense, setOpenModalExpense] = useState(false)
    const [idDel, setIdDel] = useState(-1)
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [isInitialRenderOrganization, setIsInitialRenderOrganization] = useState(true);
    const [columns, setColumns] = useState([])
    const [sortField, setSortField] = useState(currentUser.advanceSearch.sortField);
    const [sortDirection, setSortDirection] = useState(currentUser.advanceSearch.sortDirection);
    const [currentAdvance, setCurrentAdvance] = useState({})
    const handleCloseModalExpense = () => {
        setOpenModalExpense(false)
    }
    const handleSort = (field) => {
        // Xử lý sự kiện nhấp vào tiêu đề cột
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    useEffect(() => {
        if (sortField != null && sortDirection != null) {
            submitSearch()
        }
    }, [sortField, sortDirection])
    const changeSettingColumn = (name, isCheck) => {

    }
    useEffect(() => {
        dispatch(updateAdvanceSearch({type: "name", data: nameSearch}))
    }, [nameSearch])
    // useEffect(() => {
    //     dispatch(updateExpenseSearch({type: "sortField", data: sortField}))
    // }, [sortField])
    // useEffect(() => {
    //     dispatch(updateExpenseSearch({type: "sortDirection", data: sortDirection}))
    // }, [sortDirection])
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const [timeSearch, setTimeSearch] = useState(
        currentUser.advanceSearch.time
    )
    const [updateOrganization, setUpdateOrganization] = useState({
        name: '',
        code: '',
        description: '',
        parentId: null,
    })

    const [anchorElSettingTable, setAnchorElSettingTable] = useState(null);
    const openSettingTable = Boolean(anchorElSettingTable);
    const handleClickNotification = (event) => {
        setAnchorElSettingTable(event.currentTarget);
    };
    const handleCloseNotification = () => {
        setAnchorElSettingTable(null);
    };
    useEffect(() => {
        if (!isInitialRender) {
            if (selectedNodeKey != null) {
                submitSearch();
            }
        } else {
            setIsInitialRender(false);
        }
    }, [currentPage])
    useEffect(() => {
        console.log("selectedNodeKey", selectedNodeKey)
        if (!isInitialRenderOrganization) {
            if (selectedNodeKey != null) {
                submitSearchDefault()
            }
        } else {
            setIsInitialRenderOrganization(false);
        }
        dispatch(updateAdvanceSearch({type: "organization", data: selectedNodeKey}))


    }, [selectedNodeKey])
    // useEffect(() => {
    //     dispatch(updateExpenseSearch({type: "group", data: selectedGroupExpense}))
    // }, [selectedGroupExpense])
    useEffect(() => {
        dispatch(updateAdvanceSearch({type: "organizationExpanded", data: expandedKeys}))
    }, [expandedKeys])
    useEffect(() => {
        dispatch(updateAdvanceSearch({type: "time", data: timeSearch}))
    }, [timeSearch])
    useEffect(() => {
        let checkExitOrganization = false;
        for (let i = 0; i < listOrganization.length; i++) {
            if (selectedNodeKey == listOrganization[i].id) {
                setCurrentOrganization(listOrganization[i])
                // console.log(1)
                // setExpandedKeys(
                //     {
                //         [listOrganization[i].id]: true
                //     }
                // )
                checkExitOrganization = true
            }
        }
        if (!checkExitOrganization) {
            let inputTree = buildInputTree(listOrganization)
            for (let i = 0; i < inputTree.length; i++) {
                if (inputTree[i].parentId == null) {
                    setSelectedNodeKey(inputTree[i].id)
                    setCurrentOrganization(inputTree[i])
                    setExpandedKeys(
                        {
                            [inputTree[i].id]: true
                        }
                    )

                }
            }
        }

    }, [listOrganization])
    useEffect(() => {
        getOrganization().then(r => {
            setListOrganization(r.data)
            let convert = buildTreeAsset(buildInputTree(r.data))
            setListOrganizationTree(convert)
        })


    }, [])
    // useEffect(()=>{
    //     getConfigTableApi().then(r => {
    //         console.log("config table", r)
    //         let list = r.data;
    //         list.sort((a, b) => a.index - b.index);
    //         console.log("list", list)
    //
    //         setColumns(list);
    //     })
    // },[isRefreshConfigTable])
    useEffect(() => {
        if (listOrganization.length > 0) {
            submitSearch()
        }
    }, [listOrganization, isRefresh])
    const submitSearchDefault = () => {
        setNameSearch("");
        setCurrentPage(1);
        setSelectedGroupExpense(0)
        setTimeSearch({
            start: (new dayjs).startOf("month"),
            end: (new dayjs).endOf("month"),
        })
        let children = [];
        getExpenseApi({
            organizationId: selectedNodeKey,
            name: "",
            startDate: (new dayjs).startOf("month"),
            endDate: (new dayjs).endOf("month"),
            groupExpenseId: 0,
            // groupExpenseId:
            pageSize: pageSize,
            pageIndex: 1,
            paging: true,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {
            if (r.data.responses) {
                let result = r.data.responses;
                // for (let i = 0; i < result.length; i++) {
                //     result[i].amount = currencyFormatter(result[i].amount)
                // }
                console.log("result", result)
                setListChildren(result);
                setTotalPage(r.data.page.total_pages)

            } else {
                setListChildren([]);
            }
        })

        getExpenseApi({

            organizationId: selectedNodeKey,
            name: nameSearch,
            groupExpenseId: 0,
            // groupExpenseId:
            startDate: (new dayjs).startOf("month"),
            endDate: (new dayjs).endOf("month"),
            pageSize: 1000,
            pageIndex: currentPage,
            paging: false,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {
            let total = 0;
            if (r.data.responses) {
                for (let i = 0; i < r.data.responses.length; i++) {
                    total = total + r.data.responses[i].amount;
                }

            }
            setTotalExpense(total)
        })
        for (let i = 0; i < listOrganization.length; i++) {
            if (selectedNodeKey == listOrganization[i].id) {
                setCurrentOrganization(listOrganization[i])

            }

        }
        setListChildren(children)
    }

    const submitSearch = () => {
        let children = [];
        console.log("1", timeSearch)
        getExpenseApi({
            organizationId: selectedNodeKey,
            name: nameSearch,
            groupExpenseId: selectedGroupExpense,
            // groupExpenseId:
            startDate: timeSearch.start != null ? timeSearch.start : null,
            endDate: timeSearch.end != null ? timeSearch.end : null,
            pageSize: pageSize,
            pageIndex: currentPage,
            paging: true,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {
            if (r.data.responses) {
                let result = r.data.responses;
                // for (let i = 0; i < result.length; i++) {
                //     result[i].amount = currencyFormatter(result[i].amount)
                //
                // }
                console.log("result", result)
                setListChildren(result);
                setTotalPage(r.data.page.total_pages)

            } else {
                setListChildren([]);
            }
        })
        getExpenseApi({

            organizationId: selectedNodeKey,
            name: nameSearch,
            groupExpenseId: selectedGroupExpense,
            // groupExpenseId:
            startDate: timeSearch.start != null ? timeSearch.start : null,
            endDate: timeSearch.end != null ? timeSearch.end : null,
            pageSize: 1000,
            pageIndex: currentPage,
            paging: false,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {
            let total = 0;
            if (r.data.responses) {
                for (let i = 0; i < r.data.responses.length; i++) {
                    total = total + r.data.responses[i].amount;
                }

            }
            setTotalExpense(total)
        })
        // setListChildren(children)
    }
    const handleChangeActive = (id, isActive) => {
        changeActiveApi({
            id: id,
            isActive: isActive
        }).then(r=>{
            setIsRefresh(!isRefresh)
        })
            .catch(e => {
                toast.error("Có lỗi xảy ra")
            })
    }

    const getOrganization = () => {
        return apiOrganization.getOrganizationByUser()
    }
    const getExpenseApi = (body) => {
        return apiAdvance.getAdvance(body)
    }
    const delExpenseApi = (body) => {
        return apiAdvance.deleteAdvance(body)
    }
    const changeActiveApi = (body) => {
        return apiAdvance.changeActive(body)
    }
    const downloadFile = (document) => {

        Axios.post(API_MAP.DOWNLOAD_EXPENSE, document, {
            // headers: {'Authorization': `Bearer ${currentUser.accessToken}`},
            headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`},
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`filename="`)[1].split(`"`)[0]
            FileDownload(response.data, nameFile);
        }).catch(e => {
        })
        // }

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
        if (idDel != -1)
            delExpenseApi({
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


    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete}
                             handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
            <ModalExpense openModal={openModalExpense} info={currentAdvance}
                          handleCloseModal={handleCloseModalExpense}></ModalExpense>
            <div className={'organization-content'} style={{}}>
                <div className={'organization-left'}>
                    <Tree
                        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
                        selectionMode="single" selectionKeys={selectedNodeKey}
                        onSelectionChange={(e) => setSelectedNodeKey(e.value)}
                        value={sortTreeData(listOrganizationTree)} filter
                        filterMode="strict" filterPlaceholder="Tìm kiếm" className="w-full md:w-30rem"/>
                </div>
                <div className={'organization-right'}>
                    <div className={'info-organization'}
                         style={{display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                        <div className={'organization-header-title'}>
                            {currentOrganization.name}
                            {/*<Tooltip title={'Cập nhật'}>*/}
                            {/*    <DriveFileRenameOutlineIcon onClick={() => {*/}
                            {/*        setUpdateOrganization(currentOrganization);*/}
                            {/*        setIsUpdate(true)*/}
                            {/*        setOpenModalEdit(true)*/}
                            {/*    }}/>*/}
                            {/*</Tooltip>*/}

                        </div>
                        <div>
                            {
                                currentUser.roles.includes('create_advance') ?
                                    <Button onClick={() => {
                                        navigate("/advance/create")
                                    }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                        Thêm tạm ứng
                                    </Button> : ""
                            }

                        </div>

                    </div>
                    <div className={'children-organization'}>
                        <div className={'table-content'} style={{marginTop: '10px'}}>
                            <div className={'table-search-btn'}
                                 style={{marginLeft: '10px', paddingBottom: '10px!important'}}>
                                <div style={{width: '20%'}}>
                                    <div className={'label-input'}>Tên</div>
                                    <TextField
                                        size={"small"}
                                        fullWidth
                                        value={nameSearch}
                                        onChange={(e) => {
                                            setNameSearch(e.target.value)
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                submitSearch()
                                            }
                                        }}
                                    />
                                </div>

                                <div style={{width: '30%', marginLeft: '20px'}}>
                                    <div className={'label-input'}>Khoảng thời gian</div>
                                    <div className={''} style={{display: "flex", alignItems: "center"}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                style={{height: '30px'}}
                                                inputFormat="DD-MM-YYYY"
                                                value={timeSearch.start}
                                                onChange={(values) => {
                                                    if (values != null) {
                                                        setTimeSearch({...timeSearch, start: values.startOf('day')})
                                                    } else {
                                                        setTimeSearch({...timeSearch, start: null})
                                                    }
                                                }}

                                                renderInput={(params) => <TextField size={"small"}  {...params} />}
                                            />
                                        </LocalizationProvider>
                                        <div style={{margin: '0 5px'}}>đến</div>
                                        <LocalizationProvider style={{width: '50px !important', height: '30px'}}
                                                              dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                style={{width: '50px !important', height: '30px'}}
                                                inputFormat="DD-MM-YYYY"
                                                value={timeSearch.end}
                                                onChange={(values) => {
                                                    if (values != null) {
                                                        setTimeSearch({...timeSearch, end: values.endOf('day')})
                                                    } else {
                                                        setTimeSearch({...timeSearch, end: null})
                                                    }
                                                }}
                                                // onChange={value => props.setFieldValue("founding_date", value)}
                                                renderInput={(params) => <TextField size={"small"}  {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div style={{marginLeft: "20px", marginTop: '16px'}}>
                                    <Button variant={"outlined"} onClick={submitSearch}>Tìm kiếm</Button>
                                </div>

                            </div>
                            <Divider></Divider>

                            <div className={'table-content-title'}
                                 style={{height: '30px', marginTop: '10px', marginBottom: '0px'}}>
                                Danh sách tạm ứng

                                <div style={{
                                    marginRight: '15px',
                                    paddingBottom: '5px',
                                    display: "flex",
                                    justifyContent: 'center'
                                }}>
                                    <div style={{marginLeft: '10px', marginRight: '10px'}}>

                                        {/*{*/}
                                        {/*    loadingExport ? <CircularProgress*/}
                                        {/*            size={25}></CircularProgress> :*/}
                                        {/*        <Tooltip title={"Xuất Excel"}>*/}
                                        {/*            <VerticalAlignBottomIcon onClick={exportSof}/>*/}

                                        {/*        </Tooltip>*/}
                                        {/*}*/}
                                        {/*<CircularProgress*/}
                                        {/*    size={20}></CircularProgress>*/}
                                        {/*<VerticalAlignBottomIcon onClick={exportSof}/>*/}
                                    </div>
                                    {/*{*/}

                                    {/*    loadingExport ? <div className={'loading-icon'}><CircularProgress*/}
                                    {/*            size={20}></CircularProgress></div> :*/}
                                    {/*        <div  style={{marginLeft: '10px', marginRight: '10px'}}>*/}
                                    {/*            <VerticalAlignBottomIcon onClick={exportSof}/></div>*/}
                                    {/*}*/}
                                    {/*<Tooltip title={"Cài đặt hiển thị"}>*/}
                                    {/*    <SettingsIcon onClick={handleClickNotification}/>*/}

                                    {/*</Tooltip>*/}
                                    {/*<IconButton onClick={handleClickNotification}>*/}
                                    {/*    <SettingsIcon/>*/}
                                    {/*</IconButton>*/}
                                </div>
                                <Menu
                                    id="icon-notification"
                                    anchorEl={anchorElSettingTable}
                                    open={openSettingTable}
                                    onClose={handleCloseNotification}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}>
                                    <SettingColumnTable columns={columns}
                                                        isRefreshConfigTable={isRefreshConfigTable}
                                                        setIsRefreshConfigTable={setIsRefreshConfigTable}
                                                        changeSettingColumn={changeSettingColumn}>

                                    </SettingColumnTable>

                                </Menu>
                            </div>
                            <Divider></Divider>
                            <div className={'sum-table'}>
                                <div className={'sum-table-label'}>
                                    Tổng số tiền:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(totalExpense)}&ensp;VNĐ
                                </div>
                            </div>

                            <TableContainer className={'table-container'}>
                                <Table stickyHeader className={"table-custom"}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{textAlign: 'center'}}>STT</TableCell>
                                            <TableCell
                                                style={{minWidth: "150px"}}>Ngày đề nghị</TableCell>
                                            <TableCell
                                                style={{minWidth: '150px'}}>Tên</TableCell>
                                            <TableCell
                                                style={{minWidth: '150px'}}>Số tiền</TableCell>
                                            <TableCell>Người tạo</TableCell>
                                            {
                                                currentUser.roles.includes('edit_advance') ?
                                                    <TableCell
                                                        style={{minWidth: '30px'}}>Trạng thái</TableCell> : ''
                                            }
                                            <TableCell>Chứng từ kèm theo</TableCell>

                                            <TableCell
                                                style={{minWidth: '150px'}}>Ghi chú</TableCell>
                                            {
                                                currentUser.roles.includes('edit_advance') || currentUser.roles.includes('delete_advance') ?
                                                    <TableCell className={"action-header"}>Thao tác</TableCell> : ""
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{overflowY: "auto", position: 'relative'}}>
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
                                                        <TableCell style={{textAlign: 'center'}}>
                                                            <div>{(currentPage - 1) * 20 + index + 1}</div>
                                                        </TableCell>
                                                        <TableCell
                                                        >
                                                            <div>{moment(item.date).format('DD-MM-YYYY')}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>{item.name}</div>
                                                        </TableCell>
                                                        <TableCell style={{textAlign: 'right'}}>
                                                            <div>{currencyFormatter(item.amount)}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>{item.fullName}</div>
                                                        </TableCell>
                                                        {currentUser.roles.includes('edit_advance')
                                                            ? <TableCell style={{textAlign: 'center'}}>
                                                                <div>
                                                                    <Switch
                                                                        checked={!!item.isActive}
                                                                        onChange={() => {
                                                                            handleChangeActive(item.id, !item.isActive);
                                                                        }}
                                                                        inputProps={{'aria-label': 'controlled'}}/>
                                                                </div>
                                                            </TableCell> : ""
                                                        }
                                                        <TableCell>
                                                            <div>
                                                                {
                                                                    item.documents.map(file => (
                                                                        <Tooltip title={"Tải về"}>
                                                                            <div onClick={() => {
                                                                                downloadFile(file)
                                                                            }}
                                                                                 className={'file-table'}> {file.name}</div>

                                                                        </Tooltip>
                                                                    ))
                                                                }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>{item.description}</div>
                                                        </TableCell>


                                                        {
                                                            currentUser.roles.includes('edit_advance') || currentUser.roles.includes('delete_advance') ?
                                                                <TableCell className={"action"}>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        <Tooltip title={"Hoàn ứng"}>
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }} onClick={() => {
                                                                                setCurrentAdvance(item)
                                                                                setOpenModalExpense(true)
                                                                            }
                                                                            }>
                                                                                <img style={{
                                                                                    width: '20px',
                                                                                    cursor: 'pointer',
                                                                                    marginRight: '10px'
                                                                                }} src={icon} alt=""/>
                                                                            </div>

                                                                            {/*/!*<EditIcon*!/*/}
                                                                            {/*    style={{*/}
                                                                            {/*        color: "#1e1e44",*/}
                                                                            {/*        marginRight: "10px"*/}
                                                                            {/*    }}*/}
                                                                            {/*    onClick={() => {*/}
                                                                            {/*        navigate(`/advance/update?id=${item.id}`)*/}
                                                                            {/*        setUpdateOrganization(item);*/}
                                                                            {/*        setIsUpdate(true);*/}
                                                                            {/*        setOpenModalEdit(true);*/}
                                                                            {/*    }}*/}
                                                                            {/*></EditIcon>*/}
                                                                        </Tooltip>
                                                                        {
                                                                            currentUser.roles.includes('edit_advance') ?
                                                                                <Tooltip title={"Cập nhật"}>
                                                                                    <EditIcon
                                                                                        style={{
                                                                                            color: "#1e1e44",
                                                                                            marginRight: "10px"
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            navigate(`/advance/update?id=${item.id}`)
                                                                                            setUpdateOrganization(item);
                                                                                            setIsUpdate(true);
                                                                                            setOpenModalEdit(true);
                                                                                        }}
                                                                                    ></EditIcon>
                                                                                </Tooltip> : ""
                                                                        }
                                                                        {
                                                                            currentUser.roles.includes('delete_advance') ?
                                                                                <Tooltip title={"Xóa"}>
                                                                                    <DeleteForeverIcon onClick={() => {
                                                                                        setIdDel(item.id);
                                                                                        setOpenModalDelete(true)
                                                                                        // delExpenseApi({
                                                                                        //     id: item.id
                                                                                        // }).then(r => {
                                                                                        //     setIsRefresh(!isRefresh)
                                                                                        //     toast.success("Xóa thành công")
                                                                                        // }).catch(e => {
                                                                                        //     toast.error("Đơn vị có chứa đơn vị trực thuộc hoặc người dùng")
                                                                                        // })
                                                                                    }} color={"error"}>
                                                                                    </DeleteForeverIcon>
                                                                                </Tooltip> : ""
                                                                        }


                                                                    </div>
                                                                </TableCell> : ""
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
                </div>
            </div>


        </div>)
}