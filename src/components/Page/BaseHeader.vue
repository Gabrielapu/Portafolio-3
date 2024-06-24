<template>
  <header>
    <div class="flex flex-row w-full">
      <div class="w-5/12">
        <h1 class="text-slate-700">{{ title }}</h1>
        <h2 v-if="subtitle !== ''" class="text-slate-600 inline mr-2">{{ subtitle }}</h2>
        <span>
          <slot name="badge"></slot>
        </span>
        <h2 v-if="subtitle2 !== ''" class="text-slate-600">{{ subtitle2 }}</h2>
      </div>
      <div v-if="hasActionsSlot" class="flex flex-row items-center justify-end w-7/12">
        <slot name="actions"></slot>
      </div>
    </div>
    <Divider v-if="hasDivider" class="mt-2" />
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '', required: false },
  subtitle: { type: String, default: '', required: false },
  subtitle2: { type: String, default: '', required: false },
  hasDivider: { type: Boolean, default: true, required: false },
})

const slots = useSlots()

const hasActionsSlot = computed(() => {
  return !!slots.actions
})

</script>
