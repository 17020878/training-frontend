const API_DOMAIN = 'http://localhost:8443/';
// const API_DOMAIN = 'https://training.aceoffice.vn/training_be/';
const API_MAP = {
    LOGIN: API_DOMAIN + 'auth/login',
    REFRESH_TOKEN: API_DOMAIN + 'auth/refresh-token',
    GET_USER_INFO: API_DOMAIN + 'user/get-user-info',
    OAUTH2_MICROSOFT: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" +
        "?client_id=4d53bf34-0100-47e0-8afc-9ffe0e94c8eb" +
        "&response_type=token" +
        "&scope=openid profile email User.Read.All" +
        "&redirect_uri=" + API_DOMAIN + "callback/oauth2/microsoft"+
        "&prompt=login"+"" +
        "&state=12345",

    GET_LIST_USER: API_DOMAIN +"user/search",
    CHANGE_ACTIVE_USER:API_DOMAIN+"user/change-active",
    CHANGE_ACTIVE_ADVANCE:API_DOMAIN+"advance/change-active",
    GET_LIST_ROLE:API_DOMAIN+"role/search",
    CREATE_USER:API_DOMAIN+"user/create",
    UPDATE_USER:API_DOMAIN+"user/update",
    CREATE_ROLE:API_DOMAIN+"role/create",
    UPDATE_ROLE:API_DOMAIN+"role/update",
    DELETE_ROLE:API_DOMAIN+"role/delete",
    DELETE_USER:API_DOMAIN+"user/delete",
    GET_LIST_PERMISSIONS:API_DOMAIN+"role/permission/get-all",
    GET_ROLE_PERMISSION:API_DOMAIN+"role/permission",
    SET_PERMISSION:API_DOMAIN+"role/set-permission",
    GET_LOGIN_HISTORY:API_DOMAIN+"login-history/search",
    LOGOUT_BY_ADMIN:API_DOMAIN+"login-history/logout-by-admin",
    GET_ORGANIZATION:API_DOMAIN+"organization/get-all",
    GET_ORGANIZATION_BY_USER:API_DOMAIN+"organization/get-by-user",
    GET_GROUP_EXPENSE:API_DOMAIN+"group-expense/get-all",
    CREATE_GROUP_EXPENSE:API_DOMAIN+"group-expense/create",
    UPDATE_GROUP_EXPENSE:API_DOMAIN+"group-expense/update",
    DELETE_GROUP_EXPENSE:API_DOMAIN+"group-expense/delete",

    GET_LINE_ITEM:API_DOMAIN+"line-item/get-all",
    CREATE_LINE_ITEM:API_DOMAIN+"line-item/create",
    UPDATE_LINE_ITEM:API_DOMAIN+"line-item/update",
    DELETE_LINE_ITEM:API_DOMAIN+"line-item/delete",

    GET_EXPENSE_GROUP_EXPENSE:API_DOMAIN+"group-expense/get-expense",
    CREATE_ORGANIZATION:API_DOMAIN+"organization/create",
    UPDATE_ORGANIZATION:API_DOMAIN+"organization/update",
    DELETE_ORGANIZATION:API_DOMAIN+"organization/delete",
    GET_EXPENSE_ORGANIZATION:API_DOMAIN+"organization/get-expense",
    GET_EXPENSE:API_DOMAIN+"expense/search",
    GET_EXPENSE_ALL:API_DOMAIN+"expense/get",
    GET_EXPENSE_BY_ID:API_DOMAIN+"expense/get_expense_by_id",
    CREATE_EXPENSE:API_DOMAIN+"expense/create",
    UPDATE_EXPENSE:API_DOMAIN+"expense/update",
    DELETE_EXPENSE:API_DOMAIN+"expense/delete",
    CLEAR_ADVANCE:API_DOMAIN+"expense/clear-advance",
    EXPORT_EXCEL_EXPENSE:API_DOMAIN+"expense/export_excel",
    EXPORT_EXCEL_ADVANCE:API_DOMAIN+"expense/export-excel-advance",
    EXPORT_EXCEL_PAY:API_DOMAIN+"expense/export-excel-pay",
    SAVE_EXPORT_EXCEL_PAY:API_DOMAIN+"expense/export-excel-pay",
    GET_EXPENSE_MONTH:API_DOMAIN+"expense/get-expense-month",
    //-----------------------------------------------------
    DOWNLOAD_EXPENSE:API_DOMAIN+"expense/download",
    GET_CONFIG_TABLE:API_DOMAIN+"table-config/get",
    UPDATE_CONFIG_TABLE:API_DOMAIN+"table-config/update",
    DEFAULT_CONFIG_TABLE:API_DOMAIN+"table-config/create-default",
    GET_ADVANCE:API_DOMAIN+"advance/search",
    GET_ADVANCE_ALL:API_DOMAIN+"advance/get-all",
    CREATE_ADVANCE:API_DOMAIN+"advance/create",
    UPDATE_ADVANCE:API_DOMAIN+"advance/update",
    DELETE_ADVANCE:API_DOMAIN+"advance/delete",
    DELETE_ADVANCE_BY_ID:API_DOMAIN+"advance/get_advance_by_id",
    // ----------------------------------------------------
    GET_CATEGORY:API_DOMAIN+"category/search",
    GET_EXPENSE_PLAN:API_DOMAIN+"category/get-expense-plan",
    CREATE_CATEGORY:API_DOMAIN+"category/create",
    UPDATE_CATEGORY:API_DOMAIN+"category/update",
    DELETE_CATEGORY:API_DOMAIN+"category/delete",

    //------------------------NEW-----------------------------
    CREATE_LECTURER:API_DOMAIN+"lecturer/create",
    DELETE_LECTURER:API_DOMAIN+"lecturer/delete",
    UPDATE_LECTURER:API_DOMAIN+"lecturer/update",
    GET_ALL_LECTURER:API_DOMAIN+"lecturer/get-all-lecturers",
    GET_DETAIL_LECTURER:API_DOMAIN+"lecturer/get-lecturer-detail",
    SEARCH_LECTURER:API_DOMAIN+"lecturer/search-lecturer",
    //-----------------------------------------------------
    CREATE_STUDENT:API_DOMAIN+"student/create",
    DELETE_STUDENT:API_DOMAIN+"student/delete",
    UPDATE_STUDENT:API_DOMAIN+"student/update",
    GET_ALL_STUDENT:API_DOMAIN+"student/get-all-students",
    GET_DETAIL_STUDENT:API_DOMAIN+"student/get-student-detail",
    SEARCH_STUDENT:API_DOMAIN+"student/search-student",
    //-----------------------------------------------------
    CREATE_LINK:API_DOMAIN+"link/create",
    DELETE_LINK:API_DOMAIN+"link/delete",
    UPDATE_LINK:API_DOMAIN+"link/update",
    GET_ALL_LINK:API_DOMAIN+"link/get-all-links",
    GET_DETAIL_LINK:API_DOMAIN+"link/get-link-detail",
    SEARCH_LINK:API_DOMAIN+"link/search-link",
    //-----------------------------------------------------
    CREATE_VENDOR:API_DOMAIN+"vendor/create",
    DELETE_VENDOR:API_DOMAIN+"vendor/delete",
    UPDATE_VENDOR:API_DOMAIN+"vendor/update",
    GET_ALL_VENDOR:API_DOMAIN+"vendor/get-all-vendors",
    GET_DETAIL_VENDOR:API_DOMAIN+"vendor/get-vendor-detail",
    SEARCH_VENDOR:API_DOMAIN+"vendor/search-vendor",
    //-----------------------------------------------------
    CREATE_PARTICIPANT_UNIT:API_DOMAIN+"participant-unit/create",
    DELETE_PARTICIPANT_UNIT:API_DOMAIN+"participant-unit/delete",
    UPDATE_PARTICIPANT_UNIT:API_DOMAIN+"participant-unit/update",
    GET_ALL_PARTICIPANT_UNIT:API_DOMAIN+"participant-unit/get-all-participant-units",
    GET_DETAIL_PARTICIPANT_UNIT:API_DOMAIN+"participant-unit/get-participant-unit-detail",
    SEARCH_PARTICIPANT_UNIT:API_DOMAIN+"participant-unit/search-participant-unit",
    //-----------------------------------------------------
    CREATE_TRAINING_SESSION:API_DOMAIN+"training-session/create",
    DELETE_TRAINING_SESSION:API_DOMAIN+"training-session/delete",
    UPDATE_TRAINING_SESSION:API_DOMAIN+"training-session/update",
    GET_ALL_TRAINING_SESSION:API_DOMAIN+"training-session/get-all-training-sessions",
    GET_DETAIL_TRAINING_SESSION:API_DOMAIN+"training-session/get-training-session-detail",
    SEARCH_TRAINING_SESSION:API_DOMAIN+"training-session/search-training-session",
    //-----------------------------------------------------
    CREATE_PLAN:API_DOMAIN+"plan/create",
    DELETE_PLAN:API_DOMAIN+"plan/delete",
    UPDATE_PLAN:API_DOMAIN+"plan/update",
    GET_ALL_PLAN:API_DOMAIN+"plan/get-all-plans",
    GET_DETAIL_PLAN:API_DOMAIN+"plan/get-plan-detail",
    SEARCH_PLAN:API_DOMAIN+"plan/search-plan",
    //-----------------------------------------------------
    CREATE_TRAINING_DOCUMENT:API_DOMAIN+"training-document/create",
    DELETE_TRAINING_DOCUMENT:API_DOMAIN+"training-document/delete",
    UPDATE_TRAINING_DOCUMENT:API_DOMAIN+"training-document/update",
    GET_ALL_TRAINING_DOCUMENT:API_DOMAIN+"training-document/get-all-training-documents",
    GET_DETAIL_TRAINING_DOCUMENT:API_DOMAIN+"training-document/get-training-document-detail",
    SEARCH_TRAINING_DOCUMENT:API_DOMAIN+"training-document/search-training-document",
    //-----------------------------------------------------
    CREATE_TRAINING_CLASS:API_DOMAIN+"training-class/create",
    DELETE_TRAINING_CLASS:API_DOMAIN+"training-class/delete",
    UPDATE_TRAINING_CLASS:API_DOMAIN+"training-class/update",
    GET_ALL_TRAINING_CLASS:API_DOMAIN+"training-class/get-all-training-classes",
    GET_DETAIL_TRAINING_CLASS:API_DOMAIN+"training-class/get-training-class-detail",
    SEARCH_TRAINING_CLASS:API_DOMAIN+"training-class/search-training-class",
    GET_ALL_TRAINING_CLASS_BY_TRAINING:API_DOMAIN+"training-class/get-all-training-classes-by-training",
    GET_ALL_TRAINING_CLASS_BY_TRAININGS:API_DOMAIN+"training-class/get-all-training-classes-by-trainings",
    //-----------------------------------------------------
    CREATE_TRAINING:API_DOMAIN+"training/create",
    DELETE_TRAINING:API_DOMAIN+"training/delete",
    UPDATE_TRAINING:API_DOMAIN+"training/update",
    GET_ALL_TRAINING:API_DOMAIN+"training/get-all-trainings",
    GET_DETAIL_TRAINING:API_DOMAIN+"training/get-training-detail",
    SEARCH_TRAINING:API_DOMAIN+"training/search-training",
    //-----------------------------------------------------
    GET_ALL_STUDENT_BY_SESSION:API_DOMAIN+"attendance/get-all-student-by-session",
    GET_ALL_ATTENDANCE_BY_TRAINING:API_DOMAIN+"attendance/get-all-attendance-by-training",
    UPDATE_ATTENDANCE:API_DOMAIN+"attendance/update-attendance",
}
export default API_MAP;
