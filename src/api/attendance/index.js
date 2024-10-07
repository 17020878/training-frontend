import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiAttendance{
    getAllStudentBySession= (id) => {
        return axiosClient.get(API_MAP.GET_ALL_STUDENT_BY_SESSION+`?id=${id}`);
    }




    updateAttendance = (data) => {
        return axiosClient.post(API_MAP.UPDATE_ATTENDANCE, data);
    }
    getAllAttendanceByTraining= (ids) => {
        return axiosClient.post(API_MAP.GET_ALL_ATTENDANCE_BY_TRAINING,ids);
    }

    getAllAttendanceByTrainingClass= (ids) => {
        return axiosClient.post(API_MAP.GET_ALL_ATTENDANCE_BY_TRAINING_CLASS,ids);
    }


}

const apiAttendance = new ApiAttendance();
export default apiAttendance;