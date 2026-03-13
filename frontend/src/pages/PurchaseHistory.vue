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

    <!-- ===================== MAIN CONTENT (CENTERED) ===================== -->
    <div class="ph">
      <!-- status -->
      <div v-if="loading" style="padding: 12px; color: #555">Loading…</div>
      <div v-else-if="error" style="padding: 12px; color: #b42318">
        {{ error }}
      </div>

      <!-- INVOICE LIST VIEW -->
      <section v-if="!selected" class="ph-grid">

        <!-- UPDATED NAVIGATION -->
        <router-link
          v-for="inv in invoices"
          :key="inv.id"
          :to="`/purchase-history/${inv.id}`"
          class="inv-card-link"
        >
          <article class="inv-card">
            <div class="inv-title">Invoice</div>
            <div class="inv-number">#{{ inv.id }}</div>

            <div class="inv-meta">
              <div class="label">Invoice Date:</div>
              <div class="value">{{ fmtDate(inv.invoiceDate) }}</div>
            </div>

            <div class="status paid">{{ inv.status ?? "Paid" }}</div>
          </article>
        </router-link>

      </section>

      <!-- INVOICE DETAIL VIEW -->
      <section v-else class="ph-detail">
        <div class="detail-header">
          <div class="left">
            <div class="detail-title">Invoice Details</div>
          </div>

          <div class="right">
            <button class="btn ghost" @click="downloadAndOpenReceipt" :disabled="receiptLoading">
              {{ receiptLoading ? "Loading…" : "Receipt" }}
            </button>
            <button class="btn primary" @click="selected = null">
              Return to Purchase History
            </button>
          </div>
        </div>

        <div class="detail-table">
          <div class="row">
            <div class="cell h">Invoice Num</div>
            <div class="cell">#{{ selected!.id }}</div>
            <div class="cell h">Invoice Date</div>
            <div class="cell">{{ fmtDate(selected!.invoiceDate) }}</div>
            <div class="cell h">Invoice Due Date</div>
            <div class="cell">{{ fmtDate(selected!.dueDate) }}</div>
          </div>

          <div class="row">
            <div class="cell h">Shipped</div>
            <div class="cell">{{ selected!.shipped ? "Yes" : "No" }}</div>
            <div class="cell h">Balance Due</div>
            <div class="cell">{{ fmtMoneySigned(selected!.balanceDue) }}</div>
            <div class="cell h">Order Method</div>
            <div class="cell">{{ selected!.orderMethod }}</div>
          </div>

          <div class="row multi">
            <div class="cell h">Order Placed By</div>
            <div class="cell">{{ selected!.placedBy }}</div>

            <div class="cell h">Billing Address & Phone</div>
            <div class="cell">
              <div class="addr">{{ selected!.billing.name }}</div>
              <div class="addr">{{ selected!.billing.address1 }}</div>
              <div class="addr" v-if="selected!.billing.address2">
                {{ selected!.billing.address2 }}
              </div>
              <div class="addr">
                {{ selected!.billing.city }},
                {{ selected!.billing.state }}
                {{ selected!.billing.zip }}
              </div>
              <div class="addr">{{ selected!.billing.phone }}</div>
            </div>
          </div>
        </div>

        <div class="section-heading">Invoice Items</div>

        <div class="items">
          <div class="items-row head">
            <div class="c product">Product Name</div>
            <div class="c qty">Item Quantity</div>
            <div class="c total">Total Cost</div>
          </div>

          <div v-for="(it, i) in selected!.items" :key="i" class="items-row">
            <div class="c product">{{ it.product }}</div>
            <div class="c qty">{{ fmtQtySigned(it.qty) }}</div>
            <div class="c total">{{ fmtMoneySigned(it.total) }}</div>
          </div>

          <div v-if="selected!.items.length === 0" class="items-row">
            <div class="c product" style="color:#64748b">No items returned.</div>
            <div class="c qty"></div>
            <div class="c total"></div>
          </div>
        </div>

        <div class="section-heading">Payment</div>

        <div class="payment">
          <div class="p-row">
            <div class="p-h">{{ selected!.payment.amountPaid < 0 ? "Amount Refunded" : "Amount Paid" }}</div>
            <div class="p-v">{{ fmtMoneySigned(selected!.payment.amountPaid) }}</div>

            <div class="p-h">Pay Date</div>
            <div class="p-v">{{ fmtDate(selected!.payment.payDate) }}</div>

            <div class="p-h">Pay Method</div>
            <div class="p-v">{{ selected!.payment.method }}</div>
          </div>

          <div class="p-row">
            <div class="p-h">Description</div>
            <div class="p-v">{{ selected!.payment.description }}</div>

            <div class="p-h">Payment Made By</div>
            <div class="p-v">{{ selected!.payment.madeBy }}</div>

            <div class="p-h">Payment Phone</div>
            <div class="p-v">{{ selected!.payment.phone }}</div>
          </div>

          <div class="p-row">
            <div class="p-h">Payment Address</div>
            <div class="p-v">
              <div>{{ selected!.payment.address1 }}</div>
              <div v-if="selected!.payment.address2">
                {{ selected!.payment.address2 }}
              </div>
              <div>
                {{ selected!.payment.city }},
                {{ selected!.payment.state }}
                {{ selected!.payment.zip }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>