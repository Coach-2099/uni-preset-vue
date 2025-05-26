import { onMounted, ref } from 'vue';
type ThemeType = 'light' | 'dark' | any

export const useTheme = () => {
  const theme = ref<ThemeType>('light')
  
  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme
    const htmlEl = document.documentElement
    htmlEl.className = newTheme === 'dark' ? 'theme-dark' : ''
    
    // 同步存储到本地
    uni.setStorageSync('APP_THEME', newTheme)
  }

  // 初始化读取本地存储
  onMounted(() => {
    const savedTheme = uni.getStorageSync('APP_THEME') || 'light'
    setTheme(savedTheme)
  })

  return { theme, setTheme }
}