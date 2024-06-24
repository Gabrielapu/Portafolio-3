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
            no-options-text="No hay productos"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Proveedor"
            placeholder-text="Seleccione un proveedor"
            v-model="form.provider.id"
            :options="providersStore.providersPipelinesList"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="proveedor"            
            class="mb-2"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
            @change="form.plant.id = null"
          />
          <CustomSelect
            label-text="Planta destino"
            placeholder-text="Seleccione una planta"
            v-model="form.plant.id"
            :options="computedPlantsList"
            :loading="loadingSelect"
            :disabled="type !== 'add'"
            name="planta"            
            class="mb-2"
            no-options-text="No hay plantas"
            :rules="getRules(['required'])"
          />
          <InputValidateField 
            label-text="Toneladas"
            v-model.number="form.tons"
            placeholder-text="0"
            name="toneladas"
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
const dayjs = inject('dayjs')
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
let payload = {}
const store = useCommitedPipelineSuppliesStore()
const providersStore = useProvidersStore()
const inputProductsStore = useInputProductStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({
  plant: { id: null },
  provider: { id: null },
  input_product: { id: null },
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
  delete: `Eliminar ${getSubtitleDate()}`
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
  await providersStore.getProvidersPipelinesList()
  await inputProductsStore.getInputProductsSimpleList()
  loadingSelect.value = false
})
const computedPlantsList = computed(() => {
  if (!!form.provider.id) {
    const indexOfProvider = providersStore.providersPipelinesList.findIndex(obj => 
      obj.id === form.provider.id)
    return providersStore.providersPipelinesList[indexOfProvider]?.pipelines ?? []	
  }
  return []  
})
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
  add: 'addCommitedPipelineSupply',
  edit: 'editCommitedPipelineSupply',
  delete: 'deleteCommitedPipelineSupply',
}
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    id: form.id,
    month: props.selectedDate.month,
    year: props.selectedDate.year,
    tons: form.tons,
    provider_id: form.provider.id,
    input_product_id: form.input_product.id,
    plant_id: form.plant.id,
    lower_clearance: form.lower_clearance,
    upper_clearance: form.upper_clearance
  }
  await store[crudMethodNames[props.type]](payload)
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>