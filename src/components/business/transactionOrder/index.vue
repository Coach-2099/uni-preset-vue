<template>
  <div class="transactionOrder-temp mt-20">
    <div class="orderTitle flex justify-between px-15">
      <div class="titleBox flex-1 flex justify-stretch">
        <div class="titleName half-width fs-12 text-gray">{{ $t('noun.time') }}</div>
        <div class="titleName half-width fs-12 text-gray">{{ $t('noun.direction') }}</div>
      </div>
      <div class="titleBox flex-1 flex justify-between">
        <div class="titleName half-width fs-12 text-gray">{{ $t('noun.price') }}</div>
        <div class="titleName half-width fs-12 text-gray text-right">{{ $t('noun.quantity') }}}</div>
      </div>
    </div>
    <div class="contentBox mt-20">
      <div v-for="(item, index) in dataList" :key="item.ts +'-'+ index" class="orderContent mt-15 flex justify-between px-15">
        <div class="titleBox flex-1 flex justify-stretch">
          <div class="titleName text-black fs-12 half-width">{{ formatISODate(item.ts) }}</div>
          <div class="titleName text-black fs-12 half-width">
			<text v-if="type==='FUTURES'||type==='METALS'" class="text-black fs-12" :class="item.direction == 'sell' ? 'sell-red' : 'buy-green'">{{ item.direction == 'sell'?'做空':'做多' }}</text>  
            <text v-else class="text-black fs-12" :class="item.direction == 'sell' ? 'sell-red' : 'buy-green'">{{ item.direction == 'sell'?'卖出':'买入' }}</text>
          </div>
        </div>
        <div class="titleBox flex-1 flex justify-between">
          <div class="titleName text-black fs-12 half-width">{{ item.price }}</div>
          <div class="titleName text-black fs-12 half-width text-right">{{ item.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { getTradeDetail } from '@/api/quotes'
import { useControlStore } from '@/stores/control';
import { onLaunch, onLoad, onShow } from "@dcloudio/uni-app";
import { useUserStore } from '@/stores/user';
import {formatISODate} from '@/utils/util'

const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);

// stores
const controlStore = useControlStore();

const subSymbol = ref('') //当前订阅的交易对

const dataList = ref()

const props = defineProps({
  type: {
    type: String,
    default: 'SPOT'
  }
})

watch(
  () => controlStore.getQuotesData(props.type)?.symbol,
  (newVal, oldVal) => {
    socketService.value.unsubscribe('trade',oldVal); //取消原有订阅
    subSymbol.value = newVal
  }
)

const loadData = async (params: any) => {
  const data = await getTradeDetail(params)
  dataList.value = data
  socketService.value.subscribe('trade',params.symbol);
  socketService.value.on(`${params.symbol}-trade`, (item: any) => {
    dataList.value.unshift(item)
    if(dataList.value.length > 30) {
        dataList.value.splice(30) // 保留最新的50条数据
    }
  })
}

// 新增时间格式化方法
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp) // 假设时间戳是秒级
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}


defineExpose({
  loadData
})


</script>

<style lang="scss" scoped>
.transactionOrder-temp {
  padding-bottom: 100px;
  .half-width {
    width: 45%;;
  }
  .orderTitle {

  }
  .orderContent {
    .buy-green {
      color: #18B86D;
    }
    .sell-red {
      color: #FF454E;
    }
  }
}
</style>