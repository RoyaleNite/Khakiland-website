import axios from 'axios';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  Product,
  Category,
  Cart,
  Order,
  ShippingInfo,
} from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthTokens>('/auth/login/', credentials);
    return data;
  },

  register: async (userData: RegisterData) => {
    const { data } = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register/', userData);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get<User>('/auth/profile/');
    return data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const { data } = await api.patch<User>('/auth/profile/', userData);
    return data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params?: {
    category?: string;
    search?: string;
    ordering?: string;
    page?: number;
  }) => {
    const { data } = await api.get<{ results: Product[]; count: number; next: string | null; previous: string | null }>('/products/', { params });
    return data;
  },

  getProduct: async (slug: string) => {
    const { data } = await api.get<Product>(`/products/${slug}/`);
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get<Category[]>('/products/categories/');
    return data;
  },
};

// Cart API
export const cartAPI = {
  getCart: async () => {
    const { data } = await api.get<Cart>('/cart/');
    return data;
  },

  addToCart: async (productId: number, variantId?: number, quantity = 1) => {
    const { data } = await api.post<Cart>('/cart/add/', {
      product_id: productId,
      variant_id: variantId,
      quantity,
    });
    return data;
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    const { data } = await api.patch<Cart>(`/cart/items/${itemId}/`, { quantity });
    return data;
  },

  removeFromCart: async (itemId: number) => {
    const { data } = await api.delete<Cart>(`/cart/items/${itemId}/remove/`);
    return data;
  },

  clearCart: async () => {
    const { data } = await api.delete<Cart>('/cart/clear/');
    return data;
  },
};

// Orders API
export const ordersAPI = {
  getOrders: async () => {
    const { data } = await api.get<Order[]>('/orders/');
    return data;
  },

  getOrder: async (orderNumber: string) => {
    const { data} = await api.get<Order>(`/orders/${orderNumber}/`);
    return data;
  },

  createOrder: async (shippingInfo: ShippingInfo) => {
    const { data } = await api.post<Order>('/orders/create/', shippingInfo);
    return data;
  },
};

export default api;
