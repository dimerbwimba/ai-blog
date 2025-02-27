export const useLocalStorage = () => {
  const setItem = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
    }
  }

  const getItem = (key: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key)
    }
    return null
  }

  return { setItem, getItem }
} 