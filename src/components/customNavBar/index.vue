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
    >
      <!-- :style="{
        backgroundColor: navBackground
      }" -->
      <!-- 遍历导航项 -->
      <div 
        v-for="(item, path) in routeConfig" 
        :key="path"
        class="tab-item"
        :class="{ active: currentRoute === path }"
        @click="switchTab(path)"
      >
        <!-- <image 
          :src="currentRoute === path ? item.activeIcon : item.icon" 
          class="tab-icon"
          :class="currentRoute === path ? 'animation-duration: 1000ms animate__animated animate__headShake' : '' "
        /> -->
        <div 
          class="tab-icon"
          v-html="currentRoute === path ? item.activeIcon : item.icon"
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
    // icon: '/static/svg/tabbar/index0.svg',
    // activeIcon: '/static/svg/tabbar/index1.svg',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.948 26">
      <defs>
        <clipPath id="a">
          <path d="M0 0h25.948v26H0z" style="fill:none"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path style="fill:var(--color-text)" d="m12.974 1.855 10.895 8.9.016.013.016.013a.655.655 0 0 1 .254.521v12.245a.661.661 0 0 1-.66.66H2.453a.661.661 0 0 1-.66-.66V11.305a.656.656 0 0 1 .254-.521l.016-.013.016-.013Zm0-1.855a1.578 1.578 0 0 0-1 .357L.945 9.371A2.453 2.453 0 0 0 0 11.305v12.242A2.454 2.454 0 0 0 2.453 26h21.041a2.454 2.454 0 0 0 2.453-2.453V11.305A2.453 2.453 0 0 0 25 9.371L13.975.357a1.578 1.578 0 0 0-1-.357"/>
        <path d="M26.671 44.237h-9.862a.9.9 0 0 1 0-1.793h9.862a.9.9 0 1 1 0 1.793" style="fill:var(--color-light-primary)" transform="translate(-8.779 -23.417)"/>
      </g>
    </svg>`,
    activeIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
      <defs>
        <clipPath id="a">
          <path d="M0 0h26v26H0z" style="fill:var(--color-light-primary)"/>
        </clipPath>
      </defs>
      <path d="M25.054 9.371 14 .357a1.587 1.587 0 0 0-2 0L.946 9.371A2.453 2.453 0 0 0 0 11.305v12.242A2.456 2.456 0 0 0 2.458 26h21.084A2.456 2.456 0 0 0 26 23.547V11.305a2.451 2.451 0 0 0-.946-1.934M17.928 20.82H8.046a.9.9 0 1 1 0-1.793h9.882a.9.9 0 1 1 0 1.793" class="a" style="fill:var(--color-light-primary)"/>
    </svg>`,
    backgroundColor: '#FFFFFF'
  },
  '/pages/trade/index': {
    title: t('navBar.trade'),
    // icon: '/static/svg/tabbar/trade0.svg',
    // activeIcon: '/static/svg/tabbar/trade1.svg',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
      <defs>
        <clipPath id="a">
          <path style="fill:var(--color-text)" d="M0 0h26v26H0z"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path style="fill:var(--color-text)" d="M22.171 1.793a2.039 2.039 0 0 1 2.036 2.036V22.17a2.039 2.039 0 0 1-2.036 2.037H3.829a2.039 2.039 0 0 1-2.036-2.037V3.829a2.039 2.039 0 0 1 2.036-2.036Zm0-1.793H3.829A3.829 3.829 0 0 0 0 3.829V22.17A3.83 3.83 0 0 0 3.829 26h18.342A3.83 3.83 0 0 0 26 22.17V3.829A3.829 3.829 0 0 0 22.171 0"/>
        <path d="M13.915 34.938a.9.9 0 0 1-.634-1.53l2.355-2.355-2.355-2.353a.9.9 0 1 1 1.268-1.268l2.538 2.538a1.534 1.534 0 0 1 0 2.17l-2.538 2.538a.894.894 0 0 1-.634.263m1.9-3.7Z" style="fill:var(--color-light-primary)" transform="translate(-7.182 -14.989)"/>
        <path style="fill:var(--color-text)" d="M20.697 19.948h-7.44a.9.9 0 0 1 0-1.793h7.44a.9.9 0 0 1 0 1.793M20.697 13.896h-7.44a.9.9 0 0 1 0-1.793h7.44a.9.9 0 0 1 0 1.793M20.697 7.845H5.818a.9.9 0 1 1 0-1.793h14.879a.9.9 0 0 1 0 1.793"/>
      </g>
    </svg>`,
    activeIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
      <defs>
        <clipPath id="a">
          <path d="M0 0h26v26H0z" style="fill:var(--color-text)"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path d="M22.17 0H3.829A3.829 3.829 0 0 0 0 3.829v18.342A3.829 3.829 0 0 0 3.829 26H22.17A3.83 3.83 0 0 0 26 22.171V3.829A3.83 3.83 0 0 0 22.17 0M9.9 17.148l-2.534 2.539A.9.9 0 0 1 6.1 18.419l2.355-2.355L6.1 13.709a.9.9 0 0 1 1.268-1.268L9.9 14.98a1.536 1.536 0 0 1 0 2.169m10.793 2.8h-7.44a.9.9 0 1 1 0-1.793H20.7a.9.9 0 1 1 0 1.793m0-6.052h-7.44a.9.9 0 0 1 0-1.793h7.44a.9.9 0 1 1 0 1.793m0-6.052H5.818a.9.9 0 0 1 0-1.793H20.7a.9.9 0 1 1 0 1.793" style="fill:var(--color-light-primary)"/>
      </g>
    </svg>`,
    backgroundColor: '#F5F6FA'
  },
  '/pages/contract/index': {
    title: t('navBar.contract'),
    // icon: '/static/svg/tabbar/gang0.svg',
    // activeIcon: '/static/svg/tabbar/gang1.svg',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
      <defs>
        <clipPath id="a">
          <path d="M0 0h26v26H0z" style="fill:none"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path style="fill:var(--color-text)" d="M13 20.852 1.116 8.969a.9.9 0 1 1 1.268-1.268L13 18.316l3.939-3.939a.9.9 0 0 1 1.267 1.269Z"/>
        <path d="M33.516 24.9a.892.892 0 0 1-.634-.263L22.266 14.02l-3.939 3.94a.9.9 0 0 1-1.268-1.268l5.207-5.207 11.883 11.883a.9.9 0 0 1-.634 1.53" style="fill:var(--color-light-primary)" transform="translate(-9.267 -6.337)"/>
        <path style="fill:var(--color-text)" d="M13 1.793A11.207 11.207 0 1 1 1.793 13 11.22 11.22 0 0 1 13 1.793M13 0a13 13 0 1 0 13 13A13 13 0 0 0 13 0"/>
      </g>
    </svg>`,
    activeIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
    <defs>
      <clipPath id="a">
        <path d="M0 0h26v26H0z" style="fill:none"/>
      </clipPath>
    </defs>
    <g style="clip-path:url(#a)">
      <path d="M13 0a13 13 0 1 0 13 13A13 13 0 0 0 13 0m5.206 15.644L13 20.851 2.6 10.448A.9.9 0 0 1 3.864 9.18L13 18.316l3.939-3.939a.9.9 0 1 1 1.268 1.268m4.54 1.416a.893.893 0 0 1-.634-.263L13 7.684l-3.94 3.939a.9.9 0 0 1-1.268-1.268L13 5.149 23.38 15.53a.9.9 0 0 1-.634 1.53" style="fill:var(--color-light-primary)"/>
    </g>
  </svg>`,
    backgroundColor: '#F5F6FA'
  },
 '/pages/metals/index': {
    title: t('navBar.metals'),
    // icon: '/static/svg/tabbar/gang0.svg',
    // activeIcon: '/static/svg/tabbar/gang1.svg',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
      <defs>
        <clipPath id="a">
          <path d="M0 0h26v26H0z" style="fill:none"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path style="fill:var(--color-text)" d="M13 20.852 1.116 8.969a.9.9 0 1 1 1.268-1.268L13 18.316l3.939-3.939a.9.9 0 0 1 1.267 1.269Z"/>
        <path d="M33.516 24.9a.892.892 0 0 1-.634-.263L22.266 14.02l-3.939 3.94a.9.9 0 0 1-1.268-1.268l5.207-5.207 11.883 11.883a.9.9 0 0 1-.634 1.53" style="fill:var(--color-light-primary)" transform="translate(-9.267 -6.337)"/>
        <path style="fill:var(--color-text)" d="M13 1.793A11.207 11.207 0 1 1 1.793 13 11.22 11.22 0 0 1 13 1.793M13 0a13 13 0 1 0 13 13A13 13 0 0 0 13 0"/>
      </g>
    </svg>`,
    activeIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
    <defs>
      <clipPath id="a">
        <path d="M0 0h26v26H0z" style="fill:none"/>
      </clipPath>
    </defs>
    <g style="clip-path:url(#a)">
      <path d="M13 0a13 13 0 1 0 13 13A13 13 0 0 0 13 0m5.206 15.644L13 20.851 2.6 10.448A.9.9 0 0 1 3.864 9.18L13 18.316l3.939-3.939a.9.9 0 1 1 1.268 1.268m4.54 1.416a.893.893 0 0 1-.634-.263L13 7.684l-3.94 3.939a.9.9 0 0 1-1.268-1.268L13 5.149 23.38 15.53a.9.9 0 0 1-.634 1.53" style="fill:var(--color-light-primary)"/>
    </g>
  </svg>`,
    backgroundColor: '#F5F6FA'
  },
  '/pages/myAssets/index': {
    title: t('navBar.myAssets'),
    // icon: '/static/svg/tabbar/mine0.svg',
    // activeIcon: '/static/svg/tabbar/mine1.svg',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 25.554">
      <defs>
        <clipPath id="a">
          <path d="M0 0h26v25.554H0z" style="fill:var(--color-text)"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path style="fill:var(--color-light-primary)" d="M18.585 1.793a1.8 1.8 0 0 1 1.8 1.8V6.5L8.33 6.514 1.793 6.5V3.591a1.8 1.8 0 0 1 1.8-1.8Zm0-1.793H3.591A3.591 3.591 0 0 0 0 3.591v4.7l8.327.018 13.848-.019v-4.7A3.591 3.591 0 0 0 18.585 0" />
        <path style="fill:var(--color-text)" d="M22.171 8.297a2.039 2.039 0 0 1 2.036 2.037v11.391a2.039 2.039 0 0 1-2.036 2.036H3.829a2.039 2.039 0 0 1-2.036-2.036V8.297Zm0-1.793H0v15.221a3.829 3.829 0 0 0 3.829 3.829h18.342A3.829 3.829 0 0 0 26 21.725V10.332a3.83 3.83 0 0 0-3.829-3.83"/>
        <path style="fill:var(--color-light-primary)" d="M22.379 16.029a.9.9 0 1 1-.9-.9.9.9 0 0 1 .9.9"/>
      </g>
    </svg>`,
    activeIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 25.554">
      <defs>
        <clipPath id="a">
          <path d="M0 0h26v25.554H0z" style="fill:none"/>
        </clipPath>
      </defs>
      <g style="clip-path:url(#a)">
        <path style="fill:var(--color-light-primary)" d="M18.585 1.793a1.8 1.8 0 0 1 1.8 1.8V6.5L8.33 6.514 1.793 6.5V3.591a1.8 1.8 0 0 1 1.8-1.8Zm0-1.793H3.591A3.591 3.591 0 0 0 0 3.591v4.7l8.327.018 13.848-.019v-4.7A3.591 3.591 0 0 0 18.585 0"/>
        <path style="fill:var(--color-light-primary)" d="M22.171 6.502H0v15.223a3.83 3.83 0 0 0 3.83 3.829h18.341A3.829 3.829 0 0 0 26 21.725V10.332a3.829 3.829 0 0 0-3.829-3.83m-.688 10.422a.9.9 0 1 1 .9-.9.9.9 0 0 1-.9.9"/>
      </g>
    </svg>`,
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
  /* background: rgba(255, 255, 255, 0.97); */
  background: var(color-background-1);
  backdrop-filter: saturate(180%) blur(60px);
}

.tabbar-content {
  display: flex;
  height: 80px;
  contain: strict; /* 限制重绘范围 */
  justify-content: space-around;
  background: var(color-background-1);
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
  color: var(--color-navBar-text);
}

.tab-item.active .tab-text {
  color: var(--color-primary); /* 激活色 */
}
</style>