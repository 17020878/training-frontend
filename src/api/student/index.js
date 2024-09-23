import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiStudent{
    getAllStudent = () => {
        return axiosClient.get(API_MAP.GET_ALL_STUDENT);
    }
    getDetailStudent = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_STUDENT+`?id=${id}`);
    }
    searchStudent = (data) => {
        return axiosClient.get(API_MAP.SEARCH_STUDENT+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}${data.organizationId?`&organizationId=${data.organizationId}` : ''}${data.type?`&type=${data.type}` : ''}`);
    }



    createStudent = (data) => {
        return axiosClient.post(API_MAP.CREATE_STUDENT, data);
    }
    deleteStudent = (id) => {
        return axiosClient.post(API_MAP.DELETE_STUDENT+`?id=${id}`);
    }
    updateStudent = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_STUDENT+`?id=${id}`, data);
    }

}

const apiStudent = new ApiStudent();
export default apiStudent;