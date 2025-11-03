import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      setError('');
      const response = await createProduct(productData);
      if (response.success) {
        await loadProducts();
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create product';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      setError('');
      const response = await updateProduct(id, productData);
      if (response.success) {
        await loadProducts();
        setEditingProduct(null);
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setError('');
      const response = await deleteProduct(id);
      if (response.success) {
        await loadProducts();
      }
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError('')} className="close-error">×</button>
            </div>
          )}
          
          <ProductForm
            onSubmit={editingProduct ? 
              (data) => handleUpdateProduct(editingProduct._id, data) : 
              handleCreateProduct
            }
            editingProduct={editingProduct}
            onCancel={cancelEdit}
            loading={loading}
          />
          
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;