<template>
  <div class="securitySettings-index">
    <navigationBar title="安全设置"></navigationBar>
    <div class="safetyLevel bg-white pl-20 pr-20 pb-20">
      <p class="text-black fs-16">账户活动</p>
      <p class="text-gray fs-12 pt-20">上次登录时间：{{ formatISODate(lastLoginTime) }}</p>
      <!-- <p class="text-gray fs-12 pt-10">登录设备：ios</p> -->
      <p class="text-balck fs-16 pt-25">安全级别 
        <span v-if="userInfo.securityLevel == 1 || userInfo.securityLevel == 0" class="text-red">低</span>
        <span v-if="userInfo.securityLevel == 2" class="text-orange">中</span>
        <span v-if="userInfo.securityLevel == 3" class="text-green">高</span>
      </p>
      <div>
        <van-progress v-if="userInfo.securityLevel == 1  || userInfo.securityLevel == 0" color="#ee0a24" :percentage="40" :show-pivot="false" />
        <van-progress v-else-if="userInfo.securityLevel == 2" color="#FFA500" :percentage="60" :show-pivot="false" />
        <van-progress v-else-if="userInfo.securityLevel == 3" color="#00B200" :percentage="100" :show-pivot="false" />
      </div>
      <div class="unsafeLevelBox mt-15 fs-12 text-gray">
        <div>
          账户安全等级
          <text v-if="userInfo.securityLevel == 1 || userInfo.securityLevel == 0">低，请至少开启<span class="text-red">1</span>项安全验证。</text>
          <text v-else-if="userInfo.securityLevel == 2">中</text>
          <text v-else-if="userInfo.securityLevel == 3">高</text>
        </div>
        <div
         v-if="userInfo.securityLevel !== 3"
         class="iconTip">
          <image
            class="mt-15"
            src="/static/svg/tools/ex_mark.svg"
            mode="scaleToFill"
          />
          手机安全验证
        </div>
      </div>
    </div>
    <div class="reviseInfo mt-5 pl-20 pr-20 bg-white">
      <div class="pt-20 flex justify-between" @click="goModifyPwd">
        <div class="">
          <text class="text-black fs-16">修改登录密码</text>
        </div>
        <div>
          <!-- <text class="fs-12 text-gray mr-5">尚未认证</text> -->
          <image
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-25 flex justify-between" @click="gomodifyEmail">
        <div class="">
          <text class="text-black fs-16">邮箱</text>
        </div>
        <div>
          <text class="fs-12 text-gray mr-5">{{ userInfo.email }}</text>
          <image
            v-if="!userInfo.email"
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-25 flex justify-between" @click="gomodifyPhone">
        <div class="">
          <text class="text-black fs-16">手机号</text>
        </div>
        <div>
          <text class="fs-12 text-gray mr-5">{{ userInfo.phone }}</text>
          <image
            v-if="!userInfo.phone"
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="pt-25 flex justify-between" @click="goModifyFundPassword">
        <div class="">
          <text class="text-black fs-16">资金密码</text>
        </div>
        <div>
          <text v-if="userInfo.hasTradePwd == 0" class="fs-12 text-gray mr-5">未设置</text>
          <image
            class="rightIcon"
            src="/static/svg/tools/right.svg"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import navigationBar from '@/components/navigationBar/index.vue'
import { useUserStore } from '@/stores/user';
import { formatISODate } from '@/utils/util'

const userStore = useUserStore();
const lastLoginTime = ref('');
const DEFAULT_USER_INFO = {
  securityLevel: 3,
  hasTradePwd: 0
}

const userInfo = computed(() => {
  return userStore.userInfo || DEFAULT_USER_INFO;
});

onMounted(() => {
  lastLoginTime.value = userInfo.value.lastLoginTime || new Date().getTime(); // 假设 lastLoginTime 是从 store 中获取的
})

const goModifyPwd = () => {
  uni.navigateTo({
    url: '/pages/modifyPwd/index'
  })
}

const goModifyFundPassword = () => {
  uni.navigateTo({
    url: '/pages/modifyFundPassword/index'
  })
}

const gomodifyEmail = () => {
  if (!userInfo.value.email) {
    uni.navigateTo({
      url: '/pages/modifyEmail/index'
    })
  }
}

const gomodifyPhone = () => {
  // if (!userInfo.value.phone) {
    uni.navigateTo({
      url: '/pages/modifyPhone/index'
    })
  // }
}

const goUser = () => {
  uni.navigateBack({
    delta: 1
  })
}


</script>

<style lang="scss" scoped>
.securitySettings-index {
  height: 100%;
  background: #F6F7FB;
  .headerTemp {
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    .back-arrow {
      image {
        width: 16px;
        height: 14px;
      }
    }
    .home_right_icon {
      width: 22px;
      height: 22px;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .safetyLevel {
    padding-top: 30px;
  }
  .reviseInfo {
    .rightIcon {
      width: 8px;
      height: 8px;
    }
  }
  .unsafeLevelBox {
    width: 100%;
    min-height: 71px;
    padding: 14px 11px;
    background: #F6F7FB;
    border-radius: 5px 5px 5px 5px;
    .iconTip {
      image {
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>