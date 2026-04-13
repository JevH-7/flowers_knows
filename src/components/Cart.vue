<template>
    <div class="cart" :class="{ 'cart-open': isOpen }">
      <!-- Кнопка корзины -->
      <button class="cart-toggle" @click="toggleCart">
        <span class="cart-icon">🛒</span>
        <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
      </button>
  
      <!-- Панель корзины -->
      <div class="cart-panel">
        <div class="cart-header">
          <h3>Корзина</h3>
          <button class="close-btn" @click="toggleCart">✕</button>
        </div>
  
        <div class="cart-items" v-if="cartItems.length > 0">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.imageUrl" :alt="item.name" class="item-image" />
            
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-price">{{ item.price }} ₽</p>
              
              <div class="item-quantity">
                <button @click="decreaseQuantity(item)" class="qty-btn">−</button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)" class="qty-btn">+</button>
              </div>
            </div>
            
            <button class="remove-item" @click="removeFromCart(item.id)" title="Удалить">✕</button>
          </div>
        </div>
  
        <div v-else class="empty-cart">
          <span class="empty-icon">🛒</span>
          <p>Корзина пуста</p>
        </div>
  
        <div class="cart-footer" v-if="cartItems.length > 0">
          <div class="cart-total">
            <span>Итого</span>
            <span class="total-price">{{ cartTotal }} ₽</span>
          </div>
          
          <button class="checkout-btn" @click="checkout">Оформить заказ</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useCart } from '../composables/useCart'
  import { inject } from 'vue'
  
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart()
  const notification = inject('notification')
  
  const isOpen = ref(false)
  
  const cartTotal = computed(() => getCartTotal.value)
  const cartCount = computed(() => getCartCount.value)
  
  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }
  
  const increaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity + 1)
  }
  
  const decreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity - 1)
  }
  
  const checkout = () => {
    notification.showSuccess('Заказ оформлен! Спасибо за покупку')
    clearCart()
    isOpen.value = false
  }
  </script>
  
  <style scoped>
  .cart {
    position: relative;
  }
  
  /* Кнопка корзины */
  .cart-toggle {
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    position: relative;
    padding: 6px;
    border-radius: 50%;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cart-toggle:hover {
    background-color: #e6c7c2;
  }
  
  .cart-icon {
    font-size: 1.3rem;
  }
  
  .cart-count {
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: #b76363;
    color: white;
    font-size: 0.65rem;
    font-weight: 500;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }
  
  /* Панель корзины */
  .cart-panel {
    position: fixed;
    top: 0;
    right: -380px;
    width: 360px;
    height: 100vh;
    background-color: #fef6f4;
    box-shadow: -4px 0 20px rgba(183, 99, 99, 0.1);
    transition: right 0.25s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }
  
  .cart.cart-open .cart-panel {
    right: 0;
  }
  
  /* Шапка */
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e6c7c2;
    background-color: #f8e1df;
  }
  
  .cart-header h3 {
    color: #b76363;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 500;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #b88b8b;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-btn:hover {
    background-color: #e6c7c2;
    color: #b76363;
  }
  
  /* Список товаров */
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 0;
  }
  
  .cart-item {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f0e0dc;
    position: relative;
    background-color: #fef6f4;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 10px;
  }
  
  .item-details {
    flex: 1;
  }
  
  .item-details h4 {
    color: #5e4b4b;
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .item-price {
    color: #b76363;
    font-weight: 500;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .qty-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #e6c7c2;
    background-color: #fff9f7;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #7a5b5b;
    transition: all 0.2s;
    padding: 0;
  }
  
  .qty-btn:hover {
    background-color: #b88b8b;
    color: white;
    border-color: #b88b8b;
  }
  
  .qty-value {
    font-size: 0.85rem;
    font-weight: 500;
    min-width: 24px;
    text-align: center;
    color: #5e4b4b;
  }
  
  .remove-item {
    background: none;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    color: #d4b8b3;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .remove-item:hover {
    color: #b76363;
    background-color: #f0e0dc;
  }
  
  /* Пустая корзина */
  .empty-cart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #b88b8b;
    background-color: #fef6f4;
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .empty-cart p {
    margin: 0;
    font-size: 0.9rem;
    color: #a57c7c;
  }
  
  /* Футер */
  .cart-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #e6c7c2;
    background-color: #f8e1df;
  }
  
  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #7a5b5b;
  }
  
  .total-price {
    font-weight: 600;
    color: #b76363;
    font-size: 1.1rem;
  }
  
  .checkout-btn {
    width: 100%;
    padding: 12px;
    background-color: #b88b8b;
    border: none;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
  }
  
  .checkout-btn:hover {
    background-color: #a57676;
  }
  
  /* Адаптив */
  @media (max-width: 480px) {
    .cart-panel {
      width: 100%;
      right: -100%;
    }
  }
  </style>