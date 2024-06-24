<template>
  <BaseTable
    :headers="operationsByPlant.headers"
    :data="operationsByPlant.data"
    :loading="loading"
    horizontalScroll
    hide-duplicate-button
    hide-delete-button
    hide-edit-button
  >
    <template v-for="column in specialHeaders" #[`${column.value}`]="{ item }">
      <div v-if="!!item[column.value].asInput" class="w-10">
        <InputValidateField                 
          v-model="item[column.value].value"
          placeholder-text="0"
          @blur="addModifiedRow(item, item[column.value])"
        />
      </div>
      <p 
        v-else
        class="my-1 mx-2 cursor-pointer hover:scale-150 ease-in duration-100"
        @dblclick="item[column.value].asInput = true"
        :class="{ 'font-bold text-amber-500': item[column.value].edited }"
      >
        {{ item[column.value].value }}
      </p>
    </template>
  </BaseTable>
</template>

<script setup>
const toast = inject('toast')
const props = defineProps({
  selectedDate: { type: Object, default: '' },
  reload: { type: Boolean, default: false }
})
let operationsByPlant = ref([])
const loading = ref(false)
const store = useOperationStore()
const excludedHeaders = ['Planta']
let specialHeaders = reactive([])
let modifiedItems = ref([])

watch(() => props.selectedDate, () => {
  requestItems()
})

watch(() => props.reload, (reload) => {
  if (reload) requestItems()
})

const requestItems = async () => {
  loading.value = true
  operationsByPlant.value = []
  await store.getPlantOperationList(props.selectedDate)
  operationsByPlant.value = store.operationsByPlant.results
  specialHeaders = operationsByPlant.value.headers
    .filter(header => !excludedHeaders.includes(header.text) )
  loading.value = false
}

const addModifiedRow = (row, item) => {
  if(!/^(0(\.\d+)?|1(\.0+)?)$/.test(item.value)) {
    toast.error('El valor debe ser entre 0 y 1.')
    return
  }
  item.edited = true
  item.asInput = false
  item.value = parseFloat(item.value)
  const presentItem = modifiedItems.value.includes(row.plant)
  if(!presentItem) modifiedItems.value.push(row.plant)
}

const saveChanges = async () => {
  if(!modifiedItems.value.length) return
  const payload = {
    date: `${props.selectedDate.year}-${props.selectedDate.month}`,
    data: operationsByPlant.value.data
      .filter(item => modifiedItems.value.includes(item.plant))
  }
  const status = await store.updatePlantOperationCalendar(payload)
  if(status === 200) toast.success('Cambios guardados')
  await requestItems()
}

defineExpose({ saveChanges })
</script>