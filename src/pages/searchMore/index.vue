<template>
  <div class="searchMore-index">
    <div class="mt-15 pl-5 pr-10 bg-white">
      <van-search
        v-model="value"
        placeholder="BTC/USDT"
        shape="round"
        clearable
        show-action
        @cancel="cancel"
        class="flex-1"
      />
    </div>
    <div class="content">
      <div v-if="true" class="px-20">
        <p class="text-black fw-b fs-16 mt-15">热门搜索</p>
        <div class="listBox bg-white mt-15 px-15 py-15">
          <div v-for="item in 5" :key="item" class="oneLine mt-10 flex justify-between items-center">
            <div class="leftBox">
              <div class="flex justify-start items-baseline">
                <div class="myBot"></div>
                <p class="mr-5 fs-16 text-black">BTC</p>
                <p class="fs-12 text-gray">/USDT</p>
              </div>
              <div>
                <text class="fs-12 text-gray">现货</text>
              </div>
            </div>
            <div class="rightBox text-right">
              <div class="text-balck fs-16">0.415</div>
              <div class="text-red fs-10">-8.09%</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="px-20 bg-white">
        <div 
          v-for="index in 5" 
          :key="index" 
          class="assetSingle pt-15 pb-5 flex justify-between items-center"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref('')

const goAssetDetail = () => {
  console.log('前往详情')
}

const cancel = () => {
  uni.switchTab({
    url: '/pages/quotes/index'
  })
}

</script>

<style lang="scss" scoped>
.searchMore-index {
  min-height: 100vh;
  background: #F6F7FB;
  .content {
    // min-height: 100vh;
    border-radius: 8px;
    .listBox {
      .oneLine {
        .leftBox {
          .myBot {
            margin-right: 3px;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            background: #652626;
          }
        }
        .rightBox {

        }
      }
    }

    .assetSingle {
      
    }
  }
}
</style>