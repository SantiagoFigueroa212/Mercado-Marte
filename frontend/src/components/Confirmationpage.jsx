// frontend/src/components/ConfirmationPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paidAmount = location.state?.amount || 162.91;

  return (
    <div className="status-page-container">
      <div className="success-icon-circle">✓</div>
      <span className="order-ref">PEDIDO AN-597226</span>
      <h1>¡Gracias, Lucía!</h1>
      <p className="status-subtext">
        Cobramos <strong>${paidAmount.toFixed(2)}</strong> y enviamos el recibo a lucia@correo.com. Tu pedido llegará mañana entre 8:00 y 10:00 h.
      </p>

      <div className="timeline-status">
        <div className="timeline-item active">
          <div className="dot"></div>
          <div>
            <strong>Pago confirmado</strong>
            <p>Ahora</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="dot"></div>
          <div>
            <strong>Preparando tu pedido</strong>
            <p>Hoy</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="dot"></div>
          <div>
            <strong>En camino</strong>
            <p>Mañana</p>
          </div>
        </div>
      </div>

      <button className="restart-btn" onClick={() => navigate('/')}>
        Reiniciar prototipo
      </button>
    </div>
  );
}