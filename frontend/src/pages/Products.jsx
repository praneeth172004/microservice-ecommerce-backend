import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Food'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await productApi.getAll(p, 12);
      if (p === 0) setProducts(Array.isArray(data) ? data : data.content || []);
      else setProducts(prev => [...prev, ...(Array.isArray(data) ? data : data.content || [])]);
      setHasMore((Array.isArray(data) ? data : data.content || []).length === 12);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(0); setPage(0); }, [fetchProducts]);

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.productName?.toLowerCase().includes(search.toLowerCase())
      || p.brand?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.productName?.localeCompare(b.productName);
      return 0;
    });

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProducts(next);
  };

  return (
    <div className="products-page page-layout container">
      {/* Page Header */}
      <div className="page-header">
        <h1>All Products</h1>
        <p>{filtered.length} product{filtered.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Filters Row */}
      <div className="products-filters">
        {/* Search */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            id="product-search"
            type="text"
            className="form-input search-input"
            placeholder="Search products, brands…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="filter-row">
          <SlidersHorizontal size={16} className="text-muted" />
          <select
            id="product-sort"
            className="form-input filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`cat-${cat}`}
            className={`cat-tab ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading && page === 0 ? (
        <div className="loading-center">
          <div className="spinner" />
          <p>Loading products…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filter</p>
          <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid animate-fade">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && !search && category === 'All' && (
            <div className="load-more-row">
              <button
                className="btn btn-outline btn-lg load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
