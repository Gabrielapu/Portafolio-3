<template>
  <div class="flex justify-center my-2">
    <div
      class="button-group w-fit flex border rounded overflow-clip 
        bg-white border-slate-200 shadow-sm"
    >
      <button
        :disabled="previousDisabled"
        class="full-center"
        :class="
          previousDisabled
            ? arrowButtonVariants.disabled
            : arrowButtonVariants.default
        "
        @click="previousPage"
      >
        <BaseIcon name="uil:arrow-left" />
        ATRÁS
      </button>
      <button
        v-for="num in amountOfPages"
        :key="num"
        class="px-4 py-2 transition-all duration-75 full-center"
        :class="paginationNumButtonClassNames(num)"
        @click="numPage(num)"
      >
        {{ num }}
      </button>
      <button
        :disabled="nextDisabled"
        class="full-center"
        :class="
          nextDisabled
            ? arrowButtonVariants.disabled
            : arrowButtonVariants.default
        "
        @click="nextPage"
      >
        SIGUIENTE
        <BaseIcon name="uil:arrow-right" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    itemsPerPage: { type: Number, default: 0 },
    itemsAmount: { type: Number, default: 0 },
    currentPage: { type: Number, default: 0 },
  },
  data() {
    return {
      variants: {
        default:
          'text-slate-600 fill-slate-600 hover:text-white hover:fill-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-600',
        current: 'text-white fill-white bg-blue-600',
      },
      arrowButtonVariants: {
        default:
          'flex items-center px-4 py-2 text-slate-600 fill-slate-600 hover:text-blue-500 hover:fill-blue-500 focus:text-blue-500 focus:fill-blue-500 active:bg-blue-500 active:text-white active:fill-white transition-all duration-75',
        disabled: 'px-4 py-2 text-slate-300 fill-slate-300 bg-slate-100',
      },
    }
  },
  computed: {
    amountOfPages() {
      let amount = 0

      if (this.itemsAmount !== 0 && this.itemsPerPage !== 0) {
        amount = Math.ceil(this.itemsAmount / this.itemsPerPage)
      } else {
        amount = 1
      }

      return amount
    },
    previousDisabled() {
      let state = false
      if (this.currentPage <= 1) state = true
      return state
    },
    nextDisabled() {
      let state = false
      if (this.currentPage >= this.amountOfPages) state = true
      return state
    },
  },
  methods: {
    paginationNumButtonClassNames(num) {
      let classNames = ''

      if (this.currentPage === num) {
        classNames = this.variants.current
      } else {
        classNames = this.variants.default
      }

      return classNames
    },
    nextPage() {
      this.changePage(this.currentPage + 1)
    },
    previousPage() {
      this.changePage(this.currentPage - 1)
    },
    numPage(num) {
      if(num === this.currentPage) return
      this.changePage(num)
    },
    changePage(pageNum) {
      this.$emit('change-page', pageNum)
    },
  },
}
</script>