import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiParticipantUnit{
    getAllParticipantUnit = () => {
        return axiosClient.get(API_MAP.GET_ALL_PARTICIPANT_UNIT);
    }
    getDetailParticipantUnit = (id) => {
        return axiosClient.get(API_MAP.GET_DETAIL_PARTICIPANT_UNIT+`?id=${id}`);
    }
    searchParticipantUnit = (data) => {
        return axiosClient.get(API_MAP.SEARCH_PARTICIPANT_UNIT+`?page=${data.page}&size=${data.size}${data.name?`&name=${data.name}` : ''}${data.departmentManage?`&departmentManage=${data.departmentManage}` : ''}`);
    }



    createParticipantUnit = (data) => {
        return axiosClient.post(API_MAP.CREATE_PARTICIPANT_UNIT, data);
    }
    deleteParticipantUnit = (id) => {
        return axiosClient.post(API_MAP.DELETE_PARTICIPANT_UNIT+`?id=${id}`);
    }
    updateParticipantUnit = (data, id) => {
        return axiosClient.post(API_MAP.UPDATE_PARTICIPANT_UNIT+`?id=${id}`, data);
    }

}

const apiParticipantUnit = new ApiParticipantUnit();
export default apiParticipantUnit;