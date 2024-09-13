import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        isLogin: null,
        isDarkTheme: true,
        isSelectedUrdu: false,
        currentUserContacts: [],
        isVoiceCallOpen: false,
        isVideoCallOpen: false,
        videoCallData: {},
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
        setIsVoiceCallOpen: (state: any, action) => {
            state.user = { ...state?.user, isVoiceCallOpen: action?.payload }
        },
        setIsVideoCallOpen: (state: any, action) => {
            state.user = { ...state?.user, isVideoCallOpen: action?.payload }
        },
        setVideoCallData: (state: any, action) => {
            state.user = { ...state?.user, videoCallData: action?.payload }
        },
    }
})

export const { login, logout, setCurrentUserContacts, setIsVoiceCallOpen, setIsVideoCallOpen, setVideoCallData } = userSlice.actions

export default userSlice.reducer