<template>
  <div class="messageList-index bg-white">
    <navigationBar :title="$t('navBar.messageList')">
      <!-- <template #right>
        <div class="flex items-center home_right_icon mr-20" @click="goCustomerService">
          <image
            src="/static/svg/home/c_service.svg"
            mode="scaleToFill"
          />
        </div>
      </template> -->
    </navigationBar>
    <div class="contentBox px-20 py-20" v-for="item in list" :key="item.id">
      <p class="fw-b fs-14">{{ item.title }}</p>
      <div class="mt-10 flex justify-between content">
        <div class="text text-gray fs-12 ellipsis-3">{{ item.content }}</div>
        <!-- <div class="contentImg">
          <image 
            src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
          />
        </div> -->
      </div>
      <div>
        <p class="fs-12 text-gray">{{ item.createTime }}</p>
      </div>
    </div>
	<dataDefault v-if="list.length === 0" class="noData mt-25"></dataDefault>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import navigationBar from '@/components/navigationBar/index.vue';
import { getNotice } from '@/api/common'
import dataDefault from '@/components/dataDefault/index.vue';

const list = ref([])

const pages = ref({
  size: 10,
  current: 1
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  const data = await getNotice({pages: pages.value})
  list.value = data.records
}

</script>

<style lang="scss" scoped>
.messageList-index {
  .home_right_icon {
    width: 22px;
    height: 22px;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .contentBox {
    border-bottom: 1px solid #f8f9fc;
    .content {
      .text {
        max-width: 60vw;
      }
      .contentImg {
        width: 100px;
        height: 65px;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>