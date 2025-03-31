<template>
  <div class="transactionOrder-index">
    <navigationBar title="All Order"></navigationBar>
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
              class="orderBox mt-20 bg-white"
              v-for="(item, index) in orderList"
              :key="item.orderNo"
              @click="goDetail"
            >
              <div class="header pb-10">
                <div class="top flex items-baseline">
                  <p class="fs-16 fw-b">{{ item.symbol }}</p>
                  <div class="orderTypeTemp ml-5 fs-10 text-red">{{ item.direction }}</div>
                </div>
                <div class="bottom flex justify-between items-center">
                  <p class="fs-12 text-gray">{{ item.createTime }}</p>
                  <div class="rightTemp flex justify-between items-baseline">
                    <p class="fs-12 text-gray">{{ item.orderNo }}</p>
                    <div class="ml-5 copyImg">
                      <image
                        src="/static/images/copy.png"
                        mode="scaleToFill"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="content">
                <!-- <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Order Type</p>
                  <p>TP/SL</p>
                </div> -->
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Trigger Price</p>
                  <p>{{ item.tradePrice }}</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Order Price</p>
                  <p>{{ item.tradeTotal }}</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Filled/Order Quantity</p>
                  <p>{{ item.tradeNum }}</p>
                </div>
                <div class="mt-15 fs-12 text-gray flex justify-between items-center">
                  <p>Status</p>
                  <p>{{ formatStatus(item.status) }}</p>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { getOrderList, getFuturesOrderList } from '@/api/trade';

const active = ref(0)
const activeList = ref([
  {
    title: '现货',
    value: 'SPOT'
  },
  {
    title: '合约',
    value:'FUTURES'
  }
  // {
  //   title: '贵金属',
  //   value:'METALS'
  // }
])

const orderList = ref([])

onMounted(() => {
  loadData()
})

const loadData = async () => {
  // 订单状态(OPEN:委托中,POSITIONING:持仓中,CLOSED:已平仓,CANCELLED:已撤单,LIQUIDATED:已爆仓)
  if (active.value === 0) {
    getSpotList()
  } else {
    getFuturesAndMetalList()
  }
}

const getSpotList = async () => {
  const params = {
    status: 'CLOSED',
    page: {
      current: 1,
      size: 10,
    }
  }
  const data = await getOrderList(params)
  console.log('data: ', data)
}

const getFuturesAndMetalList = async () => {
  // accountType: 账户类型 FUTURES:合约账户,METALS:贵金属账户,可用值:WALLET,SPOT,FUTURES,METALS
  const params = {
    status: 'CLOSED',
    accountType: 'FUTURES'
  }
  const data = await getFuturesOrderList(params)
  orderList.value = data.records
  console.log('合约 和 贵金属列表', data)
}

const onClickTab = (e: any) => {
  console.log('e: ', e)
  console.log('activeList: ', activeList)
  active.value = e.name
  loadData()
}

const formatStatus = (status: string) => {
  const statusMap = {
    'OPEN': '委托中',
    'POSITIONING': '持仓中', 
    'CLOSED': '已平仓',
    'CANCELLED': '已撤单',
    'LIQUIDATED': '已爆仓'
  }
  return statusMap[status] || status
}

const goDetail = () => {
  uni.navigateTo({
    url: '/pages/transactionOrderDetail/index'
  })
}

</script>

<style lang="scss" scoped>
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
</style>