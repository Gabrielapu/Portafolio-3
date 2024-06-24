<template>
  <div
    class="tab-option px-4 pb-2 flex border-b cursor-pointer transition-all duration-75"
    :class="tabOptionClassNames"
  >
    <BaseIcon v-if="icon !== ''" :name="icon" class="mr-2" />
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: 'ContentTabOption',
  props: {
    tabId: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    tabOptionClassNames() {
      let classNames = ''

      if (this.active) {
        classNames = 'fill-blue-500 text-blue-500 border-blue-500'
      } else {
        classNames =
          'fill-slate-600 text-slate-600 border-slate-200 hover:text-blue-500 hover:border-blue-500 hover:fill-blue-500'
      }

      return classNames
    },
  },
  methods: {
    setActive() {
      this.active = true
    },
    setInactive() {
      this.active = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
