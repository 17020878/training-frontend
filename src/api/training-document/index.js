import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiTrainingDocument{
    getAllTrainingDocument = () => {
        return axiosClient.get(API_MAP.GET_ALL_TRAINING_DOCUMENT);
    }
    getDetailTrainingDocument = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_TRAINING_DOCUMENT+`?id=${id}`);
    }
    searchTrainingDocument = (data) => {
        return axiosClient.get(API_MAP.SEARCH_TRAINING_DOCUMENT+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}`);
    }



    createTrainingDocument = (data) => {
        return axiosClient.post(API_MAP.CREATE_TRAINING_DOCUMENT, data);
    }
    deleteTrainingDocument = (id) => {
        return axiosClient.post(API_MAP.DELETE_TRAINING_DOCUMENT+`?id=${id}`);
    }
    updateTrainingDocument = (data) => {
        return axiosClient.post(API_MAP.UPDATE_TRAINING_DOCUMENT, data);
    }

}

const apiTrainingDocument = new ApiTrainingDocument();
export default apiTrainingDocument;