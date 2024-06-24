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
            label-text="Origen"
            placeholder-text="Seleccione una planta"
            v-model="form.source_plant_id"
            :options="plantsStore.loaderPlants"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="origen"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Destino"
            placeholder-text="Seleccione una planta"
            v-model="form.destination_plant_id"
            :options="computedDestinationList"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="destino"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas para esta ruta"
            :rules="getRules(['required'])"
          />
					<InputValidateField
						class="mt-2 mb-4"
						v-model="form.travel_time"
						type="number"
						label-text="Tiempo de viaje (días)"
						placeholder-text="0"
						name="tiempo de viaje"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'numeric_float', 'min_value:0'])"
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
const store = usePlantRoutesStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({})
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
	add: 'Agregar ruta',
	edit: 'Editar ruta',
	delete: 'Eliminar ruta'
}
const subtitles = {
	add: `Crear una nueva ruta`,
	edit: `Cambiar los datos de una ruta`,
	delete: `Eliminar permanentemente una ruta`
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
	form.source_plant_id = props.selectedPlant
	await plantsStore.getPlantsSimpleList()
	await plantsStore.getLoaderPlantsList()
	loadingSelect.value = false
})

const computedDestinationList = computed(() => {
	if (!!form.source_plant_id) {
		if (form.source_plant_id === form.destination_plant_id) form.destination_plant_id = 0
		return plantsStore.simplePlants.filter(item => item.id !== form.source_plant_id)
	}
	return plantsStore.simplePlants
})

const getRules = (rules) => {
	return props.type === 'delete' ? [] : rules 
}
const populateForm = () => {
	Object.keys(props.item).forEach((key) => {
		if (key === 'destination_plant') form.destination_plant_id = props.item[key].id
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
	add: 'addPlantRoute',
	edit: 'editPlantRoute',
	delete: 'deletePlantRoute',
}
const submitForm = async (values, actions) => {
	loading.value = true 
	payload = {
		id: props.item.id,
		travel_time: form.travel_time,
		source_plant_id: form.source_plant_id,
		destination_plant_id: form.destination_plant_id
	}
	await store[crudMethodNames[props.type]](payload)
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>