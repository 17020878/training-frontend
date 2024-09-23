import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {createAsyncThunk} from "@reduxjs/toolkit";
const loginApi = createAsyncThunk(
    'user/loginApi',
    async (params, { dispatch, getState }) => {
        return axiosClient.post(API_MAP.LOGIN, params)
    }
)

export default loginApi;