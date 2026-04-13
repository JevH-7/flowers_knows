<template>
    <div class="profile">
      <h1>Профиль пользователя</h1>
      
      <!-- Режим просмотра -->
      <div v-if="!isEditing" class="profile-info">
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ currentUser?.email }}</span>
        </div>
        <div class="info-row">
          <span class="label">Имя:</span>
          <span class="value">{{ currentUser?.name || 'Не указано' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Роль:</span>
          <span class="value">{{ currentUser?.role === 'admin' ? 'Администратор' : 'Пользователь' }}</span>
        </div>
        <button @click="startEditing" class="edit-btn">Редактировать профиль</button>
      </div>
  
      <!-- Режим редактирования -->
      <div v-else class="profile-edit">
        <form @submit.prevent="saveProfile" novalidate>
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
  
          <div class="form-group" :class="{ 'has-error': errors.name }">
            <label>Имя</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Ваше имя"
              @blur="validateField('name')"
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
  
          <div class="form-group" :class="{ 'has-error': errors.password }">
            <label>Новый пароль</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="Оставьте пустым, чтобы не менять"
              @blur="validateField('password')"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            <small class="hint">Минимум 6 символов</small>
          </div>
  
          <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
            <label>Подтверждение пароля</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="Повторите новый пароль"
              @blur="validateField('confirmPassword')"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>
  
          <div class="form-buttons">
            <button type="submit" class="save-btn">Сохранить</button>
            <button type="button" @click="cancelEditing" class="cancel-btn">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useAuth } from '../composables/useAuth'
  import { inject } from 'vue'
  
  const { currentUser, updateUserProfile } = useAuth()
  const notification = inject('notification')
  
  const isEditing = ref(false)
  const originalEmail = ref('')
  
  const form = reactive({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  })
  
  const errors = reactive({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
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
    if (password && password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов'
    }
    return ''
  }
  
  // Валидация подтверждения пароля
  const validateConfirmPassword = (confirmPassword) => {
    if (form.password && confirmPassword !== form.password) {
      return 'Пароли не совпадают'
    }
    return ''
  }
  
  const validateField = (field) => {
    switch (field) {
      case 'email':
        errors.email = validateEmail(form.email)
        break
      case 'name':
        errors.name = validateName(form.name)
        break
      case 'password':
        errors.password = validatePassword(form.password)
        break
      case 'confirmPassword':
        errors.confirmPassword = validateConfirmPassword(form.confirmPassword)
        break
    }
  }
  
  const validateForm = () => {
    validateField('email')
    validateField('name')
    validateField('password')
    validateField('confirmPassword')
    
    return !errors.email && !errors.name && !errors.password && !errors.confirmPassword
  }
  
  const startEditing = () => {
    originalEmail.value = currentUser.value.email
    form.email = currentUser.value.email
    form.name = currentUser.value.name || ''
    form.password = ''
    form.confirmPassword = ''
    errors.email = ''
    errors.name = ''
    errors.password = ''
    errors.confirmPassword = ''
    isEditing.value = true
  }
  
  const saveProfile = () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.has-error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    const updateData = {
      email: form.email,
      name: form.name
    }
    
    if (form.password) {
      updateData.password = form.password
    }
    
    const success = updateUserProfile(updateData, originalEmail.value)
    
    if (success) {
      notification.showSuccess('Профиль успешно обновлён')
      isEditing.value = false
    } else {
      errors.email = 'Пользователь с таким email уже существует'
    }
  }
  
  const cancelEditing = () => {
    isEditing.value = false
  }
  </script>
  
  <style scoped>
  .profile {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fef6f4;
    border-radius: 20px;
  }
  
  h1 {
    color: #b76363;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  /* Режим просмотра */
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid #e6c7c2;
  }
  
  .info-row .label {
    color: #7a5b5b;
    font-weight: 500;
  }
  
  .info-row .value {
    color: #b76363;
    font-weight: 500;
  }
  
  .edit-btn {
    margin-top: 1.5rem;
    padding: 12px;
    background-color: #b88b8b;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .edit-btn:hover {
    background-color: #a57676;
  }
  
  /* Режим редактирования */
  .profile-edit form {
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
  
  .error-message {
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    padding-left: 1rem;
  }
  
  .hint {
    color: #b88b8b;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    padding-left: 1rem;
  }
  
  .form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .save-btn {
    flex: 1;
    padding: 12px;
    background-color: #b88b8b;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .save-btn:hover {
    background-color: #a57676;
  }
  
  .cancel-btn {
    flex: 1;
    padding: 12px;
    background-color: #e6c7c2;
    color: #5e4b4b;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .cancel-btn:hover {
    background-color: #d8b1aa;
  }
  </style>