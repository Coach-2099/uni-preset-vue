<template>
  <div class="InviteFriends-index">
    <navigationBar title="邀请好友"></navigationBar>
    <div class="content">
      <div class="bannerBox">
        <van-swipe class="my-swipe bg-light-gray text-cneter" :autoplay="3000" >
          <van-swipe-item>1</van-swipe-item>
          <van-swipe-item>2</van-swipe-item>
          <van-swipe-item>3</van-swipe-item>
          <van-swipe-item>4</van-swipe-item>
        </van-swipe>
      </div>
      <div class="mt-25">
        <p class="text-center fs-24 text-black">Get $10 in Bitcoin</p>
        <p class="text-center fs-16 text-gray">
          You'll both get $10 in free Bitcoin when
          your friend buys or sells $100 of crypto
        </p>
      </div>
	  <div class="copyTemp flex justify-between items-center">
	    <qrcode-vue :value="inviteUrl" size="130" />
	  </div>
	  <div class="copyTemp flex justify-between items-center">
	    <p class="fs-16 text-gray">{{ inviteUrl }}</p>
	    <van-button class="copyBtn" type="primary" @click="copyText(inviteUrl)">Copy</van-button>
	  </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import { useUserStore } from '@/stores/user';
import QrcodeVue from 'qrcode.vue'
const userStore = useUserStore();
const inviteUrl = ref(window.location.protocol+'//'+document.domain+'/#/pages/register/index?inviteCode='+userStore.userInfo.inviteCode);
const copyText = () => {
  uni.setClipboardData({
    data: inviteUrl.value,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none'
      })
    }
  })
}

</script>

<style lang="scss" scoped>
.InviteFriends-index {
  .content {
    padding: 0 18px;
    .bannerBox {
      .my-swipe {
        border-radius: 18px 18px 18px 18px;
        height: 230px;
      }
    }
    .copyTemp {
      margin-top: 28px;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #B0B0B0;
      padding: 11px 23px;
      .copyBtn {
        background: #1777FF;
        border-radius: 8px 8px 8px 8px;
      }
    }
  }
}
</style>