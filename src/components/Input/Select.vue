<template>
  <div class="input-select relative w-full inline-block">
    <label v-if="labelText !== ''" class="text-slate-400" :class="labelClassNames">
      {{ labelText }}
    </label>
    <div
      class="selection-field w-full min-w-fit flex flex-row items-center justify-between 
				px-2 border shadow-sm bg-white border-slate-200 text-slate-500 cursor-pointer" 
      :class="selectClassNames"
      @click="open = !open"
    >
      <div class="left-content flex flex-row items-center">
        <BaseIcon v-if="startIcon" :name="startIcon" class="mr-2 fill-slate-600" />
        <span class="mr-2 text-slate-500">
          {{ getText() }}
        </span>
        <BaseIcon v-if="clearable && modelValue" name="mdi:clear-circle-outline"
          class="mr-2 fill-slate-600 absolute right-8 z-20" @click.stop="clearSelection" />
      </div>
      <button class="transition-all ease-in-out duration-50" :class="arrowIconClassNames">
        <BaseIcon name="uil:angle-down" size="32" class="fill-slate-600" />
      </button>
    </div>
    <transition name="fade">
      <div
        v-if="open"
        class="select-options absolute left-0 w-full min-h-40 max-h-80 overflow-auto
        rounded-b border-x border-b border-slate-200 bg-white shadow-md z-10"
      >
        <SelectOption
          v-for="(option, i) in options"
          :key="i"
          :name="option.name || option.description"
          :start-icon="option.icon"
          @click.native="optionSelection(option.id)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InputSelect',
  props: {
    modelValue: { type: [String, Number], required: true },
    labelText: { type: String, default: '' },
    startIcon: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    clearable: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    }
  },
  data() {
    return {
      labelSizes: {
        sm: 'text-sm ',
        md: 'text-md ',
      },
      selectSizes: {
        sm: 'h-6 ',
        md: 'h-8 ',
      },
      open: false,
      tempSelection: {},
    }
  },
  beforeMount() {
    this.tempSelection = this.options.find((option) => option.id === this.modelValue)
  },
  computed: {
    labelClassNames() {
      let classNames = this.labelSizes[this.size]
      return classNames
    },
    selectClassNames() {
      let classNames = this.selectSizes[this.size]

      if (this.labelText !== '') {
        classNames += 'mt-1 '
      }

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
  methods: {
    getText() {
      return this.tempSelection?.title || this.tempSelection?.description || this.tempSelection?.name
    },
    closeOptions() {
      if (this.open) this.open = !this.open
    },
    updateModel() {
      this.$emit('update:modelValue', this.tempSelection.id)
      this.$emit('change')
    },
    optionSelection(id) {
      const currentOption = this.options.find((option) => option.id === id)

      currentOption.id === this.modelValue
        ? this.deselectOption(currentOption)
        : this.selectOption(currentOption)
    },
    clearSelection() {
      this.tempSelection = {
        title: '',
        id: 0,
      }
      this.updateModel()
    },
    selectOption(currentOption) {
      this.tempSelection = {
        title: currentOption.name || currentOption.description,
        id: currentOption.id,
      }
      this.open = false
      this.updateModel()
    },
    deselectOption(currentOption) {
      this.tempSelection = {
        title: currentOption.name || currentOption.description,
        id: currentOption.id,
      }
      this.open = false
      this.updateModel()
    },
  },
}
</script>