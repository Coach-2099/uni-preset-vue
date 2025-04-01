<template>
  <div class="baseVCodeButton-temp">
    <van-button @click="handleClick" type="primary" :disabled="disabled || isCounting">
      {{ displayText }}
    </van-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  countdown: {
    type: Number,
    default: 60
  }
})

const emit = defineEmits(['get-code'])

const currentCount = ref(0)
const isCounting = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const displayText = computed(() => {
  return isCounting.value 
    ? `${currentCount.value}${t('common.tryAgain')}`
    : t('common.getVCode')
})

const startCountdown = () => {
  if (isCounting.value) return
  
  currentCount.value = props.countdown
  isCounting.value = true
  
  timer = setInterval(() => {
    currentCount.value--
    if (currentCount.value <= 0) {
      stopCountdown()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isCounting.value = false
}

const handleClick = () => {
  if (!isCounting.value) {
    emit('get-code')
    startCountdown()
  }
}

// 自动清理定时器
onBeforeUnmount(stopCountdown)

</script>

<style lang="scss" scoped>
.baseVCodeButton-temp {

}
</style>