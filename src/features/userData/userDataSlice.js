import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: 'userData',
    initialState:{
        allData: [],
        singleData: {},
        size: 0
    },
    reducers:{
        setSize: (state) => {
            state.size +=1;
        },
        addAllData: (state, action) =>{
            console.log(action)
            state.allData = action.payload;
            state.size = action.payload.length;
        },
        addSingleData: (state, action) => {
            state.singleData = action.payload
        }
    }
});

export const {setSize, addAllData, addSingleData} = userDataSlice.actions
export default userDataSlice.reducer