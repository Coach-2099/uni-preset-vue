<template>
  <div class="certification-index bg-light ">
    <navigationBar :customHandler="goBack" :title="$t('navigationBarTitle.certification')"></navigationBar>
    <van-config-provider :theme="themeVal">
      <div class="mt-10">
        <van-cell-group inset>
          <van-cell :title="$t('userInfo.username')" :value="userInfo.username" />
          <van-cell :title="$t('common.email')" :value="userInfo.email" />
          <van-cell :title="$t('common.phone')" :value="userInfo.phone" />
          <van-cell :title="$t('identityAuth.labels.name')" :value="userInfo.name" />
          <van-cell :title="$t('identityAuth.labels.identityType')" :value="typeFormat(userInfo.documentType)" />
        </van-cell-group>
        <div class="imgBox w-100 px-15 flex justify-between">
          <div v-if="userInfo.idcardImgZm" class="pos-relative relativeBox">
            <div class="myPreview bg-white items-center pos-absolute">
              <image
                class="myPreviewImg"
                :src="userInfo.idcardImgZm"
                mode="scaleToFill"
              />
            </div>
          </div>
          <div v-if="userInfo.idcardImgFm" class="pos-relative relativeBox">
            <div class="myPreview bg-white items-center pos-absolute">
              <image
                class="myPreviewImg"
                :src="userInfo.idcardImgFm"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>
      </div>
    </van-config-provider>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { useUserStore } from '@/stores/user';
import { onLoad } from '@dcloudio/uni-app';

const themeVal = uni.getStorageSync('APP_THEME') || 'light'

const userStore = useUserStore();
const userInfo = userStore.userInfo;
const documentTypeMap:any = {
  IDCARD: '身份证',
  PASSPORT: '护照',
  DRVING_LICENSE: '驾照'
}

onLoad(() => {
  getUser()
})

const getUser = async () => {
  await userStore.getUser()
  userInfo.value = {
    username: userStore.userInfo.username,
    phone: userStore.userInfo.phone,
    email: userStore.userInfo.email,
    avatar: userStore.userInfo.avatar,
	  isValid: userStore.userInfo.isValid
  }
}

const goBack = () => {  
  // 从提现过来的则直接前往首页
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  console.log('prevPage', prevPage)
  if (prevPage.route === 'pages/withdrawal/index') {
    uni.switchTab({
      url: '/pages/home/index',
    });
  } else {
    uni.navigateBack();
  }
}

const typeFormat = (type: string) => {
  return documentTypeMap[type] || type;
}

</script>
<style lang="scss" scoped>
.certification-index {
  height: 100vh;
  background: var(--color-background);
  .imgBox {
    margin-top: 35px;
    .relativeBox {
      height: 9.22rem;
      width: 9.77rem;
      .myPreview {
        height: 9.22rem;
        width: 9.77rem;
        border: 1px dashed #237eff;
        pointer-events: none;
        top: 0;
        left: 0;
        .myPreviewImg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>