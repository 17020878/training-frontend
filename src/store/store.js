import {configureStore} from '@reduxjs/toolkit'
import userSlice from "./user/userSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, userSlice);
const store = configureStore({
    reducer: {
        currentUser: persistedReducer,
    }
})
export default store;