<template>
  <div class="modifyUserInfo-index">
    <navigationBar :title="$t('navigationBarTitle.editUserInfo')"></navigationBar>
    <div class="container w-100">
      <div class="flex justify-between items-center mt-20">
        <div class="label">{{$t('generalSettings.nickname')}}</div>
        <input
          v-model="nickname"
          class="base-input w-100"
          :placeholder="$t('identityAuth.placeholders.familyName')"
          placeholder-class="input-placeholder"
        />
      </div>
      <div class="mt-20">
        <p class="fs-16 text-black">{{$t('userInfo.avatar')}}</p>
        <div class="pos-relative text-center mt-15">
            <van-uploader
              class="mr-15"
              v-model="fileListAvatar"
              :max-count="1"
              reupload
              preview-size="9rem"
              :after-read="afterReadFront"
            >
              <div class="upuloadTemp flex-col items-center">
                <image
                  src="/static/svg/tools/upload.svg"
                  mode="scaleToFill"
                />
                <p class="mt-15 fs-12">{{$t('userInfo.avatar')}}</p>
              </div>
            </van-uploader>
            <!-- <div v-if="fileAvatar" class="myPreview bg-white flex-col items-center pos-absolute">
              <image
                class="myPreviewImg"
                :src="fileAvatar"
                mode="scaleToFill"
              />
            </div> -->
          </div>
      </div>
    </div>
    <div class="pos-fixed btnBox w-100 bg-white">
      <van-button class="uploadBtn w-100 mt-15" @click="confirmFun">
        <text class="fs-16 text-white fw-b">{{ $t('common.confirm') }}</text>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { uploadImage } from '@/api/app';
import { editUserInfo } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { onShow } from '@dcloudio/uni-app';

const nickname = ref('');

const fileListAvatar:any = ref([])
const fileAvatar = ref('');
const fileAvatarSrc = ref('');
const userStore = useUserStore();

onShow(() => {
  nickname.value = userStore.userInfo?.nickname || '';
  fileAvatarSrc.value = userStore.userInfo?.avatar;
  fileListAvatar.value = [
    { url: userStore.userInfo?.avatar }
  ]
})

const afterReadFront = async (file: any) => {
  console.log('file', file)
  const data = await uploadImage(file.content)
  fileAvatar.value = file.url;
  fileAvatarSrc.value = data?.url;
}

const confirmFun = async () => {
  const params = {
    nickName: nickname.value,
    avatar: fileAvatarSrc.value,
  }
  await editUserInfo(params)
  uni.showToast({
    title: '修改成功',
    icon: 'none',
    duration: 3000,
  })
}

</script>

<style lang="scss">
.modifyUserInfo-index {
  .container {
    padding-bottom: 150px;
    .label {
      width: 160px;
    }
    .base-input {
      line-height: 42px;
      height: 42px;
      background: #F6F7FB;
      border-radius: 8px;
    }
    .input-placeholder {
      font-size: 14px;
      color: #B0B0B0;
    }
  }
  .upuloadTemp {
    border: 1px dashed #237eff;
    background: #f6f7fb;
    padding: 2.2rem 1.19rem;
    image {
      width: 3.49rem;
      height: 2.82rem;
    }
  }
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
  .btnBox {
    bottom: 0px;
    padding: 0 16px;
    padding-bottom: 40px;
    .btnText {
      padding: 0 20% 18px 20%;
    }
    .uploadBtn {
      background: #1777ff;
    }
  }
}
</style>