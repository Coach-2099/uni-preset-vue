<template>
  <div class="position-temp">
	  <dataDefault v-if="ordersMap.size === 0" class="noData mt-25"></dataDefault>
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
            <p class="fs-12 text-black mt-5">{{value.margin.toFixed(2)}}</p>
          </div>
          <!-- <div class="detailBox w-25">
            <p class="fs-12 text-gray text-right">预计强平价格</p>
            <p class="fs-12 text-right text-light-blue mt-5">85,888.88</p>
          </div> -->
        </div>
        <div class="btnBox flex justify-between mt-15">
          <van-button class="myBtn flex-1" type="default" @click="settingProfitAndLoss(value.orderNo)">
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

    <!-- 设置止盈止损 -->
    <van-dialog
      v-model:show="showDialog"
      title="设置止盈止损"
      show-cancel-button
      @confirm="myConfirm"
      @cancel="myCancel"
    >
      <div class="myDialog px-10">
        <div class="flex items-center justify-center mt-20">
          <div class="mr-10 fs-14 fw-b">
            <div>{{ $t('noun.takeProfit') }}</div>
          </div>
          <div class="baseInput pr-10 flex justify-between items-center">
            <input
              v-model="stopProfit"
              class="myInput px-10 w-50"
              :placeholder="$t('noun.takeProfit')"
              placeholder-class="input-placeholder"
            />
          </div>
        </div>
        <div class="flex items-center justify-center mt-10 mb-20">
          <div class="mr-10 fs-14 fw-b">
            <div>{{ $t('noun.stopLoss') }}</div>
          </div>
          <div class="baseInput pr-10 flex justify-between items-center">
            <input
              v-model="stopLess"
              class="myInput px-10 w-50"
              :placeholder="$t('noun.stopLoss')"
              placeholder-class="input-placeholder"
            />
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted ,computed,onUnmounted,nextTick} from 'vue';
import { useUserStore } from '@/stores/user';
import { closeOrder,getFuturesOrderList,cancelFuturesOrder,setProfitOrLoss} from '@/api/trade'
import { roundDown } from '@/utils/util'
import { onShow } from '@dcloudio/uni-app';
import dataDefault from '@/components/dataDefault/index.vue';
import { useControlStore } from '@/stores/control';

const props = defineProps({
  accountType:{
	  type:String,
	  default:'FUTURES'
  }
})

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
const showDialog = ref(false)
const stopProfit = ref(0) //止盈价格
const stopLess = ref(0) //止损价
const orderNo = ref('')

const settingProfitAndLoss = (orderId:string) => {
  showDialog.value = true;
  orderNo.value = orderId
}

const myConfirm= () => {
	if(!stopProfit.value && !stopLess.value){
		return uni.showToast({title: '请输入止盈止损价格', icon: 'none'})
	}else if(stopProfit.value<0){
		return uni.showToast({title: '请输入正确的止盈止损价格', icon: 'none'})
	}else if(stopLess.value<0 || stopLess.value){
		return uni.showToast({title: '请输入正确的止损止损价格', icon: 'none'})
	}
	const params ={
		stopProfit:stopProfit.value,
		stopLoss:stopLess.value,
		orderNo:orderNo.value
	}
	setProfitOrLoss(params).then((res:any)=>{
		uni.showToast({title: '设置成功', icon: 'success'})
	})
}

const myCancel = () => {
	stopProfit.value = 0
	stopLess.value = 0
}


//平仓
const close =async(orderNo: string,quantity: number)=>{
	const params = {
		orderNo:orderNo,
		closeQuantity:quantity
	}
	const data = await closeOrder(params)
	if(!data || !data.errMsg){
		uni.showToast({title: '已平仓', icon: 'success'})
	}
	controlStore.setCanceled(!controlStore.getCanceled)
}

//平仓
const cancel =async(orderNo: string)=>{
	const params = {
		orderNo:orderNo,
	}
	const data = await cancelFuturesOrder(params)
	if(!data || !data.errMsg){
		uni.showToast({title: '已成功取消', icon: 'success'})
	}
	controlStore.setCanceled(!controlStore.getCanceled)
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
		accountType: props.accountType,//查询合约账户
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

const subWebsocket =()=>{
	socketService.value.subscribe('ticker')
	socketService.value.on('ticker',(data: any)=>{
			  if(symbolMap.value.has(data.symbol)){
				  for(let val of ordersMap.value.values()){
				  	if(val.status==='POSITIONING'){
				  		val.unrealizedProfit = calculateUnrealizedProfit(data.close,val.direction,val.quantity,val.entryPrice)
				  		val.unrealizedProfitScale=roundDown(val.unrealizedProfit/val.margin*100,2)
						val.close = data.close
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
}
onShow(()=>{
	loadPositions()
	subWebsocket()
})
onMounted(() => {
  nextTick(() => {
	  subWebsocket()
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
  .myDialog {
    .baseInput {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 42px;
      .myInput {

      }
      .rightBox {
        image {
          width: 9px;
          height: 7px;
        }
      }
      .input-placeholder {
        font-size: 14px;
        color: #B0B0B0;
      }
    }
  }
}
</style>