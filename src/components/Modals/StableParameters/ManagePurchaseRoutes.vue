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
            label-text="Proveedor"
            placeholder-text="Seleccione un proveedor"
            v-model="form.source_provider_id"
            :options="providersStore.providersNationalSimpleList"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="destino"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Planta de destino"
            placeholder-text="Seleccione una planta"
            v-model="form.destination_id"
            :options="plantsStore.simplePlants"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="destino"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas"
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
	selectedProvider: { type: Number, default: null },
	type: {
		type: String,
		default: 'add',
		validator: (value) => ['add', 'edit', 'delete'].includes(value)
	},
})
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
let payload = {}
const plantsStore = usePlantsStore()
const providersStore = useProvidersStore()
const store = usePurchaseRoutesStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({})
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
	add: 'Agregar ruta de proveedor',
	edit: 'Editar ruta de proveedor',
	delete: 'Eliminar ruta de proveedor'
}
const subtitles = {
	add: `Crear una nueva ruta de proveedor`,
	edit: `Cambiar los datos de una ruta de proveedor`,
	delete: `Eliminar permanentemente una ruta de proveedor`
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
	form.source_provider_id = props.selectedProvider
	await plantsStore.getPlantsSimpleList()
	await providersStore.getNationalProvidersList()
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
	add: 'addPurchaseRoute',
	edit: 'editPurchaseRoute',
	delete: 'deletePurchaseRoute',
}
const submitForm = async (values, actions) => {
	loading.value = true 
	payload = {
		id: props.item.id,
		provider_id: form.source_provider_id,
		travel_time: form.travel_time,
		plant_id: form.destination_id
	}
	await store[crudMethodNames[props.type]](payload)
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>