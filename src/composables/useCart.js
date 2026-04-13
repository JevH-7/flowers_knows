import { ref, computed } from 'vue'

const STORAGE_KEY = 'cosmetics_cart'


const loadCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Ошибка загрузки корзины', e)
    return []
  }
}


const saveCart = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch (e) {
    console.error('Ошибка сохранения корзины', e)
  }
}

const cartItems = ref(loadCart())

export function useCart() {
  const getCart = () => cartItems

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: quantity
      })
    }
    
    saveCart(cartItems.value)
  }

  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
    saveCart(cartItems.value)
  }

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart(cartItems.value)
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveCart(cartItems.value)
  }

  const getCartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const getCartCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  }
}