import React, { useState, useMemo } from 'react';
import './ProductList.css';

const ProductList = ({ products, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'quantity':
          return a.quantity - b.quantity;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortBy]);

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product._id);
    }
  };

  const totalValue = useMemo(() => {
    return filteredAndSortedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }, [filteredAndSortedProducts]);

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2 className="list-title">Product Inventory</h2>
        <div className="list-stats">
          <span>{filteredAndSortedProducts.length} products</span>
          <span>Total Value: ${totalValue.toFixed(2)}</span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="empty-state">
          {products.length === 0 ? 'No products found. Add your first product!' : 'No products match your filters.'}
        </div>
      ) : (
        <div className="product-grid">
          {filteredAndSortedProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-header">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-sku">{product.sku}</span>
              </div>
              
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{product.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">${product.price.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Quantity:</span>
                  <span className={`detail-value ${product.quantity < 10 ? 'low-stock' : ''}`}>
                    {product.quantity}
                    {product.quantity < 10 && <span className="stock-warning"> (Low Stock)</span>}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Value:</span>
                  <span className="detail-value">
                    ${(product.price * product.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="product-actions">
                <button
                  onClick={() => onEdit(product)}
                  className="btn btn-edit"
                  title="Edit product"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="btn btn-delete"
                  title="Delete product"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;