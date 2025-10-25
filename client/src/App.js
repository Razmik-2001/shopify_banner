import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import DashboardPage from './pages/dashboardPage/Dashboard';

export default function App() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const host = params.get("host");
        const shop = params.get("shop");

        if (!host && !shop) return;

        localStorage.setItem("shop", shop);
        localStorage.setItem("host", host);

        const app = createApp({
            apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
            host,
            forceRedirect: true,
        });

        if (host) {
            const redirectAction = Redirect.create(app);
            redirectAction.dispatch(Redirect.Action.APP, "/dashboard");
        }
    }, []);

    return (
        <AppProvider i18n={enTranslations}>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}
