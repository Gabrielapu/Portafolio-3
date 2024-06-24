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
            label-text="Tipo de producto"
            placeholder-text="Seleccione un tipo de producto"
            v-model="form.product_type"
            :options="['Input','Elaborado']"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="tipo de producto"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay productos"
            :rules="getRules(['required'])"
            @change="form.selected_product.id = null"
          />
          <CustomSelect
            label-text="Producto"
            placeholder-text="Seleccione un producto"
            v-model="form.selected_product.id"
            :options="computedProductList"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="producto"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay productos para el tipo seleccionado"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Transportista"
            placeholder-text="Seleccione un transportista"
            v-model="form.carrier"
            :options="simpleCarrierList"
            :loading="loadingSelect"
            :disabled="type === 'delete' || type === 'edit'"
            name="transportista"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay transportistas"
            :rules="getRules([])"
          />
          <CustomSelect
            label-text="Planta origen"
            placeholder-text="Seleccione una planta"
            v-model="form.origin_plant.id"
            :options="plantsStore.loaderPlants"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="planta origen"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas"
            :rules="getRules(['required'])"
            @change="form.destination_plant.id = null"
          />
          <CustomSelect
            label-text="Planta destino"
            placeholder-text="Seleccione una planta"
            v-model="form.destination_plant.id"
            :options="computedDestinationList"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="planta destino"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas para el origen seleccionado"
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
const dayjs = inject('dayjs')
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
let payload = {}
const store = useCommitedTransferTripsStore()
const plantsStore = usePlantsStore()
const inputProductsStore = useInputProductStore()
const outputProductsStore = useOutputProductStore()
const carriersStore = useCarriersStore()
const loading = ref(false)
const loadingSelect = ref(true)
const simpleCarrierList = ref([])
const form = reactive({
  origin_plant: { id: null },
  destination_plant: { id: null },
  input_product: { id: null },
  elaborated_product: { id: null },
  selected_product: { id: null },
  product_type: null,
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
  simpleCarrierList.value = carriersStore.carriersSimpleList
  await plantsStore.getLoaderPlantsList()
  await inputProductsStore.getInputProductsSimpleList()
  await outputProductsStore.getOutputProductsSimpleList()
  loadingSelect.value = false
})
const getRules = (rules) => {
  return props.type === 'delete' ? [] : rules 
}
const computedDestinationList = computed(() => {
  if (!!form.origin_plant.id) {
    const indexOfLoader = plantsStore.loaderPlants.findIndex(obj => obj.id === form.origin_plant.id)
    return plantsStore.loaderPlants[indexOfLoader]?.destination_plants ?? []	
  }
  return []
})

const populateForm = () => {
  Object.keys(props.item).forEach((key) => {
    form[key] = props.item[key]
  })
  form.selected_product = props.item.is_elaborated
    ? props.item.elaborated_product
    : props.item.input_product
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
const computedProductList = computed(() => {
  if(form.product_type === 'Input') {
    return inputProductsStore.inputProductsSimpleList
  }
  if(form.product_type === 'Elaborado') {
    return outputProductsStore.outputProductsSimpleList
  }
  return []
})
const crudMethodNames = {
  add: 'addCommitedTransferTrip',
  edit: 'editCommitedTransferTrip',
  delete: 'deleteCommitedTransferTrip',
}
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    id: form.id,
    year: props.selectedDate.year,
    month: props.selectedDate.month,
    trips: form.trips,
    lower_clearance: form.lower_clearance,
    upper_clearance: form.upper_clearance,
    is_input: form.product_type === "Input",
    is_elaborated: form.product_type === "Elaborado",
    input_product_id: form.selected_product.id || null,
    elaborated_product_id: form.selected_product.id || null,
    origin_plant_id: form.origin_plant.id,
    destination_plant_id: form.destination_plant.id,
    carrier: form.carrier,
  }
  await store[crudMethodNames[props.type]](payload)
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>