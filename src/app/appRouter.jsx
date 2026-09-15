import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { EN_PREFIX } from "../i18n/LanguageContext";

const Home = lazy(() => import("../features/home/pages/index.jsx"));
const Login = lazy(() => import("../features/users/pages/login.jsx"));
const QuotationLayout = lazy(() => import("../features/modules/layout/QuotationLayout.jsx"));
const PrivacyPolicy = lazy(() => import("../features/legal/pages/PrivacyPolicy.jsx"));
const CookiesPolicy = lazy(() => import("../features/legal/pages/CookiesPolicy.jsx"));

const quoteFallback = (
    <div className="orbit-page quote-module-page" style={{ minHeight: "100svh", background: "#0f171c" }} />
);

const legalFallback = (
    <div className="legal-page" style={{ minHeight: "100svh", background: "#070b0e" }} />
);

const routes = {
    home: {
        path: "/",
        element: (
            <Suspense fallback={<div className="orbit-page" style={{ minHeight: "100svh", background: "#0f171c" }} />}>
                <Home />
            </Suspense>
        )
    },
    login: {
        path: "/login",
        element: (
            <Suspense fallback={<div className="login-page" style={{ minHeight: "100svh", background: "#0f171c" }} />}>
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

/**
 * Rutas que existen en los dos idiomas. Se montan en su ruta canónica
 * (español) y otra vez bajo /en. El idioma sale del prefijo de la URL,
 * así cada versión es indexable por separado.
 */
const LOCALIZED = [routes.home, routes.quotation];

/** Solo en español: los textos legales no están traducidos. */
const SPANISH_ONLY = [routes.login, routes.privacy, routes.cookies];

export default function AppRoutes() {

    return (
            <Routes>
                {LOCALIZED.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
                {LOCALIZED.map((route) => (
                    <Route
                        key={`en-${route.path}`}
                        path={route.path === "/" ? EN_PREFIX : `${EN_PREFIX}${route.path}`}
                        element={route.element}
                    />
                ))}

                {SPANISH_ONLY.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}

                <Route path="/legal/privacidad" element={<Navigate to="/legal/tratamiento-de-datos" replace />} />
                <Route path="/app" element={<Navigate to="/app/cotizacion" replace />} />
                <Route path={`${EN_PREFIX}/app`} element={<Navigate to={`${EN_PREFIX}/app/cotizacion`} replace />} />
            </Routes>
    );
}
