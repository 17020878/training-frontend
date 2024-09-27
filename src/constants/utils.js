import {Typography} from "@mui/material";

export const convertToObjectMisa = (data) => {
    return JSON.parse(data.data)
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const getListColor = (length) => {
    let backgroundColor = [
        '#5788ec',
        '#80e69c',
        '#ff8d8d',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF8C00',
        '#FF5733',
        '#1E90FF',
        '#FF00FF',
        '#FF4500',
        '#32CD32',
        '#FF1493',
        '#00CED1',
        '#FFD700',
        '#8A2BE2',
        '#FF69B4',
        '#00FF7F',
        '#FFA500',
        '#008080',
        '#8B008B',
        '#FF6347',
        '#00FF00',
        '#FF00FF',
        '#FFFF00',
        '#800000',
        '#00FFFF',
        '#FFC0CB',
        '#800080'
    ]
    return backgroundColor.slice(0, length)
}

const Utils= {
    localizedTextsMap :{
        columnMenuHideColumn: "Ẩn",
        columnMenuShowColumns: "Hiện",
        noRowsLabel:"Không có kết quả",
        toolbarColumns:"Cột",
        toolbarDensity: 'Khoảng cách',
        toolbarDensityLabel: 'Khoảng cách',
        toolbarDensityCompact: 'Nhỏ',
        toolbarDensityStandard: 'Tiêu chuẩn',
        toolbarDensityComfortable: 'Rộng',
        MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count }) =>
                `${from} - ${to} của ${count}`,
        },
        footerTotalRows: 'Total Rows:',
    },
    options: {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    },
};
export function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}
//định dạng ngày tháng để cho vào formDate
export function formatDateToTimeStamp(timestamp){
    const date = new Date(Number(timestamp));
    // Tạo định dạng ngày tháng
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'GMT'
    };
    return date.toLocaleString('en-US', options).replace(',', ' GMT');
}
//kiểm tra id trong list organization là khối, đơn vị hay phòng ban
export function getNodeType(id, data) {
    // Tìm nút với ID đã cho trong dữ liệu
    for (const node of data) {
        console.log(node)
        if (node.id === id) {
            // Kiểm tra cấp bậc
            if (node.parentId === 0) {
                return "Block";
            } else {
                for (const parentNode of data) {
                    if (parentNode.id === node.parentId) {
                        if (parentNode.parentId === 0) {
                            return "Unit";
                        } else {
                            return "Department";
                        }
                    }
                }
            }
        }
    }

    // Nếu không tìm thấy, trả về "Unknown"
    return "All";
}
export function buildTree(inputList, parentId = null) {
    const tree = [];
    // Lọc ra các đối tượng có parentId tương ứng hoặc parentId=null (node to nhất)
    const filteredObjects = inputList.filter(obj => obj.ParentID === parentId || (parentId === null && obj.ParentID === undefined));

    // Tạo đối tượng cây với mỗi đối tượng trong danh sách
    filteredObjects.forEach(obj => {
        const {OrganizationUnitID, OrganizationUnitName, label, value, IsParent} = obj;
        const node = {
            label: OrganizationUnitName || label,
            key: OrganizationUnitID || value,
            data: OrganizationUnitID || value,

        };

        // Nếu đối tượng có IsParent=true, tiếp tục xây dựng cây với các đối tượng con
        if (IsParent) {
            node.children = buildTree(inputList, OrganizationUnitID);
        }

        tree.push(node);
    });

    return tree;
}

