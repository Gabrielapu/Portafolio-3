<template>
  <div>
    <div 
      class="relative table-wrapper rounded bg-white border-slate-200 shadow-sm" 
      :class="tableClassNames"
    >
      <div v-if="loading">
        <Spinner />
      </div>
  
      <div v-else-if="!data.length && !tableTitle" class="text-center text-xl mt-5 font-thin p-1">
        No hay registros
      </div>
      <table v-else class=" text-slate-500" :class="{
        'w-full': !horizontalScroll,
        'w-[1600px]': horizontalScroll
      }">
        <thead>
          <tr v-if="tableTitle">
            <th 
              class="box-content border-b border-b-slate-200 text-left px-2 py-2" 
              :colspan="tableHeaders.length"
            >
              {{ tableTitle }}
            </th>
          </tr>
          <th 
            v-for="(header, i) in tableHeaders" :key="i" 
            class="box-content border-b border-slate-200 py-2 " 
            :class="{
              'w-52': header.text === 'Acciones',
              'w-auto': header.text !== 'Acciones',
              'last:sticky last:right-0 last:bg-white': horizontalScroll && stickyRight,
              'bg-slate-100': header.tinted
            }"
          >
            <div class="flex items-center justify-center">
              <template v-if="header.icon">
                <Popper arrow>
                  <BaseIcon class="cursor-pointer ml-6 mr-0.5" :name="header.icon" size="16" />
                  <template #content>
                    <div class="p-2">
                      <div class="flex items-start">
                        <BaseIcon class="mr-2 cursor-pointer text-slate-500" :name="header.icon"/>
                        <p class="font-normal text-left text-slate-600 text-xs max-w-sm break-words">
                          {{ header.popperMessage }}
                        </p>
                      </div>
                    </div>
                  </template>
                </Popper>
                <p class="text-slate-500 text-xs capitalize">{{ header.text }}</p>
              </template>
              <template v-else>
                <p class="text-slate-500 text-xs capitalize">{{ header.text }}</p>
              </template>
            </div>
          </th>
        </thead>
        <tbody>
          <tr v-if="tableTitle && !data.length">
            <td :colspan="tableHeaders.length" class="text-center text-2xl py-2"> 
              No hay registros
            </td>
          </tr>
          <tr v-for="(row, i) in data" :key="i" :class="{ 'bg-slate-50': i % 2 === 0 }">
            <td 
              v-for="(cell, j) in tableHeaders" :key="j" 
              :class="{
                'w-52': cell.text === 'Acciones',
                'w-auto': cell.text !== 'Acciones',
                'last:sticky last:right-0': horizontalScroll && stickyRight,
                'last:bg-slate-50': i % 2 === 0,
                'last:bg-white': i % 2 !== 0,
                'text-center': true
              }"
            >
              <div v-if="cell.value === 'actions'" class="p-4 full-center">
                <Button
                  v-if="!hideEditButton"
                  size="sm"
                  color="default"
                  :label="editButtonOptions.text"
                  uppercase
                  :icon="editButtonOptions.icon"
                  class="mr-1"
                  :link="editLink ? `/${editLink}/${row.id}` : null"
                  @click.native="editLink ? '' : $emit('toogleEditModal', row)"
                />
                <Button
                  v-if="!hideDuplicateButton"
                  size="sm"
                  color="default"
                  label="DUPLICAR"
                  icon="uil:copy"
                  class="mr-1"
                  @click.native="$emit('toogleDuplicateModal', row)"
                />
                <Button
                  v-if="!hideDeleteButton"
                  size="sm"
                  color="danger"
                  outlined
                  label="ELIMINAR"
                  icon="uil:trash"
                  @click="$emit('toogleDeleteModal', row)"
                />
              </div>
              <div v-else class="p-2 text-sm full-center">
                <slot :name="cell.value" :item="row">
                  <div class="mx-2 text-sm full-center">
                    {{ getCellValue(cell.value, row) }}
                  </div>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      v-if="paginated"
      :items-per-page="itemsPerPage"
      :items-amount="itemsAmount"
      :current-page="currentPage"
      @change-page="changePage"
    />
  </div>
</template>

<script setup>

const props = defineProps({
  data: { type: Array, default: () => [] },
  search: { type: String, default: '' },
  rowNums: { type: Boolean, default: false },
  headers: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  noBorder: { type: Boolean, default: false },
  editLink: { type: String, default: '' },
  paginated: { type: Boolean, default: false },
  tableTitle: { type: String, default: '' },
  fitContent: { type: Boolean, default: false },
  stickyRight: { type: Boolean, default: false },
  itemsAmount: { type: Number, default: 0 },
  currentPage: { type: Number, default: 0 },
  itemsPerPage: { type: Number, default: 8 },
  hideEditButton: { type: Boolean, default: false },
  hideDeleteButton: { type: Boolean, default: false },
  horizontalScroll: { type: Boolean, default: false },
  editButtonOptions: { type: Object, default: { icon: 'uil:edit', text: 'editar' } },
  hideDuplicateButton: { type: Boolean, default: false },
})

const emit = defineEmits([
  'changePage',
  'toogleDuplicateModal',
  'toogleDeleteModal',
  'toogleEditModal'
])

const tableHeaders = computed(() => {
  const headerList = []
  if (props.rowNums) headerList.push({})
  props.headers.forEach((header) => {
    headerList.push(header)
  })
  return headerList
})

const tableClassNames = computed(() => {
  return {
    'border': !props.noBorder,
    'overflow-x-scroll': props.horizontalScroll,
    'min-h-min': props.fitContent,
    'min-h-[300px]': !props.fitContent
  }
})

const getCellValue = (cell, row) => {
  let value
  for (const key in row) {
    if (cell === key) {
      value = row[key]
      break
    }
  }
  return value
}

const changePage = (page) => {
  emit('changePage', page)
}
</script>