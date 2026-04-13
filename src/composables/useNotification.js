import { ref } from 'vue'

const notifications = ref([])
let nextId = 0

// Экспортируем функцию createNotification
export function createNotification() {
  const show = (type, message, timeout = 3000) => {
    const id = nextId++
    notifications.value.push({ id, type, message })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, timeout)
  }

  return {
    notifications,
    showSuccess: (msg) => show('success', msg),
    showError: (msg) => show('error', msg),
    showInfo: (msg) => show('info', msg)
  }
}