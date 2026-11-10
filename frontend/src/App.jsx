// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { CartPage } from './components/CartPage';
import { PaymentPage } from './components/Paymentpage';
import { ConfirmationPage } from './components/Confirmationpage';
import { ErrorPage } from './components/ErrorPage';
import { CartProvider, useCart } from './context/CartContext';
import './App.css';

function HeaderNav() {
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
          <h1>Mercado Marte 🛒</h1>
        </Link>

        <div className="header-right">
          <span className="security-tag">🛡️ Pago seguro • TLS 1.3</span>
          <button className="cart-nav-btn" onClick={() => navigate('/carrito')}>
            🛒 Carrito <span className="badge">{totalItemsCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <HeaderNav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/checkout/pago" element={<PaymentPage />} />
              <Route path="/checkout/confirmacion" element={<ConfirmationPage />} />
              <Route path="/checkout/error" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;