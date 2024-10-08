import {
    Box,
    Button, Checkbox, CircularProgress, Divider,
    Grid, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
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
import Utils, {
    buildInputTree,
    buildTreeAsset, checkIdInArray, checkIdInListObject, convertArr, deleteIdInArray,
    getDateTimeFromTimestamp,
    getNameToId, getNodeType,
    sortTreeData
} from "../../constants/utils";
import {Tree} from "primereact/tree";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SearchIcon from "@mui/icons-material/Search";
import {sexData} from "../../constants/json_define";
import {DeleteIcon, UpdateIcon} from "../../constants/icon-define";
import {updateAdvanceSearch} from "../../store/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import apiStudent from "../../api/student";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ModalAddStudent from "./ModalAddStudent";
import ModalConfirmDel from "../../components/ModalConfirmDelete";

const ModalListStudent = (props) => {
    const {openModalEdit, handleCloseModalEdit, handleUpdateListStudent, listStudentsParent,listOrganizations,studentObjects,listUnitOrganizations} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.currentUser)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [page, setPage] = React.useState(0);
    const [listStudents, setListStudents] = React.useState([]);
    const [listUnitOrganization, setListUnitOrganization] = React.useState([]);
    const [studentObject, setStudentObject] = React.useState([]);
    const [openModalDel, setOpenModalDel] = useState(false)
    const [studentId, setStudentId] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [inputSearch, setInputSearch] = useState('')
    const [openModalAddStudent, setOpenModalAddStudent] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 1000,
        rows: [],
        total: 0
    });
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [currentOrganization, setCurrentOrganization] = useState({})
    const [selectedNodeKey, setSelectedNodeKey] = useState(currentUser.advanceSearch.organizationId);
    const [expandedKeys, setExpandedKeys] = useState(currentUser.advanceSearch.organizationExpanded);
    const [isInitialRenderOrganization, setIsInitialRenderOrganization] = useState(false);
