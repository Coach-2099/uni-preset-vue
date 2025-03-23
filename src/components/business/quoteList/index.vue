<template>
  <div class="quotesList-temp">
    <basePullRefresh
      v-model="isLoading" 
      :head-height="100"
      @refresh="handleRefresh"
    >
      <template #content>
        <!-- 排序头部 -->
        <div class="mt-10 ml-15 mr-15 flex justify-between">
          <div class="flex-1 flex text-gray fs-12">
            <div 
              class="sortTemp flex justify-between items-center"
              @click="toggleSort('symbol')"
            >
              <text>交易对</text>
              <image
                class="sortImg"
                :src="sortIcon('symbol')"
                mode="scaleToFill"
              />
            </div>
            <text class="divLine">/</text>
            <div 
              class="sortTemp flex justify-between items-center"
              @click="toggleSort('volume')"
            >
              <text>交易量</text>
              <image
                class="sortImg"
                :src="sortIcon('volume')"
                mode="scaleToFill"
              />
            </div>
          </div>
          <!-- 右侧排序 -->
          <div class="flex-1 flex justify-end text-gray fs-12">
            <div 
              class="sortTemp flex-1 flex justify-center items-center text-right mr-20"
              @click="toggleSort('price')"
            >
              <text>Last Price</text>
              <image
                class="sortImg"
                :src="sortIcon('price')"
                mode="scaleToFill"
              />
            </div>
            <div 
              class="sortTemp flex justify-center items-center text-right"
              @click="toggleSort('change')"
            >
              <text>24H Change</text>
              <image
                class="sortImg"
                :src="sortIcon('change')"
                mode="scaleToFill"
              />
            </div>
          </div>
        </div>

        <!-- 行情列表 -->
        <div v-for="(item, index) in listData" :key="index">
          <div class="mt-5 ml-15 mr-15 pb-5 flex ff-biance fw-b justify-between items-center">
            <div class="flex-1">
              <text class="fs-16">{{ item.symbol }}</text>
              <text class="fs-12 text-gray">/ {{ item.vol }}</text>
              <div>
                <text class="fs-12 text-gray">{{ formatVolume(item.volume) }}</text>
              </div>
            </div>
            <div class="flex-1 flex justify-end items-center">
              <div class="flex-1 text-right items-center mr-20">{{ item.price }}</div>
              <van-button 
                class="flex-1 text-right rises_falls_btn" 
                :class="item.rose > 0 ? 'rise_btn' : 'fall_btn'"
                style="width: 22.4vw;" 
                size="small"
              >
                <text class="fs-14">{{ formatChange(item.change) }}</text>
              </van-button>
            </div>
          </div>
        </div>
      </template>
    </basePullRefresh>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps, defineEmits, computed, ref, watch } from 'vue';
import basePullRefresh from '@/components/basePullRefresh/index.vue'

import { getSymbolsLastPrice } from '@/api/quotes'

// 组件内部状态
const listData = ref([])
const sortField = ref('')
const sortDirection = ref('')
const isLoading = ref(false)

const props = defineProps({
  type: {
    type: String,
    default: 'hot'
  },
});

const handleRefresh = (finish: any) => {
  console.log('1111');
  loadData()
    .then(() => finish(true))  // 成功时调用
    .catch(() => finish(false)); // 失败时调用
}

onMounted(() => {
  // loadData()
})

// 自动响应 type 变化
watch(() => props.type, () => {
  loadData()
})

// 自主获取数据
const loadData = async () => {
  const params = {
    type: props.type,
    sortField: sortField.value,
    sortDirection: sortDirection.value
  }
  const data = await getSymbolsLastPrice(params)
  listData.value = data
}

// 自包含排序逻辑
const toggleSort = (field: string) => {
  if (sortField.value !== field) {
    sortField.value = field
    sortDirection.value = 'asc'
  } else {
    sortDirection.value = 
      sortDirection.value === 'asc' ? 'desc' :
      sortDirection.value === 'desc' ? '' : 'asc'
    
    if (!sortDirection.value) sortField.value = ''
  }
  
  loadData() // 触发数据刷新
}

const sortIcon = (field: string) => {
  if (sortField.value !== field) return '/static/images/sort.png'
  return sortDirection.value === 'asc' 
    ? '/static/images/sort-up.png' 
    : '/static/images/sort-down.png'
}


// 排序后的列表
const sortedList = computed(() => {
  return [...listData.value].sort((a, b) => {
    console.log('a',a)
    console.log('b',b)
    // 实际排序逻辑需要根据数据类型实现
  });
});

const formatVolume = (volume:any) => {
  
}

const formatChange = (change:any) => {
  
}

</script>

<!-- 保留原有样式并稍作调整 -->
<style lang="scss" scoped>
.quotesList-temp {
  height: 100%;
  padding-bottom: 90px;
  .sortImg {
    width: 7px;
    height: 7px;
    margin-left: 3px;
  }
  .divLine {
    margin-left: 3px;
    margin-right: 3px ;
  }
  .rise_btn {
    background: #0FB668;
    border-radius: 6px 6px 6px 6px;
  }
  .fall_btn {
    background: #FF3E47;
    border-radius: 6px 6px 6px 6px;
  }
}
</style>