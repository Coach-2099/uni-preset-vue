<template>
  <div class="AssetRecord-index">
    <navigationBar :title="$t('navBar.assetRecord')"></navigationBar>
    <div class="mt-20 pl-">
      <van-tabs
        title-active-color="#333333"
        title-inactive-color="#B0B0B0"
        v-model:active="active"
        ref="tabsRefs"
        @click-tab="tabclick"
        shrink
      >
        <!-- 充值 -->
        <van-tab :title="$t('module.assetModule.deposit')">
          <assetList :data-list="dataList" type="Deposit" @refresh="refreshFun"></assetList>
        </van-tab>
        <!-- 提现 -->
        <van-tab :title="$t('module.assetModule.withdraw')">
          <assetList :data-list="dataList" type="Withdraw" @refresh="refreshFun"></assetList>
        </van-tab>
        <!-- 转账 -->
        <van-tab :title="$t('module.assetModule.transfer')">
          <assetList :data-list="dataList" type="Transfer" @refresh="refreshFun"></assetList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import assetList from '@/components/business/assetList/index.vue'
import { getRechargeList, getWithdrawList, getTrasferList } from '@/api/asset'
import { onLoad } from '@dcloudio/uni-app';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const active = ref(0);
const dataList = ref([]);
const pages = ref({
  current:1,
  size:10
})

const tabsRefs: any = ref(null);

const refreshFun = () => {
  loadData()
}

onLoad((options: any) => {
  console.log('options!!!', options)
  if(options.type === 'Deposit'){
	  active.value = 0
  }else if(options.type === 'Withdraw'){
	  active.value = 1
  }else{
	  active.value = 2
  }
  loadData()
})

/**
 * 加载数据
 * @param type 类型 1:充值 2:提现 3:转账
 */
const loadData = async () => {
  const params = {
    ...pages,
    // symbol: 'USDT'
  }
  let loadFun:any = null
  switch (active.value) {
    case 0:
      loadFun = getRechargeList
      break
    case 1:
      loadFun = getWithdrawList
      break
    case 2:
      loadFun = getTrasferList
      break
    default:
    loadFun = getRechargeList
      break
  }
  const data = await loadFun(params)
  dataList.value = [...data.records]
  console.log('dataList', dataList.value)
}



const tabclick = (e:any) => {
  dataList.value =[]
  tabsRefs.value?.resize()
  loadData()
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
.AssetRecord-index {
  
}
</style>