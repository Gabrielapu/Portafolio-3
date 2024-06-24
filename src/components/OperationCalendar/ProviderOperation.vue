<template>
  <BaseTable
    :headers="operationsByProvider.headers"
    :data="operationsByProvider.data"
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
let operationsByProvider = ref([])
const loading = ref(false)
const store = useOperationStore()
const excludedHeaders = ['Proveedor']
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
  operationsByProvider.value = []
  await store.getProviderOperationList(props.selectedDate)
  operationsByProvider.value = store.operationsByProvider.results
  specialHeaders = operationsByProvider.value.headers
    .filter(header => !excludedHeaders.includes(header.text) )
  loading.value = false
}

const addModifiedRow = (row, item) => {
  if(!/^[01]$/.test(item.value)) {
    toast.error('El valor debe ser 0 o 1.')
    return
  }
  item.edited = true
  item.asInput = false
  item.value = parseFloat(item.value)
  const presentItem = modifiedItems.value.includes(row.provider)
  if(!presentItem) modifiedItems.value.push(row.provider)
}

const saveChanges = async () => {
  if(!modifiedItems.value.length) return
  const payload = {
    date: `${props.selectedDate.year}-${props.selectedDate.month}`,
    data: operationsByProvider.value.data
      .filter(item => modifiedItems.value.includes(item.provider))
  }
  const status = await store.updateProviderOperationCalendar(payload)
  if(status === 200) toast.success('Cambios guardados')
  await requestItems()
}

defineExpose({ saveChanges })
</script>