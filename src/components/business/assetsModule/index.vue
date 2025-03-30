<template>
  <div class="assetsModule-temp mt-15">
    <div v-if="false">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <van-checkbox v-model="checked" shape="square">
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
            </template>
            <text
              class="fs-14"
              :class="checked ? 'text-black' : 'text-gray'"
            >{{ $t('module.assetsModule.hideZeroBalances')}}</text>
          </van-checkbox>
        </div>
        <div class="searchBox">
          <van-search
            v-model="searchValue"
            shape="round"
            placeholder="Search"
            :left-icon="searchIcon"
            :clearable="false"
          />
        </div>
      </div>
      <div
        v-for="index in 16" :key="index" 
        class="flex items-center justify-between mt-15"
        @click="goDetail"
      >
        <div class="flex items-center">
          <image
            class="currencyImg"
            src="/static/images/OIP-C.jpg"
            mode="scaleToFill"
          />
          <div class="ml-10">
            <p class="fs-16 fw-b text-black">BTC</p>
            <p class="fs-12 text-gray">bitcion</p>
          </div>
        </div>
        <div class="text-right">
          <p class="fs-16 fw-b text-black">0.00093000</p>
          <p class="fs-12 text-gray">≈0.00 USD</p>
        </div>
      </div>
    </div>
    <div v-else class="defaultTemp">
      <dataDefault></dataDefault>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import square  from '@/static/images/square.png'
import checkSquare from '@/static/images/checkSquare.png'
import searchIcon from '@/static/images/search.png'
import { getAsset } from '@/api/asset';
import dataDefault from '@/components/dataDefault/index.vue'

const checked = ref(false)
const searchValue = ref('')

const activeIcon = ref(checkSquare)
const inactiveIcon = ref(square)

const props = defineProps({
  type: {
    type: String,
    default: 'hot'
  },
});

// 自动响应 type 变化
watch(() => props.type, () => {
  loadData()
})

const loadData = async () => {
  const data = await getAsset({})
  const basicAccountList = data.basicAccountList
  const spotAccountList = data.spotAccountList
  const futuresAccount = data.futuresAccount
  const metalsAccount = data.metalsAccount
}

const goDetail = () => {
  uni.navigateTo({
    url: '/pages/currencyDetails/index'
  })

}

</script>

<style lang="scss" scoped>
.assetsModule-temp {
  padding-bottom: 120px;
  .img-icon {
    width: 18px;
    height: 18px;
  }
  .currencyImg {
    width: 21px;
    height: 21px;
  }
  .searchBox {
    width: 35vw;
  }
  :deep(.van-search) {
    padding-right: 0px !important;
  }
  .defaultTemp {
    margin-top: 90px;
    padding-bottom: 120px;
  }
}
</style>