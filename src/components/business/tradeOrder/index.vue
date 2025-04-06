<template>
  <div class="position-temp">
	  <dataDefault v-if="ordersMap.size === 0" class="noData mt-25"></dataDefault>
    <div v-for="[key,value] in ordersMap" :key="key" class="box pb-15">
      <div class="positionData flex justify-between mt-20">
        <div class="leftBox flex justify-between">
          <div class="">
            <p class="fw-b fs-16 text-black">{{value.symbol}}</p>
          </div>
          <div class="core ml-15">
            <text :class="value.direction ==='BUY'?'fs-12 text-light-green':'fs-12 text-red'">{{value.direction ==='BUY'?'买入':'卖出'}}</text>
          </div>
        </div>
        <div class="rightBox">
          <p class="fw-b fs-16 text-black text-right">{{value.dealWay==='LIMIT'?'限价':'市价'}}</p>
        </div>
      </div>
      <div class="positionDetail mt-20">
        <div class="flex justify-between">
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">已成交/委托数量</p>
            <p class="fs-12 text-balck mt-5">{{value.completeNum}}/{{value.tradeNum}}</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">委托价格</p>
            <p class="fs-12 text-balck mt-5">{{value.tradePrice}}</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">创建时间</p>
            <p class="fs-12 text-black mt-5">{{formatISODate(value.createTime)}}</p>
          </div>
          <!-- <div class="detailBox w-25">
            <p class="fs-12 text-gray text-right">预计强平价格</p>
            <p class="fs-12 text-right text-light-blue mt-5">85,888.88</p>
          </div> -->
        </div>
        <div class="btnBox flex justify-between mt-15">
         <!-- <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">设置止盈止损</text>
          </van-button> -->
          <van-button class="myBtn flex-1" type="default" @click="cancel(value.orderNo)">
            <text class="fs-12 text-gray">撤销</text>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted ,computed,onUnmounted,nextTick} from 'vue';
import { useUserStore } from '@/stores/user';
import { cancelOrder, getOrderList } from '@/api/trade'
import { onShow } from '@dcloudio/uni-app';
import dataDefault from '@/components/dataDefault/index.vue';
import { useControlStore } from '@/stores/control';
import { formatISODate } from '@/utils/util';

const controlStore = useControlStore();

const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);
const unrealizedProfit = computed(() =>{
	return 
})
const ordersMap = ref(new Map())
const size = ref(10)
const current = ref(1)
const symbolMap =ref(new Map()) //存储当前持仓单交易对


//撤销订单
const cancel =async(orderNo: string)=>{
	const params = {
		orderNo:orderNo,
	}
	const data = await cancelOrder(params)
	if(!data || !data.errMsg){
		uni.showToast({title: '已成功取消', icon: 'success'})
	}
	controlStore.setCanceled(!controlStore.getCanceled)
}

const loadSpotOrders=async()=>{
	const params ={
		status:'ENTRUSTMENT',
		current:current.value,
		size:size.value
	}
	const data = await getOrderList(params)
	ordersMap.value.clear()
	data.records.forEach((item:any)=>{
		ordersMap.value.set(item.orderNo,item)
	})
}

onShow(()=>{
	loadSpotOrders()
})
onMounted(() => {
  nextTick(() => {
	  socketService.value.subscribeUser(userStore.userInfo.userId)
	  socketService.value.on(userStore.userInfo.userId, (data: any,type:string) => {
			const payload = data
			if(type === 'SPOT_ORDER_ENTRUSTMENT'){
				ordersMap.value.set(payload.orderNo,payload)
				symbolMap.value.set(payload.symbol,'')	
			}else if(type === 'SPOT_ORDER_COMPLETED' ||type === 'SPOT_ORDER_CANCEL' ){
				ordersMap.value.delete(payload.orderNo)
			}
	  })
  })
})


onUnmounted(() => {
	console.log('移除user_id监听')
	socketService.value.unsubscribeUser(userStore.userInfo.userId);
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