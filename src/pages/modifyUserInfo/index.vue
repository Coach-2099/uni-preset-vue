<template>
  <div class="modifyUserInfo-index">
    <navigationBar :title="$t('navigationBarTitle.editUserInfo')"></navigationBar>
    <div class="container w-100">
      <div class="flex justify-between items-center mt-20">
        <div class="label">{{$t('userInfo.username')}}</div>
        <input
          v-model="UserName"
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
                <p class="mt-15 fs-12">{{$t('userInfo.idcard')}}</p>
              </div>
            </van-uploader>
            <div v-if="fileAvatar" class="myPreview bg-white flex-col items-center pos-absolute">
              <image
                class="myPreviewImg"
                :src="fileAvatar"
                mode="scaleToFill"
              />
            </div>
          </div>
      </div>
    </div>
    <div class="pos-fixed btnBox w-100 bg-white">
      <van-button class="uploadBtn w-100 mt-15" @click="uploadFun">
        <text class="fs-16 text-white fw-b">{{ $t('common.confirm') }}</text>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { uploadImage } from '@/api/app';

const UserName = ref('');

const fileListAvatar = ref([])
const fileAvatar = ref('');
const fileAvatarSrc = ref('');

const afterReadFront = async (file: any) => {
  const data = await uploadImage(file.content)
  fileAvatar.value = file.url;
  fileAvatarSrc.value = data?.url;
}

const uploadFun = () => {
  console.log('fileAvatarSrc', fileAvatarSrc.value)
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