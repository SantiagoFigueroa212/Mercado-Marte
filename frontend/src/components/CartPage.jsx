// frontend/src/components/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  // Cálculos dinámicos
  const freeShippingThreshold = 150.0;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);
  const shippingPercentage = Math.min(100, (totalAmount / freeShippingThreshold) * 100);

  const shippingCost = totalAmount > 0 ? (totalAmount >= freeShippingThreshold ? 0.0 : 3.50) : 0.0;
  const taxes = totalAmount * 0.08; // 8% estimado de impuestos
  const finalTotal = totalAmount + shippingCost + taxes;
  

  return (
    <div className="checkout-container">
      {/* Pasos de compra / Stepper */}
      <div className="stepper">
        <div className="step active"><span>Carrito</span></div>
        <div className="step"><span>Envío</span></div>
        <div className="step"><span>Pago</span></div>
        <div className="step"><span>Revisión</span></div>
      </div>

      <div className="cart-page-grid">
        {/* Columna Izquierda: Lista e Interacción */}
        <div className="cart-left-column">
          <h1>Tu carrito</h1>

          {/* Barra de envío gratis */}
          <div className="shipping-progress-card">
            <div className="shipping-text">
              {missingForFreeShipping > 0 ? (
                <span>Te faltan <strong>${missingForFreeShipping.toFixed(2)}</strong> para envío gratis</span>
              ) : (
                <span className="free-shipping-achieved">🎉 ¡Felicidades! Tienes envío gratis</span>
              )}
              <span className="shipping-tracker">${totalAmount.toFixed(2)} / ${freeShippingThreshold.toFixed(2)}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${shippingPercentage}%` }}></div>
            </div>
          </div>

          {/* Botones de Pago Rápido */}
          <div className="quick-pay-options">
            <div 
              className="quick-pay-btn yellow-btn"
              onClick={() => {
                if (cart.length === 0) return;
                clearCart();
                navigate('/checkout/confirmacion', { state: { amount: finalTotal } });
              }}
              style={{ cursor: cart.length > 0 ? 'pointer' : 'not-allowed', opacity: cart.length > 0 ? 1 : 0.6 }}
            >
              <div>
                <strong>Pagar en 1 clic</strong>
                <p>Visa •••• 4242 • envío guardado</p>
              </div>
              <span className="pay-icon">⚡</span>
            </div>

            <div className="quick-pay-btn white-btn" style={{ opacity: 0.7 }}>
              <div>
                <strong>Pagar con QR</strong>
                <p>Desde tu app bancaria</p>
              </div>
              <span className="pay-icon">📱</span>
            </div>
          </div>

          {/* Botón para flujo paso a paso (Stripe Sandbox) */}
          <div style={{ margin: '24px 0', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/checkout/pago')}
              disabled={cart.length === 0}
              style={{
                width: '100%',
                backgroundColor: cart.length > 0 ? '#0f172a' : '#94a3b8',
                color: '#ffffff',
                padding: '14px 20px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Continuar paso a paso (Pagar con tarjeta) →
            </button>
          </div>

          {/* Lista de productos */}
          {cart.length === 0 ? (
            <div className="empty-cart-page">
              <p>Tu carrito está vacío.</p>
              <button onClick={() => navigate('/')}>Ir a explorar productos</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.imagen_url || "https://via.placeholder.com/100"} alt={item.nombre} />
                  
                  <div className="item-details">
                    <div className="item-header-info">
                      <h3>{item.nombre}</h3>
                      <span className="item-price">${(item.precio * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="item-subtext">{item.descripcion || item.categoria}</p>

                    <div className="item-actions">
                      <div className="quantity-selector">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Tarjeta de Resumen */}
        <div className="cart-right-column">
          <div className="summary-card">
            <h2>Resumen</h2>
            
            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={item.id} className="summary-item-line">
                  <span>{item.quantity} × {item.nombre}</span>
                  <span>${(item.precio * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{shippingCost === 0 && totalAmount > 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Impuestos</span>
              <span>${taxes.toFixed(2)}</span>
            </div>

            <div className="summary-divider bold-divider"></div>

            <div className="summary-total-row">
              <span className="total-label">Total</span>
              <span className="total-amount">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}