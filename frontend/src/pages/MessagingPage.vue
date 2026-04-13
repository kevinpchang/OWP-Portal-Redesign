<template>
  <div class="mail-page">
    <!-- Page Header -->
    <div class="mail-topbar">
      <div>
        <h1 class="page-title">Inbox</h1>
        <p class="page-subtitle">Manage your email conversations</p>
      </div>

      <button class="compose-btn" @click="openCompose = true">
        <span class="compose-plus">+</span>
        Compose
      </button>
    </div>

    <!-- Mail App Shell -->
    <div class="mail-shell">
      <!-- LEFT COLUMN -->
      <aside class="mail-sidebar">
        <div class="sidebar-toolbar">
          <input
            v-model="search"
            class="search-input"
            type="text"
            placeholder="Search mail"
          />

          <div class="filter-row">
            <button
              v-for="f in filters"
              :key="f.key"
              class="filter-chip"
              :class="{ active: activeFilter === f.key }"
              @click="activeFilter = f.key"
            >
              {{ f.label }}
            </button>
          </div>

          <div class="bulk-toolbar" v-if="selectedIds.size">
            <div class="bulk-count">{{ selectedIds.size }} selected</div>
            <div class="bulk-actions">
              <button class="toolbar-btn" @click="markSelectedRead">Mark read</button>
              <button class="toolbar-btn" @click="archiveSelected">Archive</button>
              <button class="toolbar-btn danger" @click="clearSelection">Clear</button>
            </div>
          </div>
        </div>

        <div class="thread-list-header">
          <div class="header-cell checkbox-cell">
            <input
              type="checkbox"
              :checked="allVisibleSelected"
              @change="toggleSelectAllVisible"
              :disabled="filteredThreads.length === 0"
            />
          </div>
          <div class="header-cell star-cell"></div>
          <div class="header-cell sender-cell">From</div>
          <div class="header-cell subject-cell">Subject</div>
          <div class="header-cell date-cell">Date</div>
        </div>

        <div class="thread-list">
          <div
            v-for="t in filteredThreads"
            :key="t.id"
            class="thread-row"
            :class="{ active: t.id === selectedThreadId, unread: t.unread }"
            @click="selectThread(t.id)"
          >
            <div class="cell checkbox-cell" @click.stop>
              <input
                type="checkbox"
                :checked="selectedIds.has(t.id)"
                @change="toggleSelect(t.id)"
              />
            </div>

            <div class="cell star-cell">
              <button
                class="star-btn"
                @click.stop="toggleStar(t.id)"
                :title="t.starred ? 'Unstar' : 'Star'"
              >
                <span :class="{ starred: t.starred }">★</span>
              </button>
            </div>

            <div class="cell sender-cell sender-text">
              <span v-if="t.unread" class="unread-dot"></span>
              {{ t.sender }}
            </div>

            <div class="cell subject-cell subject-wrap">
              <span class="subject-text">{{ t.subject || '(no subject)' }}</span>
              <span class="subject-sep">—</span>
              <span class="snippet-text">{{ t.snippet }}</span>
            </div>

            <div class="cell date-cell date-text">
              {{ t.date }}
            </div>
          </div>

          <div v-if="filteredThreads.length === 0" class="empty-list">
            No mail found.
          </div>
        </div>
      </aside>

      <!-- RIGHT COLUMN -->
      <section class="mail-reader" v-if="activeThread">
        <div class="reader-header">
          <div class="reader-title-block">
            <h2 class="reader-subject">{{ activeThread.subject || '(no subject)' }}</h2>
            <div class="reader-participants">
              <span class="meta-label">Participants:</span>
              {{ activeThread.participants.join(', ') }}
            </div>
          </div>

          <div class="reader-actions">
            <button class="toolbar-btn" @click="startReply()">Reply</button>
            <button
              class="toolbar-btn"
              v-if="activeThread.participants.length > 2"
              @click="startReplyAll()"
            >
              Reply all
            </button>
            <button class="toolbar-btn" @click="startForward()">Forward</button>
            <button class="toolbar-btn" @click="archiveThread(activeThread.id)">
              Archive
            </button>
          </div>
        </div>

        <div ref="scrollBox" class="message-stack">
          <article
            v-for="m in activeThread.messages"
            :key="m.id"
            class="email-card"
          >
            <div class="email-card-header">
              <div class="email-sender-block">
                <div class="sender-name">{{ m.sender }}</div>
                <div class="email-meta-lines">
                  <div><span class="meta-label">From:</span> {{ m.sender }}</div>
                  <div><span class="meta-label">To:</span> {{ computeToLine(m.sender) }}</div>
                </div>
              </div>

              <div class="email-time">
                {{ m.time }}
              </div>
            </div>

            <div class="email-content" v-html="m.bodyHtml || escapeHtml(m.body)"></div>
          </article>
        </div>

        <div class="reply-panel">
          <div class="reply-panel-header">
            <div class="reply-mode">{{ replyModeLabel }}</div>
            <div class="reply-hint">Enter to send • Shift+Enter for new line</div>
          </div>

          <textarea
            v-model="replyText"
            class="reply-textarea"
            placeholder="Write your reply..."
            rows="6"
            @keydown.enter.exact.prevent="sendReply()"
          />

          <div class="reply-actions">
            <button class="toolbar-btn" @click="clearDraft" :disabled="!replyText.trim()">
              Discard
            </button>
            <button class="send-btn" :disabled="!replyText.trim()" @click="sendReply">
              Send
            </button>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section class="mail-reader empty-reader" v-else>
        <div class="empty-reader-state">
          <div class="empty-reader-title">No message selected</div>
          <div class="empty-reader-text">
            Choose an email from the inbox to preview it here.
          </div>
        </div>
      </section>
    </div>

    <!-- Compose Modal -->
    <div v-if="openCompose" class="modal-backdrop" @click.self="openCompose = false">
      <div class="compose-modal">
        <div class="compose-header">
          <div class="compose-title">New Message</div>
        </div>

        <div class="compose-body">
          <div class="compose-field">
            <label class="field-label">To</label>
            <input
              v-model="composeTo"
              class="compose-input"
              placeholder="alice@owp.csus.edu, bob@owp.csus.edu"
            />
          </div>

          <div class="compose-field">
            <label class="field-label">Subject</label>
            <input
              v-model="composeSubject"
              class="compose-input"
              placeholder="Subject"
            />
          </div>

          <div class="compose-field">
            <label class="field-label">Message</label>
            <textarea
              v-model="composeBody"
              class="compose-textarea"
              rows="10"
              placeholder="Write your email..."
            />
          </div>
        </div>

        <div class="compose-footer">
          <button class="toolbar-btn" @click="openCompose = false">Cancel</button>
          <button
            class="send-btn"
            :disabled="!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()"
            @click="sendNewConversation"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// Loading from Dashboard
