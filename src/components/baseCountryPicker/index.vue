<template>
  <van-popup 
    :show="modelValue" 
    position="bottom"
    @update:show="$emit('update:modelValue', $event)"
    @close="$emit('update:modelValue', false)"
  >
    <van-picker
      :columns="countryCodeArray"
      :model-value="selectedValue"
      @confirm="handleConfirm"
      @cancel="$emit('update:modelValue', false)"
    >
      <template #option="option">
        <img
          :src="option.flag"
          alt="flag"
          style="width: 25px; height: 18px; margin-right: 5px;" />
        {{ option.text }}
      </template>
    </van-picker>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { COUNTRY_LIST } from '@/utils/countries';

defineProps({
  modelValue: Boolean,
  selectedValue: {
    type: [],  // 允许两种类型
    default: () => {[]}
  },
});

interface PickerConfirmEvent {
  selectedValues: number[];
  selectedOptions: { value: number; text: string }[];
}

const countryCodeArray = ref(COUNTRY_LIST);

const emit = defineEmits(['update:modelValue', 'confirm']);

const handleConfirm = ({ selectedValues, selectedOptions }: PickerConfirmEvent) => {
  emit('confirm', { 
    ...selectedOptions,
    selectedValues
  });
  emit('update:modelValue', false);
};
</script>