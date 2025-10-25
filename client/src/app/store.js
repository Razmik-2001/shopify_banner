import {configureStore} from '@reduxjs/toolkit';
import bannerSlice from "./features/bannerSlice";

const store = configureStore({
    reducer: {
        banner: bannerSlice,
    }
})
export default store;