import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const stockStatus = () => {
    if (!product.stockQuantity || product.stockQuantity === 0)
      return <span className="badge badge-danger">Out of Stock</span>;
    if (product.stockQuantity <= 5)
      return <span className="badge badge-warning">Only {product.stockQuantity} left</span>;
    return <span className="badge badge-success">In Stock</span>;
  };

  return (
    <div className="product-card">
      {/* Category tag */}
      {product.category && (
        <div className="product-category">{product.category}</div>
      )}

      {/* Product Image Placeholder */}
      <Link to={`/products/${product.id}`} className="product-image-link">
        <div className="product-image">
          <Package size={48} className="product-image-icon" />
          <div className="product-image-overlay" />
        </div>
      </Link>

      <div className="product-body">
        {/* Brand */}
        {product.brand && <p className="product-brand">{product.brand}</p>}

        {/* Name */}
        <Link to={`/products/${product.id}`} className="product-name">
          {product.productName}
        </Link>

        {/* Description */}
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}

        {/* Footer: Price + Stock + Cart */}
        <div className="product-footer">
          <div>
            <p className="product-price">{formatPrice(product.price)}</p>
            {stockStatus()}
          </div>
          <button
            className="btn btn-primary btn-sm cart-btn"
            disabled={loading || !product.stockQuantity}
            onClick={() => addToCart(product.id, 1)}
            title="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
