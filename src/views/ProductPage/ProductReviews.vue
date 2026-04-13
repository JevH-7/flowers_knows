<template>
    <div class="reviews">
      <h2>Отзывы</h2>
      
      <!-- Средний рейтинг -->
      <div v-if="reviewsList.length > 0" class="rating-summary">
        <div class="average-rating">
          <span class="rating-value">{{ averageRating }}</span>
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(averageRating) }">★</span>
          </div>
          <span class="reviews-count">{{ reviewsList.length }} {{ getDeclension(reviewsList.length) }}</span>
        </div>
      </div>
  
      <!-- Форма добавления отзыва -->
      <div v-if="isAuthenticated" class="add-review-form">
        <h3>Оставить отзыв</h3>
        <div class="form-group">
          <label>Оценка</label>
          <div class="rating-input">
            <span 
              v-for="star in 5" 
              :key="star"
              class="star-input"
              :class="{ active: star <= newReview.rating }"
              @click="newReview.rating = star"
            >
              ★
            </span>
          </div>
        </div>
        <div class="form-group">
          <label>Ваш отзыв</label>
          <textarea 
            v-model="newReview.text" 
            rows="4" 
            placeholder="Поделитесь впечатлениями о товаре..."
          ></textarea>
        </div>
        <div class="form-group">
          <label>Ваше имя</label>
          <input 
            v-model="newReview.author" 
            type="text" 
            placeholder="Как вас зовут?"
          />
        </div>
        <button @click="submitReview" :disabled="!canSubmit" class="submit-review-btn">
          Отправить отзыв
        </button>
      </div>
  
      <div v-else class="login-prompt">
        <p>Чтобы оставить отзыв, <router-link to="/auth">войдите</router-link> в аккаунт</p>
      </div>
  
      <!-- Список отзывов -->
      <div class="reviews-list">
        <div v-if="reviewsList.length === 0" class="no-reviews">
          <p>Пока нет отзывов. Будьте первым!</p>
        </div>
        
        <div v-for="review in reviewsList" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="review-author">
              <span class="author-name">{{ review.author }}</span>
              <span class="review-date">{{ review.date }}</span>
            </div>
            <div class="review-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
            </div>
            <!-- Кнопка удаления отзыва ТОЛЬКО для администратора -->
            <button 
              v-if="isAdmin()" 
              @click="deleteReview(review.id)" 
              class="delete-review-btn"
              title="Удалить отзыв"
            >
              🗑️
            </button>
          </div>
          <div class="review-text">
            {{ review.text }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useAuth } from '../../composables/useAuth'
  import { useReviews } from '../../composables/useReviews'
  import { inject } from 'vue'
  
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })
  
  const { isAuthenticated, currentUser, isAdmin } = useAuth()
  const { getReviewsByProductUrl, addReview, deleteReview: deleteReviewApi, getAverageRating } = useReviews()
  const notification = inject('notification')
  
  const reviewsList = ref([])
  const averageRating = ref(0)
  
  const newReview = ref({
    author: '',
    rating: 5,
    text: ''
  })
  
  const canSubmit = computed(() => {
    return newReview.value.rating > 0 && 
           newReview.value.text.trim().length >= 10 &&
           newReview.value.author.trim().length >= 2
  })
  
  const getDeclension = (count) => {
    if (count === 1) return 'отзыв'
    if (count >= 2 && count <= 4) return 'отзыва'
    return 'отзывов'
  }
  
  const loadReviews = () => {
    if (props.product && props.product.url) {
      console.log('Загрузка отзывов для товара:', props.product.url)
      reviewsList.value = getReviewsByProductUrl(props.product.url)
      averageRating.value = getAverageRating(props.product.url)
      console.log('Загружено отзывов:', reviewsList.value.length)
    }
  }
  
  const submitReview = () => {
    console.log('=== submitReview вызван ===')
    console.log('canSubmit:', canSubmit.value)
    console.log('newReview:', newReview.value)
    
    if (!canSubmit.value) {
      if (newReview.value.text.trim().length < 10) {
        notification.showError('Отзыв должен содержать минимум 10 символов')
      }
      if (newReview.value.author.trim().length < 2) {
        notification.showError('Введите ваше имя (минимум 2 символа)')
      }
      return
    }
    
    if (!props.product || !props.product.url) {
      console.error('Нет product.url')
      notification.showError('Ошибка: товар не найден')
      return
    }
    
    const review = {
      author: newReview.value.author.trim(),
      rating: newReview.value.rating,
      text: newReview.value.text.trim()
    }
    
    console.log('Отправляем отзыв:', review)
    
    try {
      const result = addReview(props.product.url, review)
      if (result) {
        loadReviews()
        newReview.value = { author: '', rating: 5, text: '' }
        notification.showSuccess('Спасибо за отзыв!')
      } else {
        notification.showError('Не удалось добавить отзыв')
      }
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error)
      notification.showError('Не удалось добавить отзыв')
    }
  }
  
  const deleteReview = (reviewId) => {
    // Дополнительная проверка: удалять может только админ
    if (!isAdmin()) {
      notification.showError('У вас нет прав на удаление отзывов')
      return
    }
    
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      deleteReviewApi(props.product.url, reviewId)
      loadReviews()
      notification.showSuccess('Отзыв удален')
    }
  }
  
  // Заполняем имя из данных пользователя, если есть
  watch(() => currentUser.value, () => {
    if (currentUser.value) {
      newReview.value.author = currentUser.value.name || currentUser.value.email || ''
    }
  }, { immediate: true })
  
  watch(() => props.product, () => {
    loadReviews()
  }, { immediate: true, deep: true })
  
  onMounted(() => {
    loadReviews()
  })
  </script>
  
  <style scoped>
  .reviews {
    line-height: 1.6;
    color: #7a5b5b;
  }
  
  h2 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  h3 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .rating-summary {
    background-color: #fff9f7;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .average-rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .rating-value {
    font-size: 2rem;
    font-weight: bold;
    color: #b76363;
  }
  
  .stars {
    display: inline-flex;
    gap: 2px;
  }
  
  .star {
    font-size: 1.2rem;
    color: #e6c7c2;
  }
  
  .star.filled {
    color: #ffc107;
  }
  
  .reviews-count {
    color: #b88b8b;
    font-size: 0.9rem;
  }
  
  .add-review-form {
    background-color: #fff9f7;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #7a5b5b;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e6c7c2;
    border-radius: 12px;
    background-color: white;
    font-size: 1rem;
    font-family: inherit;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #b88b8b;
  }
  
  .rating-input {
    display: flex;
    gap: 8px;
  }
  
  .star-input {
    font-size: 1.5rem;
    color: #e6c7c2;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .star-input:hover,
  .star-input.active {
    color: #ffc107;
  }
  
  .submit-review-btn {
    background-color: #b88b8b;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
    margin-top: 0.5rem;
  }
  
  .submit-review-btn:hover:not(:disabled) {
    background-color: #a57676;
  }
  
  .submit-review-btn:disabled {
    background-color: #e6c7c2;
    cursor: not-allowed;
  }
  
  .login-prompt {
    background-color: #fff9f7;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .login-prompt a {
    color: #b76363;
    text-decoration: none;
    font-weight: 500;
  }
  
  .login-prompt a:hover {
    text-decoration: underline;
  }
  
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .no-reviews {
    text-align: center;
    padding: 2rem;
    color: #b88b8b;
    font-style: italic;
  }
  
  .review-card {
    background-color: #fff9f7;
    border-radius: 12px;
    padding: 1rem;
    transition: box-shadow 0.2s;
  }
  
  .review-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e6c7c2;
  }
  
  .review-author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .author-name {
    font-weight: 600;
    color: #b76363;
  }
  
  .review-date {
    font-size: 0.8rem;
    color: #b88b8b;
  }
  
  .review-rating {
    display: flex;
    gap: 2px;
  }
  
  .review-text {
    color: #7a5b5b;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  
  .delete-review-btn {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
    color: #b88b8b;
  }
  
  .delete-review-btn:hover {
    background-color: #f8e1df;
    color: #f44336;
  }
  </style>