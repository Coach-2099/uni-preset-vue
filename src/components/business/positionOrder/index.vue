<template>
  <div class="position-temp">
    <div v-for="[key,value] in ordersMap" :key="key" class="box pb-15">
      <div class="positionData flex justify-between mt-20">
        <div class="leftBox flex justify-between">
          <div class="">
            <p class="fw-b fs-16 text-black">{{value.symbol}}</p>
            <p class="fs-12 text-black mt-5">全仓{{value.leverage}}X</p>
          </div>
          <div class="core ml-15">
            <text class="fs-12 text-light-green">{{value.direction ==='LONG'?'做多':'做空'}}</text>
          </div>
        </div>
        <div class="rightBox" v-if="value.status==='POSITIONING'">
          <p class="fs-12 text-gray text-right">未结盈亏</p>
          <p class="fw-b fs-16 text-red mt-5">{{value.unrealizedProfit}}({{value.unrealizedProfitScale}}%)</p>
        </div>
      </div>
      <div class="positionDetail mt-20">
        <div class="flex justify-between">
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">持仓数量</p>
            <p class="fs-12 text-balck mt-5">{{value.tradeNum}}</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">入场价格</p>
            <p class="fs-12 text-balck mt-5">{{value.entryPrice}}</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">标记价格</p>
            <p class="fs-12 text-black mt-5">85,888.88</p>
          </div>
          <div class="detailBox w-25">
            <p class="fs-12 text-gray text-right">预计强平价格</p>
            <p class="fs-12 text-right text-light-blue mt-5">85,888.88</p>
          </div>
        </div>
        <div class="btnBox flex justify-between mt-15">
          <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">设置止盈止损</text>
          </van-button>
          <!-- <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">追踪出场</text>
          </van-button> -->
          <van-button class="myBtn flex-1" type="default" @click="close(value.orderNo)">
            <text class="fs-12 text-gray">平仓</text>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted ,computed,onUnmounted,nextTick,watch} from 'vue';
import { useUserStore } from '@/stores/user';
import { closeOrder } from '@/api/trade'
import { roundDown } from '@/utils/util'

watch(
  () => lastPrice.value,
  (newVal, oldVal) => {
	for(let val of ordersMap.value.values()){
		if(val.status==='POSITIONING'){
			val.unrealizedProfit = calculateUnrealizedProfit(val.direction,val.quantity,val.entryPrice)
			val.unrealizedProfitScale=roundDown(val.unrealizedProfit/val.margin*100,2)
		}
	}
  }
);
const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);
const unrealizedProfit = computed(() =>{
	return 
})
const ordersMap = ref(new Map())
const lastPrice = ref(0)

//平仓
const close =(orderNo: string)=>{
	const params={
		orderNo:orderNo
	}
	closeOrder(params)
}
//
const calculateUnrealizedProfit=(direction:string,quantity: number,entryPrice:number)=>{
	if(direction ==='LONG'){
		return roundDown((lastPrice.value - entryPrice) * quantity,2)
	}else{
		return roundDown((entryPrice - lastPrice.value ) * quantity,2)
	}
}
onMounted(() => {
  nextTick(() => {
	  socketService.value.on('ticker',(data: any)=>{
		  lastPrice.value = data.close //获取最新价
	  })
	  socketService.value.subscribeUser(userStore.userInfo.id)
	  socketService.value.on(userStore.userInfo.id, (data: any) => {
			const payload = data.payload
			if(data.event === 'FUTURES_ORDER_ENTRUSTMENT' || data.event === 'FUTURES_ORDER_POSITION'){
				ordersMap.value.set(payload.orderNo,payload)
			}else if(data.event === 'FUTURES_ORDER_CANCEL' ||data.event === 'FUTURES_ORDER_BOOM' ||data.event === 'FUTURES_ORDER_CLOSED' ){
				ordersMap.value.delete(payload.orderNo)
			}
	  })
  })
})
onUnmounted(() => {
	console.log('移除user_id监听')
	socketService.value.unsubscribeUser(userStore.userInfo.id);
})
</script>

<style lang="scss" scoped>
.position-temp {
  padding: 0 8px;
  padding-bottom: 90px;
  .box {
    border-bottom: 2px solid #f9fafc;
    .positionData {
      .leftBox {
        .core {
          background: #E0F5EC;
          border-radius: 3px 3px 3px 3px;
          opacity: 0.35;
          padding: 3px 7px;
          height: 27px;
          line-height: 22px;
        }
      }
      .rightBox {}
    }
    .positionDetail {
      .btnBox {
        gap: 8px;
        .myBtn {
          height: 28px;
          border-radius: 6px;
          background: #F6F7FB;
        }
      }
    }
  }
}
</style>