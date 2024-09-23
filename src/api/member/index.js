import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiMember {
    getAllMember = (r) => {
        return axiosClient.get(API_MAP.GET_ALL_MEMBERS + convertObjectToParameter(r))
    }
    getGuestType = () => {
        return axiosClient.get(API_MAP.GET_GUEST_TYPE)
    }
    getMemberStatus = () => {
        return axiosClient.get(API_MAP.GET_MEMBER_STATUS)
    }
    getDiscount = () => {
        return axiosClient.get(API_MAP.GET_DISCOUNT)
    }
    getArea = () => {
        return axiosClient.get(API_MAP.GET_AREA)
    }
    getNations = () => {
        return axiosClient.get(API_MAP.GET_NATIONS)
    }
    getTitle = () => {
        return axiosClient.get(API_MAP.GET_TITLE)
    }
    getGender = () => {
        return axiosClient.get(API_MAP.GET_GENDER)
    }
    getMarital = () => {
        return axiosClient.get(API_MAP.GET_MARITAL)
    }
    createMember = (data) => {
        return axiosClient.post(API_MAP.CREATE_MEMBER,data)
    }
    updateMember = (data) => {
        return axiosClient.post(API_MAP.UPDATE_MEMBER,data)
    }
    deleteMember = (data) => {
        return axiosClient.post(API_MAP.DELETE_MEMBER,data)
    }
    searchMember = (data) => {
        return axiosClient.get(API_MAP.SEARCH_MEMBER+convertObjectToParameter(data))
    }
    searchGuestOfMember = (data) => {
        return axiosClient.get(API_MAP.GET_GUEST_OF_MEMBER+convertObjectToParameter(data))
    }

}

const apiMember = new ApiMember();

export default apiMember;