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
		    <p>{{ $t('noun.currency') }}</p>
		    <p>{{ item.symbol }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.quantity') }}</p>
		    <p>{{ item.rechargeAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.depositAddress') }}</p>
		    <p>{{ item.userAddress }}</p>
		  </div>
		  <div v-if="item.protocolType" class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.blockchain') }}</p>
		    <p class="w-75 text-wrap text-right">{{ item.protocolType }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.transactionHash') }}</p>
		    <p class="w-75 text-wrap text-right">{{ item.blockOrderId }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.time') }}</p>
		    <p>{{ formatISODate(item.createTime) }}</p>
		  </div>
		</div>
		<div v-if="type==='Withdraw'" class="content">
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.currency') }}</p>
		    <p>{{ item.symbol }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.quantity') }}</p>
		    <p>{{ item.tradeAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.withdrawalAddress') }}</p>
		    <p>{{ item.userAddress }}</p>
		  </div>
		  <div v-if="item.protocolType" class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.blockchain') }}</p>
		    <p>{{ item.protocolType }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.fee') }}</p>
		    <p>{{ item.chargeAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.transactionHash') }}</p>
		    <p class="w-75 text-wrap text-right">{{ item.transactionId }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.time') }}</p>
		    <p>{{ formatISODate(item.createTime) }}</p>
		  </div>
		</div>
		<div v-if="type==='Transfer'" class="content">
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.fromAccount') }}</p>
		    <p>{{ item.fromAccount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('assetRecord.toAccount') }}</p>
		    <p>{{ item.toAccount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.currency') }}</p>
		    <p>{{ item.token }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.quantity') }}</p>
		    <p>{{ item.transferAmount }}</p>
		  </div>
		  <div class="mt-15 fs-14 fw-600 text-black flex justify-between items-center">
		    <p>{{ $t('noun.time') }}</p>
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
    0: t('assetRecord.statusPending'),
    1: t('assetRecord.statusApproved'),
    2: t('assetRecord.statusRejected'),
    3: t('assetRecord.statusCompleted'),
    4: t('assetRecord.statusFailed'),
}

// 在现有代码中添加格式化方法
const formatStatus = (status: number) => {
  return statusMap[status] || t('assetRecord.statusUnknown')
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
    min-height: calc(100vh - 5px);
    background-color: #f6f8fc;
    .orderBox {
      box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
      border-radius: 16px;
      padding: 14px 20px;
      .header {
        border-bottom: 2px solid var(--color-background-box);
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