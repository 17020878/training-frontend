import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiAdvance{
    getAdvance = (data) => {
        return axiosClient.post(API_MAP.GET_ADVANCE,data)
    }
    getAdvanceAll = () => {
        return axiosClient.post(API_MAP.GET_ADVANCE_ALL)
    }
    createAdvance = (data) => {
        return axiosClient.post(API_MAP.CREATE_ADVANCE,data)
    }
    updateAdvance = (data) => {
        return axiosClient.post(API_MAP.UPDATE_ADVANCE,data)
    }
    deleteAdvance = (data) => {
        return axiosClient.post(API_MAP.DELETE_ADVANCE,data)
    }
    getAdvanceById = (data) => {
        return axiosClient.post(API_MAP.DELETE_ADVANCE_BY_ID,data)
    }
    changeActive = (data) => {
        return axiosClient.post(API_MAP.CHANGE_ACTIVE_ADVANCE,data)
    }

}

const apiAdvance = new ApiAdvance();

export default apiAdvance;