<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import * as api from "@/services/owpAPI"

const route = useRoute()
const invoiceId = route.params.id

const invoice = ref(null)
const loading = ref(true)

async function loadInvoice() {
  try {
    const data = await api.getInvoiceData(invoiceId)
    invoice.value = data?.response ?? []
  } finally {
    loading.value = false
  }
}

onMounted(loadInvoice)
</script>

<template>
<div class="invoice-page">

<h1>Invoice {{ invoiceId }}</h1>

<div v-if="loading">
Loading invoice...
</div>

<div v-else>

<!-- your invoice layout here -->

</div>

</div>
</template>