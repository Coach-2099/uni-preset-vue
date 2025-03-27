<template>
  <div class="quotesList-temp w-100">
    <div
      v-if="loadingData"
      class="myLoading pt-25 w-100 flex justify-center items-center"
    >
      <van-loading type="spinner" />
    </div>
    <template v-else>
      <basePullRefresh
        v-if="needPullRefresh"
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
                <text class="fs-16">{{ item.symbol1 }}</text>
                <text class="fs-12 text-gray">/ {{ item.symbol2 }}</text>
                <div>
                  <text class="fs-12 text-gray">{{ formatVolume(item.vol) + ' ' + item.symbol2 }}</text>
                </div>
              </div>
              <div class="flex-1 flex justify-end items-center">
                <div class="flex-1 text-right items-center mr-20">{{ item.close }}</div>
                <van-button 
                  class="flex-1 text-right rises_falls_btn" 
                  :class="item.rose > 0 ? 'rise_btn' : 'fall_btn'"
                  style="width: 22.4vw;" 
                  size="small"
                >
                  <text class="fs-14 text-white">{{ formatChange(item.rose) }}</text>
                </van-button>
              </div>
            </div>
          </div>
        </template>
      </basePullRefresh>
      <template v-else>
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
              <text class="fs-16">{{ item.symbol1 }}</text>
              <text class="fs-12 text-gray">/ {{ item.symbol2 }}</text>
              <div>
                <text class="fs-12 text-gray">{{ formatVolume(item.vol) + ' ' + item.symbol2 }}</text>
              </div>
            </div>
            <div class="flex-1 flex justify-end items-center">
              <div class="flex-1 text-right items-center mr-20">{{ item.close }}</div>
              <van-button 
                class="flex-1 text-right rises_falls_btn" 
                :class="item.rose > 0 ? 'rise_btn' : 'fall_btn'"
                style="width: 22.4vw;" 
                size="small"
              >
                <text class="fs-14 text-white">{{ formatChange(item.rose) }}</text>
              </van-button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps, defineEmits, computed, ref, watch, nextTick } from 'vue';
import basePullRefresh from '@/components/basePullRefresh/index.vue'

import { getSymbolsLastPrice } from '@/api/quotes'

// 组件内部状态
const listData = ref<any[]>([])
const sortField = ref('')
const sortDirection = ref('')
const isLoading = ref(false)
const loadingData = ref(true)

const props = defineProps({
  type: {
    type: String,
    default: 'hot'
  },
  // 新增下拉刷新控制参数
  needPullRefresh: {
    type: Boolean,
    default: true
  }
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
// watch(() => props.type, () => {
//   loadData()
// })

// 自主获取数据
const loadData = async () => {
  try {
    loadingData.value = true;
    console.log('开始刷新', loadingData.value, new Date().getTime())
    const params = {
      klineType: props.type,
      // sortField: sortField.value,
      // sortDirection: sortDirection.value
    }
    const data = await getSymbolsLastPrice(params)
    // 问题出在 listData 初始化为空数组时没有指定类型，TypeScript 默认推断为 never[]
    // 这里将 listData 的类型明确指定为 any[]，以解决类型不匹配的问题
    listData.value.push(...data)
    listData.value.forEach((item: any) => {
      item.symbol1 = item.symbol.split('/')[0]
      item.symbol2 = item.symbol.split('/')[1]
      // item.price = item.price.toFixed(2)
    })
    console.log('listData', listData.value)
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setTimeout(() => {
      nextTick(() => {
        loadingData.value = false;
        console.log('结束刷新', loadingData.value, new Date().getTime())
      })
    }, 0)
  }
}

const clearData = () => {
  listData.value = []
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
  const num = Number(volume)
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' // 百万单位
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k' // 千单位
  }
  return num.toString() // 小于 1000 
}

const formatChange = (change:any) => {
  const num = Number(change)
  if (isNaN(num)) return '0.00%'
  
  // 添加正负号并格式化为百分比
  return `${num > 0 ? '+' : ''}${num}%`
}

defineExpose({
  loadData,
  clearData
})

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