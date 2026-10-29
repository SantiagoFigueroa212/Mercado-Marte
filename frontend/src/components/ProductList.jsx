// frontend/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Petición al backend FastAPI
    axios.get('http://localhost:8000/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. ¿Está encendido el backend?');
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando catálogo...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Catálogo de Productos</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img 
              src={product.imagen_url || "https://via.placeholder.com/150"} 
              alt={product.nombre} 
              className="product-image"
            />
            <h3>{product.nombre}</h3>
            <p className="category">{product.categoria}</p>
            <p className="description">{product.descripcion}</p>
            
            {/* Detalles nutricionales */}
            <div className="nutrition-tags">
              <span>Proteína: {product.proteina_g}g</span>
              <span>Azúcar: {product.azucar_g}g</span>
              <span>Calorias: {product.calorias_g}g</span>
              {product.es_deslactosado && <span className="tag-lactose">Deslactosado</span>}
            </div>

            <div className="card-footer">
              <span className="price">${product.precio.toFixed(2)}</span>
              <button onClick={() => alert(`Agregado: ${product.nombre}`)}>
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}