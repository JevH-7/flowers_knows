<template>
    <div class="product-edit" v-if="product">
      <h1>Редактирование товара</h1>
      <form @submit.prevent="handleUpdateProduct" class="product-form" novalidate>
        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label>Название *</label>
          <input v-model="form.name" @blur="validateField('name')" />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
  
        <div class="form-group" :class="{ 'has-error': errors.description }">
          <label>Описание *</label>
          <textarea v-model="form.description" rows="3" @blur="validateField('description')"></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>
  
        <div class="form-group" :class="{ 'has-error': errors.specs }">
          <label>Характеристики</label>
          <textarea v-model="form.specs" rows="2" @blur="validateField('specs')"></textarea>
          <span v-if="errors.specs" class="error-message">{{ errors.specs }}</span>
        </div>
  
        <div class="form-group" :class="{ 'has-error': errors.category }">
          <label>Категория *</label>
          <select v-model="form.category" @blur="validateField('category')">
            <option value="" disabled>Выберите категорию</option>
            <option value="Лицо">Лицо</option>
            <option value="Губы">Губы</option>
            <option value="Глаза">Глаза</option>
            <option value="Брови">Брови</option>
            <option value="Кисти и аксессуары">Кисти и аксессуары</option>
          </select>
          <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
        </div>
  
        <div class="form-group" :class="{ 'has-error': errors.price }">
          <label>Цена (₽) *</label>
          <input v-model.number="form.price" type="number" @blur="validateField('price')" />
          <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
        </div>
  
        <div class="form-group" :class="{ 'has-error': errors.imageUrl }">
          <label>URL изображения *</label>
          <input v-model="form.imageUrl" @blur="validateField('imageUrl')" />
          <span v-if="errors.imageUrl" class="error-message">{{ errors.imageUrl }}</span>
          <div v-if="form.imageUrl && !errors.imageUrl" class="image-preview">
            <img :src="form.imageUrl" alt="Предпросмотр" @error="handleImageError" />
          </div>
        </div>
  
        <div class="form-buttons">
          <button type="submit">Сохранить</button>
          <button type="button" @click="cancel">Отмена</button>
        </div>
      </form>
    </div>
    <div v-else>
      <p>Товар не найден</p>
      <button @click="cancel">Назад</button>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useProducts } from '../composables/useProducts'
  import { inject } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const { getProductByUrl, updateProduct } = useProducts()
  const notification = inject('notification')
  
  const product = ref(null)
  const originalUrl = ref('')
  
  const form = reactive({
    name: '',
    description: '',
    specs: '',
    category: '',
    price: null,
    imageUrl: ''
  })
  
  const errors = reactive({
    name: '',
    description: '',
    specs: '',
    category: '',
    price: '',
    imageUrl: ''
  })
  
  // Валидация
  const validateName = (name) => {
    if (!name || name.trim() === '') return 'Название обязательно'
    if (name.length < 3) return 'Название должно содержать минимум 3 символа'
    if (name.length > 100) return 'Название не должно превышать 100 символов'
    return ''
  }
  
  const validateDescription = (description) => {
    if (!description || description.trim() === '') return 'Описание обязательно'
    if (description.length < 10) return 'Описание должно содержать минимум 10 символов'
    if (description.length > 500) return 'Описание не должно превышать 500 символов'
    return ''
  }
  
  const validateSpecs = (specs) => {
    if (specs && specs.length > 300) return 'Характеристики не должны превышать 300 символов'
    return ''
  }
  
  const validateCategory = (category) => {
    if (!category) return 'Выберите категорию'
    return ''
  }
  
  const validatePrice = (price) => {
    if (price === null || price === '' || isNaN(price)) return 'Цена обязательна'
    if (price <= 0) return 'Цена должна быть больше 0'
    if (price > 100000) return 'Цена не должна превышать 100 000 ₽'
    return ''
  }
  
  const validateImageUrl = (url) => {
    if (!url || url.trim() === '') return 'URL изображения обязателен'
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i
    if (!urlPattern.test(url)) return 'Введите корректный URL (начинается с http:// или https://)'
    return ''
  }
  
  const validateField = (field) => {
    switch (field) {
      case 'name': errors.name = validateName(form.name); break
      case 'description': errors.description = validateDescription(form.description); break
      case 'specs': errors.specs = validateSpecs(form.specs); break
      case 'category': errors.category = validateCategory(form.category); break
      case 'price': errors.price = validatePrice(form.price); break
      case 'imageUrl': errors.imageUrl = validateImageUrl(form.imageUrl); break
    }
  }
  
  const validateForm = () => {
    validateField('name')
    validateField('description')
    validateField('specs')
    validateField('category')
    validateField('price')
    validateField('imageUrl')
    
    return !errors.name && !errors.description && !errors.specs && 
           !errors.category && !errors.price && !errors.imageUrl
  }
  
  const handleImageError = () => {
    errors.imageUrl = 'Не удалось загрузить изображение по указанному URL'
  }
  
  const handleUpdateProduct = () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.has-error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    updateProduct(product.value.id, form)
    notification.showSuccess('Товар обновлен')
    router.push('/admin')
  }
  
  const cancel = () => {
    router.push('/admin')
  }
  
  onMounted(() => {
    const url = route.params.url
    const foundProduct = getProductByUrl(url)
    if (foundProduct) {
      product.value = foundProduct
      originalUrl.value = foundProduct.url
      Object.assign(form, {
        name: foundProduct.name,
        description: foundProduct.description,
        specs: foundProduct.specs || '',
        category: foundProduct.category,
        price: foundProduct.price,
        imageUrl: foundProduct.imageUrl
      })
    }
  })
  </script>
  
  <style scoped>
  .product-edit {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fef6f4;
    border-radius: 20px;
  }
  
  h1 {
    color: #b76363;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    color: #7a5b5b;
    font-weight: 500;
    font-size: 0.95rem;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e6c7c2;
    border-radius: 8px;
    background-color: #fff9f7;
    font-size: 1rem;
    font-family: inherit;
  }
  
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #b88b8b;
    box-shadow: 0 0 0 2px rgba(184, 139, 139, 0.2);
  }
  
  .form-group.has-error input,
  .form-group.has-error textarea,
  .form-group.has-error select {
    border-color: #f44336;
    background-color: #fff5f5;
  }
  
  .error-message {
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .image-preview {
    margin-top: 0.5rem;
    max-width: 200px;
  }
  
  .image-preview img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #e6c7c2;
  }
  
  .form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .form-buttons button {
    flex: 1;
  }
  
  .form-buttons button:first-child {
    background-color: #b88b8b;
    color: white;
  }
  
  .form-buttons button:first-child:hover {
    background-color: #a57676;
  }
  
  .form-buttons button:last-child {
    background-color: #e6c7c2;
    color: #5e4b4b;
  }
  
  .form-buttons button:last-child:hover {
    background-color: #d8b1aa;
  }
  </style>