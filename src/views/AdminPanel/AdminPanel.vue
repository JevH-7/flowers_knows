<template>
    <div class="admin-panel">
      <h1>Панель администратора</h1>
      <nav class="admin-nav">
        <router-link to="/admin">Список товаров</router-link>
        <router-link to="/admin/add">Добавить товар</router-link>
      </nav>
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <style scoped>
  .admin-panel {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fef6f4;
    border-radius: 20px;
  }
  h1 {
    color: #b76363;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  .admin-nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e6c7c2;
    padding-bottom: 1rem;
  }
  .admin-nav a {
    text-decoration: none;
    color: #7a5b5b;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    transition: all 0.2s;
  }
  .admin-nav a:hover {
    background-color: #e6c7c2;
  }
  .admin-nav a.router-link-exact-active {
    background-color: #b88b8b;
    color: white;
  }
  .admin-content {
    min-height: 300px;
  }
  </style>