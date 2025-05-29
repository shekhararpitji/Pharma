import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auth: null,
    isLoading: true,
};

export const authReducer = createSlice({
    name: "authReducer",
    initialState,
    reducers: {
        authExists: (state, action) => {
            state.auth = action.payload;
            state.isLoading = false;
        },
        authNotExist: (state) => {
            state.auth = null;
            state.isLoading = false;
        },
    },
});

export const { authExists, authNotExist } = authReducer.actions;