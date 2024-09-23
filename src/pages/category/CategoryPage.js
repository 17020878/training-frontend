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
import {useLocation, useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiCategory from "../../api/category";
import {getTitleFromCodeCategory} from "../../constants/utils";
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {DeleteIcon, UpdateIcon} from "../../constants/icon-define";

export default function CategoryPage(props) {
    const {type} = props;
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1)
    const [limitOfPage, setLimitOfPage] = useState(20)
    const [result, setResult] = useState([])
    const [searchUsername, setSearchUsername] = useState("")
    const [totalPage, setTotalPage] = useState(0)
    const [search, setSearch] = useState(true)
    const [isRefreshTable, setRefreshTable] = useState(true)
    const currentUser = useSelector(state => state.currentUser)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel, setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    useEffect(() => {
        submitSearch()
    }, [type])
    const submitSearch = () => {
        getUserApi({
            name: searchUsername,
            pageSize: limitOfPage,
            pageIndex: currentPage,
            type: type,
            paging: true
        }).then(r => {
            console.log(r.data);
            if (r.data.responses) {
                setResult(r.data.responses);
                setTotalPage(r.data.page.total_pages)
            } else {
                setResult([]);
                setTotalPage(0)
            }

        })
    }
    useEffect(() => {
        submitSearch()
    }, [currentPage, isRefreshTable])


    const getUserApi = (body) => {
        return apiCategory.getCategory(body);
    }

    const deleteUserApi = (body) => {
        return apiCategory.deleteCategory(body)
    }
    const submitDel = () => {
        deleteUserApi({
            type: type,
            id: idDel
        }).then(r => {
            submitSearch()
            toast.success("Xóa thành công")
        }).catch(e => {
            toast.error("Vui lòng xóa các phụ thuộc trước")
        })
    }
    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete}
                             handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>

            <div className={'wrapper-table'}>
                <div className={'table-search'}>
                    <div className={'table-content-title'}>Thông tin tìm kiếm</div>
                    <div className={'table-search-btn'}>
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>Tên</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchUsername}
                                onChange={(e) => {
                                    setSearchUsername(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{marginLeft: "20px", marginTop: '16px'}}>
                            <Button variant={"outlined"} onClick={submitSearch}>Tìm kiếm</Button>
                        </div>
                    </div>
                    <Divider></Divider>
                </div>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        {getTitleFromCodeCategory(type)}
                        {currentUser.roles.includes('create_category')
                            ? <div>
                                <Button onClick={() => {
                                    navigate(`${pathname}/create`)
                                }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                    Thêm mới
                                </Button>
                            </div> : ''}

                    </div>
                    <TableContainer className={'table-container'}>
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: '30px'}} align="center">STT</TableCell>
                                    <TableCell>Tên </TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    {
                                        currentUser.roles.includes('edit_category') || currentUser.roles.includes('delete_category') ?
                                            <TableCell className={"action-header"} style={{width: '50px'}}>Thao
                                                tác</TableCell> : ""
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                {result.length == 0
                                    ? <div className={'message-table-empty-group'}>
                                        <div
                                            className={`message-table-empty ${result.length === 0 ? '' : 'hidden'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon" width="100"
                                                 height="100"
                                                 viewBox="0 0 1567 1024" version="1.1">
                                                <path
                                                    d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z"
                                                    fill="#8A96A3"/>
                                            </svg>
                                            <p>Không có dữ liệu</p>
                                        </div>
                                    </div>
                                    : ''
                                }
                                {
                                    result.map((item, index) => (
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                    <div>{index + 1 + ((currentPage - 1) * limitOfPage)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.description}</div>
                                                </TableCell>
                                                {
                                                    currentUser.roles.includes('edit_category') || currentUser.roles.includes('delete_category') ?
                                                        <TableCell className={"action"}>
                                                            <div className={'icon-action'} style={{display: 'flex', justifyContent: 'center'}}>
                                                                {
                                                                    currentUser.roles.includes('edit_category') ?
                                                                        <Tooltip title="Cập nhật"
                                                                                 onClick={() => {
                                                                                     navigate(`${pathname}/update?id=${item.id}`)
                                                                                 }}>
                                                                            <div><UpdateIcon/></div>
                                                                        </Tooltip> : ""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('delete_category') ?
                                                                        <Tooltip className={'deleteButton'} title="Xóa"
                                                                                 onClick={() => {
                                                                                     setIdDel(item.id)
                                                                                     setOpenModalDelete(true)

                                                                                 }}>
                                                                            <div><DeleteIcon/></div>
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
        </div>)
}