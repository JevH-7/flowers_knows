<template>
    <div class="notification-container">
      <transition-group name="notification">
        <div 
          v-for="note in notifications" 
          :key="note.id" 
          :class="['notification', note.type]"
        >
          {{ note.message }}
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { inject } from 'vue'
  
  const { notifications } = inject('notification')
  </script>
  
  <style scoped>
  .notification-container {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }
  
  .notification {
    padding: 8px 20px;
    border-radius: 40px;
    font-size: 0.85rem;
    font-weight: 450;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    color: white;
    pointer-events: auto;
    text-align: center;
    max-width: 280px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Успех */
  .notification.success {
    background-color: rgba(76, 175, 80, 0.85);
    backdrop-filter: blur(8px);
  }
  
  /* Ошибка */
  .notification.error {
    background-color: rgba(244, 67, 54, 0.85);
    backdrop-filter: blur(8px);
  }
  
  /* Информация */
  .notification.info {
    background-color: rgba(100, 108, 255, 0.75);
    backdrop-filter: blur(8px);
  }
  
  /* Анимации */
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.2s ease;
  }
  
  .notification-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .notification-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  /* Для мобильных устройств */
  @media (max-width: 480px) {
    .notification-container {
      bottom: 16px;
      left: 16px;
      right: 16px;
      transform: none;
    }
    
    .notification {
      width: 100%;
      max-width: none;
      white-space: normal;
      text-align: center;
      font-size: 0.8rem;
      padding: 8px 16px;
    }
  }
  </style>