<template>
    <div class="description">
      <h2>Описание</h2>
      <p>{{ product?.description || 'Описание отсутствует' }}</p>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .description {
    line-height: 1.6;
    color: #7a5b5b;
  }
  
  h2 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1rem;
  }
  </style>