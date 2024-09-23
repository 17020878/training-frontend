import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiTrainingClass{
    getAllTrainingClass = () => {
        return axiosClient.get(API_MAP.GET_ALL_TRAINING_CLASS);
    }
    getDetailTrainingClass = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_TRAINING_CLASS+`?id=${id}`);
    }
    getAllTrainingClassByTraining = (id) => {
        return axiosClient.get(API_MAP.GET_ALL_TRAINING_CLASS_BY_TRAINING+`?trainingId=${id}`);
    }
    searchTrainingClass = (data) => {
        return axiosClient.get(API_MAP.SEARCH_TRAINING_CLASS+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.organizationId?`&organizationId=${data.organizationId}` : ''}${data.type?`&type=${data.type}` : ''}`);
    }



    createTrainingClass = (data) => {
        return axiosClient.post(API_MAP.CREATE_TRAINING_CLASS, data);
    }
    deleteTrainingClass = (id) => {
        return axiosClient.post(API_MAP.DELETE_TRAINING_CLASS+`?id=${id}`);
    }
    updateTrainingClass = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_TRAINING_CLASS+`?id=${id}`, data);
    }

}

const apiTrainingClass = new ApiTrainingClass();
export default apiTrainingClass;