export const currencyFormatter = (value) => {
    const options = {
        significantDigits: 0,
        thousandsSeparator: '.',
        decimalSeparator: ',',
        symbol: ''
    }
    if (typeof value !== 'number' || value <= 0) value = 0.0
    value = value.toFixed(options.significantDigits)

    const [currency, decimal] = value.split('.')
    return `${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.thousandsSeparator
    )}`
    // )}${options.decimalSeparator}${decimal} ${options.symbol}`
}
export const getListYear = () => {
    let listYear = [];
    for (let i = 2010; i < 2025; i++) {
        let item = {
            value: `${i}-01-01/${i}-12-31`,
            name: i
        }
        listYear.push(item);
    }
    return listYear;
}
export const getListMonth = (year) => {
    let listYear = [];
    for (let i = 1; i < 13; i++) {
        let item = {
            value: `${i}-${i}-01/${i}-${i}-31`,
            name: i
        }
        listYear.push(item);
    }
    return listYear;
}
//lấy các ob từ 1 list ob cô vào 1 list ob mới
export const getListObjectBykey = (sessions, key) => {
    const result = [];
    sessions.forEach(session => {
        if (session[key]) {
            if (Array.isArray(session[key])) {
                result.push(...session[key]);
            } else {
                result.push(session[key]);
            }
        }
    });
    return result;
}
//lấy list loai khoa dao tao trong plan cho vao training
export const getTrainingTypesPutInTraining = (jsonPlan, jsonTraining) => {
    jsonTraining.forEach(item => {
        const planIdToCheck = item.plan.id; // Lấy ID của plan từ từng item trong jsonTraining
        const planFromJsonPlan = jsonPlan.find(plan => plan.id === planIdToCheck); // Tìm đối tượng kế hoạch trong jsonPlan

        if (planFromJsonPlan) {
            // Lấy trainingTypes từ jsonPlan
            const trainingTypes = planFromJsonPlan.trainingTypes;
            // Gán trainingTypes vào item
            item.trainingTypes = trainingTypes;
        }
    });
    return jsonTraining;
}
export const getListStatusStudentByAttendance = (data) => {
    const result = {};

    data.forEach(item => {
        const { student, statusId, trainingId } = item;
        const { id: studentId, name } = student;

        if (!result[trainingId]) {
            result[trainingId] = {};
        }

        if (!result[trainingId][studentId]) {
            result[trainingId][studentId] = { count: 0, statusCount: { 3: 0, 6: 0 } };
        }

        result[trainingId][studentId].count++;
        if (statusId === 3 || statusId === 6) {
            result[trainingId][studentId].statusCount[statusId]++;
        }
    });

    const finalResult = [];

    for (const trainingId in result) {
        for (const studentId in result[trainingId]) {
            const { count, statusCount } = result[trainingId][studentId];
            const totalStatusCount = statusCount[3] + statusCount[6];
            const percentage = (totalStatusCount / count) * 100;

            if (percentage > 30) {
                finalResult.push({ id: studentId, name: "Không đạt" });
            } else {
                finalResult.push({ id: studentId, name: "Đạt" });
            }
        }
    }
    return finalResult;
}
//tính toán chi phí theo đối tượng học viên
export const expenseByStudentObject = (data) => {
   const result = data.reduce((acc, item) => {
        const studentId = item.studentObject.id;
        const studentName = item.studentObject.name;
        const expense = item.totalExpense || 0;

        if (!acc[studentId]) {
            acc[studentId] = { name: studentName, value: 0 };
        }

        acc[studentId].value += expense;

        return acc;
    }, {});
    return Object.values(result).map((item, index) => ({
        index: index,
        ...item
    }));
}
//đếm số lượng để cho vào thống kê
export const typeDashboardStatistical = (jsonString, key, key1, key2) => {
    // Parse chuỗi JSON thành một mảng các object
    var objects = (jsonString);

    // Thống kê số lượng typeGroup
    var countByTypeGroup = {};
    objects.forEach(function(object) {
        var typeGroup = object[key];
        if (countByTypeGroup.hasOwnProperty(typeGroup)) {
            countByTypeGroup[typeGroup] += 1;
        } else {
            countByTypeGroup[typeGroup] = 1;
        }
    });
    // Tạo JSON mới chứa thông tin thống kê
    var result = [];
    for (var typeGroup in countByTypeGroup) {
        result.push({ [key1]: typeGroup, [key2]: countByTypeGroup[typeGroup] });
    }
    return result;
}
export function buildTreeAsset(inputList, parentId = null) {
    const tree = [];
    // Lọc ra các đối tượng có parentId tương ứng hoặc parentId=null (node to nhất)
    const filteredObjects = inputList.filter(obj => obj.parentId === parentId || (parentId === null && obj.parentId === undefined));
    // const filteredObjects = inputList.filter(obj => obj.parentId === parentId );
    // Tạo đối tượng cây với mỗi đối tượng trong danh sách
    filteredObjects.forEach(obj => {
        const {id, name, description,amount} = obj;
        const node = {
            label: name,
            key: id,
            data: id,
            description: description,
            amount:amount
        };

        const hasChildren = inputList.some(childObj => childObj.parentId === obj.id);
        if (hasChildren) {
            node.children = buildTreeAsset(inputList, id);
        }

        tree.push(node);
    });

    return tree;
}

