<template>
  <div id="app">
    <nav>
      <router-link to="/" class="site-title">FLOWERS KNOWS</router-link>
      <div class="nav-links">
        <router-link to="/products">Каталог</router-link>
        <router-link to="/about">О нас</router-link>
        <router-link to="/contacts">Контакты</router-link>
        
        <!-- Поисковая строка -->
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск товаров..."
            @keyup.enter="handleSearch"
            class="search-input"
          />
          <button @click="handleSearch" class="search-btn">🔍</button>
        </div>
        
        <!-- Кнопка корзины -->
        <Cart />
        
        <router-link v-if="!isAuthenticated" to="/auth">Вход/Регистрация</router-link>
        <template v-else>
          <router-link v-if="isAdmin()" to="/admin">Админка</router-link>
          <router-link to="/profile">Профиль</router-link>
          <span class="user-name">{{ currentUser?.name || currentUser?.email }}</span>
          <button @click="handleLogout" class="logout-btn">Выйти</button>
        </template>
      </div>
    </nav>

    <router-view />

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h4>FLOWERS KNOWS</h4>
          <p>Магазин декоративной косметики с нежными оттенками и натуральными ингредиентами.</p>
        </div>
        <div class="footer-section">
          <h4>Контакты</h4>
          <p>📞 +7 (960) 278-77-33</p>
          <p>✉️ info@flowersknows.ru</p>
          <p>📍 г. Санкт-Петербург ул. Красного Курсанта, 26 </p>
        </div>
        <div class="footer-section">
          <h4>Мы в соцсетях</h4>
          <p>
            <a href="https://vk.com/id757392379" target="_blank">VK</a> |
            <a href="https://t.me/JevH7" target="_blank">Telegram</a>
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2025 FLOWERS KNOWS. Все права защищены.
      </div>
    </footer>

    <Notification />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from './composables/useAuth'
import Notification from './components/Notification.vue'
import Cart from './components/Cart.vue'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const { currentUser, isAuthenticated, logout, isAdmin } = useAuth()
const notification = inject('notification')
const router = useRouter()

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  }
}

const handleLogout = () => {
  logout()
  notification.showInfo('Вы вышли из системы')
  router.push('/')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  background-color: #faf3f0;
  color: #5e4b4b;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
}

nav {
  background-color: #f8e1df;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Логотип - всегда в улучшенном виде */
.site-title {
  font-size: 1.6rem;
  font-weight: 300;
  color: #a14f4f;
  text-decoration: none;
  letter-spacing: 4px;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
}

.site-title::before {
  content: '🌸';
  font-size: 1.2rem;
  margin-right: 8px;
  opacity: 1;
}

.site-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #b76363, #e6c7c2);
}

.site-title:hover {
  color: #8a3f3f;
  letter-spacing: 5px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-links a {
  text-decoration: none;
  color: #7a5b5b;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #b88b8b;
}

.nav-links a.router-link-exact-active {
  color: #b76363;
  border-bottom: 2px solid #b76363;
}

.user-name {
  color: #7a5b5b;
  margin-right: 10px;
}

.logout-btn {
  background: none;
  border: 1px solid #b88b8b;
  color: #b88b8b;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.logout-btn:hover {
  background-color: #b88b8b;
  color: white;
}

button {
  background-color: #e6c7c2;
  border: none;
  color: #5e4b4b;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  font-family: inherit;
}

button:hover {
  background-color: #d8b1aa;
}

/* Стили для поиска */
.search-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-input {
  padding: 8px 15px;
  border: 1px solid #e6c7c2;
  border-radius: 25px;
  background-color: #fff9f7;
  font-size: 0.9rem;
  width: 200px;
  transition: all 0.2s;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: #b88b8b;
  box-shadow: 0 0 0 2px rgba(184, 139, 139, 0.2);
  width: 250px;
}

.search-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50%;
  transition: background-color 0.2s;
  font-family: inherit;
}

.search-btn:hover {
  background-color: #e6c7c2;
}

.footer {
  background-color: #f8e1df;
  padding: 2rem 2rem 1rem;
  margin-top: auto;
  flex-shrink: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h4 {
  color: #b76363;
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section p {
  color: #7a5b5b;
  line-height: 1.6;
}

.footer-section a {
  color: #7a5b5b;
  text-decoration: none;
  border-bottom: 1px dotted #b88b8b;
  font-family: inherit;
}

.footer-section a:hover {
  color: #b76363;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #d8b1aa;
  color: #7a5b5b;
  font-size: 0.9rem;
}

input, textarea, select, button {
  font-family: inherit;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    text-align: center;
  }
  .nav-links {
    justify-content: center;
  }
  .search-input {
    width: 180px;
  }
  .search-input:focus {
    width: 180px;
  }
  .site-title {
    font-size: 1.4rem;
  }
}
</style>