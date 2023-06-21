import {createSlice} from "@reduxjs/toolkit";
const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState :[],
    reducers:{
        addNotification: (state, action)=>{
            state.push(action.payload);
        },
        clearNotifications: ()=>{
            return [];
        }
    }
})
export const {addNotification,clearNotifications} = notificationSlice.actions;
export default notificationSlice.reducer;