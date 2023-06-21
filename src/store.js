import {configureStore} from "@reduxjs/toolkit";
import userSlice from '../src/components/slices/userSlice'
import notificationSlice from '../src/components/slices/notificationSlice'

export const store = configureStore({
    reducer:{
        "user": userSlice,
        "notification": notificationSlice
    }
})