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
            v-model="form.name"
            label-text="Nombre de la planta"
            placeholder-text="Nombre"
            name="nombre"
            :rules="getRules(['required', 'max:255'])"
          />
					<InputValidateField
						class="mt-2"
						v-model="form.discharge_capacity"
						type="number"
						label-text="Capacidad de descarga"
						placeholder-text="0"
						name="capacidad de descarga"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'max:255'])"
					/>
          <InputValidateField
						class="mt-2"
						v-model="form.butane_max_percentage"
						type="number"
						label-text="Butano máximo (%)"
						placeholder-text="0"
						name="butanos máximo"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'numeric', 'min_value:0', 'max_value:100', 'max:3'])"
					/>   
          <InputValidateField
            class="mt-2"
            v-model="form.desired_minimum_inventory"
            type="number"
            label-text="Inventario mínimo deseable (%)"
            placeholder-text="0"
            name="inventario minimo deseado"
						:disabled="type === 'delete'"
            :rules="getRules(['required', 'numeric', 'min_value:0', 'max_value:100', 'max:3'])"
          />
          <InputValidateField
            class="mt-2"
            v-model="form.operational_minimum_inventory"
            type="number"
            label-text="Inventario mínimo operacional (%)"
            placeholder-text="0"
            name="inventario minimo operacional"
						:disabled="type === 'delete'"
            :rules="getRules(['required', 'numeric', 'min_value:0', 'max_value:100', 'max:3'])"
          />     
					<div class="my-4">
						<label class="text-slate-400 text-md">
								Puede cargar
						</label>
						<Toogle 
							class="my-1"
							color="primary"
							v-model="form.can_load"
							:disabled="type === 'delete'"
						/>
					</div>
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
const store = usePlantsStore()
const loading = ref(false)
const form = reactive({})
const colors = {
  add: 'primary',
  edit: 'primary',
  delete: 'danger'
}
const titles = {
  add: 'Agregar planta',
  edit: 'Editar planta',
  delete: 'Eliminar planta'
}

const subtitles = {
  add: `Crear registro de una nueva planta`,
  edit: `Cambiar los datos de la planta`,
  delete: `Eliminar permanentemente el registro de una planta`
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
const crudMethodNames = {
  add: 'addPlant',
  edit: 'editPlant',
  delete: 'deletePlant',
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
const submitForm = async (values, actions) => {
  loading.value = true 
  payload = {
    name: form.name,
    discharge_capacity: form.discharge_capacity,
    desired_minimum_inventory: form.desired_minimum_inventory / 100,
    operational_minimum_inventory: form.operational_minimum_inventory / 100,
    butane_max_percentage: form.butane_max_percentage / 100,
		can_load: form.can_load,
		id: props.item.id,
  }
  await store[crudMethodNames[props.type]](payload)
  loading.value = false
  actions.resetForm()
  closeModal(true)
}
</script>