<template>
    <div>
      <h2>Добавить новый товар</h2>
      <form @submit.prevent="handleAddProduct" class="product-form" novalidate>
        <!-- Название -->
        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label>Название *</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="Введите название товара"
            @blur="validateField('name')"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
  
        <!-- Описание -->
        <div class="form-group" :class="{ 'has-error': errors.description }">
          <label>Описание *</label>
          <textarea 
            v-model="form.description" 
            rows="3" 
            placeholder="Опишите товар"
            @blur="validateField('description')"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>
  
        <!-- Характеристики -->
        <div class="form-group" :class="{ 'has-error': errors.specs }">
          <label>Характеристики</label>
          <textarea 
            v-model="form.specs" 
            rows="2" 
            placeholder="Например: объем, состав, страна производства"
            @blur="validateField('specs')"
          ></textarea>
          <span v-if="errors.specs" class="error-message">{{ errors.specs }}</span>
        </div>
  
        <!-- Категория -->
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
  
        <!-- Цена -->
        <div class="form-group" :class="{ 'has-error': errors.price }">
          <label>Цена (₽) *</label>
          <input 
            v-model.number="form.price" 
            type="number" 
            placeholder="0"
            min="0"
            step="1"
            @blur="validateField('price')"
          />
          <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
        </div>
  
        <!-- URL изображения -->
        <div class="form-group" :class="{ 'has-error': errors.imageUrl }">
          <label>URL изображения *</label>
          <input 
            v-model="form.imageUrl" 
            type="text" 
            placeholder="/images/photo.jpg  или  https://example.com/image.jpg"
            @blur="validateField('imageUrl')"
          />
          <span v-if="errors.imageUrl" class="error-message">{{ errors.imageUrl }}</span>
          <div class="hint">
            <strong>Примеры правильных путей:</strong><br>
            • /images/pomada.jpg (картинка в папке public/images/)<br>
            • https://example.com/image.jpg (картинка из интернета)
          </div>
          
          <!-- Предпросмотр изображения -->
          <div v-if="form.imageUrl && !errors.imageUrl" class="image-preview">
            <img :src="form.imageUrl" alt="Предпросмотр" @error="handleImageError" />
          </div>
        </div>
  
        <div class="form-buttons">
          <button type="submit" class="submit-btn">Сохранить</button>
          <button type="button" @click="cancel" class="cancel-btn">Отмена</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useProducts } from '../../composables/useProducts'
  import { inject } from 'vue'
  import { useRouter } from 'vue-router'
  
  const { addProduct } = useProducts()
  const notification = inject('notification')
  const router = useRouter()
  
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
  
  // Валидация названия
  const validateName = (name) => {
    if (!name || name.trim() === '') {
      return 'Название обязательно'
    }
    if (name.length < 3) {
      return 'Название должно содержать минимум 3 символа'
    }
    if (name.length > 100) {
      return 'Название не должно превышать 100 символов'
    }
    return ''
  }
  
  // Валидация описания
  const validateDescription = (description) => {
    if (!description || description.trim() === '') {
      return 'Описание обязательно'
    }
    if (description.length < 10) {
      return 'Описание должно содержать минимум 10 символов'
    }
    if (description.length > 500) {
      return 'Описание не должно превышать 500 символов'
    }
    return ''
  }
  
  // Валидация характеристик
  const validateSpecs = (specs) => {
    if (specs && specs.length > 300) {
      return 'Характеристики не должны превышать 300 символов'
    }
    return ''
  }
  
  // Валидация категории
  const validateCategory = (category) => {
    if (!category) {
      return 'Выберите категорию'
    }
    return ''
  }
  
  // Валидация цены
  const validatePrice = (price) => {
    if (price === null || price === '' || isNaN(price)) {
      return 'Цена обязательна'
    }
    if (price <= 0) {
      return 'Цена должна быть больше 0'
    }
    if (price > 100000) {
      return 'Цена не должна превышать 100 000 ₽'
    }
    return ''
  }
  
  // Валидация URL изображения
  const validateImageUrl = (url) => {
    if (!url || url.trim() === '') {
      return 'URL изображения обязателен'
    }
    
    // Разрешаем локальные пути, начинающиеся с / (папка public)
    if (url.startsWith('/')) {
      return ''
    }
    
    // Разрешаем локальные пути, начинающиеся с ./ или ../
    if (url.startsWith('./') || url.startsWith('../')) {
      return ''
    }
    
    // Проверка на обычный URL (http:// или https://)
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i
    if (!urlPattern.test(url)) {
      return 'Введите корректный URL (начинается с http:// или https://) или локальный путь (например, /images/photo.jpg)'
    }
    return ''
  }
  
  const validateField = (field) => {
    switch (field) {
      case 'name':
        errors.name = validateName(form.name)
        break
      case 'description':
        errors.description = validateDescription(form.description)
        break
      case 'specs':
        errors.specs = validateSpecs(form.specs)
        break
      case 'category':
        errors.category = validateCategory(form.category)
        break
      case 'price':
        errors.price = validatePrice(form.price)
        break
      case 'imageUrl':
        errors.imageUrl = validateImageUrl(form.imageUrl)
        break
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
    errors.imageUrl = 'Не удалось загрузить изображение по указанному пути. Проверьте, что файл существует.'
  }
  
  const handleAddProduct = () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.has-error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    const newProduct = addProduct(form)
    console.log('Созданный товар:', newProduct)
    console.log('URL товара:', newProduct.url)
    
    notification.showSuccess(`Товар "${form.name}" добавлен`)
    router.push(`/product/${newProduct.url}`)
  }
  
  const cancel = () => {
    router.push('/admin')
  }
  </script>
  
  <style scoped>
  h2 {
    color: #b76363;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .product-form {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
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
    padding: 10px 12px;
    border: 1px solid #e6c7c2;
    border-radius: 8px;
    background-color: #fff9f7;
    font-size: 1rem;
    transition: all 0.2s;
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
  
  .hint {
    color: #b88b8b;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    line-height: 1.4;
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
  
  .submit-btn {
    flex: 1;
    background-color: #b88b8b;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .submit-btn:hover {
    background-color: #a57676;
  }
  
  .cancel-btn {
    flex: 1;
    background-color: #e6c7c2;
    color: #5e4b4b;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .cancel-btn:hover {
    background-color: #d8b1aa;
  }
  </style>