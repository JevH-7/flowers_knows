<template>
    <div>
      <h2>Управление товарами</h2>
      <table class="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }} ₽</td>
            <td>
              <button @click="editProduct(product)">Редактировать</button>
              <button @click="removeProduct(product.id)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { useProducts } from '../../composables/useProducts'
  import { inject } from 'vue'
  import { useRouter } from 'vue-router'
  
  const { getProducts, deleteProduct } = useProducts()
  const products = getProducts()
  const notification = inject('notification')
  const router = useRouter()
  
  const editProduct = (product) => {
    // Передаем URL товара, а не ID
    router.push(`/product/edit/${product.url}`)
  }
  
  const removeProduct = (id) => {
    deleteProduct(id)
    notification.showSuccess('Товар удален')
  }
  </script>
  
  <style scoped>
  h2 {
    color: #b76363;
    margin-bottom: 1rem;
  }
  .products-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff9f7;
    border-radius: 10px;
    overflow: hidden;
  }
  .products-table th,
  .products-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e6c7c2;
  }
  .products-table th {
    background-color: #f8e1df;
    color: #5e4b4b;
  }
  .products-table button {
    margin-right: 8px;
    padding: 4px 12px;
  }
  </style>