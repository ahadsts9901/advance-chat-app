import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        isLogin: null,
        isDarkTheme: true,
        isSelectedUrdu: false,
        currentUserContacts: [],
    },
}

export const userSlice: any = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: { user: {} }, action) => {
            state.user = {
                ...state?.user, ...action.payload, isLogin: true
            }
        },
        logout: (state: { user: {} | null }) => {
            state.user = { ...state?.user, isLogin: false }
        },
        setCurrentUserContacts: (state, action) => {
            state.user.currentUserContacts = action.payload;
        },
    }
})

export const { login, logout, setCurrentUserContacts } = userSlice.actions

export default userSlice.reducer