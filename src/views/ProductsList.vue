<template>
    <div class="products-list">
      <h1>Каталог</h1>
      
      <div class="products-container">
        <aside class="categories-sidebar">
          <h3>Категории</h3>
          <ul class="categories-list">
            <li 
              v-for="category in categories" 
              :key="category"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
              <span class="category-count">{{ getProductsCountByCategory(category) }}</span>
            </li>
            <li 
              :class="{ active: selectedCategory === null }"
              @click="selectedCategory = null"
              class="all-categories"
            >
              Все товары
              <span class="category-count">{{ products.length }}</span>
            </li>
          </ul>
          
          <div class="sidebar-info">
            <p>Натуральная косметика</p>
            <p>Гипоаллергенно</p>
            <p>Подарочная упаковка</p>
          </div>
        </aside>
  
        <div class="products-content">
          <div class="selected-category-mobile">
            <span>Категория: </span>
            <strong>{{ selectedCategory || 'Все товары' }}</strong>
          </div>
  
          <div v-if="filteredProducts.length > 0" class="product-grid">
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
                <button @click="editProduct(product)" title="Редактировать">✎</button>
                <button @click="removeProduct(product.id)" title="Удалить">🗑️</button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-products">
            <p>В этой категории пока нет товаров</p>
            <button @click="selectedCategory = null" class="reset-filter">Показать все товары</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useProducts } from '../composables/useProducts'
  import { useAuth } from '../composables/useAuth'
  import { useCart } from '../composables/useCart'
  import { inject } from 'vue'
  import { useRouter } from 'vue-router'
  
  const { getProducts, deleteProduct } = useProducts()
  const { addToCart } = useCart()
  const products = getProducts()
  const { isAdmin, currentUser } = useAuth()
  const notification = inject('notification')
  const router = useRouter()
  
  const categories = computed(() => {
    const cats = products.value.map(p => p.category)
    return [...new Set(cats)].sort()
  })
  
  const selectedCategory = ref(null)
  
  const filteredProducts = computed(() => {
    if (!selectedCategory.value) return products.value
    return products.value.filter(p => p.category === selectedCategory.value)
  })
  
  const getProductsCountByCategory = (category) => {
    return products.value.filter(p => p.category === category).length
  }
  
  const truncateDescription = (description) => {
    if (description.length > 60) {
      return description.substring(0, 60) + '...'
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
  }
  
  const editProduct = (product) => {
    router.push(`/product/edit/${product.url}`)
  }
  </script>
  
  <style scoped>
  .products-list {
    max-width: 1300px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  }
  
  h1 {
    color: #b76363;
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2.2rem;
    font-weight: 300;
  }
  
  .products-container {
    display: flex;
    gap: 3rem;
  }
  
  .categories-sidebar {
    flex: 0 0 240px;
    background-color: #fef6f4;
    border-radius: 20px;
    padding: 1.8rem 1.5rem;
    height: fit-content;
    position: sticky;
    top: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    margin-right: 1rem;
  }
  
  .categories-sidebar h3 {
    color: #b76363;
    margin-bottom: 1.2rem;
    padding-bottom: 0.8rem;
    border-bottom: 2px solid #e6c7c2;
    font-size: 1.3rem;
    font-weight: 500;
  }
  
  .categories-list {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
  }
  
  .categories-list li {
    padding: 12px 18px;
    margin-bottom: 8px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #7a5b5b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 1.05rem;
  }
  
  .categories-list li:hover {
    background-color: #e6c7c2;
    color: #5e4b4b;
    transform: translateX(5px);
  }
  
  .categories-list li.active {
    background-color: #b88b8b;
    color: white;
    box-shadow: 0 4px 10px rgba(183, 99, 99, 0.2);
  }
  
  .category-count {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: normal;
  }
  
  .categories-list li.active .category-count {
    background-color: rgba(255, 255, 255, 0.4);
  }
  
  .all-categories {
    margin-top: 15px;
    border-top: 1px solid #e6c7c2;
    padding-top: 18px !important;
    font-weight: bold;
  }
  
  .sidebar-info {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px dashed #e6c7c2;
    font-size: 0.95rem;
    color: #b88b8b;
  }
  
  .sidebar-info p {
    margin: 0.8rem 0;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  
  .products-content {
    flex: 1;
  }
  
  .selected-category-mobile {
    display: none;
    background-color: #fef6f4;
    padding: 1rem 1.5rem;
    border-radius: 30px;
    margin-bottom: 2rem;
    color: #7a5b5b;
    text-align: center;
    font-size: 1.1rem;
  }
  
  .selected-category-mobile strong {
    color: #b76363;
  }
  
  .product-grid {
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
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 1rem;
    transition: transform 0.3s;
  }
  
  .product-card:hover img {
    transform: scale(1.03);
  }
  
  .product-card h3 {
    color: #b76363;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .category-tag {
    font-size: 0.8rem;
    color: #b88b8b;
    margin-bottom: 0.5rem;
    display: inline-block;
    background-color: #fff0ed;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 400;
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
    font-family: inherit;
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
    font-family: inherit;
  }
  
  .admin-actions button:hover {
    background-color: #b88b8b;
    color: white;
  }
  
  .no-products {
    text-align: center;
    padding: 4rem;
    background-color: #fef6f4;
    border-radius: 20px;
    color: #7a5b5b;
  }
  
  .reset-filter {
    margin-top: 1.5rem;
    background-color: #b88b8b;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
    font-family: inherit;
  }
  
  .reset-filter:hover {
    background-color: #a57676;
  }
  
  @media (max-width: 1100px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.8rem;
    }
    
    .products-container {
      gap: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .products-container {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .categories-sidebar {
      position: static;
      width: 100%;
      margin-right: 0;
      padding: 1.5rem;
    }
    
    .categories-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }
    
    .categories-list li {
      flex: 0 0 auto;
      margin-bottom: 0;
      padding: 10px 16px;
    }
    
    .categories-list li:hover {
      transform: none;
    }
    
    .selected-category-mobile {
      display: block;
    }
    
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .products-list {
      padding: 1rem;
    }
    
    .product-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    h1 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
    }
    
    .admin-actions {
      opacity: 1;
    }
  }
  </style>