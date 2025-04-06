<template>
  <div class="userInfo-index">
    <navigationBar title="">
      <template #right>
        <div class="flex justify-between">
          <div class="flex items-center home_right_icon mr-15" @click="goCustomerService">
            <image
              src="/static/svg/home/c_service.svg"
              mode="scaleToFill"
            />
          </div>
          <div @click="goGeneralSetting" class="flex items-center home_right_icon">
            <image
              src="/static/svg/tools/setting.svg"
              mode="scaleToFill"
            />
          </div>
        </div>
      </template>
    </navigationBar>
    <div class="userHeader">
      <div class="flex pl-20 pr-20 pt-10 bg-white items-center justify-start">
        <div class="headerImg">
          <van-image
            round 
            width="52px" 
            height="52px" 
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" 
          />
        </div>
        <div class="ml-10">
          <p class="fs-20 fw-b text-balck">{{ userInfo.username }}</p>
          <div class="fs-12 flex mt-10 text-gray">
            <text>UID:{{ userInfo.uid }}</text>
            <div class="ml-5"><van-image src="/static/svg/tools/copy.svg" /></div>
          </div>
        </div>
      </div>
      <div class="tabInfo pl-20 pr-20 pb-20 pt-15 bg-white">
        <div class="flex items-center">
          <!-- @click="clickTab(0)" -->
          <div class="text-black fw-b fs-12 tabBox mr-15 text-center pos-relative">
            <div>{{ $t('userInfo.ordinaryUsers') }}</div>
            <!-- <div v-if="tabVal == 0" class="triangle-up-border pos-absolute"></div> -->
          </div>
          <div @click="clickTab(1)" class="text-black fw-b fs-12 tabBox mr-15 text-center pos-relative">
            <div class="certification">
              <image v-if="userInfo.isValid !== 2" class="mr-5" src="/static/svg/tools/ex_mark.svg" />
              <image v-else-if="userInfo.isValid === 2" class="mr-5" src="/static/images/success.png" mode="scaleToFill" />
              <text v-if="userInfo.isValid === 0">{{ $t('userInfo.IdNotCompleted') }}</text>
              <text v-else-if="userInfo.isValid === 1">{{ $t('userInfo.IdentityDuthentication') }}</text>
              <text v-else-if="userInfo.isValid === 2">{{ $t('userInfo.IdentityDuthenticationSuccess') }}</text>
            </div> 
            <div v-if="tabVal == 1" class="triangle-up-border pos-absolute"></div>
          </div>
        </div>
        <div v-if="userInfo.isValid !== 2" class="infoBox mt-10 px-10 pt-25">
          <div class="text-black fs-14">{{ $t('userInfo.completeIDforTransactions') }}</div>
          <div class="CertificationBox mt-5">
            <van-button @click="goIdentityAuth" v-if="userInfo.isValid == 0" class="BtnBox" color="#1777FF">
              <text  class="fw-b fs-14">{{ $t('userInfo.goCertification') }}</text>
            </van-button>
            <van-button v-if="userInfo.isValid == 1" class="BtnBox" color="#1777FF">
              <text class="fw-b fs-14">{{ $t('userInfo.certification') }}</text>
            </van-button>
          </div>
        </div>
      </div>
      <div class="optionBox bg-white mt-5">
        <div class="pl-20 pr-20 pt-20">
          <div class="fw-b fs-16">{{ $t('userInfo.accountInfo') }}</div>
          <div @click="goIdentityAuth" class="pt-25 flex justify-between">
            <div class="flex items-center">
              <image
                class="leftIcon mr-10"
                src="/static/svg/tools/identity.svg"
                mode="scaleToFill"
              />
              <text class="text-black fs-16">{{ $t('userInfo.identityAuthentication') }}</text>
            </div>
            <div>
              <text v-if="userInfo.isValid == 0" class="fs-12 text-gray mr-5">{{ $t('userInfo.notCertifiedYet') }}</text>
              <text v-if="userInfo.isValid == 1" class="fs-12 text-gray mr-5">{{ $t('userInfo.authentication') }}</text>
              <text v-if="userInfo.isValid == 2" class="fs-12 text-gray mr-5">{{ $t('userInfo.authenticationSuccess') }}</text>
              <image
                class="rightIcon"
                src="/static/svg/tools/right.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
          <div @click="gosecuritySetting" class="pt-25 flex justify-between">
            <div class="flex items-center">
              <image
                class="leftIcon mr-10"
                src="/static/svg/tools/security.svg"
                mode="scaleToFill"
              />
              <text class="text-black fs-16">{{ $t('userInfo.securitySettings') }}</text>
            </div>
            <div>
              <image
                class="rightIcon"
                src="/static/svg/tools/right.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
          <div class="pt-25 flex justify-between" @click="goCustomerService">
            <div class="flex items-center">
              <image
                class="leftIcon mr-10"
                src="/static/svg/home/c_service.svg"
                mode="scaleToFill"
              />
              <text class="text-black fs-16">客服中心</text>
            </div>
            <div>
              <image
                class="rightIcon"
                src="/static/svg/tools/right.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="loginOutBtn pos-fixed bg-white pt-20 w-100 px-20">
      <van-button class="w-100" type="primary" @click="loginOut">安全登出</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue'
