<template>
  <div class="transactionOrder-index">
    <navigationBar :title="$t('transactionOrder.allOrder')"></navigationBar>
    <div class="">
      <van-tabs
        v-model:active="active"
        animated
        sticky
        shrink
        @click-tab="onClickTab"
      >
        <van-tab v-for="(item, index) in activeList" :key="index" :title="item.title">
          <div class="orderList px-20 pt-5 pb-25">
            <div
			  v-if="orderList.length>0"
              class="orderBox mt-20 bg-white"
              v-for="(item, index) in orderList"
              :key="item.orderNo"
            >
              <div class="header pb-10">
                <div class="top flex items-baseline">
                  <p class="fs-16 fw-b">{{ item.symbol }}</p>
                  <div class="orderTypeTemp ml-5 fs-10 text-red">{{ item.direction }}</div>
                </div>
                <div class="bottom flex justify-between items-center">
                  <p class="fs-12 text-gray">{{ formatISODate(item.createTime) }}</p>
                  <div class="rightTemp flex justify-between items-baseline">
                    <p class="fs-12 text-gray">{{ item.orderNo }}</p>
                    <div class="ml-5 copyImg" @click="copyText(item.orderNo)">
                      <image
                        src="/static/images/copy.png"
                        mode="scaleToFill"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="content" v-if="active ===0">
				  <div class="mt-15 fs-12 text-gray flex justify-between items-center">
				    <p>{{ $t('transactionOrder.tradingMethod') }}</p>
				    <p>{{ item.dealWay }}</p>
				  </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>{{ $t('transactionOrder.orderPrice') }}</p>
                  <p>{{ item.tradePrice }}</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>{{ $t('transactionOrder.volumeVsOrderQuantity') }}</p>
                  <p>{{item.completeNum}}/{{ item.tradeNum }}</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>{{ $t('transactionOrder.status') }}</p>
                  <p>{{ spotStatus(item.status) }}</p>
                </div>
              </div>
			  <div class="content" v-else>
				<div class="mt-15 fs-12 text-gray flex justify-between items-center">
				  <p>{{ $t('transactionOrder.tradingMethod') }}</p>
				  <p>{{ item.tradeType }}</p>
				</div>
			    <div class="mt-15 fs-12 text-gray flex justify-between items-center">
			      <p>{{ $t('transactionOrder.entryPrice') }}</p>
			      <p>{{ item.entryPrice }}</p>
			    </div>
			    <div class="mt-15 fs-12 text-gray flex justify-between items-center">
			      <p>{{ $t('transactionOrder.liquidationPrice') }}</p>
			      <p>{{ item.liquidationPrice }}</p>
			    </div>
			    <div class="mt-15 fs-12 text-gray flex justify-between items-center">
			      <p>{{ $t('noun.quantity') }}</p>
			      <p>{{ item.quantity }}</p>
			    </div>
			    <div class="mt-15 fs-12 text-gray flex justify-between items-center">
			      <p>{{ $t('transactionOrder.status') }}</p>
			      <p>{{ formatStatus(item.status) }}</p>
			    </div>
			  </div>
            </div>
			<div v-else class="defaultTemp">
			  <dataDefault></dataDefault>
			</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { getOrderList, getFuturesOrderList } from '@/api/trade';
import dataDefault from '@/components/dataDefault/index.vue'
import { onLoad } from '@dcloudio/uni-app';
import { useI18n } from 'vue-i18n';
import {formatISODate} from '@/utils/util'

const { t } = useI18n();
const active = ref(0)
const status = ref('') //查询状态
const accountType = ref('FUTURES')
const activeList = ref([
  {
    title: t('noun.spotGoods'),
    value: 'SPOT'
  },
  {
    title: t('noun.futureGoods'),
    value:'FUTURES'
  },
  {
    title: t('noun.metalsGoods'),
    value:'METALS'
  }
])

