// frontend/src/components/PaymentPage.jsx
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
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#0f172a' }}>
          Ingresa los datos de tu tarjeta de crédito o débito:
        </label>
        <div style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
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
        style={{
          width: '100%',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginTop: '20px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? "Procesando pago..." : `Pagar $${finalTotal.toFixed(2)} MXN`}
      </button>
    </form>
  );
}

export function PaymentPage() {
  const { cart, totalAmount } = useCart();
  const navigate = useNavigate();

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
          <h1>Pago con tarjeta</h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            Completa tu compra de forma segura a través de Stripe.
          </p>

          <div className="stripe-container" style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Elements stripe={stripePromise}>
              <CheckoutForm finalTotal={finalTotal} />
            </Elements>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>
            🔒 Tus datos se cifran y nunca se almacenan en nuestros servidores (PCI DSS nivel 1).
          </div>

          <button 
            onClick={() => navigate('/carrito')} 
            style={{ marginTop: '20px', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', fontWeight: '600' }}
          >
            ← Volver al carrito
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