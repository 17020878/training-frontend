import axios from 'axios';
import queryString from 'query-string';
import API_MAP from "../constants/api";
import {clearToken} from "../constants/common";
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem('accessToken');
    const accessTokenExp = localStorage.getItem('accessTokenExp');
    if (accessToken != null && accessToken != undefined && accessTokenExp != null && accessTokenExp != undefined) {
        const currentTime = Date.now(); // Chuyển đổi thời gian hiện tại thành giây
        if (currentTime >= Number(accessTokenExp)) {
            console.log("token hết hạn")
            let r = await refreshToken();
            localStorage.setItem('accessToken', r.accessToken);
            localStorage.setItem('accessTokenExp', r.accessTokenExp);
            accessToken = r.accessToken;
        }
    }
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;

}, (error) => {

    let url = new URL(window.location.href);
    let paramDomain = url.searchParams.get("domain")
    if (error.response) {
        switch (error.response.status) {
            case 401:
                clearToken()
                window.location.href = "/login"
                break
        }
    }
    throw error;
});

async function refreshToken() {
    console.log("refresh token")
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenExp = localStorage.getItem('refreshTokenExp');
    if (refreshToken && refreshTokenExp) {
        const currentTime = Date.now(); // Chuyển đổi thời gian hiện tại thành giây
        if (currentTime >= Number(refreshTokenExp)) {
            console.log("refresh token hết hạn")
            clearToken()
            window.location.href = "/login";
            return;
        }
    }
    let response = await axios.post(API_MAP.REFRESH_TOKEN, {
        refreshToken: localStorage.getItem('refreshToken'),
    }).catch(e=>{
        clearToken()
        window.location.href = "/login";
    });
    return {
        accessToken: response.data.data.accessToken,
        accessTokenExp: response.data.data.accessTokenExp
    }
}

export default axiosClient;