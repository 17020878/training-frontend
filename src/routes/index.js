import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Main from "../pages/Main";

import Forbidden from "../pages/errors/forbidden";
import NotFound from "../pages/errors/notFound";
import ErrorServer from "../pages/errors/errorServer";
import PrivateRoutes from "./PrivateRotes";
import Login from "../pages/authentication/login/Login";
import {useSelector} from "react-redux";
import Oauth2Success from "../pages/authentication/oauth2/OAuth2Success";
import UserPage from "../pages/user/UserPage";
import UserEdit from "../pages/user/UserEdit";
import RolePage from "../pages/role/RolePage";
import RoleEdit from "../pages/role/RoleEdit";
import PermissionPage from "../pages/role/PermissionPage";
import LoginHistoryPage from "../pages/login-history/LoginHistoryPage";
import OrganizationPage from "../pages/organization/OrganizationPage";
import ExpensePage from "../pages/expense/ExpensePage";
import GroupExpensePage from "../pages/group-expense/GroupExpensePage";
import CategoryPage from "../pages/category/CategoryPage";
import CategoryEdit from "../pages/category/CategoryEdit";
import ExpenseEdit from "../pages/expense/ExpenseEdit";
import DashboardPage from "../pages/dashboad/DashboardPage";
import AdvancePage from "../pages/advance/AdvancePage";
import AdvanceEdit from "../pages/advance/AdvanceEdit";
import LineItemPage from "../pages/line-item/LineItemPage";
import ManageLecturer from "../pages/lecturer";
import CreateUpdateLecturer from "../pages/lecturer/create-update";
import ManageStudent from "../pages/student";
import CreateUpdateStudent from "../pages/student/create-update";
import ManageLink from "../pages/link";
import CreateUpdateLink from "../pages/link/create-update";
import ManageVendor from "../pages/vendor";
import CreateUpdateVendor from "../pages/vendor/create-update";
import CreateUpdateParticipantUnit from "../pages/participant-unit/create-update";
import ManageParticipantUnit from "../pages/participant-unit";
import CreateUpdateTrainingSession from "../pages/training-session/create-update";
import ManageTrainingSession from "../pages/training-session";
import ManagePlan from "../pages/plan";
import CreateUpdatePlan from "../pages/plan/create-update";
import ManageTrainingDocument from "../pages/training-document";
import CreateUpdateTrainingDocument from "../pages/training-document/create-update";
import ManageTrainingClass from "../pages/training-class";
import CreateUpdateTrainingClass from "../pages/training-class/create-update";
import ManageTraining from "../pages/training";
import CreateUpdateTraining from "../pages/training/create-update";

