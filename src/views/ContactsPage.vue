<template>
    <div class="contacts-page">
      <h1>Контакты</h1>
      <p class="subtitle">Всегда рады помочь и ответить на ваши вопросы</p>
  
      <div class="contacts-grid">
        <!-- Свяжитесь с нами -->
        <div class="contact-card main-info">
          <h2>Свяжитесь с нами</h2>
          
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div>
              <h3>Телефон</h3>
              <p>+7 (960) 278-77-33</p>
              <p class="note">Ежедневно с 10:00 до 20:00</p>
            </div>
          </div>
  
          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div>
              <h3>Email</h3>
              <p>info@flowersknows.ru</p>
              <p class="note">Ответим в течение 24 часов</p>
            </div>
          </div>
  
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div>
              <h3>Адрес</h3>
              <p>г. Санкт-Петербург</p>
              <p>ул. Красного Курсанта, 26</p>
      
            </div>
          </div>
        </div>
  
        <!-- Мы в соцсетях -->
        <div class="contact-card social">
          <h2>Мы в соцсетях</h2>
          <p>Подписывайтесь, чтобы первыми узнавать о новинках и акциях</p>
          
          <div class="social-links">
            <a href="https://vk.com/id757392379" target="_blank" class="social-link vk">
              <span class="social-icon">📱</span>
              <span>ВКонтакте</span>
            </a>
            <a href="https://t.me/JevH7" target="_blank" class="social-link telegram">
              <span class="social-icon">📨</span>
              <span>Telegram</span>
            </a>
          </div>
  
          <div class="social-stats">
            <div class="stat">
              <span class="stat-number">5000+</span>
              <span class="stat-label">подписчиков</span>
            </div>
            <div class="stat">
              <span class="stat-number">1000+</span>
              <span class="stat-label">в Telegram</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .contacts-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    color: #b76363;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }
  
  .subtitle {
    color: #a57c7c;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
  
  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .contact-card {
    background-color: #fef6f4;
    border-radius: 30px;
    padding: 2rem;
    box-shadow: 0 8px 20px rgba(183, 99, 99, 0.08);
    transition: transform 0.3s;
  }
  
  .contact-card:hover {
    transform: translateY(-5px);
  }
  
  .contact-card h2 {
    color: #b76363;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }
  
  .contact-item {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    align-items: flex-start;
  }
  
  .contact-item:last-child {
    margin-bottom: 0;
  }
  
  .contact-icon {
    font-size: 2rem;
    background-color: #f8e1df;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .contact-item h3 {
    color: #b76363;
    margin-bottom: 0.3rem;
    font-size: 1.2rem;
  }
  
  .contact-item p {
    color: #7a5b5b;
    line-height: 1.5;
  }
  
  .contact-item .note {
    font-size: 0.9rem;
    color: #b88b8b;
    margin-top: 0.2rem;
  }
  
  .social-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    color: white;
    font-weight: 500;
    transition: transform 0.2s;
  }
  
  .social-link:hover {
    transform: translateX(10px);
  }
  
  .social-link.vk {
    background-color: #4a76a8;
  }
  
  .social-link.telegram {
    background-color: #0088cc;
  }
  
  .social-icon {
    font-size: 1.5rem;
  }
  
  .social-stats {
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin-top: 2rem;
  }
  
  .stat-number {
    display: block;
    font-size: 1.8rem;
    font-weight: bold;
    color: #b76363;
  }
  
  .stat-label {
    color: #7a5b5b;
  }
  
  @media (max-width: 768px) {
    .contacts-grid {
      grid-template-columns: 1fr;
    }
  
    h1 {
      font-size: 2rem;
    }
  }
  </style>