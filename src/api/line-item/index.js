import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiLineItem{
    getLineItem= () => {
        return axiosClient.post(API_MAP.GET_LINE_ITEM)
    }

    createLineItem= (body) => {
        return axiosClient.post(API_MAP.CREATE_LINE_ITEM,body)
    }
    updateLineItem= (body) => {
        return axiosClient.post(API_MAP.UPDATE_LINE_ITEM,body)
    }
    deleteLineItem= (body) => {
        return axiosClient.post(API_MAP.DELETE_LINE_ITEM,body)
    }

}

const apiLineItem = new ApiLineItem();

export default apiLineItem;