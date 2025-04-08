<template>
  <basePullRefresh
    v-model="isLoading" 
    :head-height="100"
    @refresh="handleRefresh"
  >
    <template #content>
	<div class="transactionOrder-index">
      <div class="orderList px-20 pt-5 pb-25">
        <div v-if="dataList.length>0"
          v-for="(item, index) in dataList" 
          :key="index" 
          class="orderBox mt-20 bg-white"
          @click="goAssetDetail(item)"
        >
		<div v-if="type==='Deposit'" class="content">
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>币种</p>
		    <p>{{ item.symbol }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>数量</p>
		    <p>{{ item.rechargeAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>充值地址</p>
		    <p>{{ item.userAddress }}</p>
		  </div>
		  <div v-if="item.protocolType" class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>所属公链</p>
		    <p>{{ item.protocolType }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>交易Hash</p>
		    <p>{{ item.blockOrderId }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>时间</p>
		    <p>{{ formatISODate(item.createTime) }}</p>
		  </div>
		</div>
		<div v-if="type==='Withdraw'" class="content">
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>币种</p>
		    <p>{{ item.symbol }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>数量</p>
		    <p>{{ item.tradeAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>提币地址</p>
		    <p>{{ item.userAddress }}</p>
		  </div>
		  <div v-if="item.protocolType" class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>所属公链</p>
		    <p>{{ item.protocolType }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>手续费</p>
		    <p>{{ item.chargeAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>交易Hash</p>
		    <p>{{ item.transactionId }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>时间</p>
		    <p>{{ formatISODate(item.createTime) }}</p>
		  </div>
		</div>
		<div v-if="type==='Transfer'" class="content">
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>转出账户</p>
		    <p>{{ item.fromAccount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>转入账户</p>
		    <p>{{ item.toAccount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>币种</p>
		    <p>{{ item.token }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>数量</p>
		    <p>{{ item.transferAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>时间</p>
		    <p>{{ formatISODate(item.createTime) }}</p>
		  </div>
		</div>
        </div>
		<div v-else class="defaultTemp">
		  <dataDefault></dataDefault>
		</div>
      </div>
	  </div>
    </template>
  </basePullRefresh>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import basePullRefresh from '@/components/basePullRefresh/index.vue'
import { formatISODate } from '@/utils/util'
import { onShow } from '@dcloudio/uni-app'
import dataDefault from '@/components/dataDefault/index.vue'

const props = defineProps({
  dataList: {
    type: Array,
    default: []
  },
  type: {
    type: String,
    default: 'Deposit'
  },
})

const statusMap: { [key: number]: string } = {
    0: '待审核',
    1: '提币审核成功',
    2: '提币审核驳回',
    3: '提币到账成功',
    4: '提币失败',
}

// 在现有代码中添加格式化方法
const formatStatus = (status: number) => {
  return statusMap[status] || '未知状态'
}

const isLoading = ref(false)
const pages = {
  current: 1,
  size: 10
}

const emit = defineEmits(['refresh'])

onShow(()=> {
  
})

const handleRefresh = (finish: any) => {
  emit('refresh')
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const goAssetDetail = (item: any) => {
  uni.navigateTo({
    // url: '/pages/assetDetail/index?type=' + props.type + '&' + encodeURIComponent(JSON.stringify(item))
    url: `/pages/assetDetail/index?type=${props.type}&item=${encodeURIComponent(JSON.stringify(item))}`
  })
};

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
.defaultTemp {
    margin-top: 150px;
    padding-bottom: 120px;
  }
</style>