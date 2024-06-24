<template>
  <PlantsTable ref="plantsTable" @updatePlants="updatePlantList" />
  <Routes ref="routes" @newRoute="plantsTable.requestCurrentPage()" />
  <Tanks ref="tanks" />
</template>

<script setup>
const plantsTable = ref(null)
const routes = ref(null)
const tanks = ref(null)

const updatePlantList = () => {
  routes.value.updatePlantsList()
  tanks.value.updatePlantsList()
}
</script>
