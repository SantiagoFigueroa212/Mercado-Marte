// frontend/src/components/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    // Aseguramos la URL exacta del backend: /products/ID
    axios.get(`http://localhost:8000/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener detalle del producto:", err);
        setError("No se pudo cargar la información del producto.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', margin: '40px' }}>Cargando producto...</p>;
  if (error) return (
    <div style={{ textAlign: 'center', margin: '40px' }}>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
  if (!product) return <p style={{ textAlign: 'center', margin: '40px' }}>Producto no encontrado</p>;

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Volver al catálogo
      </button>
      
      <div className="detail-card">
        <img 
          src={product.imagen_url || "https://via.placeholder.com/300"} 
          alt={product.nombre} 
          className="detail-image" 
        />
        
        <div className="detail-info">
          <div>
            <span className="category">{product.categoria}</span>
            <h2>{product.nombre}</h2>
            <p className="detail-description">{product.descripcion}</p>
          </div>
          
          <div className="nutrition-box">
            <h4>Información Nutricional</h4>
            <ul>
              <li>Proteína: <strong>{product.proteina_g}g</strong></li>
              <li>Azúcar: <strong>{product.azucar_g}g</strong></li>
              <li>Deslactosado: <strong>{product.es_deslactosado ? "Sí" : "No"}</strong></li>
            </ul>
          </div>

          <div className="detail-footer">
            <span className="price">${product.precio.toFixed(2)}</span>
            <button onClick={() => addToCart(product)}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}