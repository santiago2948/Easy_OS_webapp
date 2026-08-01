import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("../features/home/pages/index.jsx"));
const Login = lazy(() => import("../features/users/pages/login.jsx"));
const QuotationLayout = lazy(() => import("../features/modules/layout/QuotationLayout.jsx"));
const PrivacyPolicy = lazy(() => import("../features/legal/pages/PrivacyPolicy.jsx"));
const CookiesPolicy = lazy(() => import("../features/legal/pages/CookiesPolicy.jsx"));

const quoteFallback = (
    <div className="orbit-page quote-module-page" style={{ minHeight: "100svh", background: "#02080c" }} />
);

const legalFallback = (
    <div className="legal-page" style={{ minHeight: "100svh", background: "#070b0e" }} />
);

const routes = {
    home: {
        path: "/",
        element: (
            <Suspense fallback={<div className="orbit-page" style={{ minHeight: "100svh", background: "#00060a" }} />}>
                <Home />
            </Suspense>
        )
    },
    login: {
        path: "/login",
        element: (
            <Suspense fallback={<div className="login-page" style={{ minHeight: "100svh", background: "#041018" }} />}>
                <Login />
            </Suspense>
        )
    },
    quotation: {
        path: "/app/cotizacion",
        element: (
            <Suspense fallback={quoteFallback}>
                <QuotationLayout />
            </Suspense>
        )
    },
    privacy: {
        path: "/legal/tratamiento-de-datos",
        element: (
            <Suspense fallback={legalFallback}>
                <PrivacyPolicy />
            </Suspense>
        )
    },
    cookies: {
        path: "/legal/cookies",
        element: (
            <Suspense fallback={legalFallback}>
                <CookiesPolicy />
            </Suspense>
        )
    }
}

export default function AppRoutes() {

    return (
            <Routes>
                <Route path={routes.home.path} element={routes.home.element} />
                <Route path={routes.login.path} element={routes.login.element} />
                <Route path={routes.quotation.path} element={routes.quotation.element} />
                <Route path={routes.privacy.path} element={routes.privacy.element} />
                <Route path={routes.cookies.path} element={routes.cookies.element} />
                <Route path="/legal/privacidad" element={<Navigate to="/legal/tratamiento-de-datos" replace />} />
                <Route path="/app" element={<Navigate to="/app/cotizacion" replace />} />
            </Routes>
    );
}
