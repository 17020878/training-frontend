import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiExpense{
    getExpense= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE,body)
    }
    getExpenseAll= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE_ALL,body)
    }
    getExpenseById= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE_BY_ID,body)
    }
    createExpense= (body) => {
        return axiosClient.post(API_MAP.CREATE_EXPENSE,body)
    }
    saveAndExportExpense= (body) => {
        return axiosClient.post(API_MAP.EXPORT_EXCEL_PAY,body)
    }
    updateExpense= (body) => {
        return axiosClient.post(API_MAP.UPDATE_EXPENSE,body)
    }
    deleteExpense= (body) => {
        return axiosClient.post(API_MAP.DELETE_EXPENSE,body)
    }
    clearAdvance= (body) => {
        return axiosClient.post(API_MAP.CLEAR_ADVANCE,body)
    }
    getExpenseMonth= (body) => {
        return axiosClient.post(API_MAP.GET_EXPENSE_MONTH,body)
    }
}

const apiExpense = new ApiExpense();

export default apiExpense;