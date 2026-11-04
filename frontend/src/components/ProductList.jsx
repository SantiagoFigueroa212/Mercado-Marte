// frontend/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Cargar categorías al inicio
  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then((res) => setCategories(['Todas', ...res.data]))
      .catch((err) => console.error(err));
  }, []);

  // Cargar productos con filtros dinámicos
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/products', {
      params: {
        search: search,
        category: selectedCategory
      }
    })
    .then((response) => {
      setProducts(response.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [search, selectedCategory]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Barra de Búsqueda y Filtro de Categorías */}
      <div className="filter-container">
        <input 
          type="text" 
          placeholder="🔍 Buscar producto por nombre..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="search-input"
        />

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="category-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando catálogo...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div onClick={() => navigate(`/producto/${product.id}`)} style={{ cursor: 'pointer' }}>
                <img 
                  src={product.imagen_url || "https://via.placeholder.com/300"} 
                  alt={product.nombre} 
                  className="product-image"
                />
                <h3>{product.nombre}</h3>
                <p className="category">{product.categoria}</p>
                <p className="description">{product.descripcion}</p>
              </div>
              
              <div className="nutrition-tags">
                <span>Proteína: {product.proteina_g}g</span>
                <span>Azúcar: {product.azucar_g}g</span>
                {product.es_deslactosado && <span className="tag-lactose">Deslactosado</span>}
              </div>

              <div className="card-footer">
                <span className="price">${product.precio.toFixed(2)}</span>
                <button onClick={() => addToCart(product)}>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}