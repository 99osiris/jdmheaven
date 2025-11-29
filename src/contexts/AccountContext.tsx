import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { toast } from '../components/Toast';
import type { Car, WishlistItem } from '../types';

interface CartItem {
  car: Car;
  quantity: number;
  notes?: string;
  inquiryType: 'general' | 'purchase' | 'test_drive' | 'financing';
}

interface AccountContextType {
  // Wishlist
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (carId: string) => boolean;
  addToWishlist: (car: Car) => Promise<void>;
  removeFromWishlist: (carId: string) => Promise<void>;
  toggleWishlist: (car: Car) => Promise<void>;
  
  // Cart/Inquiries
  cart: CartItem[];
  cartCount: number;
  addToCart: (car: Car, inquiryType?: CartItem['inquiryType'], notes?: string) => Promise<void>;
  removeFromCart: (carId: string) => void;
  updateCartItem: (carId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  submitInquiry: () => Promise<void>;
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  
  // Refresh functions
  refreshWishlist: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType>({
  wishlist: [],
  wishlistCount: 0,
  isInWishlist: () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  toggleWishlist: async () => {},
  cart: [],
  cartCount: 0,
  addToCart: async () => {},
  removeFromCart: () => {},
  updateCartItem: () => {},
  clearCart: () => {},
  submitInquiry: async () => {},
  loading: false,
  refreshing: false,
  refreshWishlist: async () => {},
  refreshCart: async () => {},
});

export const useAccount = () => useContext(AccountContext);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load wishlist from localStorage (for guest users) or Supabase (for authenticated users)
  const loadWishlist = useCallback(async () => {
    if (!user) {
      // Load from localStorage for guests
      const saved = localStorage.getItem('guest_wishlist');
      if (saved) {
        try {
          const carIds = JSON.parse(saved) as string[];
          // Fetch car details for each ID
          const cars = await Promise.all(
            carIds.map(async (id) => {
              try {
                const car = await api.cars.getById(id);
                return { car, id };
              } catch {
                return null;
              }
            })
          );
          setWishlist(cars.filter(Boolean).map((item: any) => ({
            id: `guest-${item.id}`,
            user_id: 'guest',
            car_id: item.id,
            car: item.car as any,
            created_at: new Date().toISOString(),
          })) as WishlistItem[]);
        } catch (error) {
          console.error('Error loading guest wishlist:', error);
        }
      }
      setLoading(false);
      return;
    }

    try {
      const data = await api.wishlist.getAll();
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load cart from localStorage
  const loadCart = useCallback(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, []);

  // Initialize
  useEffect(() => {
    loadWishlist();
    loadCart();
  }, [loadWishlist, loadCart]);

  // Sync guest wishlist to account when user logs in
  useEffect(() => {
    if (user && wishlist.length > 0) {
      const guestWishlist = wishlist.filter(item => item.user_id === 'guest');
      if (guestWishlist.length > 0) {
        // Sync guest wishlist items to account
        guestWishlist.forEach(async (item) => {
          try {
            await api.wishlist.add(item.car_id);
          } catch (error) {
            console.error('Error syncing wishlist item:', error);
          }
        });
        // Clear guest wishlist from localStorage
        localStorage.removeItem('guest_wishlist');
        loadWishlist();
      }
    }
  }, [user, wishlist, loadWishlist]);

  // Wishlist functions
  const isInWishlist = useCallback((carId: string): boolean => {
    return wishlist.some(item => {
      const itemCarId = typeof item.car === 'object' && item.car ? item.car.id : item.car_id;
      return itemCarId === carId;
    });
  }, [wishlist]);

  const addToWishlist = useCallback(async (car: Car) => {
    if (!user) {
      // Save to localStorage for guests
      const saved = localStorage.getItem('guest_wishlist');
      const carIds = saved ? JSON.parse(saved) : [];
      if (!carIds.includes(car.id)) {
        carIds.push(car.id);
        localStorage.setItem('guest_wishlist', JSON.stringify(carIds));
        setWishlist(prev => [...prev, {
          id: `guest-${car.id}`,
          user_id: 'guest',
          car_id: car.id,
          car: car as any,
          created_at: new Date().toISOString(),
        } as WishlistItem]);
        toast.success('Added to wishlist');
      }
      return;
    }

    try {
      await api.wishlist.add(car.id);
      await loadWishlist();
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  }, [user, loadWishlist]);

  const removeFromWishlist = useCallback(async (carId: string) => {
    if (!user) {
      // Remove from localStorage for guests
      const saved = localStorage.getItem('guest_wishlist');
      if (saved) {
        const carIds = JSON.parse(saved).filter((id: string) => id !== carId);
        localStorage.setItem('guest_wishlist', JSON.stringify(carIds));
        setWishlist(prev => prev.filter(item => {
          const itemCarId = typeof item.car === 'object' && item.car ? item.car.id : item.car_id;
          return itemCarId !== carId;
        }));
        toast.success('Removed from wishlist');
      }
      return;
    }

    try {
      const item = wishlist.find(w => {
        const itemCarId = typeof w.car === 'object' && w.car ? w.car.id : w.car_id;
        return itemCarId === carId;
      });
      if (item) {
        await api.wishlist.remove(item.id);
        await loadWishlist();
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  }, [user, wishlist, loadWishlist]);

  const toggleWishlist = useCallback(async (car: Car) => {
    if (isInWishlist(car.id)) {
      await removeFromWishlist(car.id);
    } else {
      await addToWishlist(car);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  // Cart functions
  const addToCart = useCallback(async (car: Car, inquiryType: CartItem['inquiryType'] = 'general', notes?: string) => {
    const existingItem = cart.find(item => item.car.id === car.id);
    
    if (existingItem) {
      // Update existing item
      const updated = cart.map(item =>
        item.car.id === car.id
          ? { ...item, quantity: item.quantity + 1, inquiryType, notes: notes || item.notes }
          : item
      );
      setCart(updated);
      saveCart(updated);
      toast.info('Updated inquiry');
    } else {
      // Add new item
      const newCart = [...cart, { car, quantity: 1, inquiryType, notes }];
      setCart(newCart);
      saveCart(newCart);
      toast.success('Added to inquiries');
    }
  }, [cart, saveCart]);

  const removeFromCart = useCallback((carId: string) => {
    const updated = cart.filter(item => item.car.id !== carId);
    setCart(updated);
    saveCart(updated);
    toast.success('Removed from inquiries');
  }, [cart, saveCart]);

  const updateCartItem = useCallback((carId: string, updates: Partial<CartItem>) => {
    const updated = cart.map(item =>
      item.car.id === carId ? { ...item, ...updates } : item
    );
    setCart(updated);
    saveCart(updated);
  }, [cart, saveCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, [saveCart]);

  const submitInquiry = useCallback(async () => {
    if (cart.length === 0) {
      toast.error('No inquiries to submit');
      return;
    }

    if (!user) {
      toast.error('Please sign in to submit inquiries');
      return;
    }

    setRefreshing(true);
    try {
      // Submit each inquiry
      for (const item of cart) {
        // Create custom request for each car
        await api.customRequests.create({
          make: item.car.make,
          model: item.car.model,
          year_min: item.car.year,
          year_max: item.car.year,
          price_min: item.car.price,
          price_max: item.car.price,
          additional_notes: `${item.inquiryType}: ${item.notes || 'Interested in this vehicle'}`,
        });
      }

      clearCart();
      toast.success('Inquiries submitted successfully!');
    } catch (error) {
      console.error('Error submitting inquiries:', error);
      toast.error('Failed to submit inquiries');
    } finally {
      setRefreshing(false);
    }
  }, [cart, user, clearCart]);

  const refreshWishlist = useCallback(async () => {
    setRefreshing(true);
    await loadWishlist();
    setRefreshing(false);
  }, [loadWishlist]);

  const refreshCart = useCallback(() => {
    loadCart();
  }, [loadCart]);

  return (
    <AccountContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        cart,
        cartCount: cart.length,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        submitInquiry,
        loading,
        refreshing,
        refreshWishlist,
        refreshCart,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

