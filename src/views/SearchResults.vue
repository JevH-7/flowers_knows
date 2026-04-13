<template>
    <div class="search-results">
      <div class="search-header">
        <h1>Результаты поиска</h1>
        <p class="search-query">По запросу: <strong>"{{ query }}"</strong></p>
        <p class="results-count">Найдено товаров: {{ filteredProducts.length }}</p>
      </div>
  
      <div v-if="filteredProducts.length > 0" class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <router-link :to="`/product/${product.url}`">
            <img :src="product.imageUrl" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p class="category-tag">{{ product.category }}</p>
            <p class="product-description">{{ truncateDescription(product.description) }}</p>
            <p class="price">{{ product.price }} ₽</p>
          </router-link>
          <button @click="handleAddToCart(product)" class="add-to-cart-btn">
            В корзину
          </button>
          <div v-if="isAdmin && currentUser?.role === 'admin'" class="admin-actions">
            <button @click="editProduct(product.url)" title="Редактировать">✎</button>
            <button @click="removeProduct(product.id)" title="Удалить">🗑️</button>
          </div>
        </div>
      </div>
  
      <div v-else class="no-results">
        <div class="no-results-icon">🔍</div>
        <h2>Ничего не найдено</h2>
        <p>Попробуйте изменить поисковый запрос или посмотрите другие товары в каталоге</p>
        <div class="no-results-actions">
          <router-link to="/products" class="catalog-link">Перейти в каталог</router-link>
          <button @click="clearSearch" class="clear-search-btn">Очистить поиск</button>
        </div>
        <div class="suggestions">
          <h3>Возможно, вы искали:</h3>
          <div class="suggestions-list">
            <button 
              v-for="suggestion in suggestions" 
              :key="suggestion"
              @click="searchAgain(suggestion)"
              class="suggestion-btn"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref, watch } from 'vue'
  import { useProducts } from '../composables/useProducts'
  import { useAuth } from '../composables/useAuth'
  import { useCart } from '../composables/useCart'
  import { inject } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const { getProducts, deleteProduct } = useProducts()
  const { addToCart } = useCart()
  const { isAdmin, currentUser } = useAuth()
  const notification = inject('notification')
  
  const products = getProducts()
  const query = ref(route.query.q || '')
  
  // Функция поиска
  const searchProducts = (searchQuery) => {
    if (!searchQuery) return []
    
    const searchLower = searchQuery.toLowerCase().trim()
    
    return products.value.filter(product => {
      // Поиск по названию
      if (product.name.toLowerCase().includes(searchLower)) return true
      // Поиск по описанию
      if (product.description.toLowerCase().includes(searchLower)) return true
      // Поиск по характеристикам
      if (product.specs && product.specs.toLowerCase().includes(searchLower)) return true
      // Поиск по категории
      if (product.category.toLowerCase().includes(searchLower)) return true
      return false
    })
  }
  
  const filteredProducts = computed(() => {
    return searchProducts(query.value)
  })
  
  // Предложения для поиска (популярные запросы)
  const suggestions = ref(['помада', 'тональный крем', 'тушь', 'палетка теней', 'кисти'])
  
  const truncateDescription = (description) => {
    if (description.length > 80) {
      return description.substring(0, 80) + '...'
    }
    return description
  }
  
  const handleAddToCart = (product) => {
    addToCart(product)
    notification.showSuccess(`"${product.name}" добавлен в корзину`)
  }
  
  const removeProduct = (id) => {
    deleteProduct(id)
    notification.showSuccess('Товар удален')
    // Обновляем список
    filteredProducts.value = searchProducts(query.value)
  }
  
  const editProduct = (url) => {
    router.push(`/product/edit/${url}`)
  }
  
  const clearSearch = () => {
    query.value = ''
    router.push('/products')
  }
  
  const searchAgain = (term) => {
    query.value = term
    router.push({ name: 'search', query: { q: term } })
  }
  
  // Следим за изменением query в URL
  watch(() => route.query.q, (newQuery) => {
    query.value = newQuery || ''
  }, { immediate: true })
  </script>
  
  <style scoped>
  .search-results {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .search-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .search-header h1 {
    color: #b76363;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }
  
  .search-query {
    color: #7a5b5b;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .search-query strong {
    color: #b76363;
    font-weight: 600;
  }
  
  .results-count {
    color: #b88b8b;
    font-size: 0.95rem;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  
  .product-card {
    background-color: #fef6f4;
    border-radius: 18px;
    padding: 1.2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(183, 99, 99, 0.15);
  }
  
  .product-card a {
    text-decoration: none;
    color: inherit;
    flex-grow: 1;
  }
  
  .product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  
  .product-card h3 {
    color: #b76363;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  .category-tag {
    font-size: 0.8rem;
    color: #b88b8b;
    margin-bottom: 0.5rem;
    display: inline-block;
    background-color: #fff0ed;
    padding: 3px 10px;
    border-radius: 20px;
  }
  
  .product-description {
    color: #7a5b5b;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .price {
    font-weight: bold;
    color: #b76363;
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }
  
  .add-to-cart-btn {
    width: 100%;
    padding: 10px;
    background-color: #b88b8b;
    color: white;
    border: none;
    border-radius: 25px;
    margin-top: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.95rem;
  }
  
  .add-to-cart-btn:hover {
    background-color: #a57676;
  }
  
  .admin-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .product-card:hover .admin-actions {
    opacity: 1;
  }
  
  .admin-actions button {
    background: rgba(230, 199, 194, 0.9);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
  }
  
  .admin-actions button:hover {
    background-color: #b88b8b;
    color: white;
  }
  
  .no-results {
    text-align: center;
    padding: 4rem;
    background-color: #fef6f4;
    border-radius: 30px;
  }
  
  .no-results-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .no-results h2 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }
  
  .no-results p {
    color: #7a5b5b;
    margin-bottom: 2rem;
  }
  
  .no-results-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
  }
  
  .catalog-link {
    display: inline-block;
    padding: 12px 24px;
    background-color: #b88b8b;
    color: white;
    text-decoration: none;
    border-radius: 30px;
    transition: background-color 0.2s;
  }
  
  .catalog-link:hover {
    background-color: #a57676;
  }
  
  .clear-search-btn {
    padding: 12px 24px;
    background-color: #e6c7c2;
    color: #5e4b4b;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .clear-search-btn:hover {
    background-color: #d8b1aa;
  }
  
  .suggestions h3 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .suggestions-list {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .suggestion-btn {
    padding: 8px 16px;
    background-color: #fff0ed;
    border: 1px solid #e6c7c2;
    border-radius: 25px;
    color: #7a5b5b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .suggestion-btn:hover {
    background-color: #b88b8b;
    color: white;
    border-color: #b88b8b;
  }
  
  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .search-results {
      padding: 1rem;
    }
    
    .no-results-actions {
      flex-direction: column;
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .products-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>