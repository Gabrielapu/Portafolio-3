<template>
	<div>
		<ViewHeader 
			title="Cargar parámetros" 
			:subtitle="getSubtitle" 
			hide-new-item-button
			hide-download-template-button
			hide-upload-template-button
		/>   
		<div class="my-8">
			<Card>
				<template #default>
						<div class="ml-3 flex-row w-full">
							<div class="w-1/3">
								<div class="flex flex-col">
									<h2 class="text-slate-800 text-md my-2 text-center">
										Plantilla de parámetros estables
									</h2>
									<UploadFile 
										v-model="fileToUpload"
										@removeCurrentFile="store.lastUpdatedFile = null"
									/>
								</div>
								<p class="text-slate-800 my-3 text-sm">
									Los parámetros estables consisten en:
									<div class="mx-2 my-3">
										<li>Plantas</li>
										<li>Proveedores</li>
										<li>Transportistas</li>
										<li>Tarifas de transportista</li>
										<li>Productos de input</li>
										<li>Productos elaborados</li>
                    <li>Pasos fronterizos</li>
									</div>
									Descargue las plantillas para obtener un ejemplo <br>
									del formato del archivo .XLSX
								</p>
							</div>
							<Divider class="mt-4 flex w-full" />
							<div class="flex items-center justify-end mt-4">
								<Button
									color="default"
									size="md"
									label="DESCARGAR PLANTILLAS"         
									icon="uil:download-alt"
									@click="downloadFile"
								/>
								<Button
									class="ml-3" 
									size="md"
									color="primary"                
									label="GUARDAR PLANTILLAS"
									:disabled="!fileToUpload"
									:loading="loadingBadge"
									icon="uil:save"
									@click="saveFile"
								/>
							</div>
						</div>
				</template>
			</Card>
		</div>
	</div>
</template>

<script setup>

const loadingBadge = ref(false)
const fileToUpload = ref(null)
const store = useParametersStore()

onMounted( async () => {
	await updateViewHeader()
})
const getSubtitle = computed(() => {
	return store.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${store.lastUpdatedFile?.filename} - 
		Fecha: ${store.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
	await store.getLastUpdatedTemplate("parametros_estables")
}
const saveFile = async () => {
	if(loadingBadge.value) return
	loadingBadge.value = true
 	await store.uploadTemplate(fileToUpload.value)
	loadingBadge.value = false
	fileToUpload.value = null
	updateViewHeader()
}

const downloadFile = async () => {
	await store.downloadTemplate()
}
</script>