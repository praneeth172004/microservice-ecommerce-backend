import { useState, useEffect } from 'react';
import { productApi } from '../../api/productApi';
import { Plus, Pencil, Trash2, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

const EMPTY_FORM = { productName: '', description: '', price: '', category: '', brand: '', stockQuantity: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    productApi.getAll(0, 100)
      .then(({ data }) => setProducts(Array.isArray(data) ? data : data.content || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditProduct(null); setModal('add'); };
  const openEdit = (p) => {
    setForm({ productName: p.productName, description: p.description || '', price: p.price, category: p.category || '', brand: p.brand || '', stockQuantity: p.stockQuantity });
    setEditProduct(p);
    setModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        await productApi.create({ ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) });
        toast.success('Product added!');
      } else {
        await productApi.update(editProduct.id, { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) });
        toast.success('Product updated!');
      }
      setModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-layout container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Product Management</h1>
            <p>{products.length} products in catalogue</p>
          </div>
          <button id="add-product-btn" className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="user-cell">
                      <div className="product-cell-icon"><Package size={16} /></div>
                      <div>
                        <p className="font-semibold">{p.productName}</p>
                        <p className="text-xs text-muted">{p.id?.slice(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td>{p.category ? <span className="badge badge-muted">{p.category}</span> : '—'}</td>
                  <td className="text-sm text-muted">{p.brand || '—'}</td>
                  <td className="font-semibold">{fmt(p.price)}</td>
                  <td>
                    <span className={`badge badge-${p.stockQuantity > 0 ? 'success' : 'danger'}`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} title="Edit">
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.productName)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input id="prod-name" type="text" className="form-input" value={form.productName} onChange={set('productName')} placeholder="e.g. iPhone 16 Pro" required />
              </div>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input id="prod-price" type="number" className="form-input" value={form.price} onChange={set('price')} placeholder="0" min="0" step="0.01" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input id="prod-stock" type="number" className="form-input" value={form.stockQuantity} onChange={set('stockQuantity')} placeholder="0" min="0" />
                </div>
              </div>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input id="prod-category" type="text" className="form-input" value={form.category} onChange={set('category')} placeholder="Electronics" />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input id="prod-brand" type="text" className="form-input" value={form.brand} onChange={set('brand')} placeholder="Apple" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea id="prod-desc" className="form-input" rows={3} value={form.description} onChange={set('description')} placeholder="Product description…" style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button id="save-product-btn" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
