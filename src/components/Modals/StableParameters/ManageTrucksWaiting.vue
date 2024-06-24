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
            v-model="form.product_type"
            :options="['Input','Elaborado']"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="tipo de producto"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay productos"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Producto"
            placeholder-text="Seleccione un producto"
            v-model="form.selected_product"
            :options="computedProductList"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="producto"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay productos para el tipo seleccionado"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Planta"
            placeholder-text="Seleccione una planta"
            v-model="form.plant.id"
            :options="plantsStore.simplePlants"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="planta"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas"
            :rules="getRules(['required'])"
          />
          <InputValidateField 
            label-text="Mínimo camiones"
            v-model.number="form.min_trucks"
            placeholder-text="0"
            name="mínimo camiones"
            :disabled="type === 'delete'"
            :rules="getRules(['required', 'integer'])"
            class="mb-2"
          />
          <InputValidateField 
            label-text="Máximo camiones"
            v-model.number="form.max_trucks"
            placeholder-text="0"
            name="máximo camiones"
            :disabled="type === 'delete'"
            :rules="getRules(['required', 'integer'])"
            class="mb-2"
          />
          <label class="text-slate-400">
            Fecha
          </label>
          <DatePicker 
            class="mb-2" 
            v-model="form.date" 
            label="Fecha de inicio de mantención" 
            size="md"
            format="MM/yyyy"
            :showTrigger="false"
            :disabled="type === 'delete'"
            :monthPicker="true"
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
const dayjs = inject('dayjs')
const plantsStore = usePlantsStore()
const store = useTrucksRangeStore()
const loading = ref(false)
const loadingSelect = ref(true)
const inputProductsStore = useInputProductStore()
const outputProductsStore = useOutputProductStore()
const form = reactive({
  plant: {id: null},
})
const FIRST_PAGE = 1
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
  add: 'Agregar rango de camiones',
  edit: 'Editar mantenimiento',
  delete: 'Eliminar mantenimiento'
}
const subtitles = {
  add: `Crear registro de un rango de camiones`,
  edit: `Cambiar los datos del mantenimiento`,
  delete: `Eliminar permanentemente el registro de un mantenimiento`
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
  const currentDate = new Date()
  form.date = {
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  }
	if(props.type !== 'add') {
		populateForm()
	}
	await plantsStore.getPlantsSimpleList()
  await inputProductsStore.getInputProductsSimpleList()
  await outputProductsStore.getOutputProductsSimpleList()
	loadingSelect.value = false
})
const computedProductList = computed(() => {
  if(form.product_type === 'Input') {
    return inputProductsStore.inputProductsSimpleList
  }
  if(form.product_type === 'Elaborado') {
    return outputProductsStore.outputProductsSimpleList
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
  if (props.item.is_elaborated) {
    form.product_type = 'Elaborado'
    form.selected_product = props.item.elaborated_product.id
  }
  else {
    form.product_type = 'Input'
    form.selected_product = props.item.input_product.id
  }
  form.date = {
    month: props.item.month - 1,
    year: props.item.year
  }
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
  add: 'addTrucksRange',
  edit: 'editTrucksRange',
  delete: 'deleteTrucksRange',
}
const submitForm = async (values, actions) => {
	loading.value = true 
  payload = {
    id: form.id,
    year: form.date.year,
    month: form.date.month + 1,
    is_elaborated: form.product_type === 'Elaborado',
    is_input: form.product_type === 'Input',
    input_product_id: form.product_type === 'Input' ? form.selected_product : null,
    elaborated_product_id: form.product_type === 'Elaborado' ? form.selected_product : null,
    plant_id: form.plant.id,
    min_trucks: form.min_trucks,
    max_trucks: form.max_trucks,
	}
	await store[crudMethodNames[props.type]](payload)
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>