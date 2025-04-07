<template>
  <basePullRefresh
    v-model="isLoading" 
    :head-height="100"
    @refresh="handleRefresh"
  >
    <template #content>
      <div class="assetList mt-15">
        <div 
          v-for="(item, index) in dataList" 
          :key="index" 
          class=""
          @click="goAssetDetail(item)"
        >
          <div v-if="type='Deposit'" class="assetSingle mt-15 flex justify-between items-center">
            <div>
              <p class="fs-16 text-black">{{ item.symbol }}</p>
              <p class="fs--12 text-gray">{{ formatISODate(item.createTime) }}</p>
            </div>
            <div class="flex justify-between items-center">
              <div class="mr-10">
                <p class="fs-16 text-black text-right">{{ item.rechargeAmount }}</p>
                <div class="flex items-center">
                  <div class="dot mr-5"></div>
                  <p class="fs-12 text-gray">Succeeded</p>
                </div>
              </div>
              <div class="rightIcon"></div>
            </div>
          </div>
          <div v-else-if="type='Withdraw'" class="assetSingle mt-15 flex justify-between items-center">
            <div>
              <p class="fs-16 text-black">{{ item.symbol }}</p>
              <p class="fs--12 text-gray">{{ formatISODate(item.createTime) }}</p>
            </div>
            <div class="flex justify-between items-center">
              <div class="mr-10">
                <p class="fs-16 text-black text-right">{{ item.arrivalAmoumt }}</p>
                <div class="flex items-center">
                  <div class="dot mr-5"></div>
                  <p class="fs-12 text-gray">{{ formatStatus(item.status) }}</p>
                </div>
              </div>
              <div class="rightIcon"></div>
            </div>
          </div>
          <div v-else-if="type='Transfer'" class="assetSingle mt-15 flex justify-between items-center">
            <div>
              <p class="fs-16 text-black">{{ item.symbol }}</p>
              <p class="fs--12 text-gray">{{ formatISODate(item.createTime) }}</p>
            </div>
            <div class="flex justify-between items-center">
              <div class="mr-10">
                <p class="fs-16 text-black text-right">{{ item.arrivalAmoumt }}</p>
                <div class="flex items-center">
                  <div class="dot mr-5"></div>
                  <p class="fs-12 text-gray">{{ formatStatus(item.status) }}</p>
                </div>
              </div>
              <div class="rightIcon"></div>
            </div>
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

// 在现有代码中添加格式化方法
const formatStatus = (status: number) => {
  const statusMap: { [key: number]: string } = {
    0: '待审核',
    1: '已审核',
    2: '区块链已扫描提现信息',
    3: '转账中',
    4: '提现审核未通过转账失败',
    5: '转账成功',
    6: '预出金资金冻结失败',
    7: '提交提币申请'
  }
  return statusMap[status] || '未知状态'
}

const isLoading = ref(false)
const pages = {
  current: 1,
  size: 10
}

const emit = defineEmits(['refresh'])

onShow(()=> {
  console.log('props11', props.type)
})

const handleRefresh = (finish: any) => {
  emit('refresh')
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const goAssetDetail = (item: any) => {
  console.log('item', item)
  console.log('xxxxx', encodeURIComponent(JSON.stringify(item)))
  uni.navigateTo({
    // url: '/pages/assetDetail/index?type=' + props.type + '&' + encodeURIComponent(JSON.stringify(item))
    url: `/pages/assetDetail/index?type=${props.type}&item=${encodeURIComponent(JSON.stringify(item))}`
  })
};

</script>

<style lang="scss" scoped>
.assetList {
  .assetSingle {
    padding-left: 18px;
    padding-right: 18px;
  }

  .dot {
    width: 3px;
    height: 3px;
    background: #00B200;
  }

  .rightIcon {
    position: relative;
    width: 5px;
    height: 10px;
    cursor: pointer;
  }
  .rightIcon:before {
    content: "";
    width: 6px;
    height: 6px;
    border: solid #333;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -50%) rotate(-45deg);
    position: absolute;
    left: 50%;
    top: 70%;
  }
}
</style>