const orderList = ref([])

	
onLoad((options: any)=>{
	if(options.type === 'SPOT'){
		  active.value = 0
	}else if(options.type === 'FUTURES'){
		  active.value = 1
	}else{
		  active.value = 2
	}
	loadData()
})

const loadData = async () => {
  // 订单状态(OPEN:委托中,POSITIONING:持仓中,CLOSED:已平仓,CANCELLED:已撤单,LIQUIDATED:已爆仓)
  if (active.value === 0) {
    getSpotList()
  } else if(active.value === 1){
	  accountType.value = 'FUTURES'
    getFuturesAndMetalList()
  }else{
	  accountType.value = 'METALS'
	getFuturesAndMetalList()  
  }
}

const getSpotList = async () => {
  const params = {
    status: status.value,
    page: {
      current: 1,
      size: 10,
    }
  }
  const data = await getOrderList(params)
  orderList.value = data.records
}

const getFuturesAndMetalList = async () => {
  // accountType: 账户类型 FUTURES:合约账户,METALS:贵金属账户,可用值:WALLET,SPOT,FUTURES,METALS
  const params = {
    status: status.value,
    accountType: accountType.value
  }
  const data = await getFuturesOrderList(params)
  orderList.value = data.records
}

const copyText = (val:string) => {
  uni.setClipboardData({
    data: val,
    success: () => {
      uni.showToast({
        title: t('tips.copySuccess'),
        icon: 'success',
        duration: 3000
      })
    }
  })
}

const onClickTab = (e: any) => {
	console.log('e =',e)
  active.value = e.name
  orderList.value = []
  loadData()
}

const statusMap = {
    'OPEN': t('transactionOrder.statuses.inOrder'),
    'POSITIONING': t('transactionOrder.statuses.inPosition'), 
    'CLOSED': t('transactionOrder.statuses.closed'),
    'CANCELLED': t('transactionOrder.statuses.cancelled'),
    'LIQUIDATED': t('transactionOrder.statuses.liquidated')
}

const spotStatusMap = {
    'ENTRUSTMENT': t('transactionOrder.spotStatuses.entrusting'),
    'MATCHING': t('transactionOrder.spotStatuses.partialMatching'), 
    'COMPLETED': t('transactionOrder.spotStatuses.completed'),
    'PART_REVOKED': t('transactionOrder.spotStatuses.partialDealCancelled'),
    'REVOKED': t('transactionOrder.spotStatuses.cancelled')
}
const formatStatus = (status: string) => {
  return statusMap[status] || status
}

const spotStatus = (status: string) => {
  return spotStatusMap[status] || status
}

const goDetail = () => {
  uni.navigateTo({
    url: '/pages/transactionOrderDetail/index'
  })
}

</script>

<style lang="scss" scoped>
/* App 端特定样式 */
// #ifdef APP-PLUS
:deep(.van-tabs) {
  /* 修复底部指示器样式 */
  .van-tabs__line {
    display: none!important;
  }
  /* 确保激活状态的标签颜色正确 */
  .van-tab--active {
    font-weight: bold;
    color: #333333 !important;
  }
}
// #endif
.transactionOrder-index {
  .orderList {
    // height: 100%;
    min-height: calc(100vh - 95px);
    background-color: #f6f8fc;
    .orderBox {
      box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
      border-radius: 16px;
      padding: 14px 20px;
      .header {
        border-bottom: 2px solid #f6f7fb;
        .top {
          .orderTypeTemp {
            height: 16px;
            line-height: 16px;
            padding-left: 2px;
            padding-right: 2px;
            background: #FFD3D9;
            border-radius: 3px 3px 3px 3px;
          }
        }
        .bottom {
          .rightTemp {
            .copyImg {
              image {
                width: 10px;
                height: 10px;
              }
            }
          }
        }
      }
      .content {

      }
    }
  }
}
.defaultTemp {
    margin-top: 150px;
    padding-bottom: 120px;
  }
</style>