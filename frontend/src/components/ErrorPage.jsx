// frontend/src/components/ErrorPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const errorMsg = location.state?.errorMsg || "Bloqueo preventivo del emisor o datos incorrectos.";

  return (
    <div className="status-page-container">
      <div className="error-icon-circle">✕</div>
      <span className="error-code">CARD_DECLINED · 05</span>
      <h1>Tu banco no autorizó el pago</h1>
      <p className="status-subtext">{errorMsg}</p>

      <div className="error-actions-row">
        <button className="dark-btn" onClick={() => navigate('/checkout/pago')}>
          Probar otra tarjeta
        </button>
        <button className="outline-btn" onClick={() => navigate('/checkout/pago')}>
          Pagar con QR
        </button>
      </div>

      <p className="support-link">
        ¿Necesitas ayuda? <a href="#chat">Chatea con soporte</a> · Ref. AN-597226
      </p>
    </div>
  );
}