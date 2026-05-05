import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data } = await cartApi.get(user.id);
      setCart(data);
    } catch {
      setCart(null);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user?.id, fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user?.id) { toast.error('Please login to add items'); return; }
    setLoading(true);
    try {
      const { data } = await cartApi.add(user.id, {
        items: [{ productId, quantity }]
      });
      setCart(data);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateItem = useCallback(async (productId, quantity) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await cartApi.update(user.id, { productId, quantity });
      setCart(data);
    } catch (err) {
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const removeItem = useCallback(async (productId) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await cartApi.removeItem(user.id, productId);
      await fetchCart();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user?.id) return;
    try {
      await cartApi.clear(user.id);
      setCart(null);
    } catch {}
  }, [user?.id]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const totalAmount = cart?.totalAmount ?? 0;

  return (
    <CartContext.Provider value={{
      cart, loading, itemCount, totalAmount,
      addToCart, updateItem, removeItem, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
