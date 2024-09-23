import {
    Button,
    CircularProgress, Divider, Grid, Menu, MenuItem, Pagination, Select, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    TextField, Tooltip, Autocomplete
} from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';
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
import {buildInputTree, buildTreeAsset, currencyFormatter, getNameToId, sortTreeData} from "../../constants/utils";
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
import {changeSettingColumnSlice, updateExpenseSearch} from "../../store/user/userSlice";
import dayjs from "dayjs";
import apiTableConfig from "../../api/tableConfig";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import icon from "../../assets/img/icon-advance.svg";
import apiCategory from "../../api/category";
import {convertToAutoComplete} from "../../constants/common";
import apiAdvance from "../../api/advance";
import CloseIcon from "@mui/icons-material/Close";
import apiLineItem from "../../api/line-item";

export default function ExpensePage() {
    const [filterValue, setFilterValue] = useState('');
    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
        filterValue: filterValue,

    };
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser)
    const [listGroupExpenseTree, setListGroupExpenseTree] = useState([])
    const [expandedKeysGroupExpense, setExpandedKeysGroupExpense] = useState({0: true})
    const [selectedNodeKeysLineItem, setSelectedNodeKeysLineItem] = useState(null);
    const [expandedKeysLineItem, setExpandedKeysLineItem] = useState({0: true});
    const navigate = useNavigate()
    const [listOrganization, setListOrganization] = useState([])
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [selectedGroupExpense, setSelectedGroupExpense] = useState(currentUser.expenseSearch.groupId)
    const [currentOrganization, setCurrentOrganization] = useState({})
    const [listChildren, setListChildren] = useState([])
    const [listLineItem, setListLineItem] = useState([])
    const [selectedNodeKey, setSelectedNodeKey] = useState(currentUser.expenseSearch.organizationId);
    const [expandedKeys, setExpandedKeys] = useState(currentUser.expenseSearch.organizationExpanded);
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [isRefreshConfigTable, setIsRefreshConfigTable] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [loadingExport, setLoadingExport] = useState(false)
    const [loadingExportPay, setLoadingExportPay] = useState(false)
    const [totalExpense, setTotalExpense] = useState(0)
    const [nameSearch, setNameSearch] = useState(currentUser.expenseSearch.name);
    const [fullNameSearch, setFullNameSearch] = useState(currentUser.expenseSearch.fullName);
    const [groupExpenseId, setGroupExpenseId] = useState(null);
    const [pageSize, setPageSize] = useState(20)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel, setIdDel] = useState(-1)
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [isInitialRenderOrganization, setIsInitialRenderOrganization] = useState(true);
    const [columns, setColumns] = useState([])
    const [sortField, setSortField] = useState(currentUser.expenseSearch.sortField);
    const [sortDirection, setSortDirection] = useState(currentUser.expenseSearch.sortDirection);
    const [listPaymentType, setListPaymentType] = useState([])
    const [listPlan, setListPlan] = useState([])
    const [listPurpose, setListPurpose] = useState([])
    const [listOccurrence, setListOccurrence] = useState([])
    const [listUnitPay, setListUnitPay] = useState([])
    const [listClue, setListClue] = useState([])
    const [listAdvance,setListAdvance] = useState([])
    const [listLineItemTree, setListLineItemTree] = useState([])

    const [objectSearch, setObjectSearch] = useState({
        name: '',
        fullName: '',
        description: '',
        paymentTypeId:null,
        unitPayId:null,
        clueId:null,
        purposeId:null,
        occurrenceId:null,
        planId:null,
        bill:'',
        advanceId:"",
        advanceName:"",



    })
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
        dispatch(updateExpenseSearch({type: "name", data: nameSearch}))
    }, [nameSearch])
    useEffect(() => {
        dispatch(updateExpenseSearch({type: "fullName", data: fullNameSearch}))
    }, [fullNameSearch])
    useEffect(() => {
        dispatch(updateExpenseSearch({type: "sortField", data: sortField}))
    }, [sortField])
    useEffect(() => {
        dispatch(updateExpenseSearch({type: "sortDirection", data: sortDirection}))
    }, [sortDirection])
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const [timeSearch, setTimeSearch] = useState(
        currentUser.expenseSearch.time
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
        dispatch(updateExpenseSearch({type: "organization", data: selectedNodeKey}))


    }, [selectedNodeKey])
    useEffect(() => {
        dispatch(updateExpenseSearch({type: "group", data: selectedGroupExpense}))
    }, [selectedGroupExpense])
    useEffect(() => {
        dispatch(updateExpenseSearch({type: "organizationExpanded", data: expandedKeys}))
    }, [expandedKeys])
    useEffect(() => {
        dispatch(updateExpenseSearch({type: "time", data: timeSearch}))
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
        getGroupExpense().then(r => {
            let convert = buildTreeAsset(r.data)
            setListGroupExpenseTree(convert)
        })

    }, [])
    useEffect(() => {
        getConfigTableApi().then(r => {
            console.log("config table", r)
            let list = r.data;
            list.sort((a, b) => a.index - b.index);
            console.log("list", list)

            setColumns(list);
        })
    }, [isRefreshConfigTable])
    useEffect(() => {
        if (listOrganization.length > 0 && listGroupExpenseTree.length > 0) {
            submitSearch()
        }
    }, [listOrganization, listGroupExpenseTree, isRefresh])
    const submitSearchDefault = () => {
        setNameSearch("");
        setFullNameSearch("");
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
            fullName: "",
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
                for (let i = 0; i < result.length; i++) {
                    result[i].date = moment(result[i].date).format('DD-MM-YYYY')
                    result[i].payDate = moment(result[i].payDate).format('DD-MM-YYYY')
                    result[i].group = result[i].groupExpense.name
                    result[i].unitSpend = result[i].unitSpend.name
                    result[i].occurrence = result[i].occurrence.name
                    result[i].plan = result[i].plan.name
                    result[i].purpose = result[i].purpose.name
                    result[i].unitPay = result[i].unitPay.name
                    result[i].amount = currencyFormatter(result[i].amount)
                    result[i].clue = result[i].clue != null ? result[i].clue.name : ""
                    result[i].paymentType = result[i].paymentType != null ? result[i].paymentType.name : ""
                    result[i].advance = result[i].advance != null ? result[i].advance.name : ""
                    result[i].lineItem = result[i].lineItem != null ? result[i].lineItem.code : ""

                }
                console.log("result", result)
                setListChildren(result);
                setTotalPage(r.data.page.total_pages)

            } else {
                setListChildren([]);
            }
        })

        getExpenseApi({

            organizationId: selectedNodeKey,
            name: "",
            fullName: "",
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
    }
    const submitSearch = () => {
        let children = [];
        console.log("1", timeSearch)
        getExpenseApi({
            organizationId: selectedNodeKey,
            name: nameSearch,
            fullName: fullNameSearch,
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
                for (let i = 0; i < result.length; i++) {
                    result[i].date = moment(result[i].date).format('DD-MM-YYYY')
                    result[i].payDate = moment(result[i].payDate).format('DD-MM-YYYY')
                    result[i].group = result[i].groupExpense.name
                    result[i].unitSpend = result[i].unitSpend.name
                    result[i].occurrence = result[i].occurrence.name
                    result[i].plan = result[i].plan.name
                    result[i].purpose = result[i].purpose.name
                    result[i].unitPay = result[i].unitPay.name
                    result[i].amount = currencyFormatter(result[i].amount)
                    result[i].clue = result[i].clue != null ? result[i].clue.name : ""
                    result[i].paymentType = result[i].paymentType != null ? result[i].paymentType.name : ""
                    result[i].advance = result[i].advance != null ? result[i].advance.name : ""
                    result[i].lineItem = result[i].lineItem != null ? result[i].lineItem.code : ""

                }
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
            fullName: fullNameSearch,
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
    }
    const handleCloseModalEdit = () => {
        setIsUpdate(false)
        setOpenModalEdit(false)
    }
    const getGroupExpense = () => {
        return apiGroupExpense.getGroupExpense()
    }
    const getOrganization = () => {
        return apiOrganization.getOrganizationByUser()
    }
    const getExpenseApi = (body) => {
        return apiExpense.getExpense(body)
    }
    const delExpenseApi = (body) => {
        return apiExpense.deleteExpense(body)
    }
    const getConfigTableApi = (body) => {
        return apiTableConfig.get(body)
    }
    const getLineItem= () => {
        return apiLineItem.getLineItem()
    }
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
    const exportSof = () => {
        setLoadingExport(true)
        Axios.post(API_MAP.EXPORT_EXCEL_EXPENSE, {
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
    const exportExcelPay = (id) => {
        setLoadingExportPay(true)
        // setLoadingExport(true)
        Axios.post(API_MAP.EXPORT_EXCEL_PAY, {
            id: id,
        }, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`},
            responseType: 'blob'
        }).then(response => {
            setLoadingExportPay(false)
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);

        }).catch(e => {
            setLoadingExportPay(false)
        })
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }
    const getListAdvance = () => {
        return apiAdvance.getAdvanceAll()
    }
    useEffect(() => {
        getCategoryApi({
            paging: false,
            type: "Clue"
        }).then(r => {
            setListClue(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,clue:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "Occurrence"
        }).then(r => {
            setListOccurrence(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,occurrence:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "PaymentType"
        }).then(r => {
            setListPaymentType(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,paymentType:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "Plan"
        }).then(r => {
            setListPlan(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,plan:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "Purpose"
        }).then(r => {
            setListPurpose(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,purpose:{id:r.data.responses[0].id}})
            // }
        })
        getCategoryApi({
            paging: false,
            type: "UnitPay"
        }).then(r => {
            setListUnitPay(r.data.responses)
            // if(!isUpdate){
            //     setInfo({...info,unitPay:{id:r.data.responses[0].id}})
            // }
        })
        getListAdvance().then(r=>{
            let result = [];
            for (let i = 0;i<r.data.length;i++){
                if(r.data[i].isActive==true){
                    let item = r.data[i];
                    item.name = moment(r.data[i].date).format('DD-MM-YYYY')+": "+r.data[i].name
                    result.push(r.data[i])
                }
            }
            setListAdvance(convertToAutoComplete(result,'name'))
        })
        //
        getLineItem().then(r => {
            let result = r.data;
            console.log("result1",result)
            for (let i =0;i<result.length;i++){
                result[i].name=result[i].code+": "+result[i].name
            }
            console.log("result2",result)

            setListLineItem(result)
            let convert = buildTreeAsset(result)
            setListLineItemTree(convert)
            if (!isUpdate) {
                let inputTree = buildInputTree(buildInputTree(result))
                for (let i = 0; i < inputTree.length; i++) {
                    if (inputTree[i].parentId == null) {
                        // setSelectedNodeKeysLineItem(inputTree[i].id)
                        setExpandedKeysLineItem(
                            {
                                [inputTree[i].id]: true
                            }
                        )
                    }
                }
            }
        })

    }, [])

    const renderFilterSearch = (code) => {
        if (code == "name") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.name}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, name: e.target.value})
                            }}
                            // onKeyDown={(event) => {
                            //     if (event.key === 'Enter') {
                            //         submitSearch()
                            //     }
                            // }}
                        />
                    </div>

                </TableCell>

            )
        }
        if (code == "bill") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.bill}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, bill: e.target.value})
                            }}
                            // onKeyDown={(event) => {
                            //     if (event.key === 'Enter') {
                            //         submitSearch()
                            //     }
                            // }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "fullName") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.fullName}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, fullName: e.target.value})
                            }}
                            // onKeyDown={(event) => {
                            //     if (event.key === 'Enter') {
                            //         submitSearch()
                            //     }
                            // }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "description") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.description}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, description: e.target.value})
                            }}
                            // onKeyDown={(event) => {
                            //     if (event.key === 'Enter') {
                            //         submitSearch()
                            //     }
                            // }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == 'group') {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '200px', maxWidth: '200px', top: 41}}>
                    <div>
                        <TreeSelect
                            {...filterOptions} filterMode="strict"
                            // filterMode="strict"
                            value={selectedGroupExpense}
                            onChange={(e) => {
                                setSelectedGroupExpense(e.value)
                            }}
                            options={sortTreeData(listGroupExpenseTree)}
                            expandedKeys={expandedKeysGroupExpense}
                            onToggle={(e) => setExpandedKeysGroupExpense(e.value)}
                            style={{width: '100%', zIndex: '1000000 !important', overflow: 'auto'}}
                            className="md:w-20rem w-full"
                            placeholder="Tất cả nhóm chi phí"></TreeSelect>
                    </div>

                </TableCell>

            )
        }
        else if(code=="paymentType"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <FormControl fullWidth>
                    <Select
                        value={objectSearch.paymentTypeId}
                        onChange={(event) => {
                            if (event.target.value) {
                                if( event.target.value==-1){
                                    setObjectSearch({...objectSearch,paymentTypeId:null})
                                }else
                                    setObjectSearch({...objectSearch,paymentTypeId:event.target.value})
                            }
                        }}
                        size={"small"}>
                        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                        {
                            listPaymentType.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>)
        }
        else if(code=="clue"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <FormControl fullWidth>
                    <Select
                        value={objectSearch.clueId}
                        onChange={(event) => {
                            if (event.target.value) {
                                if( event.target.value==-1){
                                    setObjectSearch({...objectSearch,clueId:null})
                                }else
                                    setObjectSearch({...objectSearch,clueId:event.target.value})
                            }
                        }}
                        size={"small"}>
                        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                        {
                            listClue.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>)
        }
        else if(code=="unitPay"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <FormControl fullWidth>
                    <Select
                        value={objectSearch.unitPayId}
                        onChange={(event) => {
                            if (event.target.value) {
                                if( event.target.value==-1){
                                    setObjectSearch({...objectSearch,unitPayId:null})
                                }else
                                    setObjectSearch({...objectSearch,unitPayId:event.target.value})
                            }
                        }}
                        size={"small"}>
                        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                        {
                            listUnitPay.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>)
        }
        else if(code=="purpose"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <FormControl fullWidth>
                    <Select
                        value={objectSearch.purposeId}
                        onChange={(event) => {
                            if (event.target.value) {
                                if( event.target.value==-1){
                                    setObjectSearch({...objectSearch,purposeId:null})
                                }else
                                    setObjectSearch({...objectSearch,purposeId:event.target.value})
                            }
                        }}
                        size={"small"}>
                        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                        {
                            listPurpose.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>)
        }
        else if(code=="occurrence"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <FormControl fullWidth>
                    <Select
                        value={objectSearch.occurrenceId}
                        onChange={(event) => {
                            if (event.target.value) {
                                if( event.target.value==-1){
                                    setObjectSearch({...objectSearch,occurrenceId:null})
                                }else
                                    setObjectSearch({...objectSearch,occurrenceId:event.target.value})
                            }
                        }}
                        size={"small"}>
                        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                        {
                            listOccurrence.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>)
        }
        else if(code=="plan"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <FormControl fullWidth>
                    <Select
                        value={objectSearch.planId}
                        onChange={(event) => {
                            if (event.target.value) {
                                if( event.target.value==-1){
                                    setObjectSearch({...objectSearch,planId:null})
                                }else
                                    setObjectSearch({...objectSearch,planId:event.target.value})
                            }
                        }}
                        size={"small"}>
                        <MenuItem value={-1}><div className={'none-select'}>--&ensp;Để trống&ensp;--</div></MenuItem>
                        {
                            listPlan.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>)
        }
        else if(code=="advance"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <Autocomplete
                    // disablePortal
                    id="combo-box-demo"
                    options={listAdvance}
                    value={{
                        id: objectSearch.advanceId,
                        label: objectSearch.advanceName
                    }
                    }

                    renderInput={(params) => < TextField  {...params}
                                                          id='advanceId'
                                                          name='advanceId'
                                                          placeholder=""
                                                     />}
                    size={"small"}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setObjectSearch({...objectSearch,advanceId:newValue.id,advanceName:newValue.label})

                        } else {
                            setObjectSearch({...objectSearch,advanceId:'',advanceName:''})
                        }
                    }}
                />
            </TableCell>)
        }
        else if(code=="lineItem"){
            return(
            <TableCell className={"filter-table"} style={{minWidth: '200px',maxWidth: '200px', top: 41}}>
                <div className={'custom-tree-select'}>
                    <TreeSelect
                        {...filterOptions} filterMode="strict"
                        // filterMode="strict"
                        value={selectedNodeKeysLineItem}
                        onChange={(e) => {
                            setSelectedNodeKeysLineItem(e.value)
                        }}
                        options={sortTreeData(listLineItemTree)}
                        expandedKeys={expandedKeysLineItem}
                        onToggle={(e) => setExpandedKeysLineItem(e.value)}
                        style={{width: '100%', zIndex: '1000000 !important', overflow: 'auto'}}
                        className="md:w-20rem w-full"
                        placeholder="Khoản mục"
                        showClear
                        filterInputProps={{ allowSpaces: true }}
                    ></TreeSelect>
                    {
                        selectedNodeKeysLineItem!=null?
                            <div onClick={()=>{
                                setSelectedNodeKeysLineItem(null)}
                            } className={'clear-tree-select'}>

                                <CloseIcon style={{color:"#6c757d"}}/>
                            </div>:''
                    }

                </div>
            </TableCell>)
        }
        else return (
            <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
            </TableCell>
        )
    }
    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete}
                             handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
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
                                currentUser.roles.includes('create_expense') ?
                                    <Button onClick={() => {
                                        navigate("/expense/create")
                                    }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                        Thêm chi phí
                                    </Button> : ""
                            }

                        </div>

                    </div>
                    <div className={'children-organization'}>
                        <div className={'table-content'} style={{marginTop: '10px'}}>
                            <div className={'table-search-btn'}
                                 style={{marginLeft: '10px', paddingBottom: '10px!important'}}>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <div>
                                            <div className={'label-input'}>Khoảng thời gian</div>
                                            <div className={''} style={{display: "flex", alignItems: "center"}}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopDatePicker
                                                        style={{height: '30px'}}
                                                        inputFormat="DD-MM-YYYY"
                                                        value={timeSearch.start}
                                                        onChange={(values) => {
                                                            if (values != null) {
                                                                setTimeSearch({
                                                                    ...timeSearch,
                                                                    start: values.startOf('day')
                                                                })
                                                            } else {
                                                                setTimeSearch({...timeSearch, start: null})
                                                            }
                                                        }}

                                                        renderInput={(params) => <TextField
                                                            size={"small"}  {...params} />}
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
                                                        renderInput={(params) => <TextField
                                                            size={"small"}  {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <div style={{display: 'flex', marginTop: '17px', alignItems: 'center'}}>
                                            <Button variant={"outlined"} onClick={submitSearch}>Tìm kiếm</Button>
                                        </div>
                                    </Grid>
                                </Grid>

                            </div>
                            <Divider></Divider>

                            <div className={'table-content-title'}
                                 style={{height: '30px', marginTop: '10px', marginBottom: '0px'}}>
                                Danh sách chi phí

                                <div style={{
                                    marginRight: '15px',
                                    paddingBottom: '5px',
                                    display: "flex",
                                    justifyContent: 'center'
                                }}>
                                    <div style={{marginLeft: '10px', marginRight: '10px'}}>

                                        {
                                            loadingExport ? <CircularProgress
                                                    size={25}></CircularProgress> :
                                                <Tooltip title={"Xuất Excel"}>
                                                    <VerticalAlignBottomIcon onClick={exportSof}/>

                                                </Tooltip>
                                        }
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
                                    <Tooltip title={"Cài đặt hiển thị"}>
                                        <SettingsIcon onClick={handleClickNotification}/>

                                    </Tooltip>
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
                                    Tổng chi phí:&ensp;
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
                                            {columns.map((column, index) => (
                                                column.visible &&
                                                <TableCell style={{minWidth: '150px', cursor: 'pointer'}}
                                                           key={index}
                                                           onClick={() => handleSort(column.code)}
                                                >
                                                    <div className={'flex'} style={{
                                                        cursor: 'pointer',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        {column.name}
                                                        {sortField === column.code && (
                                                            sortDirection === 'asc'
                                                                ? <ArrowUpwardIcon
                                                                    style={{display: 'block', fontSize: '18px'}}/>
                                                                : <ArrowDownwardIcon
                                                                    style={{display: 'block', fontSize: '18px'}}/>
                                                        )}
                                                    </div>


                                                </TableCell>
                                            ))}
                                            {
                                                currentUser.roles.includes('edit_expense') || currentUser.roles.includes('delete_expense') ?
                                                    <TableCell className={"action-header"}>Thao tác</TableCell> : ""
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={"filter-table"}
                                                       style={{textAlign: 'center', top: 41}}></TableCell>
                                            {columns.map((column, index) => {
                                                    if (column.visible)
                                                        return (
                                                            renderFilterSearch(column.code)
                                                        )
                                                }
                                            )}
                                            {
                                                currentUser.roles.includes('edit_expense') || currentUser.roles.includes('delete_expense') ?
                                                    <TableCell style={{top: 41}}
                                                               className={"action-header filter-table"}></TableCell> : ""
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
                                                        {columns.map((column, columnIndex) => {
                                                                if (column.visible) {
                                                                    if (column.code == 'file') {
                                                                        return <TableCell>
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
                                                                    } else if (column.code == 'amount') {
                                                                        return <TableCell
                                                                            style={{textAlign: 'right'}}>{item[column.code]}</TableCell>
                                                                    } else return <TableCell>{item[column.code]}</TableCell>
                                                                } else return ""
                                                            }
                                                        )}

                                                        {
                                                            currentUser.roles.includes('edit_expense') || currentUser.roles.includes('delete_expense') ?
                                                                <TableCell className={"action"}>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        {loadingExportPay ?
                                                                            <Tooltip title={"Đề nghị thanh toán"}>
                                                                                <img
                                                                                    onClick={() => {
                                                                                        // exportExcelPay(item.id)
                                                                                        // navigate(`/expense/update?id=${item.id}`)
                                                                                        // setUpdateOrganization(item);
                                                                                        // setIsUpdate(true);
                                                                                        // setOpenModalEdit(true);
                                                                                    }}
                                                                                    style={{
                                                                                        width: '26px',
                                                                                        cursor: 'pointer',
                                                                                        marginRight: '10px'
                                                                                    }}
                                                                                    src={require('../../assets/img/sheet.png')}
                                                                                    alt=""/>
                                                                            </Tooltip> :
                                                                            <Tooltip title={"Đề nghị thanh toán"}>
                                                                                <img
                                                                                    onClick={() => {
                                                                                        exportExcelPay(item.id)
                                                                                        // navigate(`/expense/update?id=${item.id}`)
                                                                                        // setUpdateOrganization(item);
                                                                                        // setIsUpdate(true);
                                                                                        // setOpenModalEdit(true);
                                                                                    }}
                                                                                    style={{
                                                                                        width: '26px',
                                                                                        cursor: 'pointer',
                                                                                        marginRight: '10px'
                                                                                    }}
                                                                                    src={require('../../assets/img/sheet.png')}
                                                                                    alt=""/>
                                                                            </Tooltip>
                                                                        }

                                                                        {
                                                                            currentUser.roles.includes('edit_expense') ?
                                                                                <Tooltip title={"Cập nhật"}>
                                                                                    <EditIcon
                                                                                        style={{
                                                                                            color: "#1e1e44",
                                                                                            marginRight: "10px"
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            navigate(`/expense/update?id=${item.id}`)
                                                                                            setUpdateOrganization(item);
                                                                                            setIsUpdate(true);
                                                                                            setOpenModalEdit(true);
                                                                                        }}
                                                                                    ></EditIcon>
                                                                                </Tooltip> : ""
                                                                        }
                                                                        {
                                                                            currentUser.roles.includes('delete_expense') ?
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