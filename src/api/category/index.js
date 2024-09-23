import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiCategory {
    getCategory= (body) => {
        return axiosClient.post(API_MAP.GET_CATEGORY,body)
    }
    createCategory= (body) => {
        return axiosClient.post(API_MAP.CREATE_CATEGORY,body)
    }
    updateCategory= (body) => {
        return axiosClient.post(API_MAP.UPDATE_CATEGORY,body)
    }
    deleteCategory= (body) => {
        return axiosClient.post(API_MAP.DELETE_CATEGORY,body)
    }
    getExpensePlan= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE_PLAN,body)
    }

}

const apiCategory = new ApiCategory();

export default apiCategory;