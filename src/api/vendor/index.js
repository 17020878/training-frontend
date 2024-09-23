import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiVendor{
    getAllVendor = () => {
        return axiosClient.get(API_MAP.GET_ALL_VENDOR);
    }
    getDetailVendor = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_VENDOR+`?id=${id}`);
    }
    searchVendor = (data) => {
        return axiosClient.get(API_MAP.SEARCH_VENDOR+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}`);
    }



    createVendor = (data) => {
        return axiosClient.post(API_MAP.CREATE_VENDOR, data);
    }
    deleteVendor = (id) => {
        return axiosClient.post(API_MAP.DELETE_VENDOR+`?id=${id}`);
    }
    updateVendor = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_VENDOR+`?id=${id}`, data);
    }

}

const apiVendor = new ApiVendor();
export default apiVendor;