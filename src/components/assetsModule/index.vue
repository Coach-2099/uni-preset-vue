<template>
  <div class="assetsModule-temp mt-15">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <van-checkbox v-model="checked" shape="square">
          <template #icon="props">
            <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
          </template>
          <text
            class="fs-14"
            :class="checked ? 'text-black' : 'text-gray'"
          >Hide zero balances</text>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import square  from '@/static/images/square.png'
import checkSquare from '@/static/images/checkSquare.png'
import searchIcon from '@/static/images/search.png'

const checked = ref(false)
const searchValue = ref('')

const activeIcon = ref(checkSquare)
const inactiveIcon = ref(square)

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
}
</style>