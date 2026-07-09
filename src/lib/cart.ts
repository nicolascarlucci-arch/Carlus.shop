export interface CartItem {
  variantId: string;
  productSlug: string;
  label: string;
  priceEUR: number;
  quantity: number;
  image?: string;
}

const CART_KEY = 'carlus_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotalEUR(): number {
  return getCart().reduce((sum, item) => sum + item.priceEUR * item.quantity, 0);
}

export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
  const cart = getCart();
  const qty = item.quantity ?? 1;
  const existing = cart.find((i) => i.variantId === item.variantId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  saveCart(cart);
}

export function updateQuantity(variantId: string, quantity: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.variantId === variantId);
  if (!item) return;
  if (quantity <= 0) {
    removeFromCart(variantId);
    return;
  }
  item.quantity = quantity;
  saveCart(cart);
}

export function removeFromCart(variantId: string): void {
  saveCart(getCart().filter((i) => i.variantId !== variantId));
}

export function clearCart(): void {
  saveCart([]);
}

export function onCartUpdated(callback: (items: CartItem[]) => void): () => void {
  const handler = (e: Event) => callback((e as CustomEvent<CartItem[]>).detail);
  window.addEventListener('cart:updated', handler);
  return () => window.removeEventListener('cart:updated', handler);
}
