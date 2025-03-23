<template>
  <div class="userInfo-index">
    <navigationBar title="">
      <template #right>
        <div class="flex justify-between">
          <div class="flex items-center home_right_icon mr-15">
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
          <p class="fs-20 fw-b text-balck">用户姓名</p>
          <div class="fs-12 flex mt-10 text-gray">
            <text>UID:123456</text>
            <div class="ml-5"><van-image src="/static/svg/tools/copy.svg" /></div>
          </div>
        </div>
      </div>
      <div class="tabInfo pl-20 pr-20 pb-20 pt-15 bg-white">
        <div class="flex items-center">
          <!-- @click="clickTab(0)" -->
          <div class="text-black fw-b fs-12 tabBox mr-15 text-center pos-relative">
            <div>普通用户</div>
            <!-- <div v-if="tabVal == 0" class="triangle-up-border pos-absolute"></div> -->
          </div>
          <div @click="clickTab(1)" class="text-black fw-b fs-12 tabBox mr-15 text-center pos-relative">
            <div class="certification">
              <image class="mr-5" src="/static/svg/tools/ex_mark.svg" />
              未完成身份认证
            </div> 
            <div v-if="tabVal == 1" class="triangle-up-border pos-absolute"></div>
          </div>
        </div>
        <div class="infoBox mt-10 px-10 pt-25">
          <div class="text-black fs-14">完成身份认证以进行充值和交易</div>
          <div class="CertificationBox mt-5">
            <van-button class="BtnBox" color="#1777FF">
              <text class="fw-b fs-14">认证</text>
            </van-button>
          </div>
        </div>
      </div>
      <div class="optionBox bg-white mt-5">
        <div class="pl-20 pr-20 pt-20">
          <div class="fw-b fs-16">账户信息</div>
          <div @click="goIdentityAuth" class="pt-25 flex justify-between">
            <div class="flex items-center">
              <image
                class="leftIcon mr-10"
                src="/static/svg/tools/identity.svg"
                mode="scaleToFill"
              />
              <text class="text-black fs-16">身份认证</text>
            </div>
            <div>
              <text class="fs-12 text-gray mr-5">尚未认证</text>
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
              <text class="text-black fs-16">安全设置</text>
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
  </div>
</template>

<script lang="ts" setup>
import navigationBar from '@/components/navigationBar/index.vue'
import { ref, onMounted, onUnmounted } from 'vue';

const tabVal = ref(0);
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
        width: 64px;
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
}
</style>