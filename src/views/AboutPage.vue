<template>
    <div class="about-page">
      <div class="about-header">
        <h1>О бренде FLOWERS KNOWS</h1>
        <p class="subtitle">История нежности и красоты</p>
      </div>
  
      <div class="about-content">
        <section class="about-section">
          <div class="section-image">
            <img src='/images/bun4.jpg' alt="О нас" />
          </div>
          <div class="section-text">
            <h2>Наша история</h2>
            <p>FLOWERS KNOWS родился из любви к природе и желания подчеркнуть естественную красоту каждой женщины. Мы начали свой путь в 2020 году с небольшой коллекции губных помад, вдохновленных нежными оттенками цветущего сада.</p>
            <p>Сегодня наш бренд предлагает полный ассортимент декоративной косметики: от тональных средств до палеток теней. Мы тщательно отбираем ингредиенты и контролируем качество на каждом этапе производства.</p>
          </div>
        </section>
  
        <section class="about-section reverse">
          <div class="section-image">
            <img src='/images/bun5.jpg' alt="Наши ценности" />
          </div>
          <div class="section-text">
            <h2>Наши ценности</h2>
            <ul class="values-list">
              <li><strong>Натуральность</strong> — мы используем только безопасные компоненты, многие из которых имеют растительное происхождение.</li>
              <li><strong>Этичность</strong> — не тестируем на животных и поддерживаем экологичные инициативы.</li>
              <li><strong>Доступность</strong> — качественная косметика должна быть доступна каждому.</li>
              <li><strong>Вдохновение</strong> — создаем продукты, которые помогают выражать индивидуальность.</li>
            </ul>
          </div>
        </section>
  
        <section class="about-section">
          <div class="section-image">
            <img src='/images/bun6.jpg' alt="Наша команда" />
          </div>
          <div class="section-text">
            <h2>Наша команда</h2>
            <p>За каждым продуктом стоит команда профессионалов: визажисты, химики-технологи и дизайнеры. Мы постоянно учимся, следим за мировыми трендами и совершенствуем формулы, чтобы радовать вас новыми оттенками и текстурами.</p>
            <p>Мы верим, что макияж — это искусство, доступное каждому. И мы здесь, чтобы помочь вам создавать свои шедевры.</p>
          </div>
        </section>
      </div>
  
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">🌿</div>
          <h3>100%</h3>
          <p>Натуральных ингредиентов в некоторых продуктах</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🏆</div>
          <h3>5 лет</h3>
          <p>Радуем вас качественной косметикой</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💝</div>
          <h3>10000+</h3>
          <p>Довольных клиентов по всей России</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .about-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .about-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .about-header h1 {
    color: #b76363;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }
  
  .about-header .subtitle {
    color: #a57c7c;
    font-size: 1.2rem;
  }
  
  .about-section {
    display: flex;
    align-items: center;
    gap: 3rem;
    margin-bottom: 4rem;
    background-color: #fef6f4;
    border-radius: 30px;
    padding: 2rem;
    box-shadow: 0 8px 20px rgba(183, 99, 99, 0.08);
  }
  
  .about-section.reverse {
    flex-direction: row-reverse;
  }
  
  .section-image {
    flex: 1;
  }
  
  .section-image img {
    width: 100%;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
  }
  
  .section-image img:hover {
    transform: scale(1.02);
  }
  
  .section-text {
    flex: 1;
  }
  
  .section-text h2 {
    color: #b76363;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }
  
  .section-text p {
    color: #7a5b5b;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .values-list {
    list-style: none;
    padding: 0;
  }
  
  .values-list li {
    color: #7a5b5b;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;
  }
  
  .values-list li::before {
    content: "🌸";
    position: absolute;
    left: -5px;
    top: 0;
    color: #b88b8b;
  }
  
  .values-list li strong {
    color: #b76363;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 4rem;
    padding: 2rem;
    background: linear-gradient(135deg, #fef6f4 0%, #f8e1df 100%);
    border-radius: 40px;
  }
  
  .feature-item {
    text-align: center;
    padding: 1.5rem;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .feature-item h3 {
    color: #b76363;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
  
  .feature-item p {
    color: #7a5b5b;
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    .about-section,
    .about-section.reverse {
      flex-direction: column;
      gap: 2rem;
    }
  
    .features {
      grid-template-columns: 1fr;
    }
  
    .about-header h1 {
      font-size: 2rem;
    }
  }
  </style>