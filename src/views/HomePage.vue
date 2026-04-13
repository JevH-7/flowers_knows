<template>
    <div class="home">
      <div class="hero">
        <img src='/images/bun1.jpg' alt="hero" />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>Добро пожаловать в магазин декоративной косметики</h1>
          <p class="subtitle">Нежные оттенки для вашего образа</p>
        </div>
      </div>
  
      <!-- ХИТЫ ПРОДАЖ + ССЫЛКА НА КАТАЛОГ -->
      <section class="bestsellers">
        <div class="section-header-wrapper">
          <div class="section-title-block">
            <h2>Хит продаж</h2>
            <p class="section-subtitle">Самые популярные товары этого месяца</p>
          </div>
          <router-link to="/products" class="catalog-link">Смотреть все товары →</router-link>
        </div>
        
        <div class="bestsellers-grid">
          <div v-for="product in bestsellers" :key="product.id" class="bestseller-card">
            <router-link :to="`/product/${product.url}`">
              <div class="product-image">
                <img :src="product.imageUrl" :alt="product.name" />
                <span class="bestseller-badge">Хит</span>
              </div>
              <h3>{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <p class="product-price">{{ product.price }} ₽</p>
            </router-link>
            <button @click="handleAddToCart(product)" class="add-to-cart-btn">
              В корзину
            </button>
          </div>
        </div>
      </section>
  
      <!-- СЕКЦИЯ: О НАС -->
      <section class="about-preview">
        <div class="about-preview-content">
          <div class="about-preview-text">
            <h2>О бренде FLOWERS KNOWS</h2>
            <p>Мы создаём декоративную косметику, которая подчёркивает вашу естественную красоту. Нежные оттенки, натуральные ингредиенты и забота о вашей коже — наш главный приоритет.</p>
            <router-link to="/about" class="about-link">Узнать больше →</router-link>
          </div>
          <div class="about-preview-image">
            <img src="/images/bun4.jpg" alt="О бренде" />
          </div>
        </div>
      </section>
  
      <div class="features">
        <div class="feature">
          <h3>Натуральные ингредиенты</h3>
          <p>Мы заботимся о вашей коже</p>
        </div>
        <div class="feature">
          <h3>Широкая палитра</h3>
          <p>Более 100 оттенков</p>
        </div>
        <div class="feature">
          <h3>Доставка по всей России</h3>
          <p>Быстро и надежно</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useProducts } from '../composables/useProducts'
  import { useCart } from '../composables/useCart'
  import { inject } from 'vue'
  
  const { getProducts } = useProducts()
  const { addToCart } = useCart()
  const notification = inject('notification')
  
  const products = getProducts()
  
  // Хиты продаж (id товаров, которые считаются хитами)
  const bestsellers = computed(() => {
    const bestsellerIds = [1, 3, 7, 4, 9]
    return products.value.filter(product => bestsellerIds.includes(product.id))
  })
  
  const handleAddToCart = (product) => {
    addToCart(product)
    notification.showSuccess(`"${product.name}" добавлен в корзину`)
  }
  </script>
  
  <style scoped>
  .home {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  
  /* HERO СЕКЦИЯ */
  .hero {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    margin-bottom: 4rem;
  }
  
  .hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
  }
  
  .hero-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    width: 100%;
    padding: 0 2rem;
    z-index: 2;
  }
  
  .hero-content h1 {
    color: white;
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 600;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .hero-content .subtitle {
    color: white;
    font-size: 1.3rem;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  }
  
  /* СЕКЦИЯ ХИТОВ ПРОДАЖ */
  .bestsellers {
    max-width: 1200px;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #fef6f4;
    border-radius: 30px;
  }
  
  .section-header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  
  .section-title-block {
    text-align: left;
  }
  
  .bestsellers h2 {
    color: #b76363;
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    font-weight: 400;
  }
  
  .section-subtitle {
    color: #a57c7c;
    font-size: 0.95rem;
    margin: 0;
    font-weight: 400;
  }
  
  /* Ссылка в стиле "О нас" */
  .catalog-link {
    display: inline-block;
    color: #b76363;
    text-decoration: none;
    font-weight: 400;
    font-size: 1rem;
    border-bottom: 2px solid #b76363;
    padding-bottom: 4px;
    transition: all 0.2s;
    margin-top: 0.5rem;
  }
  
  .catalog-link:hover {
    color: #a14f4f;
    border-bottom-color: #a14f4f;
    transform: translateX(5px);
  }
  
  .bestsellers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 1rem;
  }
  
  .bestseller-card {
    background-color: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 6px 15px rgba(183, 99, 99, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .bestseller-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(183, 99, 99, 0.2);
  }
  
  .bestseller-card a {
    text-decoration: none;
    color: inherit;
    flex-grow: 1;
  }
  
  .product-image {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .bestseller-card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 15px;
  }
  
  .bestseller-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff6b6b;
    color: white;
    padding: 5px 12px;
    border-radius: 25px;
    font-size: 0.75rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  }
  
  .bestseller-card h3 {
    color: #b76363;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  .product-category {
    color: #b88b8b;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    font-weight: 400;
  }
  
  .product-price {
    color: #5e4b4b;
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0.5rem 0;
  }
  
  .add-to-cart-btn {
    background-color: #b88b8b;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1rem;
    width: 100%;
  }
  
  .add-to-cart-btn:hover {
    background-color: #a57676;
  }
  
  /* СЕКЦИЯ: О НАС */
  .about-preview {
    max-width: 1200px;
    margin: 4rem auto;
    padding: 2rem;
    background: linear-gradient(135deg, #f8e1df 0%, #fef6f4 100%);
    border-radius: 30px;
  }
  
  .about-preview-content {
    display: flex;
    align-items: center;
    gap: 3rem;
  }
  
  .about-preview-text {
    flex: 1;
  }
  
  .about-preview-text h2 {
    color: #b76363;
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 400;
  }
  
  .about-preview-text p {
    color: #7a5b5b;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    font-weight: 400;
  }
  
  .about-link {
    display: inline-block;
    color: #b76363;
    text-decoration: none;
    font-weight: 400;
    font-size: 1rem;
    border-bottom: 2px solid #b76363;
    padding-bottom: 4px;
    transition: all 0.2s;
  }
  
  .about-link:hover {
    color: #a14f4f;
    border-bottom-color: #a14f4f;
    transform: translateX(5px);
  }
  
  .about-preview-image {
    flex: 1;
  }
  
  .about-preview-image img {
    width: 100%;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(183, 99, 99, 0.2);
    transition: transform 0.3s;
  }
  
  .about-preview-image img:hover {
    transform: scale(1.02);
  }
  
  /* ПРЕИМУЩЕСТВА */
  .features {
    max-width: 1200px;
    margin: 3rem auto;
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    padding: 0 2rem;
    padding-bottom: 3rem;
  }
  
  .feature {
    background-color: #fef6f4;
    padding: 1.5rem;
    border-radius: 15px;
    width: 250px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    text-align: center;
  }
  
  .feature h3 {
    color: #b76363;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .feature p {
    font-weight: 400;
  }
  
  /* Адаптив */
  @media (max-width: 768px) {
    .hero {
      height: 400px;
    }
    
    .hero-content h1 {
      font-size: 2rem;
    }
    
    .hero-content .subtitle {
      font-size: 1rem;
    }
    
    .bestsellers-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .about-preview-content {
      flex-direction: column;
    }
    
    .about-preview-text {
      text-align: center;
    }
    
    .section-header-wrapper {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
    }
    
    .section-title-block {
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .hero {
      height: 300px;
    }
    
    .hero-content h1 {
      font-size: 1.5rem;
    }
    
    .hero-content .subtitle {
      font-size: 0.9rem;
    }
    
    .bestsellers-grid {
      grid-template-columns: 1fr;
    }
    
    .features {
      flex-direction: column;
      align-items: center;
    }
    
    .feature {
      width: 100%;
      max-width: 280px;
    }
    
    .about-preview-text h2 {
      font-size: 1.5rem;
    }
  }
  </style>