import { ref, computed } from 'vue'

const STORAGE_KEY = 'cosmetics_users'
const CURRENT_USER_KEY = 'currentUser'

// Загрузка пользователей из localStorage
const loadUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Ошибка загрузки пользователей', e)
  }
  // Дефолтный пользователь: admin@flowersknows.ru / Admin123
  return [
    { 
      id: 1,
      email: 'admin@flowersknows.ru', 
      password: 'Admin123', 
      role: 'admin', 
      name: 'Администратор' 
    }
  ]
}

// Сохранение пользователей в localStorage
const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Ошибка сохранения пользователей', e)
  }
}

// Загрузка текущего пользователя из localStorage
const loadCurrentUser = () => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.error('Ошибка загрузки текущего пользователя', e)
    return null
  }
}

// Сохранение текущего пользователя в localStorage
const saveCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  } catch (e) {
    console.error('Ошибка сохранения текущего пользователя', e)
  }
}

const users = ref(loadUsers())
const currentUser = ref(loadCurrentUser())

export function useAuth() {
  // Вход в систему
  const login = (email, password) => {
    console.log('login вызван:', { email, password })
    
    const user = users.value.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userData = { 
        id: user.id,
        email: user.email, 
        role: user.role,
        name: user.name 
      }
      currentUser.value = userData
      saveCurrentUser(userData)
      console.log('Вход выполнен:', userData)
      return true
    }
    
    console.log('Неверный email или пароль')
    return false
  }

  // Регистрация нового пользователя
  const register = (email, name, password) => {
    console.log('register вызван:', { email, name, password })
    
    // Проверка на существующего пользователя
    if (users.value.find(u => u.email === email)) {
      console.log('Пользователь с таким email уже существует')
      return false
    }
    
    // Создаем нового пользователя
    const newUser = { 
      id: Date.now(),
      email, 
      name, 
      password, 
      role: 'user' 
    }
    
    users.value.push(newUser)
    saveUsers(users.value)
    console.log('Новый пользователь зарегистрирован:', newUser)
    return true
  }

  // Обновление профиля пользователя
  const updateUserProfile = (updatedData, originalEmail) => {
    console.log('updateUserProfile вызван:', updatedData, originalEmail)
    
    // Если email меняется, проверяем что новый email не занят
    if (updatedData.email !== originalEmail) {
      const existingUser = users.value.find(u => u.email === updatedData.email)
      if (existingUser) {
        console.log('Пользователь с таким email уже существует')
        return false
      }
    }
    
    // Находим индекс пользователя
    const userIndex = users.value.findIndex(u => u.email === originalEmail)
    
    if (userIndex !== -1) {
      // Обновляем данные пользователя
      users.value[userIndex] = {
        ...users.value[userIndex],
        email: updatedData.email,
        name: updatedData.name,
        ...(updatedData.password && { password: updatedData.password })
      }
      
      saveUsers(users.value)
      
      // Обновляем текущего пользователя в сессии
      if (currentUser.value && currentUser.value.email === originalEmail) {
        const newCurrentUser = {
          id: users.value[userIndex].id,
          email: users.value[userIndex].email,
          role: users.value[userIndex].role,
          name: users.value[userIndex].name
        }
        currentUser.value = newCurrentUser
        saveCurrentUser(newCurrentUser)
      }
      
      console.log('Профиль обновлён:', users.value[userIndex])
      return true
    }
    
    return false
  }

  // Выход из системы
  const logout = () => {
    console.log('logout вызван')
    currentUser.value = null
    saveCurrentUser(null)
  }

  // Проверка, является ли пользователь администратором
  const isAdmin = () => {
    return currentUser.value?.role === 'admin'
  }

  // Проверка, авторизован ли пользователь
  const isAuthenticated = computed(() => !!currentUser.value)

  // Получение имени пользователя
  const getUserName = () => {
    return currentUser.value?.name || currentUser.value?.email || 'Гость'
  }

  return {
    currentUser,
    login,
    register,
    logout,
    updateUserProfile,
    isAdmin,
    isAuthenticated,
    getUserName
  }
}