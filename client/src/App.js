import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import DashboardPage from './pages/dashboardPage/Dashboard';

export default function App() {
    const [appBridgeReady, setAppBridgeReady] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const host = params.get("host");
        const shop = params.get("shop");

        if (!host || !shop) return;

        localStorage.setItem("shop", shop);
        localStorage.setItem("host", host);

        const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;
        if (!apiKey) {
            console.error("Shopify API Key is missing!");
            return;
        }

        const app = createApp({
            apiKey,
            host,
            forceRedirect: true,
        });

        setAppBridgeReady(true);

        const redirectAction = Redirect.create(app);
        redirectAction.dispatch(Redirect.Action.APP, "/dashboard");
    }, []);

    if (!appBridgeReady) return null;

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
