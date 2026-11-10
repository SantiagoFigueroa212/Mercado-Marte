// frontend/src/components/PaymentForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

export function PaymentForm({ totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Pedir el clientSecret al backend de FastAPI
      const response = await axios.post('http://localhost:8000/create-payment-intent', {
        amount: totalAmount,
      });

      const { clientSecret } = response.data;

      // 2. Confirmar el pago en Stripe con los datos ingresados en CardElement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        // Redirigir a la pantalla de error pasando el mensaje del banco/Stripe
        navigate('/checkout/error', { state: { errorMsg: result.error.message } });
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Limpiar carrito y redirigir a la pantalla de éxito
        clearCart();
        navigate('/checkout/confirmacion', { state: { amount: totalAmount } });
      }
    } catch (err) {
      console.error(err);
      navigate('/checkout/error', {
        state: { errorMsg: 'Ocurrió un error al procesar la solicitud con el servidor.' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="card-input-box">
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Datos de la tarjeta:
        </label>
        <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', backgroundColor: '#fff' }}>
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

      {errorMessage && (
        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>
          {errorMessage}
        </p>
      )}

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
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Procesando pago...' : 'Pagar ahora'}
      </button>
    </form>
  );
}