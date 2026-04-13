import { ref } from 'vue'

const STORAGE_KEY = 'cosmetics_products'

// Дефолтные товары с URL
const defaultProducts = [
  { 
    id: 1, 
    url: 'nezhnyy-persik',
    name: 'Помада матовая "Нежный персик"', 
    description: 'Увлажняющая помада с персиковым ароматом. Легкая текстура, не сушит губы, оставляет нежное сияние.', 
    specs: 'Объем: 4 мл\nСостав: масло ши, витамин Е, пчелиный воск\nСтойкость: 4 часа\nГипоаллергенно',
    category: 'Губы',
    price: 450, 
    imageUrl: '/images/lip2.jpg' 
  },
  { 
    id: 2, 
    url: 'tonalnyy-krem-siyanie',
    name: 'Тональный крем "Сияние"', 
    description: 'Легкое покрытие с эффектом сияния. Выравнивает тон, придает коже здоровое свечение.', 
    specs: 'Объем: 30 мл\nSPF: 15\nТип кожи: все типы\nФиниш: натуральный',
    category: 'Лицо',
    price: 890, 
    imageUrl: '/images/ton.jpg' 
  },
  { 
    id: 3, 
    url: 'paletka-teney-rozovyy-zakat',
    name: 'Палетка теней "Розовый закат"', 
    description: '8 натуральных оттенков: от нежно-розовых до насыщенных терракотовых. Идеально для создания дневного и вечернего макияжа.', 
    specs: 'Количество цветов: 8\nФиниши: матовые, шиммерные, сатиновые\nСтойкость: 8 часов\nГипоаллергенно',
    category: 'Глаза',
    price: 1200, 
    imageUrl: '/images/palet1.jpg' 
  },
  { 
    id: 4, 
    url: 'tush-dlya-resnits-obem',
    name: 'Тушь для ресниц "Объем"', 
    description: 'Придает объем и удлиняет. Специальная щеточка разделяет каждую ресничку, создавая эффект "кукольных" ресниц.', 
    specs: 'Цвет: черный\nОбъем: 10 мл\nВодостойкая\nУдлиняющий эффект',
    category: 'Глаза',
    price: 650, 
    imageUrl: '/images/tush.jpg' 
  },
  { 
    id: 5, 
    url: 'nabor-kistey-dlya-makiyazha',
    name: 'Набор кистей для макияжа', 
    description: '8 кистей из синтетического ворса для идеального макияжа. В наборе: кисть для тона, кисть для пудры, кисть для теней, кисть для растушевки, спонж.', 
    specs: 'Количество: 8 шт\nМатериал: синтетический ворс\nЧехол в комплекте\nПодходит для всех типов косметики',
    category: 'Кисти и аксессуары',
    price: 1200, 
    imageUrl: '/images/kistjpg.jpg'  
  },
  {
    id: 6,
    url: 'rumyana-nezhnyy-rumb',
    name: 'Румяна "Нежный румянец"',
    description: 'Кремовые румяна с легкой текстурой, которая тает на коже. Придают естественное сияние и здоровый вид. Легко растушевываются пальцами или кистью.',
    specs: 'Объем: 6 г\nФиниш: сатиновый\nСтойкость: 6 часов\nПодходит для всех типов кожи',
    category: 'Лицо',
    price: 890,
    imageUrl: '/images/rum1.jpg'
  },
  {
    id: 7,
    url: 'khaighlighter-siyanie',
    name: 'Хайлайтер "Сияние"',
    description: 'Хайлайтер с мелкими шиммерными частицами. Подчеркивает скулы, создает эффект влажной кожи. Не подчеркивает поры и текстуру.',
    specs: 'Вес: 8 г\nФиниш: шиммерный\nСтойкость: 8 часов\nБез парабенов',
    category: 'Лицо',
    price: 750,
    imageUrl: '/images/hyl.jpg'
  },
  {
    id: 8,
    url: 'podvodka-dlya-glaz-chernyy',
    name: 'Подводка для глаз "Идеальная линия"',
    description: 'Водостойкая подводка-фломастер с тонким наконечником. Позволяет рисовать четкие стрелки любой толщины. Не отпечатывается на верхнем веке.',
    specs: 'Цвет: черный\nОбъем: 2 мл\nВодостойкая\nТолщина наконечника: 0.1 мм',
    category: 'Глаза',
    price: 490,
    imageUrl: '/images/pod.jpg'
  },
  {
    id: 9,
    url: 'matovaya-pomada-vinnyy',
    name: 'Помада матовая "Винная ягода"',
    description: 'Матовая помада насыщенного винного оттенка. Держится до 8 часов, не сушит губы благодаря маслу ши в составе. Идеально для осенне-зимних образов.',
    specs: 'Объем: 4.5 г\nФиниш: матовый\nСтойкость: 8 часов\nУвлажняющий эффект',
    category: 'Губы',
    price: 520,
    imageUrl: '/images/lip1.jpg'
  }
]

const loadProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Миграция: добавляем url если его нет
      const migrated = parsed.map(p => ({
        ...p,
        url: p.url || generateUrlFromName(p.name)
      }))
      console.log('Загружены товары из localStorage:', migrated)
      return migrated
    }
  } catch (e) {
    console.error('Ошибка загрузки товаров', e)
  }
  console.log('Загружены дефолтные товары:', defaultProducts)
  return defaultProducts
}

// Генерация URL из названия
const generateUrlFromName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-а-яё]/g, '') // удаляем спецсимволы, оставляем русские буквы
    .replace(/\s+/g, '-')          // заменяем пробелы на дефисы
    .replace(/-+/g, '-')           // убираем множественные дефисы
    .trim()
}

const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    console.log('Сохранены товары:', products)
  } catch (e) {
    console.error('Ошибка сохранения товаров', e)
  }
}

const products = ref(loadProducts())

export function useProducts() {
  const getProducts = () => {
    console.log('getProducts вызван, товаров:', products.value.length)
    return products
  }

  const getProductById = (id) => {
    const product = products.value.find(p => p.id === Number(id))
    console.log('getProductById:', id, product)
    return product
  }

  const getProductByUrl = (url) => {
    if (!url) return null
    const product = products.value.find(p => p.url === url)
    console.log('getProductByUrl:', url, product)
    return product
  }

  const addProduct = (productData) => {
    const newId = Math.max(...products.value.map(p => p.id), 0) + 1
    
    // Генерируем URL из названия
    let baseUrl = generateUrlFromName(productData.name)
    let url = baseUrl
    let counter = 1
    
    // Проверяем уникальность URL
    while (products.value.some(p => p.url === url)) {
      url = `${baseUrl}-${counter}`
      counter++
    }
    
    const newProduct = {
      id: newId,
      url: url,
      name: productData.name,
      description: productData.description,
      specs: productData.specs || '',
      category: productData.category,
      price: productData.price,
      imageUrl: productData.imageUrl
    }
    
    console.log('Добавляем новый товар:', newProduct)
    products.value.push(newProduct)
    saveProducts(products.value)
    
    return newProduct
  }

  const updateProduct = (id, updatedData) => {
    const index = products.value.findIndex(p => p.id === Number(id))
    if (index !== -1) {
      const oldProduct = products.value[index]
      
      // Если изменилось название, обновляем URL
      let url = oldProduct.url
      if (updatedData.name !== oldProduct.name) {
        let baseUrl = generateUrlFromName(updatedData.name)
        url = baseUrl
        let counter = 1
        
        // Проверяем уникальность URL, исключая текущий товар
        while (products.value.some(p => p.url === url && p.id !== Number(id))) {
          url = `${baseUrl}-${counter}`
          counter++
        }
      }
      
      products.value[index] = { 
        ...oldProduct,
        ...updatedData,
        url: url
      }
      console.log('Обновляем товар:', products.value[index])
      saveProducts(products.value)
    }
  }

  const deleteProduct = (id) => {
    console.log('Удаляем товар с id:', id)
    products.value = products.value.filter(p => p.id !== Number(id))
    saveProducts(products.value)
  }

  return {
    getProducts,
    getProductById,
    getProductByUrl,
    addProduct,
    updateProduct,
    deleteProduct
  }
}