import {createSlice} from "@reduxjs/toolkit";
import {getBanner} from "./bannerThunk";

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        banners: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBanner.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getBanner.fulfilled, (state, action) => {
                state.banners = action.payload;
                state.loading = false;
            })
            .addCase(getBanner.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    }
})

export default bannerSlice.reducer;