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
					<div class="space-y-4 mt-4">
						<InputValidateField
							v-model="form.name"
							label-text="Nombre del producto elaborado"
							placeholder-text="Nombre"
							name="nombre"
							:rules="getRules(['required', 'max:255'])"
							:disabled="type === 'delete'"
						/>
						<CustomSelect
							label-text="Tipo de producto"
							placeholder-text="Seleccione un tipo de producto"
							v-model="form.type_product.id"
							:options="tpStore.typeProductsList"
							:loading="loadingSelect"
							:disabled="type === 'delete'"
							name="tipo de producto"            
							class="mb-2"
							no-options-text="No hay tipos de producto"
							:rules="getRules(['required'])"
						/>
						<CustomSelect
							label-text="Posibles inputs"
							placeholder-text="Seleccione un posible input"
							v-model="form.possible_inputs"
							:options="inputStore.inputProductsSimpleList"
							:loading="loadingSelect"
							:disabled="type === 'delete'"
							name="posibles inputs"            
							class="mb-2"
							mode="multiple"
							:close-on-select="false"
							no-options-text="No hay posibles inputs"
							:rules="getRules(['required'])"
						/>
						<InputValidateField
							v-model="form.min_propane"
							type="number"
							label-text="Mínimo propano"
							placeholder-text="0"
							name="mínimo propano"
							:disabled="type === 'delete'"
							:rules="getRules(['required', 'max:255', 'max_value:1'])"
						/>
						<InputValidateField
							v-model="form.max_propane"
							type="number"
							label-text="Máximo propano"
							placeholder-text="0"
							name="máximo propano"
							:disabled="type === 'delete'"
							:rules="getRules(['required', 'numeric_float', 'min_value:0', 'max_value:1'])"
						/>
						<InputValidateField
							v-model="form.min_butane"
							type="number"
							label-text="Mínimo butano"
							placeholder-text="0"
							name="mínimo butano"
							:disabled="type === 'delete'"
							:rules="getRules(['required', 'max:255', 'max_value:1'])"
						/>
						<InputValidateField
							v-model="form.max_butane"
							type="number"
							label-text="Máximo butano"
							placeholder-text="0"
							name="máximo butano"
							:disabled="type === 'delete'"
							:rules="getRules(['required', 'numeric_float', 'min_value:0', 'max_value:1'])"
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
					</div>
				</template>
				<template #form-actions="{ validate, valid, reset }">
					<Divider class="my-4" />
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
const inputStore = useInputProductStore()
const store = useOutputProductStore()
const tpStore = useTypeProducts()
const loading = ref(false)
const loadingSelect = ref(true)
const form = reactive({
	type_product: { id: null },
	possible_inputs : []
})
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
	add: 'Nuevo producto elaborado',
	edit: 'Editar producto elaborado',
	delete: 'Eliminar producto elaborado'
}

const subtitles = {
	add: `Crear un registro de un producto elaborado`,
	edit: `Cambiar los datos del producto elaborado`,	
	delete: `Remover permanentemente el registro de un producto elaborado`
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
	await inputStore.getInputProductsSimpleList()
	await tpStore.getTypeProductsList()
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
		if (key !== 'possible_inputs') form[key] = props.item[key]
		else form.possible_inputs = props.item.possible_inputs.map(pi => pi.id)
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
	add: 'addOutputProduct',
	edit: 'editOutputProduct',
	delete: 'deleteOutputProduct',
}
const submitForm = async (values, actions) => {
	loading.value = true 
	let possibleInputPayload = {}
	payload = {
		id: props.item.id,
		type_product_id: form.type_product.id,
		name: form.name,
		min_propane: form.min_propane,
		max_propane: form.max_propane,
		min_butane: form.min_butane,
		max_butane: form.max_butane,
    density: form.density,
	}
	if (props.type === 'edit') {
		form.possible_inputs.forEach(async formPossibleInput => {
			if (!props.item.possible_inputs.map(i => i.id).some(PossibleInput => 
				PossibleInput === formPossibleInput)) {
				possibleInputPayload = {
					output_product_id: form.id, 
					input_product_id: formPossibleInput
				}
				await store.addPossibleInput(possibleInputPayload)
			}
		})
		props.item.possible_inputs.forEach(async propPossibleInput => {
      if (!form.possible_inputs.some(PossibleInput => 
      PossibleInput === propPossibleInput.id)) {
        await store.deletePossibleInput(propPossibleInput.possible_input_id)
			}
		})
	}
	
	const status = await store[crudMethodNames[props.type]](payload)
	if (status === 201 && props.type === 'add') {
		form.possible_inputs.forEach(async PossibleInput => {
			possibleInputPayload = {
				output_product_id: store.newOutputProduct.id, 
				input_product_id: PossibleInput
			}
			await store.addPossibleInput(possibleInputPayload)
		})		
	}
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>