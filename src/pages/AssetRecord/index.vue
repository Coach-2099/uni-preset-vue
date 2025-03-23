<template>
  <div class="AssetRecord-index">
    <navigationBar title="资产记录"></navigationBar>
    <div class="mt-20 pl-5 pr-10">
      <van-tabs
        title-active-color="#333333"
        title-inactive-color="#B0B0B0"
        v-model:active="active" 
        shrink
      >
        <van-tab title="Deposit">
          <assetList :data-list="dataList" @refresh="refreshFun"></assetList>
          <!-- <div class="assetList mt-15">
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
          </div> -->
        </van-tab>
        <van-tab title="Withdraw">
          Deposit
        </van-tab>
        <van-tab title="Transfer">
          Deposit
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import assetList from '@/components/business/assetList/index.vue'
import { getRechargeList } from '@/api/asset'

const active = ref(0);
const dataList = ref([]);
const pages = ref({
  current:1,
  size:10
})

const refreshFun = () => {
  console.log('刷新充值记录')
  loadData()
}

const loadData = async () => {
  const params = {
    ...pages,
    symbol: 'USDT'
  }
  const data = await getRechargeList(params)
  dataList.value = data.records
}

</script>

<style lang="scss" scoped>
.AssetRecord-index {
  
}
</style>