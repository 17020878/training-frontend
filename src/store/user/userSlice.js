import {createSlice} from '@reduxjs/toolkit';
import login from "../../api/auth/login";
import {clearToken} from "../../constants/common";
import dayjs from "dayjs";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: '',
        email: '',
        username: '',
        roles: [],
        isSignIn: false,
        isLoginFail: false,
        isLoading: false,
        refres: false,
        language: 'en',
        showMenu: true,
        userInfo: {
            "id": 0,
            "username": "",
            "jobTitle": "",
            "phoneNumber": "",
            "email": "",
            "fullName": "",
        },
        expenseSearch:{
            columnTableExpense:
                {
                    "Ngày đề nghị": true,
                    "Tên chi phí": true,
                    "Nhóm chi phí": true,
                    "Hình thức": false,
                    "Đơn vị đề nghị": false,
                    "Kế hoạch ngân sách": false,
                    "Mục đích": false,
                    "Đối tác": false,
                    "Đầu mối liên lạc": false,
                    "Số tiền": true,
                    "Số hóa đơn": false,
                    "Hình thức thanh toán": false,
                    "Ngày nhập liệu": false,
                    "Người tạo": true,
                    "Ghi chú": true,
                    "Chứng từ kèm theo": false,
                },
            name:"",
            fullName: "",
            time:{
                start: (new dayjs).startOf('month'),
                end: (new dayjs).endOf('month'),
            },
            groupId:null,
            groupExpanded:{0: true},
            organizationId:null,
            organizationExpanded:{0: true},
            sortField:null,
            sortDirection:null
        },
        advanceSearch:{
            name:"",
            time:{
                start: (new dayjs).startOf('month'),
                end: (new dayjs).endOf('month'),
            },
            groupId:null,
            groupExpanded:{0: true},
            organizationId:null,
            organizationExpanded:{0: true},
            sortField:null,
            sortDirection:null
        },

    },
    reducers: {
        updateProjectRedux: (state, action) => {
            state.project.id = action.payload.id;
            state.project.name = action.payload.name;
            state.project.urlImg = action.payload.urlImg;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        updateLanguage: (state, action) => {
            state.language = action.payload;
        },
        updateLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        logout: (state, action) => {
            state.accessToken = '';
            state.isSignIn = false;
            clearToken();
            state.roles = []
        },
        updateToken: (state, action) => {
            state.accessToken = action.payload;
        },
        updateRole: (state, action) => {
            state.roles = action.payload;
            state.isSignIn = true;
        },
        updateIsSignIn: (state, action) => {
            state.isSignIn = action.payload
        },
        updateUsername: (state, action) => {
            state.username = action.payload
        },
        updateEmail: (state, action) => {
            state.email = action.payload
        },
        updateShowMenu: (state, action) => {
            state.showMenu = action.payload
        },
        updateRefresh: (state) => {
            state.refresh = !state.refresh
        },
        changeSettingColumnSlice: (state, action) => {
            state.expenseSearch.columnTableExpense = action.payload
        },
        updateExpenseSearch:(state, action) => {
            if(action.payload.type=="time"){
                state.expenseSearch.time=action.payload.data;
            }
            else if(action.payload.type=="organization"){
                state.expenseSearch.organizationId=action.payload.data;
            }
            else if(action.payload.type=="organizationExpanded"){
                state.expenseSearch.organizationExpanded=action.payload.data;
            }
            else if(action.payload.type=="name"){
                state.expenseSearch.name=action.payload.data;
            }
            else if(action.payload.type=="fullName"){
                state.expenseSearch.fullName=action.payload.data;
            }
            else if(action.payload.type=="group"){
                state.expenseSearch.groupId=action.payload.data;
            }
            else if(action.payload.type=="time"){
                state.expenseSearch.time=action.payload.data;
            }
            else if(action.payload.type=="sortField"){
                state.expenseSearch.sortField=action.payload.data;
            }
            else if(action.payload.type=="sortDirection"){
                state.expenseSearch.sortDirection=action.payload.data;
            }
        },
        updateAdvanceSearch:(state, action) => {
            if(action.payload.type=="time"){
                state.advanceSearch.time=action.payload.data;
            }
            else if(action.payload.type=="organization"){
                state.advanceSearch.organizationId=action.payload.data;
            }
            else if(action.payload.type=="organizationExpanded"){
                state.advanceSearch.organizationExpanded=action.payload.data;
            }
            else if(action.payload.type=="name"){
                console.log("Redux",action.payload.data)
                state.advanceSearch.name=action.payload.data;
            }
            else if(action.payload.type=="group"){
                state.advanceSearch.groupId=action.payload.data;
            }
            else if(action.payload.type=="time"){
                state.advanceSearch.time=action.payload.data;
            }
            else if(action.payload.type=="sortField"){
                state.advanceSearch.sortField=action.payload.data;
            }
            else if(action.payload.type=="sortDirection"){
                state.advanceSearch.sortDirection=action.payload.data;
            }
        }
    },
    extraReducers: {
        [login.fulfilled]: (state, action) => {
            state.accessToken = action.payload.data.accessToken
            localStorage.setItem('accessToken', action.payload.data.accessToken)
            localStorage.setItem('accessTokenExp', action.payload.data.accessTokenExp)
            localStorage.setItem('refreshToken', action.payload.data.refreshToken)
            localStorage.setItem('refreshTokenExp', action.payload.data.refreshTokenExp)
            state.isLoading = false;
            state.isLoginFail = false;
        },
        [login.rejected]: (state, action) => {
            state.isLoading = false;
            state.isLoginFail = true;
        },
        [login.pending]: (state, action) => {
            state.isLoading = true
            // state.current = action.payload || {};
        },
    }
})
export default userSlice.reducer;
export const {
    updateRefresh,
    updateShowMenu,
    updateToken,
    updateProjectRedux,
    updateLanguage,
    logout,
    updateLoading,
    updateRole,
    updateUsername,
    updateUserInfo,
    updateIsSignIn,
    changeSettingColumnSlice,
    updateExpenseSearch,
    updateAdvanceSearch
} = userSlice.actions;
