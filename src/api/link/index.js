import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiLink{
    getAllLink = () => {
        return axiosClient.get(API_MAP.GET_ALL_LINK);
    }
    getDetailLink = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_LINK+`?id=${id}`);
    }
    searchLink = (data) => {
        return axiosClient.get(API_MAP.SEARCH_LINK+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}`);
    }



    createLink = (data) => {
        return axiosClient.post(API_MAP.CREATE_LINK, data);
    }
    deleteLink = (id) => {
        return axiosClient.post(API_MAP.DELETE_LINK+`?id=${id}`);
    }
    updateLink = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_LINK+`?id=${id}`, data);
    }

}

const apiLink = new ApiLink();
export default apiLink;