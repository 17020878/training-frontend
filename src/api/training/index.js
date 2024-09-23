import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiTraining{
    getAllTraining = () => {
        return axiosClient.get(API_MAP.GET_ALL_TRAINING);
    }
    getDetailTraining = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_TRAINING+`?id=${id}`);
    }
    searchTraining = (data) => {
        return axiosClient.get(API_MAP.SEARCH_TRAINING+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.organizationId?`&organizationId=${data.organizationId}` : ''}${data.type?`&type=${data.type}` : ''}`);
    }



    createTraining = (data) => {
        return axiosClient.post(API_MAP.CREATE_TRAINING, data);
    }
    deleteTraining = (id) => {
        return axiosClient.post(API_MAP.DELETE_TRAINING+`?id=${id}`);
    }
    updateTraining = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_TRAINING+`?id=${id}`, data);
    }

}

const apiTraining = new ApiTraining();
export default apiTraining;