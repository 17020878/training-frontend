import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiUser{
    getUserInfo= (data) => {
        return axiosClient.post(API_MAP.GET_USER_INFO,data)
    }
    getListUser= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_USER,data)
    }
    changeActiveUser= (data) => {
        return axiosClient.post(API_MAP.CHANGE_ACTIVE_USER,data)
    }
    createUser= (data) => {
        return axiosClient.post(API_MAP.CREATE_USER,data)
    }
    updateUser= (data) => {
        return axiosClient.post(API_MAP.UPDATE_USER,data)
    }
    deleteUser= (data) => {
        return axiosClient.post(API_MAP.DELETE_USER,data)
    }
}

const apiUser = new ApiUser();

export default apiUser;