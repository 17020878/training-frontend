import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiTableConfig{
    get= (tableName) => {
        return axiosClient.post(API_MAP.GET_CONFIG_TABLE+`?type=${tableName}`)
    }
    update= (data, tableName) => {
        return axiosClient.post(API_MAP.UPDATE_CONFIG_TABLE+`?type=${tableName}`,data)
    }
    default= (tableName) => {
        return axiosClient.post(API_MAP.DEFAULT_CONFIG_TABLE+`?type=${tableName}`)
    }

}

const apiTableConfig = new ApiTableConfig();

export default apiTableConfig;