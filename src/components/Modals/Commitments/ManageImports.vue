<template>
  <BaseModal
    :value="modelValue"
    :title="titles[type]"
    :subtitle="subtitles[type]"
    @close="closeModal(false)"
  >
    <template #content>
      <BaseForm id="modal-form" @submit="submitForm">
        <template #form-inputs>
          <CustomSelect
            label-text="Producto"
            placeholder-text="Seleccione un producto"
            v-model="form.input_product.id"
            :options="inputProductsStore.inputProductsSimpleList"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="producto"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay productos"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Transportista"
            placeholder-text="Seleccione un transportista"
            v-model="form.carrier.id"
            :options="carriersStore.carriersSimpleList"
            :loading="loadingSelect"
            :disabled="type === 'delete' || type === 'edit'"
            name="transportista"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay transportistas"
            :rules="getRules([])"
          />
          <CustomSelect
            label-text="Proveedor"
            placeholder-text="Seleccione un proveedor"
            v-model="form.provider.id"
            :options="computedProviderList"
            :loading="loadingSelect"
            :disabled="type !== 'add' "
            name="name"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
            @update:modelValue="onProviderChange()"
          />
          <CustomSelect
            label-text="Paso fronterizo"
            placeholder-text="Seleccione un paso"
            v-model="form.border_crossing.id"
            :options="computedBorderCrossingList"
            :loading="loadingSelect"
            :disabled="type === 'delete' || type === 'edit'"
            name="paso fronterizo"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay destinos para el origen seleccionado"
            :rules="getRules(['required'])"
            @update:modelValue="onBorderCrossingChange()"
          />
          <CustomSelect
            label-text="Planta destino"
            placeholder-text="Seleccione una planta"
            v-model="form.plant.id"
            :options="computedPlants"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="planta"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas para el proveedor seleccionado"
            :rules="getRules(['required'])"
          />
          <InputValidateField 
            label-text="Viajes"
            v-model.number="form.trips"
            placeholder-text="0"
            name="viajes"
            :disabled="type === 'delete'"
            :rules="getRules(['required', 'integer'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Holgura inferior"
            v-model.number="form.lower_clearance"
            placeholder-text="0"
            name="holgura inferior"
            :disabled="type === 'delete'"
            :rules="getRules(['required', 'integer'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Holgura superior"
            v-model.number="form.upper_clearance"
            placeholder-text="0"
            name="holgura superior"
            :disabled="type === 'delete'"
            :rules="getRules(['required', 'integer'])"
            class="mb-2"
          />

        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mt-8 mb-4" />
          <Button
            form="modal-form"
            size="lg"
            width="full"
            :color="colors[type]"
            :label="buttonLabels[type]"
            uppercase
            :icon="iconNames[type]"
            :loading="loading"
            @click.native="validate"
          />
        </template>
      </BaseForm>
    </template>
  </BaseModal>
</template>
  
<script setup>

const props = defineProps({
  modelValue: { type: Boolean, default: false, required: true },
  item: { type: Object, default: null },
  type: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit', 'delete'].includes(value)
  },
  selectedDate: { type: Object, default: '' },
})
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
const dayjs = inject('dayjs')
let payload = {}
const store = useCommitedProviderTripsStore()
const committedSupplierStore = useCommitedProviderTripsStore()
const inputProductsStore = useInputProductStore()
const carriersStore = useCarriersStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({
  plant: { id: null },
  provider: { id: null  },
  input_product: { id: null },
  border_crossing: { id: null },
  carrier: { id: null },
})
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger'
}
const titles = {
  add: 'Agregar compromiso',
  edit: 'Editar compromiso',
  delete: 'Eliminar compromiso'
}
const getSubtitleDate = () => {
  return 'compromiso en ' +
  useCapitalizeFirstChar(dayjs(props.selectedDate.month).format('MMMM'))
  + ` ${props.selectedDate.year}`
}
const subtitles = {
  add: `Agregar ${getSubtitleDate()}`,
  edit: `Editar ${getSubtitleDate()}`,
  delete: `Eliminar ${getSubtitleDate()}`,
}
const buttonLabels = {
  add: 'Crear',
  edit: 'Guardar cambios',
  delete: 'Eliminar'
}
const iconNames = {
  add: 'uil:plus',
  edit: 'uil:edit',
  delete: 'uil:trash-alt'
}
onBeforeMount( async() => {
  if(props.type !== 'add') {
    populateForm()
  }
})
onMounted( async() => {
  await carriersStore.getCarriersSimpleList()
  await committedSupplierStore.getCommitedProviderTrips()
  await inputProductsStore.getInputProductsSimpleList()
  loadingSelect.value = false
})

const computedProviderList = computed(() => {
  return committedSupplierStore.commitedProviderTripsSimpleList.providers
})

const computedBorderCrossingList = computed(() => {
  if(!form.provider.id) return []
  return computedProviderList.value
    ?.find(provider => provider.id === form.provider.id)?.border_crossings
})

const computedPlants = computed(() => { 
  if(!form.border_crossing.id) return []
  return computedBorderCrossingList.value
    ?.find(border => border.id === form.border_crossing.id)?.plants
})

const onProviderChange = () => {
  form.border_crossing.id = null
  form.plant.id = null
}

const onBorderCrossingChange = () => {
  form.plant.id = null
}

const getRules = (rules) => {
  return props.type === 'delete' ? [] : rules 
}
const populateForm = () => {
  Object.keys(props.item).forEach((key) => {
    form[key] = props.item[key]
  })
}
const closeModal = (reload) => {
  emit('update:modelValue', !props.modelValue)
  resetValues()
  if (reload) {
    emit('reload')
  } 
  emit('close')
}
const resetValues = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}    
const crudMethodNames = {
  add: 'addCommitedProviderTrip',
  edit: 'editCommitedProviderTrip',
  delete: 'deleteCommitedProviderTrip',
}
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    month: props.selectedDate.month,
    year: props.selectedDate.year,
    trips: form.trips,
    lower_clearance: form.lower_clearance,
    upper_clearance: form.upper_clearance,
    input_product_id: form.input_product.id,
    provider_id: form.provider.id,
    plant_id: form.plant.id,
    id: form.id,
    carrier_id: form.carrier.id,
    border_crossing_id: form.border_crossing.id,
  }
  await store[crudMethodNames[props.type]](payload)
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>