//=====================================================================================================
    useEffect(() => {
        setListStudents(listStudentsParent)
    },[listStudentsParent])
    useEffect(() => {
        setStudentObject(studentObjects)
    },[studentObjects])
    useEffect(() => {
        setListUnitOrganization(listUnitOrganizations)
    },[listUnitOrganizations])
    useEffect(() => {
        setListOrganization(listOrganizations)
        let convert = buildTreeAsset(buildInputTree(listOrganizations))
        setListOrganizationTree(convert)
    },[listOrganizations])
    // useEffect(() => {
    //     getOrganization().then(r => {
    //         setListOrganization(r.data)
    //         let convert = buildTreeAsset(buildInputTree(r.data))
    //         setListOrganizationTree(convert)
    //     })
    // },[])
    useEffect(() => {
        if(openModalEdit){
            if (!isInitialRenderOrganization) {
                if (selectedNodeKey != null) {
                    submitSearchDefault()
                }
            } else {
                setIsInitialRenderOrganization(false);
            }
        }
        //dispatch(updateAdvanceSearch({type: "organization", data: selectedNodeKey}))
    }, [selectedNodeKey, inputSearch,openModalEdit])
    useEffect(() => {
        //dispatch(updateAdvanceSearch({type: "organizationExpanded", data: expandedKeys}))
    }, [expandedKeys])
    const submitSearchDefault = () => {
        searchStudentApi({
            "organizationId": selectedNodeKey,
            'page': listResult.page,
            'size': listResult.pageSize,
            'name': inputSearch,
            'type': getNodeType(selectedNodeKey,listOrganization)
        }).then(r => {
            setLoading(false)
            let arr;
            arr = convertArr(r.data.content, listResult)
            setListResult({...listResult, rows: (arr.filter(employee =>
                    studentObject.some(student => student.id === employee.studentObject.id)  &&
                    listUnitOrganization.some(unit => unit.id === employee.unitOrganization.id)
                )), total: r.data.totalElements});
        })
        for (let i = 0; i < listOrganization.length; i++) {
            if (selectedNodeKey == listOrganization[i].id) {
                setCurrentOrganization(listOrganization[i])
            }
        }
    }
    useEffect(() => {
        let checkExitOrganization = false;
        for (let i = 0; i < listOrganization.length; i++) {
            if (selectedNodeKey === listOrganization[i].id) {
                setCurrentOrganization(listOrganization[i])
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
//=====================================================================================================
    const saveListStudents = () => {
        handleUpdateListStudent(listStudents)
        handleCloseModalEdit();
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const changeListStudents = (event, student) => {
        if(event.target.checked){
            setListStudents([...listStudents, student])
        }else{
            setListStudents(listStudents.filter(item => item.id !== student.id));
        }
    };
    const handleCloseModalAddStudent = () => {
        submitSearchDefault();
        setOpenModalAddStudent(false)
    }
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const deleteStudentBtn = (e) => {
        setOpenModalDel(true)
        setStudentId(e)
    }
    const submitDelete = () => {
        if(studentId){
            deleteStudentApi(studentId).then( r => {
                toast.success('Xóa thành công', Utils.options);
                setTimeout(() => {
                    window.location.reload();
                }, 1100);
            }).catch(e => {})
        }
    }
    const updateStudentBtn = (e) => {
        setOpenModalAddStudent(true)
        setStudentId(e)
    }
    const addStudentBtn = () => {
        setOpenModalAddStudent(true)
        setStudentId(null)
    }
//=====================================================================================================
    const getOrganization = () => {
        return apiOrganization.getOrganization()
    }
    const searchStudentApi = (data) => {
        return apiStudent.searchStudent(data);
    }
    const deleteStudentApi = (data) => {
        return apiStudent.deleteStudent(data);
    }
//=====================================================================================================
    return (
        <div>
            <ModalConfirmDel
                openModalDel={openModalDel}
                handleCloseModalDel={handleCloseModalDel}
                submitDelete={submitDelete}>
            </ModalConfirmDel>
            <ModalAddStudent
                studentId={studentId}
                openModalAddStudent={openModalAddStudent}
                handleCloseModalAddStudent={handleCloseModalAddStudent}>
            </ModalAddStudent>
            <Dialog className={"modal modal-width-1200"} open={openModalEdit} onClose={handleCloseModalEdit}>
                <div className={'modal-group'}>
                    <DialogTitle>
                        <div className={'vmp-tittle'}>Thêm học viên</div>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModalEdit}
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
                    <div className={'main-content-body'}>
                        <div className={"organization-content"}>
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
                                    </div>
                                    <div>
                                        {
                                            currentUser.roles.includes('create_advance') ?
                                                <Button onClick={addStudentBtn}
                                                    variant="outlined" startIcon={<ControlPointIcon/>}>
                                                    Thêm học viên
                                                </Button> : ""
                                        }
                                    </div>
                                </div>
                                <div className={'children-organization'}>
                                    <div className={'main-content-body-search'}>
                                        <div className={'form-control-search-header'}>
                                            <div className={'form-control-search-item'}>
                                                <div className={'label-input'}>Tên học viên</div>
                                                <TextField
                                                    size={"small"}
                                                    placeholder={'Tên học viên'}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    value={inputSearch}
                                                    onChange={(e) => {
                                                        setInputSearch(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Divider light/>
                                    <div className={'main-content-body-result'}>
                                        <TableContainer className={'table-est'} sx={{maxHeight: 440}}>
                                            {loading
                                                ? <div className={'message-table-empty-loading'}>
                                                    <CircularProgress size={30}
                                                                      style={{color: '#1f2251'}}></CircularProgress>
                                                    <div className={'message-table-empty-sof'}>Đang tải dữ liệu</div>
                                                </div>
                                                : listResult.rows.length > 0
                                                    ? <Table stickyHeader className={"table-custom"}>
                                                        <TableHead className={'super-app-theme--header'}>
                                                            <TableRow>
                                                                <TableCell rowSpan={1}
                                                                           align="center">
                                                                    {/*<Checkbox sx={{color: true ? 'white' : 'white', '&.Mui-checked': {color: 'white',},}} defaultChecked/>*/}
                                                                </TableCell>
                                                                <TableCell style={{minWidth: 70}}
                                                                           align="center">STT</TableCell>
                                                                <TableCell style={{minWidth: 150}}>Họ và tên</TableCell>
                                                                <TableCell style={{minWidth: 150}}>Năm sinh</TableCell>
                                                                <TableCell style={{minWidth: 80}}>Giới tính</TableCell>
                                                                <TableCell style={{minWidth: 150}}>Chức danh</TableCell>
                                                                <TableCell style={{minWidth: 250}}>Khối</TableCell>
                                                                <TableCell style={{minWidth: 250}}>Đơn vị</TableCell>
                                                                <TableCell style={{minWidth: 250}}>Phòng ban</TableCell>
                                                                <TableCell style={{minWidth: 150}}>Số điện thoại</TableCell>
                                                                <TableCell style={{minWidth: 150}}>Email</TableCell>
                                                                <TableCell style={{minWidth: 250}}>Ghi chú</TableCell>
                                                                <TableCell style={{minWidth: 50}} align="center">Thao
                                                                    tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody className={'super-app-theme--body'}>
                                                            {loading
                                                                ? <div className={'message-table-empty-loading'}>
                                                                    <CircularProgress size={30}></CircularProgress>
                                                                    <div className={'message-table-empty-sof'}>Không có dữ
                                                                        liệu
                                                                    </div>
                                                                </div>
                                                                : ''
                                                            }
                                                            {listResult.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                                                                <>
                                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                                        <TableCell rowSpan={1}
                                                                                   align="center"><Checkbox
                                                                            onChange={event => changeListStudents(event, item)}
                                                                            checked={checkIdInListObject(listStudents, item.id)}/></TableCell>
                                                                        <TableCell rowSpan={1}
                                                                                   align="center">{(item.stt)}</TableCell>
                                                                        <TableCell rowSpan={1}>{item.name}</TableCell>
                                                                        <TableCell
                                                                            rowSpan={1}>{getDateTimeFromTimestamp(item.dateOfBirth)}</TableCell>
                                                                        <TableCell
                                                                            rowSpan={1}>{getNameToId(sexData, item.sex)}</TableCell>
                                                                        <TableCell rowSpan={1}>{item.jobTitle}</TableCell>
                                                                        <TableCell
                                                                            rowSpan={1}>{item.blockOrganization.name}</TableCell>
                                                                        <TableCell
                                                                            rowSpan={1}>{item.unitOrganization.name}</TableCell>
                                                                        <TableCell
                                                                            rowSpan={1}>{item.departmentOrganization.name}</TableCell>
                                                                        <TableCell rowSpan={1}>{item.phone}</TableCell>
                                                                        <TableCell rowSpan={1}>{item.email}</TableCell>
                                                                        <TableCell rowSpan={1}>{item.notes}</TableCell>
                                                                        <TableCell rowSpan={1} align="center">
                                                                            <div className='icon-action'>
                                                                                <Tooltip title="Cập nhật"
                                                                                         onClick={() => updateStudentBtn(item.id)}>
                                                                                    <div><UpdateIcon/></div>
                                                                                </Tooltip>
                                                                                <Tooltip className={'deleteButton'} title="Xóa"
                                                                                         onClick={() => deleteStudentBtn(item.id)}>
                                                                                    <div><DeleteIcon/></div>
                                                                                </Tooltip>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                    : <div className={'message-table-empty-group'}>
                                                        <div
                                                            className={`message-table-empty ${listResult.rows.length === 0 ? '' : 'hidden'}`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon"
                                                                 width="100"
                                                                 height="100"
                                                                 viewBox="0 0 1567 1024" version="1.1">
                                                                <path
                                                                    d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z"
                                                                    fill="#8A96A3"/>
                                                            </svg>
                                                            <p>Không có dữ liệu</p>
                                                        </div>
                                                    </div>
                                            }
                                        </TableContainer>
                                        {
                                            listResult.rows.length > 0
                                                ? <TablePagination
                                                    labelRowsPerPage={"Số hàng mỗi trang:"}
                                                    rowsPerPageOptions={[10, 25, 100]}
                                                    component="div"
                                                    count={listResult.rows.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                                : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'button-popup-bottom'}>
                        <div className={''} style={{display: "flex", justifyContent: "center"}}>
                            <Button className={'cancel-button'} style={{marginRight: '10px'}}
                                    onClick={handleCloseModalEdit}
                                    variant="outlined"><HighlightOffIcon></HighlightOffIcon>Hủy</Button>
                            <Button onClick={saveListStudents} variant="contained" type='submit'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                     viewBox="0 0 30 30" fill="none">
                                    <path
                                        d="M21.25 3.75H6.25C4.8625 3.75 3.75 4.875 3.75 6.25V23.75C3.75 25.125 4.8625 26.25 6.25 26.25H23.75C25.125 26.25 26.25 25.125 26.25 23.75V8.75L21.25 3.75ZM23.75 23.75H6.25V6.25H20.2125L23.75 9.7875V23.75ZM15 15C12.925 15 11.25 16.675 11.25 18.75C11.25 20.825 12.925 22.5 15 22.5C17.075 22.5 18.75 20.825 18.75 18.75C18.75 16.675 17.075 15 15 15ZM7.5 7.5H18.75V12.5H7.5V7.5Z"
                                        fill="#1F2251"/>
                                </svg>
                                Lưu</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>

    );
}

export default ModalListStudent;