export default function RenderRoute() {
    const currentUser = useSelector(state => state.currentUser)
    useEffect(() => {
        if (currentUser.isSignIn != null && currentUser.isSignIn !== "" && currentUser.isSignIn !== undefined) {
            isAuthenticated();
        }
    }, [currentUser])
    const isAuthenticated = () => {
        // Kiểm tra xem JWT đã được lưu trong localStorage hay không
        const isSignIn= currentUser.isSignIn;
        if (isSignIn==true) {
            return true;
        }else return false
    };
    return (
        <Routes>
            <Route
                path="/oauth2/success"
                element={<Oauth2Success></Oauth2Success>}
            />
            <Route
                path="/login"
                element={isAuthenticated() ? <Navigate to="/"/> : <Login/>}
            />
            <Route path="/" element={isAuthenticated()?<Main/>:<Navigate to="/login" />}>

                <Route path="dashboard" element={
                    <PrivateRoutes role={'view_dashboard'}>
                        <DashboardPage/>
                    </PrivateRoutes>
                }/>
                <Route path="" element={
                    <PrivateRoutes role={'view_dashboard'}>
                        <DashboardPage/>
                    </PrivateRoutes>
                }/>

                <Route path="user" element={
                    <PrivateRoutes role={'view_user'}>
                        <UserPage/>
                    </PrivateRoutes>
                }/>
                <Route path="user/create" element={
                    <PrivateRoutes role={'create_user'}>
                        <UserEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="user/update" element={
                    <PrivateRoutes role={'edit_user'}>
                        <UserEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="role" element={
                    <PrivateRoutes role={'view_role'}>
                        <RolePage/>
                    </PrivateRoutes>
                }/>
                <Route path="role/create" element={
                    <PrivateRoutes role={'create_role'}>
                        <RoleEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="role/update" element={
                    <PrivateRoutes role={'edit_role'}>
                        <RoleEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="role/permission" element={
                    <PrivateRoutes role={'view_role'}>
                        <PermissionPage />
                    </PrivateRoutes>
                }/>
                <Route path="/login-history" element={
                    <PrivateRoutes role={'view_login'}>
                        <LoginHistoryPage />
                    </PrivateRoutes>
                }/>
                <Route path="/organization" element={
                    <PrivateRoutes role={'view_organization'}>
                        <OrganizationPage />
                    </PrivateRoutes>
                }/>
                <Route path="/group-expense" element={
                    <PrivateRoutes role={'view_group'}>
                        <GroupExpensePage />
                    </PrivateRoutes>
                }/>
                <Route path="/expense" element={
                    <PrivateRoutes role={'view_expense'}>
                        <ExpensePage />
                    </PrivateRoutes>
                }/>
                <Route path="/expense/create" element={
                    <PrivateRoutes role={'create_expense'}>
                        <ExpenseEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="/expense/update" element={
                    <PrivateRoutes role={'edit_expense'}>
                        <ExpenseEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="/advance" element={
                    <PrivateRoutes role={'view_advance'}>
                        <AdvancePage />
                    </PrivateRoutes>
                }/>
                <Route path="/line-item" element={
                    <PrivateRoutes role={'view_line'}>
                        <LineItemPage />
                    </PrivateRoutes>
                }/>



                {/*====================DANH MỤC=======================*/}
                <Route path="/object-student" element={
                    <PrivateRoutes role={'view_category'}><CategoryPage type = "StudentObject" /></PrivateRoutes>
                }/>
                <Route path="/object-student/create" element={
                    <PrivateRoutes role={'create_category'}><CategoryEdit isUpdate={false} type = "StudentObject" /></PrivateRoutes>
                }/>
                <Route path="/object-student/update" element={
                    <PrivateRoutes role={'edit_category'}><CategoryEdit isUpdate={true} type = "StudentObject" /></PrivateRoutes>
                }/>


                <Route path="/object-lecturer" element={
                    <PrivateRoutes role={'view_category'}><CategoryPage type = "LecturerObject" /></PrivateRoutes>
                }/>
                <Route path="/object-lecturer/create" element={
                    <PrivateRoutes role={'create_category'}><CategoryEdit isUpdate={false} type = "LecturerObject" /></PrivateRoutes>
                }/>
                <Route path="/object-lecturer/update" element={
                    <PrivateRoutes role={'edit_category'}><CategoryEdit isUpdate={true} type = "LecturerObject" /></PrivateRoutes>
                }/>


                <Route path="/lecturer" element={
                    <PrivateRoutes role={'view_category'}><ManageLecturer /></PrivateRoutes>
                }/>
                <Route path="/lecturer/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateLecturer isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/lecturer/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateLecturer isUpdate={true} /></PrivateRoutes>
                }/>


                <Route path="/student" element={
                    <PrivateRoutes role={'view_category'}><ManageStudent/></PrivateRoutes>
                }/>
                <Route path="/student/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateStudent isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/student/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateStudent isUpdate={true} /></PrivateRoutes>
                }/>


                <Route path="/organization-location" element={
                    <PrivateRoutes role={'view_category'}><CategoryPage type = "OrganizationLocation" /></PrivateRoutes>
                }/>
                <Route path="/organization-location/create" element={
                    <PrivateRoutes role={'create_category'}><CategoryEdit isUpdate={false} type = "OrganizationLocation" /></PrivateRoutes>
                }/>
                <Route path="/organization-location/update" element={
                    <PrivateRoutes role={'edit_category'}><CategoryEdit isUpdate={true} type = "OrganizationLocation" /></PrivateRoutes>
                }/>


                <Route path="/training-type" element={
                    <PrivateRoutes role={'view_category'}><CategoryPage type = "TrainingType" /></PrivateRoutes>
                }/>
                <Route path="/training-type/create" element={
                    <PrivateRoutes role={'create_category'}><CategoryEdit isUpdate={false} type = "TrainingType" /></PrivateRoutes>
                }/>
                <Route path="/training-type/update" element={
                    <PrivateRoutes role={'edit_category'}><CategoryEdit isUpdate={true} type = "TrainingType" /></PrivateRoutes>
                }/>


                <Route path="/form-training" element={
                    <PrivateRoutes role={'view_category'}><CategoryPage type = "FormTraining" /></PrivateRoutes>
                }/>
                <Route path="/form-training/create" element={
                    <PrivateRoutes role={'create_category'}><CategoryEdit isUpdate={false} type = "FormTraining" /></PrivateRoutes>
                }/>
                <Route path="/form-training/update" element={
                    <PrivateRoutes role={'edit_category'}><CategoryEdit isUpdate={true} type = "FormTraining" /></PrivateRoutes>
                }/>


                <Route path="/participant-unit" element={
                    <PrivateRoutes role={'view_category'}><ManageParticipantUnit type = "ParticipantUnit" /></PrivateRoutes>
                }/>
                <Route path="/participant-unit/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateParticipantUnit isUpdate={false} type = "ParticipantUnit" /></PrivateRoutes>
                }/>
                <Route path="/participant-unit/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateParticipantUnit isUpdate={true} type = "ParticipantUnit" /></PrivateRoutes>
                }/>


                <Route path="/vendor" element={
                    <PrivateRoutes role={'view_category'}><ManageVendor/></PrivateRoutes>
                }/>
                <Route path="/vendor/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateVendor isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/vendor/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateVendor isUpdate={true} /></PrivateRoutes>
                }/>
                {/*====================DANH MỤC=======================*/}


                <Route path="/link" element={
                    <PrivateRoutes role={'view_category'}><ManageLink/></PrivateRoutes>
                }/>
                <Route path="/link/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateLink isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/link/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateLink isUpdate={true} /></PrivateRoutes>
                }/>

                <Route path="/training-session" element={
                    <PrivateRoutes role={'view_category'}><ManageTrainingSession/></PrivateRoutes>
                }/>
                <Route path="/training-session/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateTrainingSession isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/training-session/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateTrainingSession isUpdate={true} /></PrivateRoutes>
                }/>

                <Route path="/plan" element={
                    <PrivateRoutes role={'view_category'}><ManagePlan/></PrivateRoutes>
                }/>
                <Route path="/plan/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdatePlan isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/plan/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdatePlan isUpdate={true} /></PrivateRoutes>
                }/>

                <Route path="/training-document" element={
                    <PrivateRoutes role={'view_category'}><ManageTrainingDocument/></PrivateRoutes>
                }/>
                <Route path="/training-document/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateTrainingDocument isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/training-document/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateTrainingDocument isUpdate={true} /></PrivateRoutes>
                }/>

                <Route path="/training-class" element={
                    <PrivateRoutes role={'view_category'}><ManageTrainingClass/></PrivateRoutes>
                }/>
                <Route path="/training-class/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateTrainingClass isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/training-class/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateTrainingClass isUpdate={true} /></PrivateRoutes>
                }/>

                <Route path="/training" element={
                    <PrivateRoutes role={'view_category'}><ManageTraining/></PrivateRoutes>
                }/>
                <Route path="/training/create" element={
                    <PrivateRoutes role={'create_category'}><CreateUpdateTraining isUpdate={false} /></PrivateRoutes>
                }/>
                <Route path="/training/update" element={
                    <PrivateRoutes role={'edit_category'}><CreateUpdateTraining isUpdate={true} /></PrivateRoutes>
                }/>

                <Route path="errors/forbidden" element={<Forbidden/>}/>
                <Route path="errors/notfound" element={<NotFound/>}/>
                <Route path="errors/error-server" element={<ErrorServer/>}/>
                <Route path="*" element={<Navigate to={'/dashboard'}/>}/>
            </Route>
        </Routes>
    )
}