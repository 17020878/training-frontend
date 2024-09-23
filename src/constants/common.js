export const OPTION_TOAST = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
}
export const clearToken = () => {
    localStorage.clear();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("accessTokenExp");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExp");
}
export const compareDate = (a, b) => {
    if(a=="Empty"||b=="Empty"){
        return false
    }else
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}
export const convertObjectToParameter=(obj) => {
    let result ='?';
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(obj[key])
            result += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]) + "&";
        }
    }
    return result;
}
export const convertToAutoComplete = (arr,name) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label=arr[i][name];
    }
    return arr;
}
export const getNameCaddy = (arr,CaddyNo) => {

    let caddy = arr.find(function (obj) {
        return obj.CaddyNo === CaddyNo;
    });
    return caddy?caddy.CaddyName:'';
}
export const getIdGuestType = (arr,name) => {
    let type = arr.find(function (obj) {
        return obj.label === name;
    });
    return type?type.id:'';
}
export const convertCustomToAutoComplete = (arr,id,name) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label=arr[i][name];
        arr[i].id=arr[i][id];
    }
    return arr;
}
export const convertCaddyToAutoComplete = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label=arr[i]['CaddyName']+' - '+arr[i]['CaddyNo'];
        arr[i].id=arr[i]['CaddyNo'];
    }
    return arr;
}
export const checkDuplicateMember = (arr) => {
    const idSet = new Set();
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if(!isNotEmpty(obj.MemberID)) continue;
        if (idSet.has(obj.MemberID)) {
            return true;
        }
        idSet.add(obj.MemberID);
    }
    return false; // Không tìm thấy đối tượng trùng id
}
export const checkDuplicateCaddy = (arr) => {
    const idSet = new Set();
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if(!isNotEmpty(obj.CaddyNo)) continue;
        if (idSet.has(obj.CaddyNo)) {
            return true;
        }
        idSet.add(obj.CaddyNo);
    }
    return false; // Không tìm thấy đối tượng trùng id
}
export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export const convertTeeTimeToAutoComplete = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let date = new Date(arr[i].TeeTime);
        arr[i].label=`${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    }
    return arr;
}
export const isNotEmpty = (value) => {
    return value !== null && value !== undefined && value !== '';
}
export const getLabelTeeTime = (value) => {
    let date = new Date(value);
    return `${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}