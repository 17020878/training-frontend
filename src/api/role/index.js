import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiRole{
    getListRole= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_ROLE,data)
    }
    createRole= (data) => {
        return axiosClient.post(API_MAP.CREATE_ROLE,data)
    }
    updateRole= (data) => {
        return axiosClient.post(API_MAP.UPDATE_ROLE,data)
    }
    deleteRole= (data) => {
        return axiosClient.post(API_MAP.DELETE_ROLE,data)
    }
    getListPermission= () => {
        return axiosClient.post(API_MAP.GET_LIST_PERMISSIONS)
    }
    getRolePermission= (data) => {
        return axiosClient.post(API_MAP.GET_ROLE_PERMISSION,data)
    }
    setPermission= (data) => {
        return axiosClient.post(API_MAP.SET_PERMISSION,data)
    }
}

const apiRole = new ApiRole();

export default apiRole;