<template>
  <div class="flex justify-end items-center">
    <div class="bg-white rounded flex items-center border w-56 border-slate-300">
      <Button
        class="px-1"
        color="default" 
        icon-size="lg" 
        :shadow="false"
        icon="uil:angle-left" 
        icon-only
        @click="modifyDate('prev')" 
      />
      <div class="w-full border-x py-0.5 px-3 text-center">{{ computedMonthYear }}</div>
      <Button
        class="px-1"
        color="default" 
        icon-size="lg" 
        :shadow="false"
        icon="uil:angle-right" 
        icon-only
        @click="modifyDate('add')" 
      />
    </div>
  </div>
</template>

<script setup>
import useCapitalizeFirstChar from '@/composables/useCapitalizeFirstChar'

const dayjs = inject('dayjs');
const emit = defineEmits(['queryDate'])

let date = ref(dayjs())

onBeforeMount(() => {
  emitDate()
})

const computedMonthYear = computed(() => {
  const d = date.value.format('MMMM YYYY')
  return useCapitalizeFirstChar(d)
})

const modifyDate = (direction) => {
  if (direction === 'prev') {
    date.value = date.value.subtract(1, 'month')
  } else {
    date.value = date.value.add(1, 'month')
  }
  emitDate()
}

const emitDate = () => {
  emit('queryDate', { 
    month: date.value.format('MM'), 
    year: date.value.format('YYYY'),
    fullDate: computedMonthYear.value
  })
}
</script>