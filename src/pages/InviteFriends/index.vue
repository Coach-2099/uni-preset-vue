<template>
  <div class="InviteFriends-index">
    <navigationBar :title="$t('navBar.inviteFriends')"></navigationBar>
    <div class="content">
      <div class="bannerBox">
        <van-swipe class="my-swipe bg-light-gray text-cneter" :autoplay="3000" >
          <van-swipe-item v-for="(item,index) in bannerList" :key="index">
			  <image :src="item.url" mode="scaleToFill"></image>
		  </van-swipe-item>
        </van-swipe>
      </div>
      <div class="mt-25">
        <p class="text-center fs-24 text-black">{{ $t('inviteFriends.getReward') }}</p>
        <p class="text-center fs-16 text-gray">
          {{ $t('inviteFriends.inviteDescription') }}
        </p>
      </div>
      <div class="copyTemp flex justify-between items-center">
        <p class="inviteStr w-75 fs-16 text-gray">{{ inviteUrl }}</p>
        <van-button class="copyBtn ml-10" type="primary" @click="copyText(inviteUrl)">{{ $t('noun.copy') }}</van-button>
      </div>
      <div class="qrCodeTemp">
        <qrcode-vue :value="inviteUrl" size="130" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue'
import { useUserStore } from '@/stores/user';
import { getBanner } from '@/api/common';
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userStore = useUserStore();
const inviteUrl = ref(window.location.protocol+'//'+document.domain+'/#/pages/register/index?inviteCode='+userStore.userInfo.inviteCode);
const copyText = () => {
  uni.setClipboardData({
    data: inviteUrl.value,
    success: () => {
      uni.showToast({
        title: t('tips.copySuccess'),
        icon: 'success',
        duration: 3000
      })
    }
  })
}

const bannerList = ref([])
onMounted(()=>{
	banners()
})

const banners = async()=>{
	const params={
		clientType:'INVITE',
		size:10,
		current:1
	}
	const data = await getBanner(params)
	bannerList.value = data.records
}
</script>

<style lang="scss" scoped>
.InviteFriends-index {
  height: 100vh;
  background: var(--color-background);
  .content {
    padding: 0 18px;
    .bannerBox {
      .my-swipe {
        border-radius: 18px 18px 18px 18px;
        height: 230px;
		// width: 100%;
		image {
			width: 100%;
			height: 100%;
		}
      }
    }
    .copyTemp {
      margin-top: 28px;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #B0B0B0;
      padding: 11px 23px;
      .inviteStr {
        // 新增换行样式
        white-space: pre-wrap;
        word-break: break-all;
      }
      .copyBtn {
        background: var(--color-light-primary);
        border-radius: 8px 8px 8px 8px;
      }
    }
    .qrCodeTemp {
      top: 25px;
      left: 0;
      right: 0;
      margin: auto;
      width: 175px;
      margin-top: 28px;
      border-radius: 8px;
      border: 1px solid #B0B0B0;
      padding: 11px 23px;
    }
  }
}
</style>