export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_staff: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent?: number | null;
  parent_name?: string | null;
  has_variants: boolean;
  variant_type: string;
  subcategories?: Array<{id: number; name: string; slug: string}>;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  color?: string;
  size?: string;
  price: string;
  price_modifier: string;
  stock: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  category: number;
  category_name: string;
  category_variant_type?: string;
  stock: number;
  is_one_time: boolean;
  attributes: Record<string, any>;
  svg_placeholder: string;
  variants?: ProductVariant[];
  has_variants?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_detail: Product;
  variant?: number;
  variant_detail?: ProductVariant;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  item_count: number;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  variant_info: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  user: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'eft' | 'in_store';
  paid_at?: string;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: string;
  tax: string;
  shipping_cost: string;
  total: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancelled_by?: number;
  cancellation_reason?: string;
  is_received_back: boolean;
  received_back_at?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'shipping' | 'billing';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingInfo {
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method?: string;
  payment_status?: string;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  paid_orders: number;
  unpaid_orders: number;
  total_revenue: number;
}

export interface InventoryStats {
  total_products: number;
  active_products: number;
  out_of_stock: number;
  low_stock: number;
  total_stock_value: number;
  categories_count: number;
}