const route = useRoute()

const API_BASE = 'https://owp-portal-redesign-db.onrender.com'

// IMPORTANT: set this to a real Users.UserId in your DB
const CURRENT_USER_ID = 1
const CURRENT_USER_DISPLAY = 'You'

// ---- UI STATE ----
const search = ref('')
const activeFilter = ref('all')
const selectedThreadId = ref(null)
const replyText = ref('')

const openCompose = ref(false)
const composeTo = ref('')
const composeSubject = ref('')
const composeBody = ref('')

const selectedIds = ref(new Set())
const replyMode = ref('reply') // 'reply' | 'replyAll' | 'forward'
const scrollBox = ref(null)

const threads = ref([])

// ---- FILTERS ----
const filters = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'starred', label: 'Starred' },
]

// ---- API helper ----
async function apiFetch(path, { method = 'GET', params = null, body = null } = {}) {
  const url = new URL(API_BASE + path)

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      url.searchParams.set(k, String(v))
    })
  }

  const res = await fetch(url.toString(), {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const data = await res.json()
      msg = data?.error || msg
    } catch {}
    throw new Error(msg)
  }

  return res.json()
}

async function fetchThreadsFromApi({ userId, search = '' }) {
  const data = await apiFetch('/api/messaging/threads', { params: { userId, search } })
  return data.threads || []
}

async function fetchThreadFromApi({ threadId, userId }) {
  return apiFetch(`/api/messaging/threads/${threadId}`, { params: { userId } })
}

async function replyToThreadApi({ threadId, senderUserId, body }) {
  return apiFetch(`/api/messaging/threads/${threadId}/reply`, {
    method: 'POST',
    body: { senderUserId, body },
  })
}

