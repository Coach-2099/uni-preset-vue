<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useTheme } from "@/theme";

const { setTheme } = useTheme()
onLaunch(() => {
  // 全局隐藏系统默认导航栏
  uni.hideTabBar()

  const systemTheme = uni.getStorageSync('APP_THEME') || 'light'
  console.log('systemTheme::主题', systemTheme)
  console.log('APP_THEME:::主题', uni.getStorageSync('APP_THEME')) // 打印系统主题，用于调试
  setTheme(systemTheme)
});
onShow(() => {
});
onHide(() => {
});
</script>
<style lang="scss">
#app {
  /* height: 100vh;
  background-color: var(--color-background); */
}
</style>
