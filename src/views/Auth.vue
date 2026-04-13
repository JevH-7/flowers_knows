<template>
    <div class="auth">
      <div class="auth-card">
        <h1>{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h1>
        <form @submit.prevent="handleSubmit" novalidate>
          <!-- Email поле -->
          <div class="form-group" :class="{ 'has-error': errors.email }">
            <label>Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="example@mail.com"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
  
          <!-- Имя поле (только при регистрации) -->
          <div v-if="!isLoginMode" class="form-group" :class="{ 'has-error': errors.name }">
            <label>Имя</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Ваше имя"
              @blur="validateField('name')"
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
  
          <!-- Пароль поле -->
          <div class="form-group" :class="{ 'has-error': errors.password }">
            <label>Пароль</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="••••••••"
              @blur="validateField('password')"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
  
          <button type="submit">{{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}</button>
        </form>
        <p>
          <a href="#" @click.prevent="toggleMode">
            {{ isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
          </a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useAuth } from '../composables/useAuth'
  import { inject } from 'vue'
  import { useRouter } from 'vue-router'
  
  const auth = useAuth()
  const notification = inject('notification')
  const router = useRouter()
  
  const isLoginMode = ref(true)
  
  const form = reactive({
    email: '',
    name: '',
    password: ''
  })
  
  const errors = reactive({
    email: '',
    name: '',
    password: ''
  })
  
  // Валидация email
  const validateEmail = (email) => {
    if (!email) {
      return 'Email обязателен'
    }
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Введите корректный email (пример: name@domain.com)'
    }
    return ''
  }
  
  // Валидация имени
  const validateName = (name) => {
    if (!name) {
      return 'Имя обязательно'
    }
    if (name.length < 2) {
      return 'Имя должно содержать минимум 2 символа'
    }
    if (name.length > 50) {
      return 'Имя не должно превышать 50 символов'
    }
    return ''
  }
  
  // Валидация пароля
  const validatePassword = (password) => {
    if (!password) {
      return 'Пароль обязателен'
    }
    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов'
    }
    return ''
  }
  
  // Валидация конкретного поля
  const validateField = (field) => {
    switch (field) {
      case 'email':
        errors.email = validateEmail(form.email)
        break
      case 'name':
        if (!isLoginMode.value) {
          errors.name = validateName(form.name)
        }
        break
      case 'password':
        errors.password = validatePassword(form.password)
        break
    }
  }
  
  // Валидация всех полей
  const validateForm = () => {
    validateField('email')
    validateField('password')
    if (!isLoginMode.value) {
      validateField('name')
    }
    
    return !errors.email && !errors.password && (isLoginMode.value || !errors.name)
  }
  
  const handleSubmit = () => {
    // Валидируем все поля перед отправкой
    if (!validateForm()) {
      return
    }
  
    if (isLoginMode.value) {
      const success = auth.login(form.email, form.password)
      if (success) {
        notification.showSuccess(`Добро пожаловать, ${auth.currentUser.value?.name || 'пользователь'}!`)
        if (auth.isAdmin()) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        // Ошибка авторизации - показываем под полями
        errors.password = 'Неверный email или пароль'
      }
    } else {
      const success = auth.register(form.email, form.name, form.password)
      if (success) {
        notification.showSuccess('Регистрация прошла успешно, теперь войдите')
        // Очищаем форму и переключаемся на вход
        isLoginMode.value = true
        form.email = ''
        form.name = ''
        form.password = ''
        errors.email = ''
        errors.name = ''
        errors.password = ''
      } else {
        errors.email = 'Пользователь с таким email уже существует'
      }
    }
  }
  
  const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    // Очищаем форму и ошибки при переключении режима
    form.email = ''
    form.name = ''
    form.password = ''
    errors.email = ''
    errors.name = ''
    errors.password = ''
  }
  </script>
  
  <style scoped>
  .auth {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px);
    background-color: #faf3f0;
    padding: 1rem;
  }
  
  .auth-card {
    background-color: #fef6f4;
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  
  h1 {
    color: #b76363;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 300;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    color: #7a5b5b;
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .form-group input {
    padding: 12px 16px;
    border: 1px solid #e6c7c2;
    border-radius: 30px;
    background-color: #fff9f7;
    font-size: 1rem;
    transition: all 0.2s;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #b88b8b;
    box-shadow: 0 0 0 2px rgba(184, 139, 139, 0.2);
  }
  
  .form-group.has-error input {
    border-color: #f44336;
    background-color: #fff5f5;
  }
  
  .form-group.has-error input:focus {
    border-color: #f44336;
    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
  }
  
  .error-message {
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    padding-left: 1rem;
  }
  
  button[type="submit"] {
    background-color: #b88b8b;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 30px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 0.5rem;
  }
  
  button[type="submit"]:hover {
    background-color: #a57676;
  }
  
  button[type="submit"]:disabled {
    background-color: #e6c7c2;
    cursor: not-allowed;
  }
  
  p {
    text-align: center;
    margin-top: 1rem;
  }
  
  a {
    color: #b88b8b;
    text-decoration: none;
    border-bottom: 1px dashed #b88b8b;
  }
  
  a:hover {
    color: #a57676;
  }
  </style>