import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiGroupExpense{
    getGroupExpense= () => {
        return axiosClient.post(API_MAP.GET_GROUP_EXPENSE)
    }
    getExpenseGroupExpense= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE_GROUP_EXPENSE,body)
    }
    createGroupExpense= (body) => {
        return axiosClient.post(API_MAP.CREATE_GROUP_EXPENSE,body)
    }
    updateGroupExpense= (body) => {
        return axiosClient.post(API_MAP.UPDATE_GROUP_EXPENSE,body)
    }
    deleteGroupExpense= (body) => {
        return axiosClient.post(API_MAP.DELETE_GROUP_EXPENSE,body)
    }

}

const apiGroupExpense = new ApiGroupExpense();

export default apiGroupExpense;