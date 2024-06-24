<template>
  <BaseHeader :title="title" :subtitle="subtitle" :subtitle2="subtitle2">
    <template #badge>
      <slot name="badge"></slot>
    </template>
    <template #actions>
      <div v-if="hasFiltersSlot" class="w-60">
        <slot name="filters"></slot>
      </div>
      <Button 
        v-if="!hideDownloadTemplateButton" 
        class="mr-2" 
        color="default" 
        :label="downloadLabel" 
        uppercase
        icon="uil:download-alt" 
        :loading="loadingDownload"
        @click.native="emit('openModal', 'download')" 
        :disabled="disabledDownload" 
      />
      <Button 
        v-if="!hideUploadTemplateButton" 
        color="default" 
        label="Subir plantilla" 
        uppercase 
        icon="uil:upload"
        @click.native="emit('openModal', 'upload')" 
      />
      <Button 
        v-if="!hideNewItemButton" 
        class="ml-2" 
        size="md" 
        color="primary" 
        :label="newItemLabel"
        :loading="loadingNewItem" 
        :disabled="disableNewItemButton" 
        uppercase 
        :icon="newItemIcon"
        @click.native="emit('newItem')" 
      />
    </template>
  </BaseHeader>
</template>

<script setup>
const emit = defineEmits(['newItem', 'openModal'])
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  subtitle2: { type: String, required: false },
  newItemLabel: { type: String },
  downloadLabel: { type: String, default: 'Descargar plantilla' },
  newItemIcon: { type: String, default: "uil:plus" },
  disableNewItemButton: { type: Boolean, default: false },
  loadingNewItem: { type: Boolean, default: false },
  loadingDownload: { type: Boolean, default: false },
  disabledDownload: { type: Boolean, default: false },
  hideNewItemButton: { type: Boolean, default: false },
  hideDownloadTemplateButton: { type: Boolean, default: false },
  hideUploadTemplateButton: { type: Boolean, default: false }
})
const slots = useSlots()

const hasFiltersSlot = computed(() => {
  return !!slots.filters
})
</script>