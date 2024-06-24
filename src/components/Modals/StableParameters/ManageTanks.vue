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
						class="mt-2 mb-2"
						v-model="form.name"
						label-text="Nombre"
						placeholder-text="Nombre del tanque"
						name="nombre"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'max:255'])"
					/>
          <CustomSelect
            label-text="Planta"
            placeholder-text="Seleccione una planta"
            v-model="form.source_plant.id"
            :options="plantsStore.simplePlants"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="origen"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
          />
					<InputValidateField
						class="mt-2 mb-4"
						v-model="form.capacity"
						type="number"
						label-text="Capacidad"
						placeholder-text="0"
						name="capacidad"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'numeric_float', 'min_value:0', 'max_decimals:3'])"
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
	selectedPlant: { type: Number, default: null },
	type: {
		type: String,
		default: 'add',
		validator: (value) => ['add', 'edit', 'delete'].includes(value)
	},
})
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
let payload = {}
const plantsStore = usePlantsStore()
const store = usePlantTanksStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({
  source_plant: {id: null},
  destination_plant	: {id: null},
})
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
	add: 'Agregar tanque',
	edit: 'Editar tanque',
	delete: 'Eliminar tanque'
}
const subtitles = {
	add: 'Crear registro de un nuevo tanque',
	edit: 'Cambiar los datos de un tanque',
	delete: 'Eliminar permanentemente el registro de un tanque'
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
	form.source_plant.id = props.selectedPlant
	await plantsStore.getPlantsSimpleList()
	loadingSelect.value = false
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
	add: 'addPlantTank',
	edit: 'editPlantTank',
	delete: 'deletePlantTank',
}
const submitForm = async (values, actions) => {
	loading.value = true 
	payload = {
		id: props.item.id,
		name: form.name,
		capacity: form.capacity,
		plant_id: form.source_plant.id
	}
	await store[crudMethodNames[props.type]](payload)
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>