import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiOrganization{
    getOrganization= () => {
        return axiosClient.post(API_MAP.GET_ORGANIZATION)
    }
    getOrganizationByUser= () => {
        return axiosClient.post(API_MAP.GET_ORGANIZATION_BY_USER)
    }
    createOrganization= (body) => {
        return axiosClient.post(API_MAP.CREATE_ORGANIZATION,body)
    }
    updateOrganization= (body) => {
        return axiosClient.post(API_MAP.UPDATE_ORGANIZATION,body)
    }
    deleteOrganization= (body) => {
        return axiosClient.post(API_MAP.DELETE_ORGANIZATION,body)
    }
    getExpenseOrganization= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE_ORGANIZATION,body)
    }

}

const apiOrganization = new ApiOrganization();

export default apiOrganization;