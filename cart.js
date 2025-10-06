// cart.js - simple localStorage cart utility

const CART_KEY = 'shop_cart_v1';

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; } catch { return { items: [] }; }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addItemToCart({ id, name, price = 0, image = '', qty = 1 }) {
  const cart = getCart();
  const existing = cart.items.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ id, name, price, image, qty });
  }
  saveCart(cart);
  updateCartBadge();
  return cart;
}

export function addManyToCart(items) {
  const cart = getCart();
  items.forEach(({ id, name, price = 0, image = '', qty = 1 }) => {
    const existing = cart.items.find(i => i.id === id);
    if (existing) existing.qty += qty; else cart.items.push({ id, name, price, image, qty });
  });
  saveCart(cart);
  updateCartBadge();
  return cart;
}

export function removeItemsFromCart(ids = []) {
  const cart = getCart();
  if (!Array.isArray(ids) || !ids.length) return cart;
  cart.items = cart.items.filter(i => !ids.includes(i.id));
  saveCart(cart);
  updateCartBadge();
  return cart;
}

export function getCartTotals() {
  const { items } = getCart();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  return { totalQty, totalPrice };
}

export function updateCartBadge() {
  const badge = document.querySelector('[data-cart-badge]');
  if (!badge) return;
  const { totalQty } = getCartTotals();
  badge.textContent = totalQty > 0 ? String(totalQty) : '';
}

// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
