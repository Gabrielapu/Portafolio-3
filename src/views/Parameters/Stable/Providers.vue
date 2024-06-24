<template>
  <ProvidersTable ref="providersTable" @updateProviders="routes.updateProvidersList()"/>
  <PurchaseRoutes ref="routes" @newRoute="providersTable.requestCurrentPage()"/> 
</template>

<script setup>
const providersTable = ref(null)
const routes = ref(null)
</script>