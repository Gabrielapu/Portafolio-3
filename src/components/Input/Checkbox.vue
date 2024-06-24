<template>
  <div
    class="input-checkbox relative inline-block cursor-pointer z-0"
    @click="updateValue"
  >
    <input
      ref="checkbox"
      :checked="value"
      type="checkbox"
      class="appearance-none w-6 h-6 bg-slate-50 border border-slate-200 rounded grid place-content-center peer"
    />
    <BaseIcon
      name="uil:check"
      class="absolute top-0 fill-slate-50"
      :class="iconClass"
    />
  </div>
</template>

<script>
export default {
  name: 'InputCheckbox',
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
      validator(colorValue) {
        return [
          'default',
          'primary',
          'positive',
          'warning',
          'danger',
        ].includes(colorValue)
      },
    },
  },
  data() {
    return {
      variants: {
        default: 'peer-checked:fill-slate-500',
        primary: 'peer-checked:fill-blue-500',
        positive: 'peer-checked:fill-green-500',
        warning: 'peer-checked:fill-orange-500',
        danger: 'peer-checked:fill-red-500',
      },
    }
  },
  computed: {
    iconClass() {
      const classNames = this.variants[this.color]
      return classNames
    },
  },
  methods: {
    updateValue() {
      this.$emit('input', !this.$refs.checkbox.checked)
    },
  },
}
</script>
