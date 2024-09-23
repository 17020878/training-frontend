import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiPlan{
    getAllPlan = () => {
        return axiosClient.get(API_MAP.GET_ALL_PLAN);
    }
    getDetailPlan = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_PLAN+`?id=${id}`);
    }
    searchPlan = (data) => {
        console.log(data)
        return axiosClient.get(API_MAP.SEARCH_PLAN+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.organizationId?`&organizationId=${data.organizationId}` : ''}${data.type?`&type=${data.type}` : ''}`);
    }



    createPlan = (data) => {
        return axiosClient.post(API_MAP.CREATE_PLAN, data);
    }
    deletePlan = (id) => {
        return axiosClient.post(API_MAP.DELETE_PLAN+`?id=${id}`);
    }
    updatePlan = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_PLAN+`?id=${id}`, data);
    }
}

const apiPlan = new ApiPlan();
export default apiPlan;