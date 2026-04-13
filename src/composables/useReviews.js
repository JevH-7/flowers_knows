import { ref } from 'vue'

const STORAGE_KEY = 'cosmetics_reviews'

const loadReviews = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Ошибка загрузки отзывов', e)
  }
  return {}
}

const saveReviews = (reviews) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  } catch (e) {
    console.error('Ошибка сохранения отзывов', e)
  }
}

const reviews = ref(loadReviews())

export function useReviews() {
  const getReviewsByProductUrl = (productUrl) => {
    if (!productUrl) return []
    return reviews.value[productUrl] || []
  }

  const addReview = (productUrl, review) => {
    console.log('=== addReview вызван ===')
    console.log('productUrl:', productUrl)
    console.log('review:', review)
    
    if (!productUrl) {
      console.error('productUrl не передан')
      return false
    }
    
    if (!review || !review.text) {
      console.error('review не содержит текст')
      return false
    }
    
    if (!reviews.value[productUrl]) {
      reviews.value[productUrl] = []
    }
    
    const newReview = {
      id: Date.now(),
      author: review.author || 'Пользователь',
      rating: review.rating || 5,
      text: review.text,
      date: new Date().toLocaleDateString('ru-RU'),
      createdAt: new Date().toISOString()
    }
    
    console.log('Добавляем новый отзыв:', newReview)
    reviews.value[productUrl].unshift(newReview)
    saveReviews(reviews.value)
    console.log('Все отзывы после добавления:', reviews.value)
    
    return newReview
  }

  const deleteReview = (productUrl, reviewId) => {
    if (reviews.value[productUrl]) {
      reviews.value[productUrl] = reviews.value[productUrl].filter(r => r.id !== reviewId)
      saveReviews(reviews.value)
    }
  }

  const getAverageRating = (productUrl) => {
    const productReviews = reviews.value[productUrl] || []
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((total, review) => total + review.rating, 0)
    return (sum / productReviews.length).toFixed(1)
  }

  return {
    getReviewsByProductUrl,
    addReview,
    deleteReview,
    getAverageRating
  }
}