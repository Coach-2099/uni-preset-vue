<template>
  <div class="quotes-index">
    <div class="mt-15">
      <van-search v-model="value" placeholder="BTC/USDT" shape="round" @click="goSearchMore" />
    </div>
    <div class="quotesList">
      <van-tabs v-model:active="active" sticky shrink>
        <van-tab title="现货">
          <quoteList type="hot"></quoteList>
          <!-- <div class="mt-10 ml-15 mr-15 flex justify-between">
            <div class="flex-1 flex text-gray fs-12">
              <div class="sortTemp flex justify-between items-center">
                <text>交易对</text>
                <image
                  class="sortImg"
                  src="/static/images/sort.png"
                  mode="scaleToFill"
                />
              </div>
              <text class="divLine">/</text>
              <div class="sortTemp flex justify-between items-center">
                <text>交易量</text>
                <image
                  class="sortImg"
                  src="/static/images/sort.png"
                  mode="scaleToFill"
                />
              </div>
            </div>
            <div class="flex-1 flex justify-end text-gray fs-12">
              <div class="sortTemp flex-1 flex justify-cneter items-center text-right mr-20 ">
                <text>Last Price</text>
                <image
                  class="sortImg"
                  src="/static/images/sort.png"
                  mode="scaleToFill"
                />
              </div>
              <div class="sortTemp flex justify-cneter items-center text-right">
                <text>24H Change</text> 
                <image
                  class="sortImg"
                  src="/static/images/sort.png"
                  mode="scaleToFill"
                />
              </div>
            </div>
          </div>
          <div v-for="(item, index) in 20" :key="index">
            <div class="mt-5 ml-15 mr-15 pb-5 flex ff-biance fw-b justify-between items-center">
              <div class="flex-1">
                <text class="fs-16">BTC</text>
                <text class="fs-12 text-gray">/ USDT</text>
                <div>
                  <text class="fs-12 text-gray">3.21B USDT</text>
                </div>
              </div>
              <div class="flex-1 flex justify-end items-center">
                <div class="flex-1 text-right items-center mr-20">95792.20</div>
                <van-button class="flex-1 text-right rises_falls_btn" style="width: 22.4vw;" type="success" size="small">
                  <text class="fs-14">+0.22%</text>
                </van-button>
              </div>
            </div>
          </div> -->
        </van-tab>
        <van-tab title="合约">合约</van-tab>
        <van-tab title="黄金">黄金</van-tab>
      </van-tabs>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomNavBar from '@/components/customNavBar/index.vue'; // 使用大驼峰命名
import quoteList from '@/components/business/quoteList/index.vue'; // 使用大驼峰命名

const value = ref('')
const active = ref(0)
const loading = ref(false)

const listData = ref([]); // 从API获取的真实数据
const sortField = ref('symbol');
const sortDirection = ref('asc');

const goSearchMore = () => {
  uni.navigateTo({
    url: '/pages/searchMore/index'
  })
}

</script>

<style lang="scss" scoped>
.quotes-index {
  height: 100%;
  .quotesList {
    padding-bottom: 90px;
    .sortImg {
      width: 7px;
      height: 7px;
      margin-left: 3px;
    }
    .divLine {
      margin-left: 3px;
      margin-right: 3px ;
    }
  }
}
</style>