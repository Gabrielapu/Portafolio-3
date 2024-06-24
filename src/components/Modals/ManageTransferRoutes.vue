<template>
  <BaseModal
    :value="modelValue"
    title="Nueva planta"
    subtitle="Crear nueva planta"
    @close="closeModal(false)"
  >
    <template #content>
      <BaseForm id="create-form" @submit="createNewItem">
        <template #form-inputs>
          <InputValidateField
            v-model="name"
            label-text="Nombre de la planta"
            placeholder-text="Nombre"
            name="nombre"
            :rules="['required', 'max:255']"
          />
        </template>
        <template #form-actions="{ validate, valid, reset }">
          <Divider class="mt-8 mb-4" />
          <Button
            form="create-form"
            size="md"
            width="full"
            color="primary"
            label="Crear planta"
            uppercase
            icon="uil:save"
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
  })
  const emit = defineEmits(['update:modelValue', 'reload'])
  const sStore = useTransferRoutesStore()
  const loading = ref(false)
  const name = ref('')

  const closeModal = (reload) => {
    emit('update:modelValue', !props.modelValue)
    resetValues()
    if(reload) emit('reload')
  }

  const resetValues = () => {
    name.value = ''
    description.value = ''
  }

  const createNewItem = async (values, actions) => {
    loading.value = true
    const payload = {
      name: name.value,
    }
    await sStore.addTransferRoute(payload)
    actions.resetForm()
    closeModal(true)
  }

</script>