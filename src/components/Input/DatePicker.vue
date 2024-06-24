<template>
  <VueDatePicker
    :modelValue="modelValue"
    locale="es"
    :format="format"
    auto-apply
    :teleport="true"
    :min-date="computedMinDate"
    :max-date="computedMaxDate"
    :enable-time-picker="false"
    :month-picker="monthPicker"
    :clearable="clearable"
    :allowed-dates="allowedDates"
    @update:model-value="updateValue"
  >
    <template v-if="showTrigger" #trigger>
      <InputValidateField
        v-model="computedDate"
        :size="size"
        :label-text="label"
        placeholder-text="Seleccione una fecha"
        :form="form"
        start-icon="fe:calendar"
        clickable
        readonly
        :name="name"
        :rules="rules"
      />
    </template>
  </VueDatePicker>
</template>

<script>
export default {
  name: 'InputDatePicker',
  inject: ['dayjs'],
  props: {
    modelValue: { required: true},
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    label: { type: String, default: '' },
    allowedDates: { type: Array, default: [] },
    minDate: { type: [String, Date], default: '' },
    maxDate: { type: String, default: '' },
    rules: { type: Array, default: () => [] },
    monthPicker: { type: Boolean, default: false },
    format: { type: String, default: 'dd-MM-yyyy' },
    clearable: { type: Boolean, default: false },
    showTrigger: { type: Boolean, default: true },
    form: { type: String, default: '' },
    name: { type: String, default: '' },
  },
  computed: {
    computedDate: {
      get() {
        if(this.monthPicker) {
          return this.modelValue 
            ? this.dayjs(this.modelValue).format('MM-YYYY')
            : null
        }
        if(this.modelValue) {
          return this.dayjs(this.modelValue).format('DD-MM-YYYY')
        }
        return this.modelValue?.toString()
      },
      set(value) {
        return value
      }
    },
    computedMinDate() {
      return this.minDate ? this.dayjs(this.minDate).toDate() : null
    },
    computedMaxDate() {
      return this.maxDate ? this.dayjs(this.maxDate).toDate() : null
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event)
    },
  },
}
</script>
