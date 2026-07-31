import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../../home/components/BrandLogo'
import LoginBackdrop from '../components/LoginBackdrop'
import '../styles/login.css'

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6A2.5 2.5 0 0012 15.5M6.7 6.7C4.6 8.3 3 10.5 2 12c0 0 3.5 7 10 7 1.8 0 3.4-.5 4.8-1.3M9.9 5.1A10.8 10.8 0 0112 5c6.5 0 10 7 10 7a18.2 18.2 0 01-4.1 5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/app/cotizacion')
  }

  return (
    <div className="login-page">
      <LoginBackdrop />

      <Link to="/" className="login-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Volver al inicio
      </Link>

      <div className="login-layout">
        <header className="login-brand">
          <Link to="/" className="login-brand__logo" aria-label="Easy Logistics inicio">
            <BrandLogo variant="onDark" size="sm" />
          </Link>

          <h1 className="login-brand__title">Bienvenido a Easy Logistics</h1>
        </header>

        <section className="login-panel-wrap">
          <form className="login-panel" onSubmit={handleSubmit} noValidate>
            <h2>Iniciar Sesión</h2>

            <label className="login-field">
              <span className="sr-only">Correo electrónico</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Ingresa tu correo"
                required
              />
            </label>

            <label className="login-field login-field--password">
              <span className="sr-only">Contraseña</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </label>

            <button type="submit" className="login-submit">
              Ingresar
            </button>
          </form>
        </section>

        <p className="login-brand__register">
          <span>¿No tienes cuenta?</span>
          <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