async function createThreadApi({ subject, senderUserId, recipientEmails = [], body }) {
  return apiFetch('/api/messaging/threads', {
    method: 'POST',
    body: { subject, senderUserId, recipientEmails, body },
  })
}

async function starThreadApi({ threadId, userId }) {
  return apiFetch(`/api/messaging/threads/${threadId}/star`, {
    method: 'POST',
    body: { userId },
  })
}

async function unstarThreadApi({ threadId, userId }) {
  return apiFetch(`/api/messaging/threads/${threadId}/star`, {
    method: 'DELETE',
    params: { userId },
  })
}

// ---- UTIL ----
function formatInboxDate(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function serverRowToThreadUI(row) {
  return {
    id: Number(row.ThreadId),
    sender: row.LastSenderName || row.LastSenderEmail || 'Unknown',
    senderEmail: row.LastSenderEmail || '',
    subject: row.SubjectPreview || '',
    snippet: row.LastBody || '',
    date: formatInboxDate(row.LastSentAt || row.LastMessageAt || row.CreatedAt),
    rawLastSentAt: row.LastSentAt || row.LastMessageAt || row.CreatedAt || null,
    unread: (row.UnreadCount || 0) > 0,
    starred: !!row.IsStarred,
    participants: [],
    messages: [],
  }
}

function escapeHtml(unsafe) {
  if (!unsafe) return ''
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('\n', '<br>')
}

function parseComposeToEmails(toString) {
  return toString
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

// ---- COMPUTED ----
const filteredThreads = computed(() => {
  const q = search.value.trim().toLowerCase()

  return threads.value
    .filter((t) => {
      if (activeFilter.value === 'unread') return t.unread
      if (activeFilter.value === 'starred') return t.starred
      return true
    })
    .filter((t) => {
      if (!q) return true
      return (
        String(t.sender).toLowerCase().includes(q) ||
        String(t.subject).toLowerCase().includes(q) ||
        String(t.snippet).toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const ta = a.rawLastSentAt ? new Date(a.rawLastSentAt).getTime() : 0
      const tb = b.rawLastSentAt ? new Date(b.rawLastSentAt).getTime() : 0
      return tb - ta
    })
})

const activeThread = computed(
  () => threads.value.find((t) => t.id === selectedThreadId.value) || null,
)

const allVisibleSelected = computed(() => {
  if (!filteredThreads.value.length) return false
  return filteredThreads.value.every((t) => selectedIds.value.has(t.id))
})

const replyModeLabel = computed(() => {
  if (replyMode.value === 'replyAll') return 'Reply all'
  if (replyMode.value === 'forward') return 'Forward'
  return 'Reply'
})

// ---- DATA LOAD ----
async function loadThreads() {
  try {
    const rows = await fetchThreadsFromApi({ userId: CURRENT_USER_ID, search: search.value })
    threads.value = rows.map(serverRowToThreadUI)

    if (selectedThreadId.value) {
      const stillExists = threads.value.some((t) => t.id === selectedThreadId.value)
      if (!stillExists) selectedThreadId.value = null
    }
  } catch (err) {
    console.error('loadThreads error', err)
  }
}

async function selectThread(id) {
  selectedThreadId.value = id

  const local = threads.value.find((x) => x.id === id)
  if (local) local.unread = false

  try {
    const res = await fetchThreadFromApi({ threadId: id, userId: CURRENT_USER_ID })
    const serverThread = res.thread || {}
    const messages = (res.messages || []).map((m) => {
      const senderName =
        m.SenderDisplayName ||
        m.ExternalDisplayName ||
        m.SenderEmail ||
        m.ExternalEmail ||
        'Unknown'

      return {
        id: m.MessageId,
        sender: senderName,
        time: m.SentAt
          ? new Date(m.SentAt).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          : '',
        body: m.Body || '',
        bodyHtml: null,
      }
    })

    const uiThread = threads.value.find((x) => x.id === id)
    if (uiThread) {
      uiThread.messages = messages
      const names = new Set(messages.map((mm) => mm.sender))
      names.add(CURRENT_USER_DISPLAY)
      uiThread.participants = Array.from(names)
      uiThread.subject = serverThread.SubjectPreview || uiThread.subject
      uiThread.rawLastSentAt = serverThread.LastMessageAt || uiThread.rawLastSentAt
      uiThread.snippet = messages.length
        ? messages[messages.length - 1].body.slice(0, 200)
        : uiThread.snippet
      uiThread.unread = false
    }

    await nextTick()
    scrollToTop()
  } catch (err) {
    console.error('selectThread error', err)
  }
}

// ---- UI ACTIONS ----
async function toggleStar(id) {
  const t = threads.value.find((x) => x.id === id)
  if (!t) return

  const nextVal = !t.starred
  t.starred = nextVal

  try {
    if (nextVal) await starThreadApi({ threadId: id, userId: CURRENT_USER_ID })
    else await unstarThreadApi({ threadId: id, userId: CURRENT_USER_ID })
  } catch (err) {
    console.error('toggleStar error', err)
    t.starred = !nextVal
  }
}

function archiveThread(id) {
  threads.value = threads.value.filter((t) => t.id !== id)
  selectedIds.value.delete(id)
  if (selectedThreadId.value === id) selectedThreadId.value = null
}

function toggleSelect(id) {
  const s = new Set(selectedIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedIds.value = s
}

function toggleSelectAllVisible(e) {
  const checked = e.target.checked
  const s = new Set(selectedIds.value)

  if (checked) filteredThreads.value.forEach((t) => s.add(t.id))
  else filteredThreads.value.forEach((t) => s.delete(t.id))

  selectedIds.value = s
}

function clearSelection() {
  selectedIds.value = new Set()
}

function archiveSelected() {
  const ids = new Set(selectedIds.value)
  threads.value = threads.value.filter((t) => !ids.has(t.id))
  selectedIds.value = new Set()
  if (ids.has(selectedThreadId.value)) selectedThreadId.value = null
}

function markSelectedRead() {
  const ids = selectedIds.value
  threads.value.forEach((t) => {
    if (ids.has(t.id)) t.unread = false
  })
}

function startReply() {
  replyMode.value = 'reply'
}

function startReplyAll() {
  replyMode.value = 'replyAll'
}

function startForward() {
  replyMode.value = 'forward'
  if (!replyText.value.trim() && activeThread.value) {
    replyText.value = `\n\n--- Forwarded message ---\nSubject: ${activeThread.value.subject}\nFrom: ${activeThread.value.sender}\n`
  }
}

function clearDraft() {
  replyText.value = ''
}

function computeToLine(sender) {
  if (!activeThread.value) return ''
  const others = activeThread.value.participants.filter((p) => p !== sender)
  return others.join(', ')
}

async function sendReply() {
  const text = replyText.value.trim()
  if (!text || !activeThread.value) return

  try {
    await replyToThreadApi({
      threadId: activeThread.value.id,
      senderUserId: CURRENT_USER_ID,
      body: text,
    })

    replyText.value = ''
    await selectThread(activeThread.value.id)
    await loadThreads()

    await nextTick()
    scrollToBottom()
  } catch (err) {
    console.error('sendReply error', err)
  }
}

function scrollToTop() {
  if (!scrollBox.value) return
  scrollBox.value.scrollTop = 0
}

function scrollToBottom() {
  if (!scrollBox.value) return
  scrollBox.value.scrollTop = scrollBox.value.scrollHeight
}

async function sendNewConversation() {
  const recipientEmails = parseComposeToEmails(composeTo.value)
  if (recipientEmails.length === 0) {
    console.warn('Compose "To" must be one or more emails (comma-separated).')
    return
  }

  try {
    const res = await createThreadApi({
      subject: composeSubject.value.trim(),
      senderUserId: CURRENT_USER_ID,
      recipientEmails,
      body: composeBody.value.trim(),
    })

    await loadThreads()
    if (res.threadId) await selectThread(res.threadId)

    openCompose.value = false
    composeTo.value = ''
    composeSubject.value = ''
    composeBody.value = ''
  } catch (err) {
    console.error('sendNewConversation error', err)
  }
}

// ---- LIFECYCLE ----
onMounted(async () => {
  await loadThreads()

  const threadId = Number(route.query.threadId)
  if (threadId) {
    await selectThread(threadId)
  }
})

watch(search, loadThreads)
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.mail-page {
  height: 100vh;
  overflow: hidden;
  background: #e9edf1;
  padding: 16px 20px;
  font-family: 'Roboto', sans-serif;
  color: #034750;
  display: flex;
  flex-direction: column;
}

.mail-topbar {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex: 0 0 auto;
}

.page-title {
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  font-weight: 800;
  color: #034750;
}

.page-subtitle {
  margin: 6px 0 0;
  font-size: 16px;
  color: #747474;
}

.compose-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: #00a5b5;
  color: #fff;
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  flex: 0 0 auto;
}

.compose-btn:hover {
  background: #00909e;
  transform: translateY(-1px);
}

.compose-plus {
  font-size: 18px;
  line-height: 1;
}

.mail-shell {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: 460px 1fr;
  background: #ffffff;
  border: 1px solid #d7dde2;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

/* LEFT PANEL */
.mail-sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d7dde2;
  background: #f2f1f2;
  min-width: 0;
  min-height: 0;
}

.sidebar-toolbar {
  padding: 16px;
  border-bottom: 1px solid #d7dde2;
  background: #eceaea;
  flex: 0 0 auto;
}

.search-input {
  width: 100%;
  height: 42px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  background: #fff;
  outline: none;
  color: #034750;
}

.search-input:focus {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3px rgba(0, 165, 181, 0.15);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.filter-chip {
  height: 32px;
  border-radius: 999px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #034750;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background: #e5f7f9;
  border-color: #00a5b5;
}

.filter-chip.active {
  background: #00a5b5;
  border-color: #00a5b5;
  color: #fff;
}

.bulk-toolbar {
  margin-top: 12px;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
}

.bulk-count {
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #034750;
}

.bulk-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.thread-list-header {
  display: grid;
  grid-template-columns: 38px 42px 140px 1fr 74px;
  align-items: center;
  gap: 0;
  padding: 10px 12px;
  border-bottom: 1px solid #d7dde2;
  background: #e8e8e8;
  font-size: 12px;
  font-weight: 700;
  color: #5f6e78;
  flex: 0 0 auto;
}

.header-cell {
  min-width: 0;
}

.thread-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  background: #f2f1f2;
}

.thread-row {
  display: grid;
  grid-template-columns: 38px 42px 140px 1fr 74px;
  align-items: center;
  min-height: 58px;
  padding: 0 12px;
  border-bottom: 1px solid #dde3e8;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease;
}

.thread-row:hover {
  background: #e9f4f6;
}

.thread-row.active {
  background: #dff2f5;
  box-shadow: inset 3px 0 0 #00a5b5;
}

.thread-row.unread {
  background: #f8fcfd;
}

.thread-row.unread .sender-text,
.thread-row.unread .subject-text,
.thread-row.unread .date-text {
  font-weight: 800;
  color: #034750;
}

.cell {
  min-width: 0;
}

.checkbox-cell,
.star-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  font-size: 18px;
  line-height: 1;
}

.star-btn span {
  color: #b8b8b8;
}

.star-btn span.starred {
  color: #f5b301;
}

.sender-text {
  font-size: 13px;
  color: #034750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00a5b5;
  margin-right: 8px;
  vertical-align: middle;
}

.subject-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.subject-text {
  font-size: 13px;
  color: #034750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
}

.subject-sep {
  flex: 0 0 auto;
  color: #9a9a9a;
}

.snippet-text {
  font-size: 13px;
  color: #707070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1 1 auto;
}

.date-text {
  justify-self: end;
  font-size: 12px;
  color: #707070;
  white-space: nowrap;
}

.empty-list {
  padding: 20px 16px;
  font-size: 14px;
  color: #707070;
}

/* RIGHT PANEL */
.mail-reader {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #eef2f5;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #d7dde2;
  background: #f7f7f7;
  flex: 0 0 auto;
}

.reader-title-block {
  min-width: 0;
}

.reader-subject {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 800;
  color: #034750;
}

.reader-participants {
  margin-top: 8px;
  font-size: 14px;
  color: #707070;
}

.meta-label {
  font-weight: 700;
  color: #6f7b84;
}

.reader-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.toolbar-btn {
  height: 36px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #034750;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background: #e5f7f9;
  border-color: #00a5b5;
}

.toolbar-btn.danger {
  color: #a14d4d;
  border-color: #e7b6b6;
}

.message-stack {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 22px;
  background: #eef2f5;
}

.email-card {
  background: #ffffff;
  border: 1px solid #d7dde2;
  border-radius: 14px;
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.email-card-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid #e8eef2;
  background: #f9fbfc;
}

.email-sender-block {
  min-width: 0;
}

.sender-name {
  font-size: 16px;
  font-weight: 800;
  color: #034750;
  margin-bottom: 6px;
}

.email-meta-lines {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #5f6e78;
}

.email-time {
  white-space: nowrap;
  font-size: 12px;
  color: #707070;
  padding-top: 2px;
}

.email-content {
  padding: 18px;
  font-size: 14px;
  line-height: 1.65;
  color: #034750;
  white-space: normal;
  word-break: break-word;
}

/* Reply panel */
.reply-panel {
  border-top: 1px solid #d7dde2;
  padding: 16px 22px 20px;
  background: #f3f6f8;
  flex: 0 0 auto;
}

.reply-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 10px;
}

.reply-mode {
  font-size: 14px;
  font-weight: 800;
  color: #034750;
}

.reply-hint {
  font-size: 12px;
  color: #707070;
}

.reply-textarea {
  width: 100%;
  min-height: 120px;
  max-height: 220px;
  border: 1px solid #cfd7de;
  border-radius: 12px;
  padding: 14px;
  resize: vertical;
  font: inherit;
  font-size: 14px;
  color: #034750;
  outline: none;
  background: #fff;
}

.reply-textarea:focus {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3px rgba(0, 165, 181, 0.15);
}

.reply-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.send-btn {
  height: 38px;
  border: none;
  background: #00a5b5;
  color: #fff;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.2s ease;
}

.send-btn:hover {
  background: #00909e;
}

.send-btn:disabled,
.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty reader */
.empty-reader {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2f5;
}

.empty-reader-state {
  text-align: center;
  max-width: 320px;
  padding: 20px;
}

.empty-reader-title {
  font-size: 20px;
  font-weight: 800;
  color: #034750;
}

.empty-reader-text {
  margin-top: 8px;
  font-size: 14px;
  color: #707070;
  line-height: 1.5;
}

/* Compose modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 100;
}

.compose-modal {
  width: min(760px, 96vw);
  max-height: 90vh;
  overflow: auto;
  background: #f2f1f2;
  border-radius: 18px;
  border: 1px solid #d7dde2;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18);
}

.compose-header {
  padding: 18px 22px;
  border-bottom: 1px solid #d7dde2;
  background: #eceaea;
}

.compose-title {
  font-size: 18px;
  font-weight: 900;
  color: #034750;
}

.compose-body {
  padding: 20px 22px;
}

.compose-field + .compose-field {
  margin-top: 16px;
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 800;
  color: #034750;
}

.compose-input,
.compose-textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #fff;
  outline: none;
  font: inherit;
  font-size: 14px;
  color: #034750;
}

.compose-input {
  height: 42px;
  padding: 0 12px;
}

.compose-textarea {
  padding: 12px 14px;
  resize: vertical;
}

.compose-input:focus,
.compose-textarea:focus {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3px rgba(0, 165, 181, 0.15);
}

.compose-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px 20px;
  border-top: 1px solid #d7dde2;
  background: #f2f1f2;
}

/* Scrollbars */
.thread-list::-webkit-scrollbar,
.message-stack::-webkit-scrollbar,
.compose-modal::-webkit-scrollbar {
  width: 10px;
}

.thread-list::-webkit-scrollbar-thumb,
.message-stack::-webkit-scrollbar-thumb,
.compose-modal::-webkit-scrollbar-thumb {
  background: #cfcfcf;
  border-radius: 999px;
}

/* Responsive */
@media (max-width: 1080px) {
  .mail-page {
    height: auto;
    min-height: 100vh;
    overflow: auto;
    padding: 18px 12px 24px;
  }

  .mail-shell {
    grid-template-columns: 1fr;
    flex: 0 0 auto;
    min-height: 0;
  }

  .mail-sidebar {
    border-right: none;
    border-bottom: 1px solid #d7dde2;
    max-height: 380px;
  }

  .mail-reader {
    min-height: 500px;
  }
}

@media (max-width: 720px) {
  .mail-topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .compose-btn {
    width: 100%;
    justify-content: center;
  }

  .reader-header {
    flex-direction: column;
    align-items: stretch;
  }

  .reader-actions {
    justify-content: flex-start;
  }

  .reply-panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .thread-list-header,
  .thread-row {
    grid-template-columns: 38px 38px 90px 1fr 62px;
  }

  .reader-subject {
    font-size: 22px;
  }
}
</style>
