import React, {useEffect, useState} from "react";
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Collapse} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {isMobile} from 'react-device-detect';
import {updateShowMenu} from "../store/user/userSlice";
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ComputerIcon from '@mui/icons-material/Computer';
import HistoryIcon from '@mui/icons-material/History';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
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
import {
    VIEW_CATEGORY,
    VIEW_LINK,
    VIEW_PLAN, VIEW_TRAINING,
    VIEW_TRAINING_CLASS,
    VIEW_TRAINING_DOCUMENT,
    VIEW_TRAINING_SESSION
} from "../constants/variable";

export default function Nav() {
    const {pathname} = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.currentUser)
    const [openPersonnel, setOpenPersonnel] = useState(true);
    const [openAdministrative, setOpenAdministrative] = useState(true);
    const [openAccountant, setOpenAccountant] = useState(true);
    const [openSale, setOpenSale] = useState(true);
    const [openIT, setOpenIT] = useState(true);
    const handleClickPersonnel = () => {
        setOpenPersonnel(!openPersonnel);
    };
    const handleClickAccountant = () => {
        setOpenAccountant(!openAccountant);
    };
    const handleClickAdministrative = () => {
        setOpenAdministrative(!openAdministrative);
    };
    const handleClickSale = () => {
        setOpenSale(!openSale);
    };
    const handleClickIT = () => {
        setOpenIT(!openIT);
    };

    useEffect(() => {
        if (pathname == '/') navigate('/dashboard');

    }, [pathname])

    const touchMenu = () => {
        dispatch(updateShowMenu(!currentUser.showMenu))
    }


    return (
        <nav className={`nav ${currentUser.showMenu ? 'animationTab' : ''}`}>
            <div className={'navbarBox__main'}>
                <div className={'logo'}>
                    <a href={'#'}><img style={{width: '100%'}}
                                       src={require('../assets/img/logo-white.png')}/></a>
                    <button onClick={touchMenu}>
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                             class="svg1">
                            <path
                                d="M9.53264 8.11756C9.51712 8.10208 9.50481 8.08369 9.4964 8.06344C9.488 8.04319 9.48368 8.02149 9.48368 7.99957C9.48368 7.97765 9.488 7.95594 9.4964 7.9357C9.50481 7.91545 9.51712 7.89706 9.53264 7.88158L15.7075 1.70742C15.895 1.51966 16.0002 1.26511 16 0.999767C15.9998 0.734425 15.8942 0.480025 15.7065 0.292532C15.5187 0.10504 15.2642 -0.000187268 14.9988 2.50194e-07C14.7335 0.000187768 14.4791 0.105774 14.2916 0.293532L8.11742 6.46503C8.10194 6.48055 8.08355 6.49286 8.0633 6.50126C8.04306 6.50966 8.02135 6.51399 7.99943 6.51399C7.97751 6.51399 7.9558 6.50966 7.93556 6.50126C7.91531 6.49286 7.89692 6.48055 7.88144 6.46503L1.70728 0.293532C1.61444 0.200652 1.50422 0.126966 1.38291 0.0766825C1.26159 0.026399 1.13156 0.000502552 1.00024 0.000471601C0.735021 0.000409094 0.480642 0.105706 0.293061 0.293199C0.10548 0.480692 6.25348e-05 0.735022 2.78134e-08 1.00024C-6.24792e-05 1.26546 0.105235 1.51984 0.292727 1.70742L6.46622 7.88158C6.48174 7.89706 6.49406 7.91545 6.50246 7.9357C6.51086 7.95594 6.51518 7.97765 6.51518 7.99957C6.51518 8.02149 6.51086 8.04319 6.50246 8.06344C6.49406 8.08369 6.48174 8.10208 6.46622 8.11756L0.292727 14.2924C0.19989 14.3853 0.126257 14.4955 0.0760305 14.6169C0.0258043 14.7382 -3.09225e-05 14.8682 2.78134e-08 14.9996C6.25348e-05 15.2648 0.10548 15.5191 0.293061 15.7066C0.385942 15.7994 0.496198 15.8731 0.617536 15.9233C0.738874 15.9735 0.868916 15.9994 1.00024 15.9993C1.26546 15.9993 1.51979 15.8939 1.70728 15.7063L7.88144 9.53144C7.89692 9.51592 7.91531 9.50361 7.93556 9.49521C7.9558 9.48681 7.97751 9.48248 7.99943 9.48248C8.02135 9.48248 8.04306 9.48681 8.0633 9.49521C8.08355 9.50361 8.10194 9.51592 8.11742 9.53144L14.2916 15.7063C14.4791 15.8939 14.7334 15.9993 14.9986 15.9993C15.2638 15.9994 15.5182 15.8941 15.7058 15.7066C15.8934 15.5191 15.9988 15.2648 15.9989 14.9996C15.9989 14.7343 15.8936 14.48 15.7061 14.2924L9.53264 8.11756Z"
                                fill="#fff"></path>
                        </svg>
                    </button>
                </div>
                <hr/>
                <div style={{marginTop: "10px"}}>
                    <ul>
                        {
                            currentUser.roles.includes('view_dashboard') ?
                                <NavLink className={'nav-link menu-parent'} isActive={true} to={'dashboard'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name '}><DashBoardIcon></DashBoardIcon>
                                                Dashboard
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {
                            currentUser.roles.includes(VIEW_PLAN) ?
                                <NavLink exact className={'nav-link menu-parent'} isActive={true} to={'plan'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name'}><PlanIcon></PlanIcon>
                                                <span className={'nav-parent-size'}>Kế hoạch</span>
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {
                            currentUser.roles.includes(VIEW_TRAINING) ?
                                <NavLink className={'nav-link menu-parent'} isActive={true} to={'training'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name'}><TrainingIcon></TrainingIcon>
                                                Khóa đào tạo
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {
                            currentUser.roles.includes(VIEW_TRAINING_CLASS) ?
                                <NavLink className={'nav-link menu-parent'} isActive={true} to={'training-class'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name '}><TrainingClassIcon></TrainingClassIcon>
                                                Lớp đào tạo
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {
                            currentUser.roles.includes(VIEW_TRAINING_SESSION) ?
                                <NavLink className={'nav-link menu-parent'} isActive={true} to={'training-session'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name '}>
                                                <TrainingSessionIcon></TrainingSessionIcon>
                                                Phiên đào tạo
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {
                            currentUser.roles.includes(VIEW_LINK) ?
                                <NavLink className={'nav-link menu-parent'} isActive={true} to={'link'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name '}><LinkIcon></LinkIcon>
                                                Nguồn đăng ký
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {
                            currentUser.roles.includes(VIEW_TRAINING_DOCUMENT) ?
                                <NavLink className={'nav-link menu-parent'} isActive={true} to={'training-document'}
                                         onClick={isMobile ? touchMenu : ''}>
                                    <li>
                                        <div className={'nav-item'}>
                                            <div className={'nav-item-name '}>
                                                <TrainingDocumentIcon></TrainingDocumentIcon>
                                                Tài liệu đào tạo
                                            </div>
                                        </div>
                                    </li>
                                </NavLink> : ''
                        }
                        {currentUser.roles.includes(VIEW_CATEGORY) ?
                            <NavLink className={'nav-link nolight menu-parent'}>
                                <li onClick={handleClickSale}>
                                    <div className={'nav-item'} style={{width: '100%', color: 'white'}}>
                                        <div className={'nav-item-name '}>
                                            <FormatListBulletedIcon></FormatListBulletedIcon>
                                            Danh mục
                                        </div>
                                        {openPersonnel ? <ExpandLess/> : <ExpandMore/>}
                                    </div>
                                </li>
                            </NavLink> : ''
                        }
                        {currentUser.roles.includes(VIEW_CATEGORY)
                            ? <Collapse in={openSale} timeout="auto" unmountOnExit>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'object-student'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <StudentObjectIcon></StudentObjectIcon>
                                                    {getTitleFromCodeCategory("StudentObject")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'object-lecturer'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <LecturerObjectIcon></LecturerObjectIcon>
                                                    {getTitleFromCodeCategory("LecturerObject")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'lecturer'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <LecturerIcon></LecturerIcon>
                                                    {getTitleFromCodeCategory("Lecturer")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'student'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <StudentIcon></StudentIcon>
                                                    {getTitleFromCodeCategory("Student")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'organization-location'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <OrganizationLocationIcon></OrganizationLocationIcon>
                                                    {getTitleFromCodeCategory("OrganizationLocation")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'training-type'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <TrainingTypeIcon></TrainingTypeIcon>
                                                    {getTitleFromCodeCategory("TrainingType")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'form-training'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <FormTrainingIcon></FormTrainingIcon>
                                                    {getTitleFromCodeCategory("FormTraining")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'participant-unit'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <ParticipantUnitIcon></ParticipantUnitIcon>
                                                    {getTitleFromCodeCategory("ParticipantUnit")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                                <ul style={{padding: '0px 20px'}}>
                                    <NavLink className={'nav-link'} to={'vendor'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <VendorIcon></VendorIcon>
                                                    {getTitleFromCodeCategory("Vendor")}
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink>
                                </ul>
                            </Collapse> : ""
                        }
                        {currentUser.roles.includes('view_user') || currentUser.roles.includes('view_role') || currentUser.roles.includes('view_organization') || currentUser.roles.includes('view_organization') || currentUser.roles.includes('view_login') ?
                            <NavLink className={'nav-link nolight menu-parent'}>
                                <li onClick={handleClickIT}>
                                    <div className={'nav-item'} style={{width: '100%', color: 'white'}}>
                                        <div className={'nav-item-name '}>
                                            <ComputerIcon></ComputerIcon>
                                            Quản trị
                                        </div>
                                        {openPersonnel ? <ExpandLess/> : <ExpandMore/>}
                                    </div>
                                </li>
                            </NavLink> : ''
                        }
                        <Collapse in={openIT} timeout="auto" unmountOnExit>
                            <ul style={{padding: '0px 20px'}}>
                                {currentUser.roles.includes('view_user') ?
                                    <NavLink className={'nav-link'} to={'user'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}><GroupsIcon/>
                                                    Quản lý người dùng
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink> : ''
                                }
                            </ul>
                            <ul style={{padding: '0px 20px'}}>
                                {currentUser.roles.includes('view_role') ?
                                    <NavLink className={'nav-link'} to={'role'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <ManageAccountsIcon></ManageAccountsIcon>
                                                    Quản lý quyền
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink> : ''
                                }
                            </ul>
                            <ul style={{padding: '0px 20px'}}>
                                {currentUser.roles.includes('view_organization') ?
                                    <NavLink className={'nav-link'} to={'organization'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <CorporateFareIcon></CorporateFareIcon>
                                                    Cơ cấu tổ chức
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink> : ''
                                }
                            </ul>
                            <ul style={{padding: '0px 20px'}}>
                                {currentUser.roles.includes('view_login') ?
                                    <NavLink className={'nav-link'} to={'login-history'}
                                             onClick={isMobile ? touchMenu : ''}>
                                        <li>
                                            <div className={'nav-item li-child'}>
                                                <div className={'nav-item-name'}>
                                                    <HistoryIcon></HistoryIcon>
                                                    Nhật ký đăng nhập
                                                </div>
                                            </div>
                                        </li>
                                    </NavLink> : ''
                                }
                            </ul>
                        </Collapse>
                    </ul>
                </div>
                <div className="navbarBox__backdrop"></div>
            </div>
            <div class="navbarBox__backdrop"></div>
        </nav>
    );
};