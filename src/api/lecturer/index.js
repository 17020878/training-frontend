import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiLecturer{
    getAllLecturer = () => {
        return axiosClient.get(API_MAP.GET_ALL_LECTURER);
    }
    getDetailLecturer = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_LECTURER+`?id=${id}`);
    }
    searchLecturer = (data) => {
        return axiosClient.get(API_MAP.SEARCH_LECTURER+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}`);
    }



    createLecturer = (data) => {
        return axiosClient.post(API_MAP.CREATE_LECTURER, data);
    }
    deleteLecturer = (id) => {
        return axiosClient.post(API_MAP.DELETE_LECTURER+`?id=${id}`);
    }
    updateLecturer = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_LECTURER+`?id=${id}`, data);
    }

}

const apiLecturer = new ApiLecturer();
export default apiLecturer;