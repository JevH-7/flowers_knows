<template>
    <div class="product-page" v-if="product">
      <div class="product-header">
        <img :src="product.imageUrl" :alt="product.name" @error="handleImageError" />
        <div>
          <h1>{{ product.name }}</h1>
          <p class="price">{{ product.price }} ₽</p>
          <button @click="handleAddToCart" class="add-to-cart-btn">Добавить в корзину</button>
        </div>
      </div>
      
      <nav class="product-tabs">
        <router-link :to="`/product/${product.url}`" exact>Описание</router-link>
        <router-link :to="`/product/${product.url}/specs`">Характеристики</router-link>
        <router-link :to="`/product/${product.url}/reviews`">Отзывы</router-link>
      </nav>
      
      <div class="product-tab-content">
        <!-- Передаем product через props -->
        <router-view :product="product" />
      </div>
    </div>
    <div v-else class="not-found">
      <h2>Товар не найден</h2>
      <p>URL: {{ route.params.url }}</p>
      <router-link to="/products">Вернуться в каталог</router-link>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useProducts } from '../composables/useProducts'
  import { useCart } from '../composables/useCart'
  import { useRoute } from 'vue-router'
  import { inject } from 'vue'
  
  const route = useRoute()
  const { getProductByUrl } = useProducts()
  const { addToCart } = useCart()
  const notification = inject('notification')
  
  const product = computed(() => {
    const url = route.params.url
    if (!url) return null
    return getProductByUrl(url)
  })
  
  const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/200x150?text=No+Image'
  }
  
  const handleAddToCart = () => {
    if (product.value) {
      addToCart(product.value)
      notification.showSuccess(`"${product.value.name}" добавлен в корзину`)
    }
  }
  </script>
  
  <style scoped>
  .product-page {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fef6f4;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  
  .product-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .product-header img {
    width: 200px;
    height: auto;
    border-radius: 15px;
    object-fit: cover;
  }
  
  h1 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #b76363;
    margin-bottom: 1rem;
  }
  
  .add-to-cart-btn {
    background-color: #b88b8b;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1rem;
  }
  
  .add-to-cart-btn:hover {
    background-color: #a57676;
  }
  
  .product-tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid #e6c7c2;
    margin-bottom: 1.5rem;
  }
  
  .product-tabs a {
    text-decoration: none;
    color: #7a5b5b;
    padding: 0.5rem 1rem;
    border-radius: 20px 20px 0 0;
    transition: background-color 0.2s;
  }
  
  .product-tabs a:hover {
    background-color: #e6c7c2;
  }
  
  .product-tabs a.router-link-exact-active {
    background-color: #b88b8b;
    color: white;
  }
  
  .product-tab-content {
    padding: 1rem 0;
  }
  
  .not-found {
    text-align: center;
    padding: 3rem;
  }
  
  .not-found p {
    color: #b76363;
    margin: 1rem 0;
    font-family: monospace;
  }
  
  @media (max-width: 768px) {
    .product-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .product-header img {
      width: 100%;
      max-width: 300px;
    }
  }
  </style>