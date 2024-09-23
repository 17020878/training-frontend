import React, {useEffect, useState} from "react";
import {Avatar, Badge, Breadcrumbs, Button, IconButton, Link, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {useDispatch, useSelector} from "react-redux";
import {logout, updateShowMenu} from "../store/user/userSlice";
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GridViewIcon from '@mui/icons-material/GridView';
import ComputerIcon from '@mui/icons-material/Computer';
import HistoryIcon from '@mui/icons-material/History';
import ClassIcon from '@mui/icons-material/Class';

import {useMsal} from "@azure/msal-react";
import Axios from 'axios'
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {getTitleFromCodeCategory} from "../constants/utils";
import {
    DashBoardIcon,
    FormTrainingIcon,
    LecturerIcon,
    LecturerObjectIcon,
    LinkIcon,
    OrganizationLocationIcon,
    ParticipantUnitIcon,
    PlanIcon,
    StudentIcon,
    StudentObjectIcon,
    TrainingClassIcon,
    TrainingDocumentIcon,
    TrainingIcon,
    TrainingSessionIcon,
    TrainingTypeIcon,
    VendorIcon
} from "../constants/icon-define";
const Header = () => {
    const {pathname} = useLocation();
    const {instance, accounts} = useMsal()
    const [title, setTitle] = useState()
    // const [anchorEl, setAnchorEl] =
    const currentUser = useSelector(state => state.currentUser)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = React.useState();
    const [numberOfRequest, setNumberOfRequest] = useState(0);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleLogout() {
        // const logoutHint = accounts[0].idTokenClaims.login_hint;
        // await msalInstance.logoutPopup({ logoutHint: logoutHint });
        let homeAccountId = currentUser.homeAccountId;

        const currentAccount = instance.getAccountByHomeId(homeAccountId);
// The account's ID Token must contain the login_hint optional claim to avoid the account picker
        instance.logoutRedirect({account: currentAccount});
        // const logoutRequest = {
        //     account: instance.getAccountByHomeId(currentUser.homeAccountId),
        //     postLogoutRedirectUri: "http://localhost:3000/login",
        // };
        // // localStorage.clear();
        // instance.logoutRedirect(logoutRequest).catch(e => {
        //     console.error(e);
        // });
    }

    const touchMenu = () => {
        dispatch(updateShowMenu(!currentUser.showMenu))
    }

    useEffect(() => {

        switch (pathname) {
            case '/dashboard':
                setTitle(
                    <div className={'header-breadcrumb'}><DashBoardIcon style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/dashboard'}>Dashboard</NavLink>
                    </div>
                )
                break;
            case '/user':
                setTitle(
                    <div className={'header-breadcrumb'}><GroupsIcon style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/user'}>Quản lý người dùng </NavLink>
                    </div>
                )
                break;
            case '/user/create':
                setTitle(
                    <div className={'header-breadcrumb'}><GroupsIcon style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/user'}>Quản lý người dùng </NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/user/update':
                setTitle(
                    <div className={'header-breadcrumb'}><GroupsIcon style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/user'}>Quản lý người dùng </NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/role/create':
                setTitle(
                    <div className={'header-breadcrumb'}><ManageAccountsIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/role'}>Quản lý quyền </NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/role/update':
                setTitle(
                    <div className={'header-breadcrumb'}><ManageAccountsIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/role'}>Quản lý quyền </NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/role':
                setTitle(
                    <div className={'header-breadcrumb'}><ManageAccountsIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/role'}>Quản lý quyền </NavLink>
                    </div>
                )
                break;
            case '/role/permission':
                setTitle(
                    <div className={'header-breadcrumb'}><ManageAccountsIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/role'}>Quản lý quyền </NavLink>&ensp;/&ensp;Phân quyền
                    </div>
                )
                break;
            case '/login-history':
                setTitle(
                    <div className={'header-breadcrumb'}><HistoryIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/role'}>Nhật ký đăng nhập</NavLink>
                    </div>
                )
                break;
            case '/organization':
                setTitle(
                    <div className={'header-breadcrumb'}><CorporateFareIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/organization'}>Cơ cấu tổ chức</NavLink>
                    </div>
                )
                break;


            // =======================NEW=========================

            // =======================DANH MỤC=========================
            case '/object-student':
                setTitle(
                    <div className={'header-breadcrumb'}><StudentObjectIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/object-student'}>{getTitleFromCodeCategory("StudentObject")}</NavLink>
                    </div>
                )
                break;
            case '/object-student/create':
                setTitle(
                    <div className={'header-breadcrumb'}><StudentObjectIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/object-student'}>{getTitleFromCodeCategory("StudentObject")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/object-student/update':
                setTitle(
                    <div className={'header-breadcrumb'}><StudentObjectIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/object-student'}>{getTitleFromCodeCategory("StudentObject")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
                case '/object-lecturer':
                setTitle(
                    <div className={'header-breadcrumb'}><LecturerObjectIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/object-lecturer'}>{getTitleFromCodeCategory("LecturerObject")}</NavLink>
                    </div>
                )
                break;
            case '/object-lecturer/create':
                setTitle(
                    <div className={'header-breadcrumb'}><LecturerObjectIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/object-lecturer'}>{getTitleFromCodeCategory("LecturerObject")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/object-lecturer/update':
                setTitle(
                    <div className={'header-breadcrumb'}><LecturerObjectIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/object-lecturer'}>{getTitleFromCodeCategory("LecturerObject")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/lecturer':
                setTitle(
                    <div className={'header-breadcrumb'}><LecturerIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/lecturer'}>{getTitleFromCodeCategory("Lecturer")}</NavLink>
                    </div>
                )
                break;
            case '/lecturer/create':
                setTitle(
                    <div className={'header-breadcrumb'}><LecturerIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/lecturer'}>{getTitleFromCodeCategory("Lecturer")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/lecturer/update':
                setTitle(
                    <div className={'header-breadcrumb'}><LecturerIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/lecturer'}>{getTitleFromCodeCategory("Lecturer")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/student':
                setTitle(
                    <div className={'header-breadcrumb'}><StudentIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/student'}>{getTitleFromCodeCategory("Student")}</NavLink>
                    </div>
                )
                break;
            case '/student/create':
                setTitle(
                    <div className={'header-breadcrumb'}><StudentIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/student'}>{getTitleFromCodeCategory("Student")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/student/update':
                setTitle(
                    <div className={'header-breadcrumb'}><StudentIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/student'}>{getTitleFromCodeCategory("Student")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/organization-location':
                setTitle(
                    <div className={'header-breadcrumb'}><OrganizationLocationIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/organization-location'}>{getTitleFromCodeCategory("OrganizationLocation")}</NavLink>
                    </div>
                )
                break;
            case '/organization-location/create':
                setTitle(
                    <div className={'header-breadcrumb'}><OrganizationLocationIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/organization-location'}>{getTitleFromCodeCategory("OrganizationLocation")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/organization-location/update':
                setTitle(
                    <div className={'header-breadcrumb'}><OrganizationLocationIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/organization-location'}>{getTitleFromCodeCategory("OrganizationLocation")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/training-type':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingTypeIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-type'}>{getTitleFromCodeCategory("TrainingType")}</NavLink>
                    </div>
                )
                break;
            case '/training-type/create':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingTypeIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-type'}>{getTitleFromCodeCategory("TrainingType")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/training-type/update':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingTypeIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-type'}>{getTitleFromCodeCategory("TrainingType")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/form-training':
                setTitle(
                    <div className={'header-breadcrumb'}><FormTrainingIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/form-training'}>{getTitleFromCodeCategory("FormTraining")}</NavLink>
                    </div>
                )
                break;
            case '/form-training/create':
                setTitle(
                    <div className={'header-breadcrumb'}><FormTrainingIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/form-training'}>{getTitleFromCodeCategory("FormTraining")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/form-training/update':
                setTitle(
                    <div className={'header-breadcrumb'}><FormTrainingIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/form-training'}>{getTitleFromCodeCategory("FormTraining")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/participant-unit':
                setTitle(
                    <div className={'header-breadcrumb'}><ParticipantUnitIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/participant-unit'}>{getTitleFromCodeCategory("ParticipantUnit")}</NavLink>
                    </div>
                )
                break;
            case '/participant-unit/create':
                setTitle(
                    <div className={'header-breadcrumb'}><ParticipantUnitIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/participant-unit'}>{getTitleFromCodeCategory("ParticipantUnit")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/participant-unit/update':
                setTitle(
                    <div className={'header-breadcrumb'}><ParticipantUnitIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/participant-unit'}>{getTitleFromCodeCategory("ParticipantUnit")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            case '/vendor':
                setTitle(
                    <div className={'header-breadcrumb'}><VendorIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/vendor'}>{getTitleFromCodeCategory("Vendor")}</NavLink>
                    </div>
                )
                break;
            case '/vendor/create':
                setTitle(
                    <div className={'header-breadcrumb'}><VendorIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/vendor'}>{getTitleFromCodeCategory("Vendor")}</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/vendor/update':
                setTitle(
                    <div className={'header-breadcrumb'}><VendorIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/vendor'}>{getTitleFromCodeCategory("Vendor")}</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            // =======================DANH MỤC=========================
            case '/link':
                setTitle(
                    <div className={'header-breadcrumb'}><LinkIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/link'}>Nguồn đăng ký</NavLink>
                    </div>
                )
                break;
            case '/link/create':
                setTitle(
                    <div className={'header-breadcrumb'}><LinkIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/link'}>Nguồn đăng ký</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/link/update':
                setTitle(
                    <div className={'header-breadcrumb'}><LinkIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/link'}>Nguồn đăng ký</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;

            case '/training-session':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingSessionIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-session'}>Phiên đào tạo</NavLink>
                    </div>
                )
                break;
            case '/training-session/create':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingSessionIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-session'}>Phiên đào tạo</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/training-session/update':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingSessionIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-session'}>Phiên đào tạo</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;

            case '/plan':
                setTitle(
                    <div className={'header-breadcrumb'}><PlanIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/plan'}>Kế hoạch</NavLink>
                    </div>
                )
                break;
            case '/plan/create':
                setTitle(
                    <div className={'header-breadcrumb'}><PlanIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/plan'}>Kế hoạch</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/plan/update':
                setTitle(
                    <div className={'header-breadcrumb'}><PlanIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/plan'}>Kế hoạch</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;

            case '/training-document':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingDocumentIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-document'}>Tài liệu đào tạo</NavLink>
                    </div>
                )
                break;
            case '/training-document/create':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingDocumentIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-document'}>Tài liệu đào tạo</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/training-document/update':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingDocumentIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-document'}>Tài liệu đào tạo</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;

            case '/training':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training'}>Khóa đào tạo</NavLink>
                    </div>
                )
                break;
            case '/training/create':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training'}>Khóa đào tạo</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/training/update':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training'}>Khóa đào tạo</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;

            case '/training-class':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingClassIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-class'}>Lớp đào tạo</NavLink>
                    </div>
                )
                break;
            case '/training-class/create':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingClassIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-class'}>Lớp đào tạo</NavLink>&ensp;/&ensp;Thêm mới
                    </div>
                )
                break;
            case '/training-class/update':
                setTitle(
                    <div className={'header-breadcrumb'}><TrainingClassIcon
                        style={{marginRight: '5px', color: "#F16F21"}}/>
                        <NavLink to={'/training-class'}>Lớp đào tạo</NavLink>&ensp;/&ensp;Cập nhật
                    </div>
                )
                break;
            // =======================NEW=========================


            default:
                setTitle(<div></div>)
        }
    }, [pathname])
    return (
        <header className={'header'}>
            <div style={{display: "flex", justifyContent: 'space-between', width: '100%'}}>
                <div className={'header-left'}>
                    <IconButton onClick={touchMenu}>
                        <MenuIcon></MenuIcon>
                    </IconButton>
                    {title}
                </div>
                <div className={'header-right'}>
                    <div className={'header-right-info'}>
                        <div className={'header-right-info-fullname'}>
                            {currentUser.userInfo.fullName}
                        </div>
                        <div className={'header-right-info-job-title'}>
                            {currentUser.userInfo.jobTitle}
                        </div>
                    </div>
                    <Avatar
                        id={"basic-menu"}
                        alt="Avatar"
                        // src={require('../assets/img/avatar.jpg')}
                        // src={imageUrl}
                        sx={{width: 29, height: 29}}
                        style={{cursor: 'pointer'}}
                        onClick={handleClick}
                    />

                    <Menu
                        sx={{
                            "& .MuiPaper-root": {
                                left: 'unset !important',
                                right: '20px'
                            }

                        }}
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                        {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
                        {/*<MenuItem >{currentUser.userInfo.fullName}</MenuItem>*/}
                        {/*<MenuItem onClick={handleClose}>Logout</MenuItem>*/}
                        <MenuItem onClick={() => dispatch(logout())}>Đăng xuất</MenuItem>
                    </Menu>
                </div>
            </div>

        </header>
    );
};

export default Header
