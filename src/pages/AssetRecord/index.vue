<template>
  <div class="AssetRecord-index">
    <navigationBar title="资产记录"></navigationBar>
    <div class="mt-20 pl-5 pr-10">
      <van-tabs
        title-active-color="#333333"
        title-inactive-color="#B0B0B0"
        v-model:active="active"
        @click-tab="tabclick"
        shrink
      >
        <van-tab title="Deposit">
          <assetList :data-list="dataList" type="Deposit" @refresh="refreshFun"></assetList>
        </van-tab>
        <van-tab title="Withdraw">
          <assetList :data-list="dataList" type="Withdraw" @refresh="refreshFun"></assetList>
        </van-tab>
        <van-tab title="Transfer">
          <assetList :data-list="dataList" type="Transfer" @refresh="refreshFun"></assetList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import assetList from '@/components/business/assetList/index.vue'
import { getRechargeList, getWithdrawList, getTrasferList } from '@/api/asset'
import { onLoad } from '@dcloudio/uni-app';

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

onLoad(() => {
  loadData()

})

/**
 * 加载数据
 * @param type 类型 1:充值 2:提现 3:转账
 */
const loadData = async (type?: number) => {
  const params = {
    ...pages,
    // symbol: 'USDT'
  }
  let loadFun:any = null
  switch (type) {
    case 1:
      loadFun = getRechargeList
      break
    case 2:
      loadFun = getWithdrawList
      break
    case 3:
      loadFun = getTrasferList
      break
    default:
    loadFun = getRechargeList
      break
  }
  const data = await loadFun(params)
  dataList.value = data.records
  console.log('dataList', dataList.value)
}



const tabclick = (e:any) => {
  console.log('e', e)
}

</script>

<style lang="scss" scoped>
.AssetRecord-index {
  
}
</style>