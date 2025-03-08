<template>
  <div class="page-index">
    <div class="homeTitle flex justify-center items-center">
      <div class="text-center fw-b text-white fs-28 animate__animated animate__bounce pt-25" >bybit</div>
    </div>
    <div class="homeBtn">
      <div class="w-100 flex justify-center">
        <van-button class="" type="default" @click="goLogin">Sign in</van-button>
      </div>
      <!-- <div class="mt-10 w-100 flex justify-center">
        <van-button class="" plain type="success" @click="goRegister">Sign up</van-button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">

const goLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}

const goRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  })
}

</script>

<style lang="scss">
.page-index {
  height: 100vh;
  background-color: #2752e7;
  .homeTitle {
    height: 80%;
  }
  .homeBtn {
    
  }
}
</style>