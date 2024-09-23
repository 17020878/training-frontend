import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiLoginHistory{
    getLoginHistory= (data) => {
        return axiosClient.post(API_MAP.GET_LOGIN_HISTORY,data)
    }
    logoutByAdmin= (data) => {
        return axiosClient.post(API_MAP.LOGOUT_BY_ADMIN,data)
    }

}

const apiLoginHistory = new ApiLoginHistory();

export default apiLoginHistory;