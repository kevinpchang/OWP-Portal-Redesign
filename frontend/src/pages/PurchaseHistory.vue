<template>
  <div class="purchase-history-page">
    <!-- ===================== HEADER  ===================== -->
    <div class="page-top">
      <div class="text-block">
        <h1 class="page-title">Purchase History</h1>
        <p class="page-description">
          View your invoices and payment details for your purchases.
        </p>
      </div>
    </div>

    <!-- ===================== MAIN CONTENT ===================== -->
    <div class="ph">

      <div v-if="loading" style="padding:12px;color:#555">
        Loading…
      </div>

      <div v-else-if="error" style="padding:12px;color:#b42318">
        {{ error }}
      </div>

      <!-- ===================== INVOICE LIST ===================== -->
      <section v-if="!selected" class="ph-grid">

        <article
          v-for="inv in invoices"
          :key="inv.id"
          class="inv-card"
          @click="open(inv)"
        >
          <div class="inv-title">Invoice</div>

          <div class="inv-number">
            #{{ inv.id }}
          </div>

          <div class="inv-meta">
            <div class="label">Invoice Date:</div>
            <div class="value">
              {{ fmtDate(inv.invoiceDate) }}
            </div>
          </div>

          <div class="status paid">
            {{ inv.status ?? "Paid" }}
          </div>

        </article>

      </section>


      <!-- ===================== DETAIL VIEW ===================== -->

      <section v-else class="ph-detail">

        <div class="detail-header">

          <div class="left">
            <div class="detail-title">
              Invoice Details
            </div>
          </div>

          <div class="right">

            <button
              class="btn ghost"
              @click="downloadAndOpenReceipt"
              :disabled="receiptLoading"
            >
              {{ receiptLoading ? "Loading…" : "Receipt" }}
            </button>

            <button
              class="btn primary"
              @click="goBack"
            >
              Return to Purchase History
            </button>

          </div>

        </div>


        <div class="detail-table">

          <div class="row">

            <div class="cell h">
              Invoice Num
            </div>

            <div class="cell">
              #{{ selected!.id }}
            </div>

            <div class="cell h">
              Invoice Date
            </div>

            <div class="cell">
              {{ fmtDate(selected!.invoiceDate) }}
            </div>

            <div class="cell h">
              Invoice Due Date
            </div>

            <div class="cell">
              {{ fmtDate(selected!.dueDate) }}
            </div>

          </div>

        </div>

      </section>

    </div>
  </div>
</template>



<script setup lang="ts">

import { onMounted, ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import * as api from "@/services/owpAPI"

const router = useRouter()
const route = useRoute()


type Invoice = {
  id:number
  invoiceDate:string
  dueDate:string
  shipped:boolean
  balanceDue:number
  placedBy:string
  billing:any
  orderMethod:string
  status:"Paid"|"Unpaid"
  items:any[]
  payment:any
}


const invoices = ref<Invoice[]>([])
const selected = ref<Invoice|null>(null)

const loading = ref(false)
const error = ref<string|null>(null)
const receiptLoading = ref(false)


const pid = 458860



/* ===================== OPEN INVOICE ===================== */

async function open(inv:Invoice){

  router.push(`/purchase-history/${inv.id}`)

  await loadInvoiceDetails(inv)

}



/* ===================== RETURN ===================== */

async function goBack(){

  selected.value = null

  router.push("/purchase-history")

}



/* ===================== DATE FORMAT ===================== */

function fmtDate(iso:string){

  if(!iso) return ""

  const d = new Date(iso+"T00:00:00")

  return d.toLocaleDateString(undefined,{
    year:"numeric",
    month:"2-digit",
    day:"2-digit"
  })

}



/* ===================== LOAD INVOICE LIST ===================== */

async function loadInvoices(){

  loading.value = true
  error.value = null

  try{

    const raw:any = await api.getInvoices(pid)

    const list:any[] =
      Array.isArray(raw?.response)
      ? raw.response
      : []

    invoices.value = list.map((x:any)=>({

      id:Number(x.invoicenum),
      invoiceDate:x.invoicedate,
      dueDate:"",
      shipped:false,
      balanceDue:Number(x.balancedue),
      placedBy:"",
      billing:{},
      orderMethod:"",
      status:"Paid",
      items:[],
      payment:{}

    }))

  }
  catch(e:any){

    invoices.value = []
    error.value = e?.message ?? String(e)

  }
  finally{

    loading.value = false

  }

}



/* ===================== LOAD DETAILS ===================== */

async function loadInvoiceDetails(inv:Invoice){

  loading.value = true

  try{

    const raw:any = await api.getInvoiceData(inv.id)

    const rows:any[] =
      Array.isArray(raw?.response)
      ? raw.response
      : []

    selected.value = {

      ...inv,
      items:rows

    }

  }
  catch(e:any){

    error.value = e?.message ?? String(e)

  }
  finally{

    loading.value = false

  }

}



/* ===================== LOAD FROM URL ===================== */

async function loadInvoiceFromRoute() {

  const id = route.params.id;

  if (!id) {
    selected.value = null;
    return;
  }

  const inv = invoices.value.find(i => i.id === Number(id));

  if (!inv) {
    selected.value = null;
    return;
  }

  await loadInvoiceDetails(inv);

}


/* ===================== RECEIPT ===================== */

async function downloadAndOpenReceipt(){

  if(!selected.value) return

  receiptLoading.value = true

  try{

    const raw:any =
      await api.downloadReceipt(selected.value.id)

    const b64 = raw?.response

    const bytes =
      Uint8Array.from(atob(b64),(c)=>c.charCodeAt(0))

    const blob =
      new Blob([bytes],{type:"application/pdf"})

    const url =
      URL.createObjectURL(blob)

    window.open(url,"_blank")

  }
  catch(e:any){

    error.value = e?.message ?? String(e)

  }
  finally{

    receiptLoading.value = false

  }

}



/* ===================== INIT ===================== */

onMounted(async () => {

  await loadInvoices();

  if (route.params.id) {
    await loadInvoiceFromRoute();
  }

});



watch(
  ()=>route.params.id,
  async ()=>{

    await loadInvoiceFromRoute()

  }
)

</script>



<style scoped>

/* KEEP ALL YOUR EXISTING CSS EXACTLY THE SAME */

</style>