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
            <text :class="value.direction ==='LONG'?'fs-12 text-light-green':'fs-12 text-red'">{{value.direction ==='LONG'?'做多':'做空'}}</text>
          </div>
        </div>
        <div class="rightBox" v-if="value.status==='POSITIONING'">
          <p class="fs-12 text-gray text-right">未结盈亏</p>
          <p :class="value.unrealizedProfit>0?'fw-b fs-16 text-green mt-5':'fw-b fs-16 text-red mt-5'">{{value.unrealizedProfit}}({{value.unrealizedProfitScale}}%)</p>
        </div>
      </div>
      <div class="positionDetail mt-20">
        <div class="flex justify-between">
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">{{value.status==='POSITIONING'?'持仓数量':'委托数量'}}</p>
            <p class="fs-12 text-balck mt-5">{{value.quantity}}</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">入场价格</p>
            <p class="fs-12 text-balck mt-5">{{value.entryPrice}}</p>
          </div>
          <div class="detailBox w-20">
            <p class="fs-12 text-gray">持仓保证金</p>
            <p class="fs-12 text-black mt-5">{{value.margin}}</p>
          </div>
          <!-- <div class="detailBox w-25">
            <p class="fs-12 text-gray text-right">预计强平价格</p>
            <p class="fs-12 text-right text-light-blue mt-5">85,888.88</p>
          </div> -->
        </div>
        <div class="btnBox flex justify-between mt-15">
          <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">设置止盈止损</text>
          </van-button>
          <!-- <van-button class="myBtn flex-1" type="default">
            <text class="fs-12 text-gray">追踪出场</text>
          </van-button> -->
		  <van-button v-if="value.status==='OPEN'" class="myBtn flex-1" type="default" @click="cancel(value.orderNo)">
		    <text class="fs-12 text-gray">撤销</text>
		  </van-button>
          <van-button v-else class="myBtn flex-1" type="default" @click="close(value.orderNo,value.quantity)">
            <text class="fs-12 text-gray">平仓</text>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted ,computed,onUnmounted,nextTick} from 'vue';
import { useUserStore } from '@/stores/user';
import { closeOrder,getFuturesOrderList,cancelFuturesOrder } from '@/api/trade'
import { roundDown } from '@/utils/util'
import { onShow } from '@dcloudio/uni-app';

const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);
const unrealizedProfit = computed(() =>{
	return 
})
const ordersMap = ref(new Map())
const size = ref(10)
const current = ref(1)
const symbolMap =ref(new Map()) //存储当前持仓单交易对

//平仓
const close =async(orderNo: string,quantity: number)=>{
	const params = {
		orderNo:orderNo,
		closeQuantity:quantity
	}
	await closeOrder(params)
	uni.showToast({title: '已平仓', icon: 'success'})
}

//平仓
const cancel =async(orderNo: string)=>{
	const params = {
		orderNo:orderNo,
	}
	await cancelFuturesOrder(params)
	uni.showToast({title: '已成功取消', icon: 'success'})
}
//计算实时盈亏
const calculateUnrealizedProfit=(close: number,direction:string,quantity: number,entryPrice:number)=>{
	if(direction ==='LONG'){
		return roundDown((close - entryPrice) * quantity,2)
	}else{
		return roundDown((entryPrice - close ) * quantity,2)
	}
}
const loadPositions=async()=>{
	const params ={
		status:['OPEN','POSITIONING'],
		accountType:'FUTURES',//查询合约账户
		current:current.value,
		size:size.value
	}
	const data = await getFuturesOrderList(params)
	ordersMap.value.clear()
	data.records.forEach((item:any)=>{
		ordersMap.value.set(item.orderNo,item)
		if(item.status === 'POSITIONING'){
			symbolMap.value.set(item.symbol,'')
		}
	})
}

onShow(()=>{
	loadPositions()
})
onMounted(() => {
  nextTick(() => {
	  socketService.value.subscribe('ticker')
	  socketService.value.on('ticker',(data: any)=>{
		  if(symbolMap.value.has(data.symbol)){
			  for(let val of ordersMap.value.values()){
			  	if(val.status==='POSITIONING'){
			  		val.unrealizedProfit = calculateUnrealizedProfit(data.close,val.direction,val.quantity,val.entryPrice)
			  		val.unrealizedProfitScale=roundDown(val.unrealizedProfit/val.margin*100,2)
			  	}
			  }
		  }
	  })
	  socketService.value.subscribeUser(userStore.userInfo.userId)
	  socketService.value.on(userStore.userInfo.userId, (data: any,type:string) => {
			const payload = data
			if(type === 'FUTURES_ORDER_ENTRUSTMENT' || type === 'FUTURES_ORDER_POSITION'){
				ordersMap.value.set(payload.orderNo,payload)
				if(type === 'FUTURES_ORDER_POSITION'){
					symbolMap.value.set(payload.symbol,'')	
				}
			}else if(type === 'FUTURES_ORDER_CANCEL' ||type === 'FUTURES_ORDER_BOOM' ||type === 'FUTURES_ORDER_CLOSED' ){
				ordersMap.value.delete(payload.orderNo)
			}
	  })
  })
})

onUnmounted(() => {
	console.log('移除user_id监听')
	socketService.value.unsubscribe('ticker');
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