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
          <InputValidateField 
            label-text="Nombre de transportista"
            v-model.number="form.name"
            placeholder-text="Nombre"
            name="nombre"
            :disabled="type === 'delete'"
            :rules="getRules(['required'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Camiones de flota"
            v-model.number="form.fleet_trucks"
            placeholder-text="0"
            name="camiones de flota"
            :disabled="type === 'delete'"
            :rules="getRules(['required'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Costo de camión fijo"
            v-model.number="form.truck_fixed_cost"
            placeholder-text="0"
            name="costo de camión fijo"
            :disabled="type === 'delete'"
            :rules="getRules(['required'])"
            class="mb-2"
          />       
          <InputValidateField 
            label-text="Costo de espera de camión"
            v-model.number="form.truck_waiting_cost"
            placeholder-text="0"
            name="costo de espera de camión"
            :disabled="type === 'delete'"
            :rules="getRules(['required'])"
            class="mb-2"
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
            :disabled="!valid && type !== 'delete'"
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
const store = useCarriersStore()
const loading = ref(false)
const form = reactive({})
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger'
}
const titles = {
  add: 'Nuevo transportista',
  edit: 'Editar transportista',
  delete: 'Eliminar transportista'
}

const subtitles = {
  add: `Crear un registro de un transportista`,
  edit: `Cambiar los datos del transportista`,
  delete: `Remover permanentemente el registro de un transportista`
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
  add: 'addCarrier',
  edit: 'editCarrier',
  delete: 'deleteCarrier',
}
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    name: form.name,
    fleet_trucks: form.fleet_trucks,
    truck_fixed_cost: form.truck_fixed_cost,
    truck_waiting_cost: form.truck_waiting_cost,
    id: form.id,
  }
  await store[crudMethodNames[props.type]](payload)
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>