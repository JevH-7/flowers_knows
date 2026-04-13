<template>
    <div class="specs">
      <h2>Характеристики</h2>
      <div v-if="product?.specs" class="specs-content">
        <p>{{ product.specs }}</p>
      </div>
      <div v-else class="no-specs">
        <p>Характеристики отсутствуют</p>
      </div>
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
  .specs {
    line-height: 1.6;
    color: #7a5b5b;
  }
  
  h2 {
    color: #b76363;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .specs-content p {
    font-size: 1rem;
    white-space: pre-wrap;
  }
  
  .no-specs {
    color: #b88b8b;
    font-style: italic;
  }
  </style>