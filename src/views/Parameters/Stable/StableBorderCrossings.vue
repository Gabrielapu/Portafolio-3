<template>
  <Borders ref="borders" @reload="refreshData()"/>
  <ReturnTime ref="returnTime"/>
</template>

<script setup>
const borders = ref(null)
const returnTime = ref(null)

const refreshData = () => {
  borders.value.requestItems()
  returnTime.value.requestItems()
}
</script>