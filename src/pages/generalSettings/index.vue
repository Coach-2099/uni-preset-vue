<template>
  <div class="generalSettings-index">
     <navigationBar title="通用设置"></navigationBar>
     <div class="reviseInfo mt-5 pl-20 pr-20 bg-white">
      <div class="pt-20 flex justify-between">
        <div class="">
          <text class="text-black fs-16">头像</text>
        </div>
        <div @click="goModifyUserInfo">
          <text v-if="!userInfo.userInfo" class="fs-12 text-gray mr-5">尚未上传</text>
          <image
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-20 flex justify-between">
        <div class="">
          <text class="text-black fs-16">昵称</text>
        </div>
        <div @click="goModifyUserInfo">
          <image
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-20 flex justify-between">
        <div class="">
          <text class="text-black fs-16">UID</text>
        </div>
        <div>
          <text class="fs-12 text-gray mr-5">{{ userInfo.uid }}</text>
          <image
            class="rightIcon"
            src="/static/svg/tools/copy.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
     </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import navigationBar from '@/components/navigationBar/index.vue'

const DEFAULT_USER_INFO = {
  username: '未登录用户',
  avatar: '/static/svg/home/user.svg',
  userId: 0
}

const userStore = useUserStore();
const userInfo = userStore.userInfo;

onMounted(() => {
  getUser()
})

const getUser = async () => {
  await userStore.getUser()
  userInfo.value = {
    username: userStore.userInfo.username || DEFAULT_USER_INFO.username,
    userId: userStore.userInfo.userId || DEFAULT_USER_INFO.userId,
    avatar: userStore.userInfo.avatar || DEFAULT_USER_INFO.avatar
  }
}

const goModifyUserInfo = () => {
  uni.navigateTo({ url: '/pages/modifyUserInfo/index' })
}

</script>

<style lang="scss" scoped>
.generalSettings-index {
  height: 100%;
  .reviseInfo {
    .rightIcon {
      width: 8px;
      height: 8px;
    }
  }
}
</style>