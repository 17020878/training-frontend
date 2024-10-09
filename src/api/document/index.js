import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiDocument{
    downloadFile = (id, type) => {
        return axiosClient.get(API_MAP.DOWNLOAD_FILE + `?id=${id}&type=${type}`, { responseType: 'arraybuffer' });
    }



    

}

const apiDocument = new ApiDocument();
export default apiDocument;