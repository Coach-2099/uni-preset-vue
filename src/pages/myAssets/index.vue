<template>
  <div class="assets-index">
    <div style="height: var(--status-bar-height)"></div>
    <van-config-provider :theme="themeVal">
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
            <!-- <image
              src="~@/static/svg/home/recharge.svg"
              mode="widthFix"
              class="MyVanImage"
            /> -->
            <svg class="MyVanImage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" style="width: 28px; height: 28px; color: var(--color-primary);">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h32.223v26H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(1.825 5)">
                <path style="fill:var(--color-text)" d="M25.631 10.147a.855.855 0 0 1 .854.854V22.88a.855.855 0 0 1-.854.854H5.598a.855.855 0 0 1-.854-.854V11.001a.855.855 0 0 1 .854-.854Zm0-2.265H5.598a3.119 3.119 0 0 0-3.119 3.119V22.88A3.119 3.119 0 0 0 5.598 26h20.033a3.119 3.119 0 0 0 3.119-3.12V11.001a3.119 3.119 0 0 0-3.119-3.121"/>
                <path style="fill:var(--color-text)" d="M2.213 17.689.119 9.167a4.059 4.059 0 0 1 2.975-4.912L19.932.119a4.061 4.061 0 0 1 4.912 2.974l1.4 5.687-2.2.54-1.4-5.687a1.8 1.8 0 0 0-2.172-1.316L3.634 6.454a1.8 1.8 0 0 0-1.315 2.172l2.093 8.523Z"/>
                <path style="fill:var(--color-light-primary)" d="M31.091 18.074H18.967a1.133 1.133 0 0 1 0-2.265h12.124a1.133 1.133 0 1 1 0 2.265"/>
                <path style="fill:var(--color-light-primary)" d="M22.09 21.716a1.13 1.13 0 0 1-.8-.332l-3.092-3.093a1.911 1.911 0 0 1 0-2.7l3.094-3.094a1.133 1.133 0 1 1 1.6 1.6l-2.844 2.844 2.843 2.842a1.132 1.132 0 0 1-.8 1.933"/>
              </g>
            </svg>
            <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.recharge') }}</p>
          </div>
          <div class="contentBox flex-col items-center justify-center" @click="goTransfer">
            <!-- <image
              src="~@/static/svg/home/transfer.svg"
              mode="widthFix"
              class="MyVanImage"
            /> -->
            <svg class="MyVanImage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" style="width: 28px; height: 28px; color: var(--color-primary);">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h26v22.013H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(5 6.994)">
                <path style="fill:var(--color-text)" d="M24.737 9.007H1.085a1.085 1.085 0 0 1 0-2.17h21.459l-4.983-4.984A1.086 1.086 0 0 1 19.099.318l6.53 6.534a1.262 1.262 0 0 1-.892 2.155"/>
                <path d="M7.672 38.969a1.083 1.083 0 0 1-.767-.318L.37 32.117a1.262 1.262 0 0 1 .892-2.155h23.652a1.085 1.085 0 1 1 0 2.17H3.455l4.984 4.983a1.085 1.085 0 0 1-.767 1.853" style="fill:var(--color-light-primary)" transform="translate(0 -16.956)"/>
              </g>
              <path d="M0 0h36v36H0z" style="fill:none"/>
            </svg>
            <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.transfer') }}</p>
          </div>
          <div class="contentBox flex-col items-center justify-center" @click="goWithdraw">
            <!-- <image
              src="~@/static/svg/home/withdraw.svg"
              mode="widthFix"
              class="MyVanImage"
            /> -->
            <svg class="MyVanImage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h26v26.239H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(4.881 4.7)">
                <path style="fill:var(--color-text)" d="M21.356 26.24H4.644A4.65 4.65 0 0 1 0 21.591V15.62a1.087 1.087 0 0 1 2.173 0v5.971a2.474 2.474 0 0 0 2.471 2.472h16.712a2.474 2.474 0 0 0 2.472-2.472V15.62a1.087 1.087 0 1 1 2.173 0v5.971a4.65 4.65 0 0 1-4.644 4.645"/>
                <path style="fill:var(--color-light-primary)" d="M12.999 18.953a1.086 1.086 0 0 1-1.086-1.09V1.653a1.087 1.087 0 0 1 2.173 0v16.21a1.086 1.086 0 0 1-1.087 1.09"/>
                <path style="fill:var(--color-light-primary)" d="M19.844 8.411a1.084 1.084 0 0 1-.768-.318l-5.812-5.812a.373.373 0 0 0-.527 0L6.925 8.093a1.087 1.087 0 0 1-1.537-1.537L11.204.745a2.547 2.547 0 0 1 3.6 0l5.812 5.812a1.086 1.086 0 0 1-.768 1.855"/>
              </g>
              <path d="M0 0h36v36H0z" style="fill:none"/>
            </svg>
            <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.withdraw') }}</p>
          </div>
          <div class="contentBox flex-col items-center justify-center" @click="goInvite">
            <!-- <image
              src="~@/static/svg/home/invite.svg"
              mode="widthFix"
              class="MyVanImage"
            /> -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" style="width: 2rem; height: 2rem; color: var(--color-primary);">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h29.32v26H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="clip-path:url(#a)" transform="translate(4 4.999)">
                <path style="fill:var(--color-light-primary)" d="M28.212 22.673h-6.654a1.107 1.107 0 0 1 0-2.215h6.654a1.107 1.107 0 1 1 0 2.215"/>
                <path style="fill:var(--color-light-primary)" d="M24.886 26a1.107 1.107 0 0 1-1.107-1.107v-6.655a1.107 1.107 0 1 1 2.215 0v6.654a1.107 1.107 0 0 1-1.107 1.107"/>
                <path style="fill:var(--color-text)" d="M13.953 2.215A2.988 2.988 0 1 1 10.964 5.2a2.992 2.992 0 0 1 2.989-2.989m0-2.215a5.2 5.2 0 1 0 5.2 5.2 5.2 5.2 0 0 0-5.2-5.2"/>
                <path style="fill:var(--color-text)" d="M1.107 25.564A1.107 1.107 0 0 1 0 24.456a13.954 13.954 0 0 1 24.787-8.793 1.108 1.108 0 0 1-1.719 1.4 11.739 11.739 0 0 0-20.853 7.4 1.107 1.107 0 0 1-1.107 1.107"/>
                <path style="fill:var(--color-text)" d="M16.062 22.231a3.042 3.042 0 0 1-2.993 2.37l-.224 1.163h-1.072l.239-1.241a2.817 2.817 0 0 1-2.108-1.819l1.135-.784a2.282 2.282 0 0 0 1.258 1.152l.573-2.937a2.386 2.386 0 0 1-1.469-2.653 2.821 2.821 0 0 1 2.4-2.108l.189-.974h1.065l-.189.968a2.247 2.247 0 0 1 1.875 1.6l-1.146.774a1.365 1.365 0 0 0-1-.979l-.489 2.509.167.095c1.262.739 2.052 1.6 1.791 2.864m-2.9-3.565.35-1.808a1.3 1.3 0 0 0-.718.907.908.908 0 0 0 .367.9m.662 2.058-.48 2.437a1.426 1.426 0 0 0 1.285-1.018c.117-.59-.306-1.057-.812-1.418"/>
              </g>
              <path d="M0 0h36v36H0z" style="fill:none"/>
            </svg>
            <p class="mt-5 text-by-black fs-12 fw-b">{{ $t('noun.invite') }}</p>
          </div>
        </div>
      </div>
      <div class="mt-5 content bg-white">
        <van-tabs
          class="fw-b"
          background="var(--color-background-1)"
          title-active-color="var(--color-tab-text)"
          title-inactive-color="#B0B0B0"
          v-model:active="active"
          shrink
          sticky
        >
          <van-tab :title="$t('transfer.accounts.wallet')" name="wallet">
            <div class="px-20">
              <assetsModule type="wallet" :data="basicAccountList"></assetsModule>
            </div>
          </van-tab>
          <van-tab :title="$t('navBar.trade')" name="spot">
            <div class="px-20">
              <assetsModule type="spot" :data="spotAccountList"></assetsModule>
            </div>
          </van-tab>
          <van-tab :title="$t('navBar.contract')" name="futures">
            <div class="px-20">
              <assetsModule type="futures" :data="futuresAccount"></assetsModule>
            </div>
          </van-tab>
          <van-tab :title="$t('navBar.metals')" name="metals">
            <div class="px-20">
              <assetsModule type="metals" :data="metalsAccount"></assetsModule>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-config-provider>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CustomNavBar from '@/components/customNavBar/index.vue'; // 使用大驼峰命名
import assetsModule from '@/components/business/assetsModule/index.vue'
import { getAsset } from '@/api/asset';
import { roundDown } from '@/utils/util';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { formartRose } from '@/utils/util'

const active = ref(0);
const balance = ref(0) //账户总余额
const pl = ref(0) //当日盈亏比例
const plAmount = ref(0) //当日盈亏金额
const basicAccountList = ref([]) //基础账户列表
const spotAccountList =ref([]) //现货
const futuresAccount =ref({}) //合约
const metalsAccount =ref({}) //贵金属
const themeVal = uni.getStorageSync('APP_THEME') || 'light'

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

onLoad(() => {
  uni.hideTabBar()
})

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
.assets-index {
  background: var(--color-background-2);
  height: 100%;
  .assetsInfo {
    background: var(--color-background-box);
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
        // background: #FFFFFF;
        background: var(--color-background-box);
        box-shadow: 0px 0px 6px 1px rgba(0,8,242,0.08);
        border-radius: 16px 16px 16px 16px;
        .MyVanImage {
          // width: 50% !important; /* 图片宽度相对父容器 */
          // height: auto !important;
          width: 2rem;
          height: 2rem;
        }
      }
    }
  }
  :deep(.van-tabs) {
    .van-sticky {
      .van-tabs__wrap {
        border-bottom: 2px solid var(--color-background-box) !important;
      }
    }
  }
}
</style>