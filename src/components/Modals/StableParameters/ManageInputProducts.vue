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
            v-model="form.type_product.id"
            :options="tpStore.typeProductsList"
            :loading="loading"
            :disabled="type === 'delete'"
            name="tipo de producto"            
            class="mb-2"
            no-options-text="No hay tipos de producto"
            :rules="getRules(['required'])"
          />
          <InputValidateField 
            label-text="Nombre"
            v-model.number="form.name"
            placeholder-text="Nombre"
            name="nombre"
            :disabled="type === 'delete'"
            :rules="getRules(['required'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Porcentaje propano"
            v-model.number="form.propane_percentage"
            placeholder-text="0"
            name="porcentaje de propano"
            :disabled="type === 'delete'"
            :rules="getRules(['max_value:100', 'min_value:0', 'integer', 'required'])"
            class="mb-2"
            :endIcon="'uil:percentage'"
          />
          <InputValidateField 
            label-text="Porcentaje butano"
            v-model.number="form.butane_percentage"
            placeholder-text="0"
            name="porcentaje de botano"
            :disabled="type === 'delete'"
            :rules="getRules(['max_value:100', 'min_value:0', 'integer', 'required'])"
            class="mb-2"
            :endIcon="'uil:percentage'"
          />
          <InputValidateField
							v-model="form.density"
							type="number"
							label-text="Densidad"
							placeholder-text="0"
							name="densidad"
							:disabled="type === 'delete'"
							:rules="getRules(['required', 'numeric_float', 'min_value:0'])"
						/>  
          <Badge
            v-if="!addOneHundred && type !== 'delete'"
            size="sm"
            color='warning'
            :text="'Propano y butano deben sumar 100%'"
            icon="uil:exclamation-triangle"
            class="justify-center mx-5 mt-2"
          />        
        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mb-4" />
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
            :disabled="!addOneHundred && type !== 'delete'"
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
})
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
let payload = {}
const store = useInputProductStore()
const tpStore = useTypeProducts()
const loading = ref(false)
const form = reactive({
  type_product: {id: null},
})
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger'
}
const titles = {
  add: 'Agregar producto de input',
  edit: 'Editar producto de input',
  delete: 'Eliminar producto de input'
}

const subtitles = {
  add: `Agregar producto`,
  edit: `Editar producto`,
  delete: `Eliminar producto`
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

const addOneHundred = computed(() => {
  if(Object.keys(form).length) {
    return (form.butane_percentage) + (form.propane_percentage) === 100
  } else {
    return false
  }
})

onBeforeMount( async() => {
  await tpStore.getTypeProductsList()
  if(props.type !== 'add') {
    populateForm()
  }
})

const getRules = (rules) => {
  return props.type === 'delete' ? [] : rules 
}
const populateForm = () => {
  Object.keys(props.item).forEach((key) => {
    if (key === 'propane_percentage' || key === 'butane_percentage') {
      form[key] = props.item[key]*100
    }
    else form[key] = props.item[key]
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
  add: 'addInputProduct',
  edit: 'editInputProduct',
  delete: 'deleteInputProduct',
}
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    type_product_id: form.type_product.id,
    name: form.name,
    propane_percentage: form.propane_percentage/100,
    butane_percentage: form.butane_percentage/100,
    id: form.id,    
    density: form.density
  }
  await store[crudMethodNames[props.type]](payload)
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>