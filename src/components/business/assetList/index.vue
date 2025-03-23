<template>
  <basePullRefresh
    v-model="isLoading" 
    :head-height="100"
    @refresh="handleRefresh"
  >
    <template #content>
      <div class="assetList mt-15">
        <div 
          v-for="index in 5" 
          :key="index" 
          class="assetSingle mt-15 flex justify-between items-center"
          @click="goAssetDetail"
        >
          <div>
            <p class="fs-16 text-black">USDT</p>
            <p class="fs--12 text-gray">2025-02-23  11:43:05</p>
          </div>
          <div class="flex justify-between items-center">
            <div class="mr-10">
              <p class="fs-16 text-black text-right">999,999</p>
              <div class="flex items-center">
                <div class="dot mr-5"></div>
                <p class="fs-12 text-gray">Succeeded</p>
              </div>
            </div>
            <div class="rightIcon"></div>
          </div>
        </div>
      </div>
    </template>
  </basePullRefresh>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import basePullRefresh from '@/components/basePullRefresh/index.vue'

const props = defineProps({
  dataList: {
    type: Array,
    default: []
  }
})

const isLoading = ref(false)
const pages = {
  current: 1,
  size: 10
}

const emit = defineEmits(['refresh'])

const handleRefresh = (finish: any) => {
  emit('refresh')
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const goAssetDetail = () => {
  uni.navigateTo({
    url: '/pages/assetDetail/index'
  })
};

</script>

<style lang="scss" scoped>
.assetList {
  .assetSingle {
    padding-left: 18px;
    padding-right: 18px;
  }

  .dot {
    width: 3px;
    height: 3px;
    background: #00B200;
  }

  .rightIcon {
    position: relative;
    width: 5px;
    height: 10px;
    cursor: pointer;
  }
  .rightIcon:before {
    content: "";
    width: 6px;
    height: 6px;
    border: solid #333;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -50%) rotate(-45deg);
    position: absolute;
    left: 50%;
    top: 70%;
  }
}
</style>