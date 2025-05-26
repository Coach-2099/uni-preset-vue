<template>
  <div class="theme-index pos-relative">
    <navigationBar :title="'选择主题'"></navigationBar>
    <van-config-provider :theme="isDark">
      <div class="mt-20">
        <van-radio-group v-model="checkRadio">
          <van-cell-group inset>
            <van-cell :title="'白色'" clickable @click="checked('light')">
              <template #right-icon>
                <van-radio name="light" />
              </template>
            </van-cell>
            <van-cell :title="'黑色'" clickable @click="checked('dark')">
              <template #right-icon>
                <van-radio name="dark" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="myBtn pos-fixed w-100">
          <van-button
            type="primary"
            class="w-100 mt-20 bg-warning"
            @click="confirm"
          >
            {{ $t('common.confirm') }}
          </van-button>
        </div>
      </div>
    </van-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import navigationBar from '@/components/navigationBar/index.vue'
import { onLoad } from '@dcloudio/uni-app';

import { useTheme } from '@/theme'

const { theme, setTheme } = useTheme()
const isDark = ref<any>('light')

const checkRadio = ref(theme.value) // 根据当前主题初始化选中项

onLoad(() => {
  // 从本地存储读取主题设置
  const savedTheme = uni.getStorageSync('APP_THEME') || 'light'
  checkRadio.value = savedTheme
})

const checked = (e:any) => {
  checkRadio.value = e
  // if (e === '1') {
  //   checkRadio.value = e
  // }
}

const confirm = () => {
  setTheme(checkRadio.value)
  isDark.value = checkRadio.value
  
  // 返回首页（根据需要开启）
  // uni.navigateBack({
  //   delta: 1
  // })
}

</script>

<style lang="scss">
.theme-index {
  background: var(--color-background);
  height: 100vh;
  .myBtn {
    bottom: 80px;
    left: 0;
    right: 0;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>