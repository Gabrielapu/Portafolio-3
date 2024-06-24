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
						label-text="Tipo de flete"
						placeholder-text="Nombre"
						v-model="form.freight_type"
						:options="freightTypeOptions"
						:disabled="type === 'delete' || type === 'edit'"
						name="tipo de flete"            
						class="mb-2"
						label-for-select="name"
						no-options-text="No hay proveedores"
						:rules="getRules(['required'])"
            @update:modelValue="onFreightTypeChange()"
					/>
          <CustomSelect
            label-text="Origen"
            :placeholder-text="!form.freight_type ? 'Seleccione un tipo de flete' : 'Nombre'"
            v-model="form.source_id"
            :options="computedOriginList"
            :loading="loadingSelect"
            :disabled="type === 'delete' || !form.freight_type"
            name="origen"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay registro de origenes"
            :rules="getRules(['required'])"
						@update:modelValue="onOriginChange()"
          />
					<CustomSelect
						v-if="!!computedBorderCrossingList.length && form.freight_type === 'Proveedor'"
            label-text="Paso fronterizo"
            placeholder-text="Seleccione un paso"
            v-model="form.border_crossing_id"
            :options="computedBorderCrossingList"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="paso fronterizo"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay destinos para el origen seleccionado"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Destino"
            :placeholder-text="!form.freight_type ? 'Seleccione un tipo de flete' : 'Nombre'"
            v-model="form.destination_id"
            :options="computedDestinationList"
            :loading="loadingSelect"
            :disabled="type === 'delete' || !form.freight_type"
            name="destino"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay destinos para el origen seleccionado"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="USD"
            placeholder-text="Seleccione"
            v-model="form.usd"
            :options="usdOptions"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="usd"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay proveedores"
            :rules="getRules(['required'])"
          />
					<InputValidateField
						class="mt-2 mb-4"
						label-text="Valor"
						v-model="form.value"
						type="number"
						placeholder-text="0"
						name="valor"
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
	carrier: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue', 'reload', 'close'])
let payload = {}
const plantsStore = usePlantsStore()
const providersStore = useProvidersStore()
const store = useRatesStore()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({})
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
	add: 'Nueva tarifa',
	edit: 'Editar tarifa',
	delete: 'Eliminar tarifa'
}
const subtitles = {
	add: `Crear un registro de tarifa`,
	edit: `Cambiar los datos de una tarifa`,
	delete: `Eliminar permanentemente el registro de una tarifa`
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
const usdOptions = ["VERDADERO", "FALSO"]
const freightTypeOptions = ["Proveedor","Transferencia"]

onBeforeMount( async() => {
	await plantsStore.getPlantsSimpleList()
	await plantsStore.getLoaderPlantsList()
	await providersStore.getLoaderProviderList()
	loadingSelect.value = false
	if(props.type !== 'add') {
		populateForm()
	}
})

const onFreightTypeChange = () => {
	if(form.source_id) form.source_id = null
}

const onOriginChange = () => {
	if(form.destination_id) form.destination_id = null
	if(form.border_crossing_id) form.border_crossing_id = null
}

const computedOriginList = computed(() => {
	if(form.freight_type === 'Transferencia') {
		return plantsStore.loaderPlants
	}
  else if(form.freight_type === 'Proveedor') {
		return providersStore.loaderProvidersList
  }
  else return []
})

const computedDestinationList = computed( () => {
	if(form.freight_type === 'Transferencia') {
    const indexOfLoader = plantsStore.loaderPlants
			.findIndex(obj => obj.id === form.source_id)
    return plantsStore.loaderPlants[indexOfLoader]?.destination_plants ?? []
	}
  if(form.freight_type === 'Proveedor') {
		const provider = providersStore.loaderProvidersList
			.find(provider => provider.id === form.source_id)
		if(provider && provider.international) {
			const border = provider.border_crossings
				.find(border => border.id === form.border_crossing_id)
			return border?.plants
		}
		else {
			return provider?.plants || []
		}
  }
  return []
})

const computedBorderCrossingList = computed(() => {
	const borders = providersStore.loaderProvidersList
		.find(provider => provider.id === form.source_id)?.border_crossings || []
	return borders
})

const getRules = (rules) => {
	return props.type === 'delete' ? [] : rules 
}
const populateForm = async () => {
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
	add: 'addRate',
	edit: 'editRate',
	delete: 'deleteRate',
}
const submitForm = async (values, actions) => {
	loading.value = true 
	payload = {
		id: form.id,
		carrier: props.carrier,
		freight_type: form.freight_type,
		source: form.source_id,
		destination: form.destination_id,
		border_crossing: form.border_crossing_id,
		usd: form.usd === 'VERDADERO' ? true : false,
		value: form.value,	
		carrier_id: props.carrier,
	}
	await store[crudMethodNames[props.type]](payload)
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>