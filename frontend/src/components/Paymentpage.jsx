import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ finalTotal }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/create-payment-intent", {
        amount: finalTotal
      });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        navigate("/checkout/error", { state: { errorMsg: result.error.message } });
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        clearCart();
        navigate("/checkout/confirmacion", { state: { amount: finalTotal } });
      }
    } catch (err) {
      console.error(err);
      navigate("/checkout/error", { state: { errorMsg: "Error de comunicación con el servidor de pagos" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="card-input-box">
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Ingresa los datos de tu tarjeta (Prueba Stripe):
        </label>
        <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', backgroundColor: '#ffffff' }}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0f172a',
                  '::placeholder': { color: '#94a3b8' },
                },
                invalid: { color: '#ef4444' },
              },
            }} 
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="submit-pay-btn"
        style={{
          width: '100%',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          marginTop: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? "Procesando pago..." : "Continuar a revisión"}
      </button>
    </form>
  );
}

export function PaymentPage() {
  const { cart, totalAmount } = useCart();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');

  const shippingCost = totalAmount > 150 ? 0 : 3.50;
  const taxes = totalAmount * 0.08;
  const finalTotal = totalAmount + shippingCost + taxes;

  return (
    <div className="checkout-container">
      <div className="stepper">
        <div className="step"><span>Carrito</span></div>
        <div className="step"><span>Envío</span></div>
        <div className="step active"><span>Pago</span></div>
        <div className="step"><span>Revisión</span></div>
      </div>

      <div className="cart-page-grid">
        <div className="cart-left-column">
          <h1>Método de pago</h1>

          <div className="payment-methods-grid">
            <div 
              className={`method-card ${selectedMethod === 'saved' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('saved')}
            >
              <span className="badge-yellow">RECOMENDADO</span>
              <h3>Visa •••• 4242</h3>
              <p>Tarjeta guardada · sin escribir nada</p>
            </div>

            <div 
              className={`method-card ${selectedMethod === 'qr' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('qr')}
            >
              <span className="badge-yellow">SIN COMISIÓN</span>
              <h3>Pago con QR</h3>
              <p>Escanea desde tu app bancaria</p>
            </div>

            <div 
              className={`method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('card')}
            >
              <h3>Nueva tarjeta</h3>
              <p>Crédito o débito</p>
            </div>
          </div>

          {selectedMethod === 'card' && (
            <div className="stripe-container" style={{ marginTop: '20px' }}>
              <Elements stripe={stripePromise}>
                <CheckoutForm finalTotal={finalTotal} />
              </Elements>
            </div>
          )}

          <div className="security-footer" style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>
            🔒 Tus datos se cifran y nunca se almacenan en nuestros servidores (PCI DSS nivel 1).
          </div>

          <button className="back-link" onClick={() => navigate('/carrito')} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer' }}>
            ← Volver
          </button>
        </div>

        <div className="cart-right-column">
          <div className="summary-card">
            <h2>Resumen</h2>
            {cart.map((item) => (
              <div key={item.id} className="summary-item-line">
                <span>{item.quantity} × {item.nombre}</span>
                <span>${(item.precio * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>${totalAmount.toFixed(2)}</span></div>
            <div className="summary-row"><span>Envío</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="summary-row"><span>Impuestos</span><span>${taxes.toFixed(2)}</span></div>
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