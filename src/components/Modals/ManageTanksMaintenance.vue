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
            label-text="Planta"
            placeholder-text="Seleccione una planta"
            v-model="form.source_plant.id"
            :options="plantsStore.simplePlants"
            :loading="loadingSelect"
            :disabled="type === 'delete'"
            name="planta"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay plantas"
            :rules="getRules(['required'])"
          />
          <CustomSelect
            label-text="Tanque"
            placeholder-text="Seleccione un tanque"
            v-model="form.tank.id"
            :options="store.plantTanksAllList"
            :loading="loadingSelect || loadingTanks"
            :disabled="type === 'delete'"
            name="tanque"            
            class="mb-2"
            label-for-select="name"
            no-options-text="No hay tanques para la planta seleccionada"
            :rules="getRules(['required'])"
          />
          <label class="text-slate-400">
            Fecha de inicio
          </label>
          <DatePicker 
            class="mb-2" 
            v-model="form.initial_date" 
            label="Fecha de inicio de mantención" 
            size="md"
            format="dd/MM/yyyy"
            :showTrigger="false"
            :disabled="type === 'delete'"
          />
          <label class="text-slate-400">
            Fecha de termino
          </label>
          <DatePicker 
            class="mb-4" 
            v-model="form.end_date" 
            label="Fecha de inicio de mantención" 
            size="md"
            format="dd/MM/yyyy"
            :showTrigger="false"
            :disabled="type === 'delete'"
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
	preSelectedPlant: { type: Number, default: null },
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
const store = usePlantTanksStore()
const loading = ref(false)
const loadingTanks = ref(false)
const loadingSelect = ref(true)
const form = reactive({
  source_plant: {id: null},
  tank	: {id: null},
})
const colors = {
	add: 'primary',
	edit: 'primary',
	delete: 'danger'
}
const titles = {
  add: 'Agregar mantenimiento',
  edit: 'Editar mantenimiento',
  delete: 'Eliminar mantenimiento'
}
const subtitles = {
  add: `Crear registro de un nuevo mantenimiento`,
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
	if(props.type !== 'add') {
		populateForm()
	}
	form.source_plant.id = props.preSelectedPlant
	await plantsStore.getPlantsSimpleList()
  await store.getAllPlantTanksList(form.source_plant.id)
  form.initial_date = dayjs(form.initial_date)
  form.end_date = dayjs(form.end_date)
	loadingSelect.value = false
})
const requestTanks = async (plant_id) => {
  if (!!plant_id) {
    loadingTanks.value = true
    await store.getAllPlantTanksList(plant_id)
    loadingTanks.value = false
  }
}
watch(() => form.source_plant.id, (newVal) => {
  form.tank.id = null
  requestTanks(newVal)
});
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
  add: 'addTankMaintenance',
  edit: 'editTankMaintenance',
  delete: 'deleteTankMaintenance',
}
const submitForm = async (values, actions) => {
	loading.value = true 
	payload = {
    initial_date : form.initial_date,
    end_date: form.end_date,
    tank_id: form.tank.id,
    id: form.id,
	}
	await store[crudMethodNames[props.type]](payload)
	loading.value = false
	actions.resetForm()
	closeModal(true)
}
</script>