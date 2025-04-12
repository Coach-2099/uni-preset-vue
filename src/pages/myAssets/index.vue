<template>
  <div class="assets-index">
    <div style="height: var(--status-bar-height)"></div>
    <div class="header w-100 text-center text-black fs-22 pt-15 pb-15">{{$t('navBar.myAssets')}}</div>
    <div class="assetsInfo">
      <p class="fs-14 text-gray">{{ $t('homeIndex.totalAssets') }}</p>
      <p class="mt-5 flex items-baseline">
        <span class="fs-32 fw-b text-black mr-10">{{balance}}</span>
        <span class="fs-14 fw-b text-black">USDT</span>
        <image
          class="downArrow"
          src="/static/images/down.png"
          mode="scaleToFill"
        />
      </p>
      <div class="flex justify-between items-end">
        <!-- <p class="text-gray">
          <text>
            ≈ 0.00000000  BTC
          </text>
          <image
            class="grayImage"
            src="/static/images/exMarkGray.png"
            mode="scaleToFill"
          />
        </p> -->
        <p class="flex items-center">
          <image
            class="ProfitAndLossImg"
            src="/static/images/ProfitAndLoss.png"
            mode="scaleToFill"
          />
          <text class="text-gray fs-14">
            {{ $t('homeIndex.singleDay') }} 
            <text :class="plAmount > 0 ? 'text-light-green' : plAmount < 0 ? 'text-red' : ''">{{plAmount}}({{ formartRose(pl) }})</text>
          </text>
        </p>
      </div>
    </div>
    <div class="pb-10 ribbonBox">
      <div class="flex justify-between items-center px-5 py-5 ribbon">
        <div class="contentBox flex-col items-center justify-center" @click="goRecharge">
          <van-image class="MyVanImage" src="/static/svg/home/recharge.svg" />
          <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.recharge') }}</p>
        </div>
        <div class="contentBox flex-col items-center justify-center" @click="goTransfer">
          <van-image src="/static/svg/home/transfer.svg" />
          <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.transfer') }}</p>
        </div>
        <div class="contentBox flex-col items-center justify-center" @click="goWithdraw">
          <van-image src="/static/svg/home/withdraw.svg" />
          <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.withdraw') }}</p>
        </div>
        <div class="contentBox flex-col items-center justify-center" @click="goInvite">
          <van-image src="/static/svg/home/invite.svg" />
          <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.invite') }}</p>
        </div>
      </div>
    </div>
    <div class="mt-5 content bg-white">
      <van-tabs
        class="fw-b"
        title-active-color="#333333"
        title-inactive-color="#B0B0B0"
        v-model:active="active"
        shrink
        sticky
      >
        <van-tab title="WALLET" name="wallet">
          <div class="px-20">
            <assetsModule type="wallet" :data="basicAccountList"></assetsModule>
          </div>
        </van-tab>
        <van-tab title="SPOT" name="spot">
          <div class="px-20">
            <assetsModule type="spot" :data="spotAccountList"></assetsModule>
          </div>
        </van-tab>
        <van-tab title="FUTURES" name="futures">
          <div class="px-20">
            <assetsModule type="futures" :data="futuresAccount"></assetsModule>
          </div>
        </van-tab>
        <van-tab title="METALS" name="metals">
          <div class="px-20">
            <assetsModule type="metals" :data="metalsAccount"></assetsModule>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CustomNavBar from '@/components/customNavBar/index.vue'; // 使用大驼峰命名
import assetsModule from '@/components/business/assetsModule/index.vue'
import { getAsset } from '@/api/asset';
import { roundDown } from '@/utils/util';
import { onShow } from '@dcloudio/uni-app';
import { formartRose } from '@/utils/util'

const active = ref(0);
const balance = ref(0) //账户总余额
const pl = ref(0) //当日盈亏比例
const plAmount = ref(0) //当日盈亏金额
const basicAccountList = ref([]) //基础账户列表
const spotAccountList =ref([]) //现货
const futuresAccount =ref({}) //合约
const metalsAccount =ref({}) //贵金属

//查询余额
const getBalance = async()=>{
 const params = {
	 isLogin: true
 }
 const data = await  getAsset(params)
 balance.value = roundDown(data.total,2)
 pl.value = roundDown(data.todayPnl,2)
 plAmount.value = roundDown(data.todayPnlAmount,2)
 basicAccountList.value = data.basicAccountList
 spotAccountList.value = data.spotAccountList
 futuresAccount.value = data.futuresAccount
 metalsAccount.value = data.metalsAccount
}

onShow(()=>{
	getBalance()
})


const goRecharge = () => {
  uni.navigateTo({
    url: '/pages/recharge/index'
  })
}

const goTransfer = () => {
  uni.navigateTo({
    url: '/pages/transfer/index'
  })
}

const goWithdraw = () => {
  uni.navigateTo({
    url: '/pages/withdrawal/index'
  })
}

const goInvite = () => {
  uni.navigateTo({
    url: '/pages/InviteFriends/index',
  })
}

</script>

<style lang="scss" scoped>
.assets-index {
  background: #F6F8FC;  height: 100%;
  .assetsInfo {
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
    border-radius: 16px 16px 16px 16px;
    margin: 19px 19px 14px 19px;
    padding: 24px 14px 19px 15px;
    .downArrow {
      margin-left: 2px;
      width: 7px;
      height: 5px;
    }
    .grayImage {
      width: 11px;
      height: 11px;
    }
    .ProfitAndLossImg {
      width: 12px;
      height: 13px;
      margin-right: 7px;
    }
  }
  .ribbonBox {
    padding-left: 18px;
    padding-right: 18px;
    .ribbon {
      gap: 5px;
      // overflow-x: scroll;
      // // 隐藏滚动条新增样式
      // scrollbar-width: none; /* Firefox */
      // -ms-overflow-style: none; /* IE/Edge */
      // &::-webkit-scrollbar {
      //   display: none; /* Chrome/Safari/Webkit */
      //   width: 0;
      //   height: 0;
      // }

      .contentBox {
        width: 22%;
        aspect-ratio: 1/1;
        min-width: 65px;
        // min-height: 84px;
        padding: 10px;
        background: #FFFFFF;
        box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
        border-radius: 16px 16px 16px 16px;
        ::deep(.MyVanImage) {
          width: 50% !important; /* 图片宽度相对父容器 */
          height: auto !important;

        }
        // .MyVanImage {
        //   width: 50% !important; /* 图片宽度相对父容器 */
        //   height: auto !important;
        // }
      }
    }
  }
  :deep(.van-tabs) {
    .van-sticky {
      .van-tabs__wrap {
        border-bottom: 2px solid #f6f7fb !important;
      }
    }
  }
}
</style>