export const buildInputTree = (arr) => {
    let result = [...arr]
    for (let i = 0; i < arr.length; i++) {
        let check =false;
        for (let j = 0; j < arr.length; j++) {
            if(arr[i].parentId===arr[j].id){
                check=true;
                break;
            }
        }
        if(!check){
            arr[i].parentId=null
        }
    }
    return result;

}
// export function buildTreeAsset(inputList, parentId = null) {
//     const tree = [];
//     // Lọc ra các đối tượng có parentId tương ứng hoặc parentId=null (node to nhất)
//     // const filteredObjects = inputList.filter(obj => obj.parentId === parentId || (parentId === null && obj.parentId === undefined));
//     const filteredObjects = inputList.filter(obj => obj.parentId === parentId );
//
//     // Tạo đối tượng cây với mỗi đối tượng trong danh sách
//     filteredObjects.forEach(obj => {
//         const {id, name, description} = obj;
//         const node = {
//             label: name,
//             key: id,
//             data: id,
//             description:description
//         };
//
//         const hasChildren = inputList.some(childObj => childObj.parentId === obj.id);
//         if (hasChildren) {
//             node.children = buildTreeAsset(inputList, id);
//         }
//
//         tree.push(node);
//     });
//
//     return tree;
// }

export function compareTreeKeys(tree, key1, key2) {
    function compareTreeKeysChild(node, key2) {
        if (node.key == key2) {
            return true;
        } else {
            if (node.children) {
                for (let childNode of node.children) {
                    if (compareTreeKeysChild(childNode, key2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    if (tree.key == key1) {
        if (tree.children) {
            for (let node of tree.children) {
                if (compareTreeKeysChild(node, key2)) {
                    return true;
                }
            }
        }
    } else {
        if (tree.children) {
            for (let node of tree.children) {
                if (compareTreeKeys(node, key1, key2)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export const filterListKey = (tree, selectedNodeKeys) => {
    let listDel = [];
    let listKey = [];
    for (const id in selectedNodeKeys) {
        if (selectedNodeKeys[id].checked == true) {
            listKey.push(id)
        }
    }
    for (let i = 0; i < listKey.length; i++) {
        if (!listDel.includes(listKey[i])) {
            for (let j = 0; j < listKey.length; j++) {
                if (!listDel.includes(listKey[j])) {
                    if (i != j) {
                        if (compareTreeKeys(tree, listKey[i], listKey[j])) {
                            listDel.push(listKey[j])
                        }
                    }
                }

            }
        }
    }
    let result = '';
    for (let i = 0; i < listKey.length; i++) {
        if (!listDel.includes(listKey[i])) {
            result = result + (result === '' ? '' : ';') + listKey[i];
        }
    }
    return result;
}
export const getFirstDayOfMonth = () => {
    let currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDayOfMonth.toISOString();
}
export const getEndDayOfMonth = () => {
    let currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return lastDayOfMonth.toISOString();
}
export function sortTreeData(data) {
    if (!data || data.length === 0) {
        return data;
    }
    return data.sort((a, b) => {
        if (a.children && !b.children) {
            return -1; // Mục a có children, mục b không có children => a lên trước b
        } else if (!a.children && b.children) {
            return 1; // Mục b có children, mục a không có children => b lên trước a
        } else {
            return a.label.localeCompare(b.label); // Sắp xếp theo thứ tự bảng chữ cái
        }
    }).map(item => {
        if (item.children && item.children.length > 0) {
            item.children = sortTreeData(item.children);
        }
        return item;
    });
}
export const getTitleFromCodeCategory = (type) => {
    if (type == "StudentObject") {
        return "Đối tượng học viên"
    } else if (type == "LecturerObject") {
        return "Đối tượng giảng viên"
    } else if (type == "Lecturer") {
        return "Danh sách giảng viên"
    } else if (type == "Student") {
        return "Danh sách học viên"
    } else if (type == "OrganizationLocation") {
        return "Địa điểm tổ chức"
    } else if (type == "TrainingType") {
        return "Loại khóa đào tạo"
    }else if (type == "FormTraining") {
        return "Hình thức đào tạo"
    }else if (type == "ParticipantUnit") {
        return "Đơn vị tham gia"
    }else if (type == "Vendor") {
        return "Nhà cung cấp"
    }
}
export const getDateTimeFromTimestamp = (unixTimeStamp) => {
    if(unixTimeStamp) {
        let date = new Date(unixTimeStamp);
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    }else return '';
}
//xóa id trong mảng id
export function checkIdInListObject(data, id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            return true; // ID có trong danh sách
        }
    }
    return false;
}
export function deleteIdInArray(array, index){
    // Kiểm tra xem chỉ số có hợp lệ hay không
    if (index < 0 || index >= array.length) {
        return array; // Trả về mảng gốc nếu chỉ số không hợp lệ
    }
    // Sử dụng splice() để xóa phần tử tại vị trí chỉ định
    array.splice(index, 1);

    return array; // Trả về mảng đã được sửa đổi
}
//xóa id trùng trong list object
export function removeDuplicateObjects(objects) {
    return objects.reduce((acc, current) => {
        const existingObject = acc.find(obj => obj.studentId === current.studentId);
        if (!existingObject) {
            acc.push(current);
        }
        return acc;
    }, []);
}
//xóa id trùng, xóa luôn cả id trùng đó
export function deleteAllIdSame(data){
    return Object.values(data.reduce((acc, curr) => {
        if (!acc[curr.id]) {
            acc[curr.id] = {
                count: 0,
                item: curr
            };
        }
        acc[curr.id].count++;
        return acc;
    }, {})).filter(item => item.count === 1).map(item => item.item);
}
export function checkOb2AndObj2(obj1, obj2) {

    let hasElementInObj2 = false;
    if(obj1 && obj2){
        for (let i = 0; i < obj1.length; i++) {
            for (let j = 0; j < obj2.length; j++) {
                if (obj1[i].id === obj2[j].id && obj1[i].name === obj2[j].name) {
                    hasElementInObj2 = true;
                    break;
                }
            }
            if (hasElementInObj2) {
                break;
            }
        }
    }

    return hasElementInObj2;
}
export function getNameToId(list, id) {
    for (let i=0; i<list.length; i++) {
        if(list[i].id==id){
            return list[i].name;
        }
    }
    return "";
}
export function getValueKeyToId(list,key, id) {
    for (let i=0; i<list.length; i++) {
        if(list[i].id==id){
            return list[i][key];
        }
    }
    return "";
}
//cập nhật student với status mới
export function updateStudentStatus(listResult, studentId, newStatusId) {
    for (let i = 0; i < listResult.length; i++) {
        if (listResult[i].student.id === studentId) {
            listResult[i].statusId = newStatusId;
            return listResult;
        }
    }
    return listResult;
}
export function formatVND(amount) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    });

    return formatter.format(amount);
}
export const convertArr = (arr, listResult) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].stt = (listResult.page) * listResult.pageSize + i + 1;
    }
    return arr;
}
export function calculateTotalAmounts(data) {
    function calculateTotalAmount(item) {
        if (!item.children || item.children.length === 0) {
            return item.amount;
        }

        let totalAmount = item.amount;

        for (const child of item.children) {
            totalAmount += calculateTotalAmount(child);
        }

        return totalAmount;
    }

    function addTotalAmountToParents(item) {
        if (!item.children || item.children.length === 0) {
            item.totalAmount = item.amount;
            return;
        }

        item.totalAmount = item.amount;

        for (const child of item.children) {
            addTotalAmountToParents(child);
            item.totalAmount += child.totalAmount;
        }
    }

    const newData = JSON.parse(JSON.stringify(data));

    for (const item of newData) {
        addTotalAmountToParents(item);
    }

    return newData;
}
export default Utils;