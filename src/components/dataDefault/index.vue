<template>
  <div class="dataDetault-index">
    <div class="flex flex-col items-center">
      <image
        class="defaultImg"
        src="/static/svg/tools/detault.svg"
        mode="scaleToFill"
      />
      <div class="mt-25 fs-14 text-black ">{{ $t('common.noData') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
</script>

<style lang="scss" scoped>
.dataDetault-index {
  .defaultImg {
    width: 99px;
    height: 101px;
  }
}
</style>