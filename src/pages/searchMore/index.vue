<template>
  <div class="searchMore-index">
    <div class="mt-15 pl-5 pr-10 bg-white">
      <van-search
        v-model="value"
        placeholder="BTC/USDT"
        shape="round"
        show-action
        clearable
        class="flex-1"
      >
        <template #left>
          <div @click="cancel" class="flex items-center back-arrow">
            <div class="triangle-facing-left mx-5"></div>
          </div>
        </template>
        <template #action>
          <div @search="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="content">
      <!-- <div v-if="false" class="px-20">
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
      </div> -->
      <div
        v-if="loadingData"
        class="myLoading pt-25 w-100 flex justify-center items-center"
      >
        <van-loading type="spinner" />
      </div>
      <div v-else class="px-20 bg-white">
        <div 
          v-for="(item, index) in symbolMap" 
          :key="index" 
          class="assetSingle pt-15 pb-5 flex justify-between items-center"
          @click="goAssetDetail"
        >
          <div>
            <p class="fs-16 text-black">{{ item.tradeToken }}</p>
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
import { ref, reactive } from 'vue';
import { getSymbolsLastPrice } from '@/api/quotes'
import { onLoad } from '@dcloudio/uni-app';

const value = ref('')
const loadingData = ref(false)
const typeObj = ref({} as any)
const symbolMap = reactive(new Map())

onLoad((option) => {
  typeObj.value = option
  console.log('onLoad', option)
})
const goAssetDetail = () => {
  console.log('前往详情')
}

const onSearch = async () => {
  // console.log('搜索')
  loadingData.value = true;
  const params = {
    klineType: typeObj.type,
    // sortField: sortField.value,
    // sortDirection: sortDirection.value
  }
  const data = await getSymbolsLastPrice(params)
  data.forEach((item: any) => {
    item.tradeToken = item.symbol.split('/')[0]
    item.basicToken = item.symbol.split('/')[1]
    symbolMap.set(item.symbol,item)
    // item.price = item.price.toFixed(2)
  })
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
  background: var(--color-background-box);
  .back-arrow {
    .triangle-facing-left {
      display: inline-block;
      border-left: 2px solid;
      border-bottom: 2px solid;
      width: 12px;
      height: 12px;
      transform: rotate(45deg);
    }
  }
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