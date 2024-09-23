import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiTrainingSession{
    getAllTrainingSession = () => {
        return axiosClient.get(API_MAP.GET_ALL_TRAINING_SESSION);
    }
    getDetailTrainingSession = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_TRAINING_SESSION+`?id=${id}`);
    }
    searchTrainingSession = (data) => {
        return axiosClient.get(API_MAP.SEARCH_TRAINING_SESSION+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}`);
    }



    createTrainingSession = (data) => {
        return axiosClient.post(API_MAP.CREATE_TRAINING_SESSION, data);
    }
    deleteTrainingSession = (id) => {
        return axiosClient.post(API_MAP.DELETE_TRAINING_SESSION+`?id=${id}`);
    }
    updateTrainingSession = (data) => {
        return axiosClient.post(API_MAP.UPDATE_TRAINING_SESSION, data);
    }

}

const apiTrainingSession = new ApiTrainingSession();
export default apiTrainingSession;