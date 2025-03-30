<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :style="{ height: '90%', display: 'flex', flexDirection: 'column'}"
  >
    <div class="searchModule bg-white pt-15 pos-fixed w-100">
      <van-search v-model="searchVal" placeholder="请输入要检索的充值币种" @update:model-value="onSearch" />
    </div>
    <div class="currencyList" style="flex: 1; overflow-y: auto;">
      <div v-for="(item,index) in searchItems" :key=index class="currencyBox flex justify-start items-center px-20 py-5 mt-5 mb-10" @click="chooseToken(item)">
        <image
          class="currencyImg"
          :src="item.img"
          mode="scaleToFill"
        ></image>
        <p class="fw-b fs-14 mx-5 text-black">{{item.token}}</p>
        <!-- <p class="fs-10 text-gray">Bitcoin</p> -->
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref,defineEmits } from 'vue';
import { getRechargeCoins, getTrasferCoins, getWithdrawCoins } from '@/api/asset';

const emit = defineEmits(['chooseToken'])
const searchVal = ref('')
const showBottom = ref(false)
const coinItems = ref([])
let searchItems =ref([])

const  showFLoatingPanel = (type: string) => {
  showBottom.value = !showBottom.value
  // 判断类型是充值 或 提币
  if (type == 'recharge') return loadDataRecharge()
  if (type == 'withdraw') return loadDataWithdraw()
  if (type == 'transfer') return loadDataTransfer()
}

const chooseToken= (item: any) => {
	showBottom.value = false
	emit('chooseToken',item)
}

const onSearch= (val:string) => {
	if(searchVal.value.length>0){
		searchItems.value = coinItems.value.filter((item: any)=>{return item.token.indexOf(val)!=-1})	
	}else{
		searchItems.value = coinItems.value
	}
}



// 获取充值货币列表
const loadDataRecharge = async () => {
  const params = {}
  const data = await getRechargeCoins(params)
  coinItems.value = data
  searchItems.value = data
}

// 获取提币货币列表
const loadDataWithdraw = async () => {
  const params = {}
  const data = await getWithdrawCoins(params)
  coinItems.value = data
  searchItems.value = data
}

const loadDataTransfer = async () => {
  const params = {
    accountType: '', //查询币种
  }
  const data = await getTrasferCoins(params)
  coinItems.value = data
  searchItems.value = data
}

// 将方法暴露给父组件
defineExpose({
  showFLoatingPanel,
  coinItems
})

</script>

<style lang="scss" scoped>
.searchModule {
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  z-index: 99;
}
.currencyList {
  margin-top: 70px;
  height: calc(100% - 70px);
  overflow-y: auto;
  position: relative;
  .currencyBox {
    height: 35px;
    line-height: 35px;
    // border-bottom: 1px solid #f5f5f5;
  }
}
.currencyImg {
  width: 21px;
  height: 21px;
}
</style>