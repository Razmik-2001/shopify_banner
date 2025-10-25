import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const API = 'https://shopify-banner.onrender.com';

export const addBanner = createAsyncThunk(
    "add/addBanner",
    async (formData, {rejectWithValue}) => {
        try {
            const shop = localStorage.getItem("shop");
            const host = localStorage.getItem("host");
            const response = await axios.post(`${API}/ads/create`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    "x-shopify-shop-domain": shop,
                    "x-shopify-host": host
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Server Error");
        }
    }
);

export const getBanner = createAsyncThunk(
    "get/getBanner",
    async (_, {rejectWithValue}) => {
        try {
            const host = localStorage.getItem("host");
            const shop = localStorage.getItem("shop");

            const response = await axios.get(`${API}/ads`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-shopify-shop-domain": shop,
                        "x-shopify-host": host,
                    },
                }
            );
            console.log('thunk' + response.data.updatedBanners)
            return response.data.updatedBanners;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Server Error");
        }
    }
)

