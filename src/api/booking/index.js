import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiBooking{
    getListBooking = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_BOOKING+convertObjectToParameter(data))
    }
    getListCourse = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_COURSE+convertObjectToParameter(data))
    }
    getListTeeTime = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_TEETIME+convertObjectToParameter(data))
    }
    getListTeeTimeInfo = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_TEETIME_INFO+convertObjectToParameter(data))
    }
    getListGuestTeeTime = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_GUEST_TEETIME+convertObjectToParameter(data))
    }
    getListCaddy= (data) => {
        return axiosClient.get(API_MAP.GET_LIST_CADDY+convertObjectToParameter(data))
    }
    createBooking= (data) => {
        return axiosClient.post(API_MAP.CREATE_BOOKING,data)
    }
    createSchedule= (data) => {
        return axiosClient.post(API_MAP.CREATE_SCHEDULE,data)
    }
    createDailyTeeTime= (data) => {
        return axiosClient.post(API_MAP.CREATE_DAILY_TEETIME+convertObjectToParameter(data))
    }
    updateBooking= (data) => {
        return axiosClient.put(API_MAP.UPDATE_BOOKING,data)
    }
    deleteBooking= (data) => {
        return axiosClient.post(API_MAP.DELETE_BOOKING,data)
    }
    transferSchedule= (data) => {
        return axiosClient.post(API_MAP.TRANSFER_SCHEDULE,data)
    }
    exportExel= (data) => {
        return axiosClient.get(API_MAP.EXPORT_EXEL+convertObjectToParameter(data))
    }
    getNotification= () => {
        return axiosClient.get(API_MAP.GET_NOTIFICATION)
    }
}

const apiBooking = new ApiBooking();

export default apiBooking;