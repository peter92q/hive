import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { accountSlice } from "./account";
import { postSlice } from "./post";
import { suggestedUsersSlice } from "./suggestedUsers";

export const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
        post: postSlice.reducer,
        suggestedUsers: suggestedUsersSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;