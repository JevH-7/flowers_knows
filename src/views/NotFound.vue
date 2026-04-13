<template>
    <div class="not-found">
      <div class="content">
        <h1>404</h1>
        <p>Страница не найдена</p>
        <router-link to="/">Вернуться на главную</router-link>
      </div>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    width: 100vw;
    height: 100vh;
    background-image: url('/404-background.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
  }
  
  .blur-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: v-bind('`url(${bgImage})`');
    background-size: cover;
    background-position: center;
    filter: blur(5px); 
    transform: scale(1.05); 
  }
  
  .content {
    background-color: rgba(0, 0, 0, 0.6);
    padding: 2rem 4rem;
    border-radius: 15px;
  }
  h1 {
    font-size: 6rem;
    margin-bottom: 0.5rem;
    color: #f8e1df;
  }
  p {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  a {
    color: #f8e1df;
    text-decoration: none;
    border-bottom: 2px solid #f8e1df;
    font-size: 1.2rem;
  }
  </style>