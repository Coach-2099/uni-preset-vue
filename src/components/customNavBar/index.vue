<template>
  <!-- 改为底部定位 -->
  <div
    class="custom-tabbar"
    :style="{
      transform: `translateY(${visible ? 0 : '100%'})`,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }"
  >
    <!-- 删除状态栏占位 -->
    <div 
      class="tabbar-content items-start pt-10"
      :style="{
        backgroundColor: navBackground
      }"
    >
      <!-- 遍历导航项 -->
      <div 
        v-for="(item, path) in routeConfig" 
        :key="path"
        class="tab-item"
        :class="{ active: currentRoute === path }"
        @click="switchTab(path)"
      >
        <image 
          :src="currentRoute === path ? item.activeIcon : item.icon" 
          class="tab-icon"
          :class="currentRoute === path ? 'animation-duration: 1000ms animate__animated animate__headShake' : '' "
        />
        <text class="tab-text mt-5">{{ item.title }}</text>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const navBackground = ref('#ffffff');

const visible = ref(true)



// 保持当前路由判断逻辑
const currentRoute = computed(() => {
  const pages = getCurrentPages()
  return '/' + (pages[pages.length - 1]?.route || '')
})

watch(currentRoute, () => {
  visible.value = false
  nextTick(() => {
    visible.value = true
  })
})

interface RouteConfig {
  title: string
  icon: string         // 默认图标路径
  activeIcon: string   // 激活状态图标路径
  backgroundColor?: string
}

const routeConfig = computed(() => ({
  '/pages/home/index': {
    title: t('navBar.home'),
    icon: '/static/svg/tabbar/index0.svg',
    activeIcon: '/static/svg/tabbar/index1.svg',
    backgroundColor: '#FFFFFF'
  },
  // '/pages/quotes/index': {
  //   title: t('navBar.quotes'),
  //   icon: '/static/svg/tabbar/hang0.svg',
  //   activeIcon: '/static/svg/tabbar/hang1.svg',
  //   backgroundColor: '#F5F6FA'
  // },
  '/pages/trade/index': {
    title: t('navBar.trade'),
    icon: '/static/svg/tabbar/trade0.svg',
    activeIcon: '/static/svg/tabbar/trade1.svg',
    backgroundColor: '#F5F6FA'
  },
  '/pages/contract/index': {
    title: t('navBar.contract'),
    icon: '/static/svg/tabbar/gang0.svg',
    activeIcon: '/static/svg/tabbar/gang1.svg',
    backgroundColor: '#F5F6FA'
  },
 '/pages/metals/index': {
    title: t('navBar.metals'),
    icon: '/static/svg/tabbar/gang0.svg',
    activeIcon: '/static/svg/tabbar/gang1.svg',
    backgroundColor: '#F5F6FA'
  },
  '/pages/myAssets/index': {
    title: t('navBar.myAssets'),
    icon: '/static/svg/tabbar/mine0.svg',
    activeIcon: '/static/svg/tabbar/mine1.svg',
    backgroundColor: '#F5F6FA'
  }
}))

// const routeConfig: Record<string, RouteConfig> = {
//   '/pages/home/index': {
//     title: t('navBar.home'),
//     icon: '/static/svg/tabbar/index0.svg',
//     activeIcon: '/static/svg/tabbar/index1.svg',
//     backgroundColor: '#FFFFFF'
//   },
//   '/pages/quotes/index': {
//     title: '行情',
//     icon: '/static/svg/tabbar/hang0.svg',
//     activeIcon: '/static/svg/tabbar/hang1.svg',
//     backgroundColor: '#F5F6FA'
//   },
//   '/pages/trade/index': {
//     title: 'trade',
//     icon: '/static/svg/tabbar/trade0.svg',
//     activeIcon: '/static/svg/tabbar/trade1.svg',
//     backgroundColor: '#F5F6FA'
//   },
//   '/pages/contract/index': {
//     title: 'contract',
//     icon: '/static/svg/tabbar/gang0.svg',
//     activeIcon: '/static/svg/tabbar/gang1.svg',
//     backgroundColor: '#F5F6FA'
//   },

//   '/pages/myAssets/index': {
//     title: '资产', 
//     icon: '/static/svg/tabbar/mine0.svg',
//     activeIcon: '/static/svg/tabbar/mine1.svg',
//     backgroundColor: '#F5F6FA'
//   }
// }


// 移除返回相关逻辑
const switchTab = (path: string) => {
  console.log('currentRoute', currentRoute.value)
  if (currentRoute.value !== path) {
    uni.switchTab({ url: path })
  }
}


</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.06);

  z-index: 1001 !important; /* 必须高于原生导航栏 */
  transform: translateZ(0); /* 强制GPU渲染 */
  will-change: transform; /* 预声明动画属性 */
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: saturate(180%) blur(20px);
}

.tabbar-content {
  display: flex;
  height: 80px;
  contain: strict; /* 限制重绘范围 */
  justify-content: space-around;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  flex: 1;
}

.tab-icon {
  width: 26px;
  height: 26px;
  margin-bottom: 2px;
}

.tab-text {
  font-size: 10px;
  color: #666;
}

.tab-item.active .tab-text {
  color: #007AFF; /* 激活色 */
}
</style>