import { ref, onMounted, onUnmounted, createApp } from 'vue';
import { useUserStore } from '@/stores/user';
const DEFAULT_USER_INFO = {
  username: '未登录用户',
  uid: '--',
  isValid: 0
}

const userStore = useUserStore();
const userInfo = ref({...DEFAULT_USER_INFO})

const tabVal = ref(1);


onMounted(() => {
  getUser()
})

const getUser = async () => {
  await userStore.getUser()
  userInfo.value = {
    username: userStore.userInfo.username || DEFAULT_USER_INFO.username,
    uid: userStore.userInfo.uid || DEFAULT_USER_INFO.uid,
    isValid: userStore.userInfo.isValid || DEFAULT_USER_INFO.isValid
  }
}

const clickTab = (val: number) => {
  tabVal.value = val;
}

const goUser = () => {
  // uni.navigateTo({
  //   url: '/pages/home/index',
  // });
  uni.navigateBack();
};

const goGeneralSetting = () => {
  uni.navigateTo({
    url: '/pages/generalSettings/index',
  });
};

const gosecuritySetting = () => {
  uni.navigateTo({
    url: '/pages/securitySettings/index',
  });
};

const goIdentityAuth = () => {
  uni.navigateTo({
    url: '/pages/IdentityAuth/index',
  });
};

const goCustomerService = () => {
  console.log('前往客服中心')
}

// 登出
const loginOut = () => {
  userStore.logout();
}

</script>

<style lang="scss">
.userInfo-index {
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
  .userHeader {
    .headerImg {
      width: 52px;
      height: 52px;
    }
  }
  .tabInfo {
    .tabBox {
      min-width: 83px;
      height: 32px;
      background: #F6F7FB;
      border-radius: 5px 5px 5px 5px;
      padding: 8px 14px;
      .certification {
        image {
          width: 10px;
          height: 10px;
        }
      }
      .triangle-up-border {
        width: 0;
        height: 0;
        bottom: -11px;
        left: 50%;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 9px solid #F6F7FB;
      }
    }
    .infoBox {
      width: 100%;
      min-height: 125px;
      background: #F6F7FB;
      border-radius: 5px 5px 5px 5px;
      .BtnBox {
        width: 84px;
        height: 32px;
        border-radius: 6px;
      }
    }
  }
  .optionBox {
    // background: #F6F8FC;
    .leftIcon {
      width: 20px;
      height: 20px;
    }
    .rightIcon {
      width: 8px;
      height: 8px;
    }
  }
  .loginOutBtn {
    bottom: 50px;
    left: 0px;
    right: 0px;
  }
}
</style>