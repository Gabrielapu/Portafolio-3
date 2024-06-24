<template>
  <div class="input-select relative w-full inline-block">
    <label
      v-if="labelText !== ''"
      class="text-slate-400"
      :class="labelClassNames"
    >
      {{ labelText }}
    </label>
    <div
      class="selection-field w-full  flex flex-row items-center justify-between px-2 
        border border-slate-200 cursor-pointer"
      :class="selectClassNames"
      @click="handleClick"
    >
      <div class="left-content flex flex-row items-center">
        <BaseIcon
          v-if="startIcon"
          :name="startIcon"
          class="mr-2 fill-slate-600"
        />
        <span 
          v-if="modelValue.length > 0" 
          class="text-slate-500" 
          :class="labelClassNames"
        >
          {{ modelValue[0].name }}
        </span>
        <span 
          v-else
          class="text-slate-400" 
          >
          {{ placeholderText }}
        </span>
        <Badge
          v-if="multipleCounter > 1"
          size="sm"
          color="default"
          :text="`+${multipleCounter - 1}`"
          class="ml-2"
        />
      </div>
      <span
        class="transition-all ease-in-out duration-50"
        :class="arrowIconClassNames"
      >
        <BaseIcon name="uil:angle-down" size="32" class="fill-slate-600" />
    </span>
    </div>
    <transition name="fade">
      <div
        v-if="open"
        class="select-options w-full absolute rounded-b border-x 
        border-b border-slate-200 bg-slate-50 shadow-md z-10 h-80 overflow-auto"
      >
        <SelectOption
          v-for="(option, i) in localOptions"
          :key="i"
          :name="option.name"
          :start-icon="option.icon"
          :state="option.state"
          check-enabled
          @click.native="optionSelection(option.id)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InputSelectMultiple',
  props: {
    modelValue: {
      type: [Array],
      default: () => [
        {
          name: '',
          id: 0,
        },
      ],
      required: true,
    },
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    labelText: { type: String, default: '' },
    startIcon: { type: String, default: '' },
    options: { type: Array, default: () => [], required: true },
    loading: {type: Boolean, default: false},
    placeholderText: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      labelSizes: {
        sm: 'text-sm ',
        md: 'text-md ',
      },
      selectSizes: {
        sm: 'field-sm h-8 ',
        md: 'field-md h-11 ',
      },
      open: false,
      localValue: [],
      localOptions: [],
    }
  },
  computed: {
    multipleCounter() {
      let counter = 0

      this.modelValue.forEach(() => {
        counter++
      })

      return counter
    },
    labelClassNames() {
      let classNames = this.labelSizes[this.size]
      return classNames
    },
    selectClassNames() {
      let classNames = this.selectSizes[this.size]

      if (this.disabled) {
        classNames += 'bg-slate-50 border-slate-200 text-slate-400'
      }
      else classNames += 'bg-white text-slate-500'

      if (this.open) {
        classNames += 'rounded-t '
      } else {
        classNames += 'rounded '
      }

      return classNames
    },
    arrowIconClassNames() {
      let iconClass = 'scale-100'
      if (this.open) iconClass = '-scale-100'
      return iconClass
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newModelValue) {
        this.localValue = newModelValue
      },
    },
    open(newOpen) {
      if (newOpen) {
        this.localOptions.forEach((option) => {
          this.localValue.forEach((selected) => {
            if (selected.id === option.id) option.state = true
          })
        })
      }
    },
  },
  mounted() {
    this.options.forEach((option) => {
      const o = {
        name: option.name,
        icon: option.icon,
        id: option.id,
        state: false,
      }

      this.localOptions.push(o)
    })
  },
  methods: {
    closeOptions() {
      if (this.open) this.open = !this.open
    },
    optionSelection(id) {
      const currentOption = this.options.find((option) => option.id === id)

      let found = false
      for (let i = 0; i < this.localValue.length; i++) {
        if (this.localValue[i].id === currentOption.id) {
          this.deselectOption(currentOption)
          found = true
          break
        }
      }
      if (!found) this.selectOption(currentOption)
      this.$emit('change')
    },
    handleClick() {
      if (!this.loading && !this.disabled) this.open = !this.open
    },
    selectOption(currentOption) {
      const tempSelection = {
        name: currentOption.name,
        id: currentOption.id,
      }
      this.localValue.push(tempSelection)

      this.localOptions.forEach((option) => {
        if (option.id === currentOption.id) option.state = true
      })

      this.open = false

      this.$emit('update:modelValue', this.localValue)
    },
    deselectOption(currentOption) {
      for (let i = 0; i < this.localValue.length; i++) {
        if (this.localValue[i].id === currentOption.id) {
          this.localOptions.forEach((option) => {
            if (option.id === currentOption.id) option.state = false
          })

          this.localValue.splice(i, 1)
          break
        }
      }

      this.open = false

      this.$emit('update:modelValue', this.localValue)
    },
  },
}
</script>