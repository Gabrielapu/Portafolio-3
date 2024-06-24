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
						label-text="Nombre del proveedor"
						placeholder-text="Nombre"
						name="nombre"
						:rules="getRules(['required', 'max:255'])"
						:disabled="type === 'delete'"
					/>
					<SelectMultiple
						class="mt-2"
						v-model="form.pipelines"
						label-text="Ductos"
						:options="plantsStore.simplePlants"
						placeholder-text="Seleccione"
						:loading="loadingSelect"
						:disabled="type === 'delete'"
					/>
					<InputValidateField
						class="mt-2"
						v-model="form.pipeline_minimum_daily"
						type="number"
						label-text="Mínimo diario ducto (Tons)"
						placeholder-text="0"
						name="mínimo diario"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'max:255'])"
					/>
					<InputValidateField
						class="mt-2"
						v-model="form.pipeline_maximum_daily"
						type="number"
						label-text="Máximo diario ducto (Tons)"
						placeholder-text="0"
						name="máximo diario"
						:disabled="type === 'delete'"
						:rules="getRules(['required', 'numeric_float', 'min_value:0'])"
					/>
					<InputValidateField
						class="mt-2"
						v-model="form.batch_size"
						type="number"
						label-text="Batch"
						placeholder-text="0"
						name="batch"
						:disabled="type === 'delete'"
						:rules="getRules(['numeric', 'min:0'])"
					/>    
					<div class="mt-2">
						<label class="text-slate-400 text-md">
							Es internacional
						</label>
						<Toogle 
							class="my-1"
							:color="type === 'delete' ? 'default' : 'primary'"
							v-model="form.international"
							:disabled="type === 'delete'"
						/>
					</div>
					<InputValidateField
						class="mt-2 mb-4"
						v-model="form.loading_capacity"
						type="number"
						label-text="Capacidad de carga (Camiones)"
						placeholder-text="0"
						name="inventario minimo operacional"
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
	type: {
		type: String,
		default: 'add',
		validator: (value) => ['add', 'edit', 'delete'].includes(value)
	},
})
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
let payload = {}
const plantsStore = usePlantsStore()
const store = useProvidersStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({pipelines : []})

const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
	add: 'Nuevo proveedor',
	edit: 'Editar proveedor',
	delete: 'Eliminar proveedor'
}

const subtitles = {
	add: `Crear un registro de un proveedor`,
	edit: `Cambiar los datos del proveedor`,	
	delete: `Remover permanentemente el registro de un proveedor`
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

onMounted( async() => {
	await plantsStore.getPlantsSimpleList()
	if(props.type !== 'add') {
		populateForm()
	}
	loadingSelect.value = false
})

const getRules = (rules) => {
	return props.type === 'delete' ? [] : rules 
}
const populateForm = () => {
	Object.keys(props.item).forEach((key) => {
		if (key !== 'pipelines') form[key] = props.item[key]
		else form.pipelines = JSON.parse(JSON.stringify(props.item.pipelines))
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
	add: 'addProvider',
	edit: 'editProvider',
	delete: 'deleteProvider',
}
const submitForm = async (values, actions) => {
	loading.value = true 

	payload = {
		id: props.item.id,
		name: form.name,
		loading_capacity: form.loading_capacity,
		has_pipeline: false,
		pipeline_minimum_daily: form.pipeline_minimum_daily,
		pipeline_maximum_daily: form.pipeline_maximum_daily,
		international: form.international,
		batch_size: form.batch_size
	}
	if (form.pipelines?.length > 0) payload.has_pipeline = true
	
	if (props.type === 'edit') {
		form.pipelines.forEach(async formPipeline => {
			if (!props.item.pipelines.some(pipeline => pipeline.id === formPipeline.id)) {
				await store.addPipeline({plant_id: formPipeline.id, provider_id: form.id})
			}
		})
		props.item.pipelines.forEach(async propPipeline => {
			if (!form.pipelines.some(pipeline => pipeline.id === propPipeline.id)) {
				await store.deletePipeline(propPipeline.pipeline_id)
			}
		})
	}
	const status = await store[crudMethodNames[props.type]](payload)
	
	if (status === 201 && props.type === 'add') {
		form.pipelines.forEach(async pipeline => {
			await store.addPipeline({plant_id: pipeline.id, provider_id: store.newProvider.id})
		})		
	}
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>