<template>
  <ViewHeader 
    title="Compromisos" 
    subtitle="Listado de compromisos" 
    newItemLabel="Nuevo compromiso"
    @openModal="e => openTemplateModal(e)"
    @newItem="showCreate = true"
  />
  <div>
    <Section>
      <template #content>
        <div class="flex items-center justify-between">
          <div class="full-center">
            <Button 
              label="Nacionales" 
              color="primary"
              :text-only="activeTable !== 'nationals'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'nationals'"
            />
            <Button 
              label="Importaciones" 
              color="primary"
              :text-only="activeTable !== 'imports'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'imports'"
            />
            <Button 
              label="Transferencias" 
              color="primary" 
              :text-only="activeTable !== 'transfers'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'transfers'"
            />
            <Button 
              label="Ductos" 
              color="primary" 
              :text-only="activeTable !== 'pipeline'"
              :shadow="false"
              size="sm" 
              @click.native="activeTable = 'pipeline'"
            />
          </div>
          <div class="full-center gap-4">
            <div class="flex flex-direction-row gap-2">
              <p class="text-sm text-slate-800"> Ver progreso </p>
              <Toogle color="primary" v-model="progress" />
            </div>
            <MonthSelector @queryDate="date => selectedDate = date" />
          </div>
        </div>
        <div  class="mt-4">
          <div v-show="activeTable === 'nationals'">
            <Nationals 
              ref="nationals" 
              :selected-date="selectedDate"
              :showCreate="showCreate && activeTable === 'nationals'"
              @closeModal="showCreate = false"
              :showProgress = progress
            />
          </div>          
          <div v-show="activeTable === 'imports'">
            <Imports 
              ref="imports" 
              :selected-date="selectedDate"
              :showCreate="showCreate && activeTable === 'imports'"
              @closeModal="showCreate = false"
              :showProgress = progress
            />
          </div> 
          <div v-show="activeTable === 'transfers'"> 
            <Transfers 
              ref="transfers" 
              :selected-date="selectedDate"
              :showCreate="showCreate && activeTable === 'transfers'"
              @closeModal="showCreate = false"
              :showProgress = progress
            />
          </div>
          <div v-show="activeTable === 'pipeline'" >
            <PipelineSupply 
              ref="pipeline" 
              :selected-date="selectedDate"
              :showCreate="showCreate && activeTable === 'pipeline'"
              @closeModal="showCreate = false"
              :showProgress = progress
            />
          </div>
        </div>
      </template>
    </Section>
  </div>

  <ManageTemplate 
    v-model="manageTemplateModal"
    label="compromisos"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  >
    <template #inputs>
      <DatePicker
        :class="{
          'mb-3': templateAction === 'upload'
        }"
        :model-value="selectedTemplateDate" 
        label="Mes" 
        month-picker
        format="MM-yyyy"
        @update:model-value="date => selectedTemplateDate = date"
      />
    </template>
  </ManageTemplate>
</template>

<script setup>
const activeTable = ref('nationals')
const selectedDate = ref({})
const store = useMonthlyCommitmentsStore()
const selectedTemplateDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
const nationals = ref(null)
const imports = ref(null)
const transfers = ref(null)
const pipeline = ref(null)
const showCreate = ref(false)
const progress = ref(false)

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !fileToUpload.value || !selectedTemplateDate.value
    : !selectedTemplateDate.value
})

const openTemplateModal = (action) => {
  manageTemplateModal.value = true
  templateAction.value = action
  selectedTemplateDate.value = {...selectedDate.value}
  selectedTemplateDate.value.month = parseInt(selectedTemplateDate.value.month) - 1
}

const manageTemplate = async () => {
  loadingTemplate.value = true
  const { date } = useFormatMonthWith0(selectedTemplateDate.value)
  templateAction.value === 'upload'
    ? await store.uploadTemplate(date, fileToUpload.value)
    : await store.downloadTemplate(date)
  if(templateAction.value === 'upload') {
    nationals.value.reload()
    imports.value.reload()
    transfers.value.reload()
    pipeline.value.reload()
  } 
  loadingTemplate.value = false
  manageTemplateModal.value = false
}
</script>