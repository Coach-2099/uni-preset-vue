<template>
  <div class="userInfo-index">
    <navigationBar :customHandler="goBack" title="">
      <template #right>
        <div class="flex justify-between">
          <div
            @click="goCustomerService"
            class="flex items-center home_right_icon mr-15"
          >
            <!-- <image
              src="/static/svg/home/c_service.svg"
              mode="scaleToFill"
            /> -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22.054 22"
              style="color: var(--color-icon);width: 100%;height: 100%;"
            >
              <defs>
                <clipPath id="a">
                  <path d="M0 0h22.054v22H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="fill:none;">
                <path
                  d="M20.978 10.944C20.978 3.757 17.6 0 11.052 0s-9.926 3.757-9.98 11A2.94 2.94 0 0 0 0 13.254v2.573a2.978 2.978 0 0 0 2.256 2.845l.536.107a2.01 2.01 0 0 0 .59.054A2.518 2.518 0 0 0 5.9 16.309v-3.645a2.449 2.449 0 0 0-.054-.594 2.531 2.531 0 0 0-3.056-1.823h-.052c.214-5.847 2.949-8.639 8.314-8.639s8.1 2.792 8.264 8.586h-.054a2.01 2.01 0 0 0-.59-.054 2.521 2.521 0 0 0-2.524 2.524v3.646a2.4 2.4 0 0 0 .054.59 2.552 2.552 0 0 0 1.926 1.876 6.19 6.19 0 0 0 1.723-.157 2.934 2.934 0 0 0 2.2-2.845V13.2a3.016 3.016 0 0 0-1.076-2.256m-17.811.8a.966.966 0 0 1 1.126.7.322.322 0 0 1 .054.214v3.646a.943.943 0 0 1-.911.915c-.054 0-.161-.054-.214-.054l-.536-.107a1.38 1.38 0 0 1-1.022-1.291V13.2a1.521 1.521 0 0 1 .969-1.344Zm17.275 4.078a1.377 1.377 0 0 1-1.019 1.291l-.536.107a.923.923 0 0 1-1.072-.647.322.322 0 0 1-.054-.214v-3.642a.943.943 0 0 1 .911-.915c.054 0 .161.054.214.054l.536.107a1.377 1.377 0 0 1 1.019 1.291Z"
                  style="fill:var(--color-text)"
                />
                <path d="M36.364 48.62a3.946 3.946 0 0 1-.218.8A4.023 4.023 0 0 1 32.393 52h-4.829a.806.806 0 0 1 0-1.612h4.829a2.367 2.367 0 0 0 2.045-1.164 2.252 2.252 0 0 0 .211-.444s0 0-.008 0a6.19 6.19 0 0 0 1.723-.157" style="fill:var(--color-light-primary)" transform="translate(-16.512 -30.001)"/>
              </g>
            </svg>
          </div>
          <div
            @click="goGeneralSetting"
            class="flex items-center home_right_icon"
          >
            <!-- <image
              src="/static/svg/tools/setting.svg"
              mode="scaleToFill"
            /> -->
            <svg style="width: 22px;height: 22px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.945 22">
              <defs>
                <clipPath id="a">
                  <path d="M0 0h23.945v22H0z" style="fill:none"/>
                </clipPath>
              </defs>
              <g style="fill:none">
                <path style="fill:var(--color-text)" d="M17.077 1.744a.416.416 0 0 1 .347.188l4.7 8.818.012.023.013.022a.421.421 0 0 1 0 .41l-.013.023-.012.023-4.7 8.82a.4.4 0 0 1-.342.185H6.873a.416.416 0 0 1-.347-.188l-4.7-8.818-.012-.023L1.8 11.2a.421.421 0 0 1 0-.41l.013-.022.012-.023 4.7-8.816a.416.416 0 0 1 .348-.19Zm0-1.744H6.869A2.162 2.162 0 0 0 5 1.081v.008L.283 9.929a2.167 2.167 0 0 0 0 2.141l4.711 8.83.006.019A2.163 2.163 0 0 0 6.873 22h10.208a2.151 2.151 0 0 0 1.866-1.081v-.008l4.711-8.841a2.167 2.167 0 0 0 0-2.141L18.955 1.1l-.008-.016A2.162 2.162 0 0 0 17.077 0"/>
                <path d="M20.911 15.34A3.324 3.324 0 1 1 18.032 17a3.335 3.335 0 0 1 2.879-1.663m0-1.744a5.069 5.069 0 1 0 4.389 2.538 5.083 5.083 0 0 0-4.389-2.531" style="fill:var(--color-light-primary)" transform="translate(-8.935 -7.667)"/>
              </g>
            </svg>
          </div>
        </div>
      </template>
    </navigationBar>
    <div class="userHeader">
      <div class="flex headerBox pl-20 pr-20 pt-10 items-center justify-start">
        <div class="headerImg">
          <!-- <van-image
            round 
            width="52px" 
            height="52px" 
            :src="userInfo.avatar"
          >
            <template #error>
              <van-image
                src="/static/images/logo.png"
                mode="scaleToFill"
              />
            </template>
          </van-image> -->
          <image 
            class="header-img"
            :src="userInfo.avatar || '/static/images/logo.png'"
            mode="aspectFill"
            style="width: 52px; height: 52px; border-radius: 50%;"
            @error="handleImageError"
          />
        </div>
        <div class="ml-10">
          <p class="fs-20 fw-b text-black">{{ userInfo.nickname || userInfo.username }}</p>
          <div class="fs-12 flex mt-5 text-gray">
            <text>UID:{{ userInfo.uid }}</text>
            <div @click="copy" class="ml-5">
              <!-- <van-image src="/static/svg/tools/copy.svg" /> -->
              <image
                style="width: 10px; height: 10px;"
                src="/static/svg/tools/copy.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="tabInfo pl-20 pr-20 pb-20 pt-15">
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
      <div class="optionBox pb-20 bg-white mt-5">
        <div class="pl-20 pr-20 pt-20">
          <div class="fw-b fs-16">{{ $t('userInfo.accountInfo') }}</div>
          <div @click="goIdentityAuth" class="pt-25 flex justify-between">
            <div class="flex items-center">
              <!-- <image
                class="leftIcon mr-10"
                src="/static/svg/tools/identity.svg"
                mode="scaleToFill"
              /> -->
              <svg class="leftIcon mr-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h20v20H0z" style="fill:none"/>
                  </clipPath>
                </defs>
                <g style="fill:none">
                  <path style="fill:var(--color-light-primary)" d="M.785 7.079A.786.786 0 0 1 0 6.294v-4A2.3 2.3 0 0 1 2.3 0h4a.785.785 0 1 1 0 1.57h-4a.726.726 0 0 0-.726.725v4a.786.786 0 0 1-.785.785M19.214 7.079a.786.786 0 0 1-.785-.785v-4a.726.726 0 0 0-.726-.725h-4a.785.785 0 1 1 0-1.57h4a2.3 2.3 0 0 1 2.3 2.3v4a.786.786 0 0 1-.785.785M6.3 20h-4A2.3 2.3 0 0 1 0 17.705v-4a.786.786 0 0 1 1.571 0v4a.726.726 0 0 0 .726.725h4a.785.785 0 1 1 0 1.57M17.704 20h-4a.785.785 0 1 1 0-1.57h4a.727.727 0 0 0 .726-.725v-4a.786.786 0 0 1 1.571 0v4a2.3 2.3 0 0 1-2.3 2.3"/>
                  <path d="M9.919 10.126a3.792 3.792 0 1 1 3.8-3.792 3.8 3.8 0 0 1-3.8 3.792m0-6.013a2.222 2.222 0 1 0 2.223 2.222 2.224 2.224 0 0 0-2.223-2.223"/>
                  <path d="M15.751 17.333a.786.786 0 0 1-.785-.785 5.042 5.042 0 0 0-10.084 0 .786.786 0 0 1-1.571 0 6.613 6.613 0 0 1 13.226 0 .786.786 0 0 1-.785.785"/>
                </g>
              </svg>
              <text class="text-black fs-16">{{ $t('userInfo.identityAuthentication') }}</text>
            </div>
            <div>
              <text v-if="userInfo.isValid == 0" class="fs-12 text-gray mr-5">{{ $t('userInfo.notCertifiedYet') }}</text>
              <text v-if="userInfo.isValid == 1" class="fs-12 text-gray mr-5">{{ $t('userInfo.authentication') }}</text>
              <text v-if="userInfo.isValid == 2" class="fs-12 text-gray mr-5">{{ $t('userInfo.authenticationSuccess') }}</text>
              <image
                v-if="userInfo.isValid !== 2"
                class="rightIcon"
                src="/static/svg/tools/right.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
          <div @click="gosecuritySetting" class="pt-25 flex justify-between">
            <div class="flex items-center">
              <!-- <image
                class="leftIcon mr-10"
                src="/static/svg/tools/security.svg"
                mode="scaleToFill"
              /> -->
              <svg class="leftIcon mr-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.082 22">
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h19.082v22H0z" style="fill:none"/>
                  </clipPath>
                </defs>
                <g style="fill:none">
                  <path style="fill:var(--color-text)" d="m9.541 22-.641-.289c-.359-.158-8.9-3.99-8.9-9.4V5.12a2.242 2.242 0 0 1 1.46-2.093A48.968 48.968 0 0 0 7.019.57a5.056 5.056 0 0 1 4.414-.122c1.2.535 3.252 1.418 6.226 2.582a2.249 2.249 0 0 1 1.423 2.079v7.2c0 5.272-7.989 9-8.9 9.4ZM9.347 1.609A3.433 3.433 0 0 0 7.76 2a50.664 50.664 0 0 1-5.743 2.536.636.636 0 0 0-.409.585v7.189c0 3.625 5.714 6.946 7.932 7.928.4-.182 7.933-3.69 7.933-7.928v-7.2a.629.629 0 0 0-.4-.581c-3-1.176-5.081-2.07-6.3-2.612a3.5 3.5 0 0 0-1.43-.308"/>
                  <path d="m14.326 23.7-3.346-3.343a.8.8 0 1 1 1.137-1.137l2.21 2.21 5.473-5.476a.8.8 0 0 1 1.137 1.137Z" style="fill:var(--color-light-primary)" transform="translate(-6.425 -9.399)"/>
                </g>
              </svg>

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
              <!-- <image
                class="leftIcon mr-10"
                src="/static/svg/home/c_service.svg"
                mode="scaleToFill"
              /> -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.054 22"
                class="leftIcon mr-10"
              >
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h22.054v22H0z" style="fill:none"/>
                  </clipPath>
                </defs>
                <g style="fill:none;">
                  <path
                    d="M20.978 10.944C20.978 3.757 17.6 0 11.052 0s-9.926 3.757-9.98 11A2.94 2.94 0 0 0 0 13.254v2.573a2.978 2.978 0 0 0 2.256 2.845l.536.107a2.01 2.01 0 0 0 .59.054A2.518 2.518 0 0 0 5.9 16.309v-3.645a2.449 2.449 0 0 0-.054-.594 2.531 2.531 0 0 0-3.056-1.823h-.052c.214-5.847 2.949-8.639 8.314-8.639s8.1 2.792 8.264 8.586h-.054a2.01 2.01 0 0 0-.59-.054 2.521 2.521 0 0 0-2.524 2.524v3.646a2.4 2.4 0 0 0 .054.59 2.552 2.552 0 0 0 1.926 1.876 6.19 6.19 0 0 0 1.723-.157 2.934 2.934 0 0 0 2.2-2.845V13.2a3.016 3.016 0 0 0-1.076-2.256m-17.811.8a.966.966 0 0 1 1.126.7.322.322 0 0 1 .054.214v3.646a.943.943 0 0 1-.911.915c-.054 0-.161-.054-.214-.054l-.536-.107a1.38 1.38 0 0 1-1.022-1.291V13.2a1.521 1.521 0 0 1 .969-1.344Zm17.275 4.078a1.377 1.377 0 0 1-1.019 1.291l-.536.107a.923.923 0 0 1-1.072-.647.322.322 0 0 1-.054-.214v-3.642a.943.943 0 0 1 .911-.915c.054 0 .161.054.214.054l.536.107a1.377 1.377 0 0 1 1.019 1.291Z"
                    style="fill:var(--color-text)"
                  />
                  <path d="M36.364 48.62a3.946 3.946 0 0 1-.218.8A4.023 4.023 0 0 1 32.393 52h-4.829a.806.806 0 0 1 0-1.612h4.829a2.367 2.367 0 0 0 2.045-1.164 2.252 2.252 0 0 0 .211-.444s0 0-.008 0a6.19 6.19 0 0 0 1.723-.157" style="fill:var(--color-light-primary)" transform="translate(-16.512 -30.001)"/>
                </g>
              </svg>
              <text class="text-black fs-16">{{ $t('userInfo.customerServiceCenter') }}</text>
            </div>
            <div>
              <image
                class="rightIcon"
                src="/static/svg/tools/right.svg"
                mode="scaleToFill"
              />
            </div>
          </div>
          
          <div class="pt-25 flex justify-between" @click="goLanguage">
            <div class="flex items-center">
              <!-- <image
                class="leftIcon mr-10"
                src="/static/images/language.png"
                mode="scaleToFill"
              /> -->
              <svg class="leftIcon mr-10" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 43 43">
                <path style="fill:var(--color-text)" d="M1.2 1.2C.3 2.1 0 8 0 21.7 0 39.7.1 41 1.9 42c1.2.6 9.5 1 20 1 15 0 18.2-.3 19.5-1.6 1.3-1.3 1.6-4.5 1.6-19.5 0-10.5-.4-18.8-1-20C41 .1 39.7 0 21.7 0 8 0 2.1.3 1.2 1.2zm38.3 20.3v18h-36l-.3-18.3L3 3l18.2.2 18.3.3v18z"/>
                <path style="fill:var(--color-light-primary)" d="M8 22v8h5.5c6.5 0 7.4-1.7 1.3-2.2-3.5-.2-4.3-.7-4.3-2.3 0-1.6.8-2.1 4.3-2.3 5.7-.4 5.4-2.2-.4-2.2-4.1 0-4.5-.2-4.2-2.3.2-1.8 1-2.3 4.6-2.5 6.1-.5 5.2-2.2-1.3-2.2H8v8zM23 22c0 6.4.3 8 1.5 8 1.1 0 1.5-1.2 1.5-4.7v-4.7l3.3 4.7C34 32.1 35 31.5 35 22c0-6.3-.3-8-1.4-8-1.1 0-1.6 1.4-1.8 4.7l-.3 4.8-3-4.7c-4.4-7-5.5-6.3-5.5 3.2z"/>
              </svg>
              <text class="text-black fs-16">{{ $t('userInfo.langaugeSettings') }}</text>
            </div>
            <div>
              <image
                class="rightIcon"
                src="/static/svg/tools/right.svg"
                mode="scaleToFill"
              />
            </div>
          </div>

          <div class="pt-25 flex justify-between" @click="goSetTheme">
            <div class="flex items-center">
              <!-- <image
                class="leftIcon mr-10"
                src="/static/images/language.png"
                mode="scaleToFill"
              /> -->
              <svg class="leftIcon mr-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.945 22">
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h23.945v22H0z" style="fill:none"/>
                  </clipPath>
                </defs>
                <g style="fill:none">
                  <path style="fill:var(--color-text)" d="M17.077 1.744a.416.416 0 0 1 .347.188l4.7 8.818.012.023.013.022a.421.421 0 0 1 0 .41l-.013.023-.012.023-4.7 8.82a.4.4 0 0 1-.342.185H6.873a.416.416 0 0 1-.347-.188l-4.7-8.818-.012-.023L1.8 11.2a.421.421 0 0 1 0-.41l.013-.022.012-.023 4.7-8.816a.416.416 0 0 1 .348-.19Zm0-1.744H6.869A2.162 2.162 0 0 0 5 1.081v.008L.283 9.929a2.167 2.167 0 0 0 0 2.141l4.711 8.83.006.019A2.163 2.163 0 0 0 6.873 22h10.208a2.151 2.151 0 0 0 1.866-1.081v-.008l4.711-8.841a2.167 2.167 0 0 0 0-2.141L18.955 1.1l-.008-.016A2.162 2.162 0 0 0 17.077 0"/>
                  <path d="M20.911 15.34A3.324 3.324 0 1 1 18.032 17a3.335 3.335 0 0 1 2.879-1.663m0-1.744a5.069 5.069 0 1 0 4.389 2.538 5.083 5.083 0 0 0-4.389-2.531" style="fill:var(--color-light-primary)" transform="translate(-8.935 -7.667)"/>
                </g>
              </svg>
              <text class="text-black fs-16">主题颜色</text>
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
    <div class="loginOutBtn bg-white pt-10 pb-25 w-100 px-20">
      <van-button class="w-100" type="primary" @click="loginOut">{{ $t('common.loginOut') }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue'
import { ref, onMounted, onUnmounted, createApp } from 'vue';
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';
import { getCustomerService } from '@/api/common';

const { t } = useI18n();

const DEFAULT_USER_INFO = {
  username: t('common.unloginUser'),
  uid: '--',
  isValid: 0, // 0:未认证 1:认证中 2:认证成功
  avatar: '@/static/svg/home/user.svg',
  nickname: '',
}

const userStore = useUserStore();
const userInfo = ref({...DEFAULT_USER_INFO})

const tabVal = ref(1);

const customerUrl = ref('') //客服链接地址


onMounted(() => {
  getUser()
  getCustomer()
})

const getUser = async () => {
  await userStore.getUser()
  console.log('userStore.userInfo ={}',userStore.userInfo)
  userInfo.value = {
    username: userStore.userInfo.username || DEFAULT_USER_INFO.username,
    nickname: userStore.userInfo.nickname || DEFAULT_USER_INFO.nickname,
    uid: userStore.userInfo.uid || DEFAULT_USER_INFO.uid,
    avatar: userStore.userInfo.avatar || DEFAULT_USER_INFO.avatar,
    isValid: userStore.userInfo.isValid || DEFAULT_USER_INFO.isValid
  }
}

const clickTab = (val: number) => {
  tabVal.value = val;
}

const handleImageError = () => {
  userInfo.value.avatar = '/static/images/logo.png';
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

const copy = () => {
  uni.setClipboardData({
    data: userInfo.value.uid,
    success: () => {
      uni.showToast({
        title: t('tips.copySuccess'),
        icon: 'success',
        duration: 3000,
      });
    },
  });
}

// 前往身份认证
const goIdentityAuth = () => {
  if (userInfo.value.isValid == 1) {
    uni.navigateTo({
      url: '/pages/certification/index'
    })
  } else if (userInfo.value.isValid !== 2) {
    uni.navigateTo({
      url: '/pages/IdentityAuth/index',
    });
  }
};

const getCustomer =async() =>{
	const data = await getCustomerService()
	customerUrl.value = data
}

const goBack = () => { 
  uni.switchTab({
    url: '/pages/home/index',
  });
}

const goCustomerService = () => {
	location.href = 'https://msg.btchatc1.top?appId=0qkyvQAz&userId='+userInfo.value.userId+'&redirectUrl='+encodeURIComponent(customerUrl.value)
}

const goLanguage = () => {
  uni.navigateTo({
    url: '/pages/languageSetting/index',
  });
}

const goSetTheme = () => {
  uni.navigateTo({
    url: '/pages/theme/index',
  });
}

// 登出
const loginOut = () => {
  userStore.logout();
}

</script>

<style lang="scss">
.userInfo-index {
  min-height: 100vh;
  background: var(--color-background-2);
  // background: #F6F7FB;
  .headerTemp {
    height: 50px;
    line-height: 50px;
    // background: #ffffff;
    background: var(--color-background);
    .back-arrow {
      image {
        width: 16px;
        height: 14px;
      }
    }
    .home_right_icon {
      width: 22px;
      height: 22px;
      line-height: 22px;
      // image {
      //   width: 100%;
      //   height: 100%;
      // }
    }
  }
  .userHeader {
    .headerBox {
      background: var(--color-background);
    }
    .headerImg {
      width: 52px;
      height: 52px;
    }
  }
  .tabInfo {
    background: var(--color-background);
    .tabBox {
      min-width: 83px;
      height: 32px;
      // background: #F6F7FB;
      background: var(--color-background-box);
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
        border-bottom: 9px solid var(--color-background-box);
      }
    }
    .infoBox {
      width: 100%;
      min-height: 125px;
      // background: #F6F7FB;
      background: var(--color-background-box);
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
    // padding-bottom: 120px;
    background: var(--color-background);
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
    // bottom: 30px;
    // left: 0px;
    // right: 0px;
  }
}
</style>