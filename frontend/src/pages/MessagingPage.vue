<template>
  <div class="messages-page">
    <!-- Header -->
    <div class="messages-top">
      <div class="text-block">
        <div class="messages-header">Inbox</div>
        <div class="messages-subtitle">View and reply to your conversations</div>
      </div>

      <button class="compose-btn" @click="openCompose = true">+ Compose</button>
    </div>

    <!-- Main Layout -->
    <div class="messages-container">
      <!-- LEFT: Inbox / Threads -->
      <div class="inbox-card">
        <div class="inbox-controls">
          <input v-model="search" class="search" type="text" placeholder="Search mail" />

          <div class="filters">
            <button
              v-for="f in filters"
              :key="f.key"
              class="filter-pill"
              :class="{ active: activeFilter === f.key }"
              @click="activeFilter = f.key"
            >
              {{ f.label }}
            </button>
          </div>

          <!-- Bulk actions (email feel) -->
          <div class="bulk-bar" v-if="selectedIds.size">
            <div class="bulk-left">
              <span class="bulk-count">{{ selectedIds.size }} selected</span>
            </div>
            <div class="bulk-actions">
              <button class="action-btn" @click="markSelectedRead">Mark read</button>
              <button class="action-btn" @click="archiveSelected">Archive</button>
              <button class="action-btn danger" @click="clearSelection">Clear</button>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="thread-list">
          <div
            v-for="t in filteredThreads"
            :key="t.id"
            class="thread-row"
            :class="{ selected: t.id === selectedThreadId, unread: t.unread }"
            @click="selectThread(t.id)"
          >
            <!-- Checkbox -->
            <label class="chk-wrap" @click.stop>
              <input
                type="checkbox"
                :checked="selectedIds.has(t.id)"
                @change="toggleSelect(t.id)"
              />
            </label>

            <!-- Star -->
            <button
              class="star"
              @click.stop="toggleStar(t.id)"
              :title="t.starred ? 'Unstar' : 'Star'"
            >
              <span :class="{ starred: t.starred }">★</span>
            </button>

            <!-- From -->
            <div class="from">{{ t.sender }}</div>

            <!-- Subject + snippet -->
            <div class="subj">
              <span class="subject">{{ t.subject }}</span>
              <span class="dash">—</span>
              <span class="snippet">{{ t.snippet }}</span>
            </div>

            <!-- Date -->
            <div class="date">{{ t.date }}</div>
          </div>

          <div v-if="filteredThreads.length === 0" class="empty">No mail found.</div>
        </div>
      </div>

      <!-- RIGHT: Email thread view -->
      <div class="conversation-card" v-if="activeThread">
        <!-- Email header (subject + participants) -->
        <div class="conversation-header">
          <div class="conv-title">
            <div class="subject-big">{{ activeThread.subject }}</div>
            <div class="participants">
              <span class="meta-label">With:</span>
              {{ activeThread.participants.join(', ') }}
            </div>
          </div>

          <!-- Email toolbar -->
          <div class="conv-actions">
            <button class="action-btn" @click="startReply()">Reply</button>
            <button
              class="action-btn"
              v-if="activeThread.participants.length > 2"
              @click="startReplyAll()"
            >
              Reply all
            </button>
            <button class="action-btn" @click="startForward()">Forward</button>
            <button class="action-btn" @click="archiveThread(activeThread.id)">Archive</button>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Message stack (email style, not bubbles) -->
        <div ref="scrollBox" class="message-list">
          <div v-for="m in activeThread.messages" :key="m.id" class="email-message">
            <div class="email-meta">
              <div class="left">
                <div class="fromline">
                  <span class="meta-label">From:</span>
                  <span class="fromname">{{ m.sender }}</span>
                </div>
                <div class="toline">
                  <span class="meta-label">To:</span>
                  <span class="tonames">{{ computeToLine(m.sender) }}</span>
                </div>
              </div>
              <div class="right">
                <div class="time">{{ m.time }}</div>
              </div>
            </div>

            <div class="email-body" v-html="m.bodyHtml || escapeHtml(m.body)"></div>
          </div>
        </div>

        <!-- Reply composer (email reply style) -->
        <div class="composer">
          <div class="reply-head">
            <div class="reply-title">{{ replyModeLabel }}</div>
            <div class="hint">Enter to send • Shift+Enter for new line</div>
          </div>

          <textarea
            v-model="replyText"
            class="reply-box"
            placeholder="Write your reply..."
            rows="4"
            @keydown.enter.exact.prevent="sendReply()"
          />

          <div class="composer-actions">
            <button class="action-btn" @click="clearDraft" :disabled="!replyText.trim()">
              Discard
            </button>
            <button class="send-btn" :disabled="!replyText.trim()" @click="sendReply">Send</button>
          </div>
        </div>
      </div>

      <!-- Empty Right Panel -->
      <div class="conversation-card empty-right" v-else>
        <div class="empty-state">Select an email to read.</div>
      </div>
    </div>

    <!-- Compose Modal (simple) -->
    <div v-if="openCompose" class="modal-backdrop" @click.self="openCompose = false">
      <div class="modal">
        <div class="modal-title">New Email</div>
        <div class="divider"></div>

        <label class="field-label">To (comma-separated emails)</label>
        <input
          v-model="composeTo"
          class="input"
          placeholder="alice@owp.csus.edu, bob@owp.csus.edu"
        />

        <label class="field-label">Subject</label>
        <input v-model="composeSubject" class="input" placeholder="Subject" />

        <label class="field-label">Message</label>
        <textarea
          v-model="composeBody"
          class="textarea"
          rows="7"
          placeholder="Write your email..."
        />

        <div class="modal-actions">
          <button class="action-btn" @click="openCompose = false">Cancel</button>
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
  if (sameDay) return 'Today'
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
          ? new Date(m.SentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    scrollToBottom()
  } catch (err) {
    console.error('selectThread error', err)
  }
}

// ---- UI ACTIONS ----
async function toggleStar(id) {
  const t = threads.value.find((x) => x.id === id)
  if (!t) return

  const nextVal = !t.starred
  t.starred = nextVal // optimistic UI

  try {
    if (nextVal) await starThreadApi({ threadId: id, userId: CURRENT_USER_ID })
    else await unstarThreadApi({ threadId: id, userId: CURRENT_USER_ID })
  } catch (err) {
    console.error('toggleStar error', err)
    t.starred = !nextVal // rollback
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
onMounted(loadThreads)

watch(search, loadThreads)
</script>

<style scoped>

*,
*::before,
*::after {
  box-sizing: border-box;
}

.messages-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  font-family: 'Roboto', sans-serif;
  color: #034750;
}

.messages-top {
  max-width: 1100px;
  width: 100%;
  margin: 32px auto 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  padding: 0 12px;
}

.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.messages-header {
  font-size: 32px;
  font-weight: 700;
}

.messages-subtitle {
  font-size: 18px;
  font-weight: 400;
  color: #747474;
  margin-top: 6px;
}

.compose-btn {
  background: #00a5b5;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.compose-btn:hover {
  background: #00909e;
}

.messages-container {
  max-width: 1100px;
  width: 100%;
  margin: 18px auto 48px auto;
  display: grid;
  grid-template-columns: 520px 1fr;
  gap: 16px;
  padding: 0 12px;
}

/* Cards */
.inbox-card,
.conversation-card {
  background: #f2f1f2;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 640px;
}

/* Inbox controls */
.inbox-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;
  background: #fff;
}

.search:focus {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3px rgba(0, 165, 181, 0.15);
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
  color: #034750;
}

.filter-pill:hover {
  background: #e5f7f9;
  border-color: #00a5b5;
}
.filter-pill.active {
  background: #00a5b5;
  border-color: #00a5b5;
  color: #fff;
}

.bulk-bar {
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.bulk-count {
  font-weight: 800;
  font-size: 13px;
  color: #034750;
}

.bulk-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.divider {
  border-top: 1px solid #fff;
  width: calc(100% + 32px);
  margin-left: -16px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.chk-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Thread list */
.thread-list {
  overflow-y: auto;
  padding-right: 6px;
  flex: 1;
}

.thread-list::-webkit-scrollbar {
  width: 8px;
}
.thread-list::-webkit-scrollbar-thumb {
  background: #cfcfcf;
  border-radius: 10px;
}

.thread-row {
  display: grid;
  grid-template-columns: 36px 36px 60px 1fr 70px;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 12px;
  transition: 0.15s ease;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #e2e2e2;
}

.thread-row:hover {
  cursor: pointer;
  background: #f7f7f7;
}

.thread-row.selected {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3px rgba(0, 165, 181, 0.12);
}

.thread-row.unread .subject,
.thread-row.unread .from {
  font-weight: 900;
}

.star {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
}

.star span {
  color: #b8b8b8;
}
.star span.starred {
  color: #f5b301;
}

.from {
  font-size: 13px;
  color: #034750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subj {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
}

.subject {
  font-size: 13px;
  color: #034750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dash {
  color: #9a9a9a;
  flex: 0 0 auto;
}

.snippet {
  font-size: 13px;
  color: #707070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.date {
  font-size: 12px;
  color: #707070;
  justify-self: end;
  white-space: nowrap;
}

.empty {
  color: #707070;
  font-size: 14px;
  padding: 16px 6px;
}

/* Conversation */
.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.subject-big {
  font-size: 18px;
  font-weight: 900;
  color: #034750;
}

.participants {
  font-size: 14px;
  color: #707070;
  margin-top: 4px;
}

.meta-label {
  color: #707070;
  font-weight: 700;
  margin-right: 6px;
}

.conv-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
  color: #034750;
}

.action-btn:hover {
  background: #e5f7f9;
  border-color: #00a5b5;
}

.action-btn.danger {
  border-color: #e7b6b6;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 6px;
}

.message-list::-webkit-scrollbar {
  width: 8px;
}
.message-list::-webkit-scrollbar-thumb {
  background: #cfcfcf;
  border-radius: 10px;
}

/* Email message block  */
.email-message {
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
}

.email-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.fromline,
.toline {
  font-size: 13px;
  color: #034750;
  line-height: 1.25;
}

.fromname,
.tonames {
  font-weight: 900;
  color: #034750;
}

.time {
  font-size: 12px;
  color: #707070;
  white-space: nowrap;
}

.email-body {
  font-size: 14px;
  color: #034750;
  line-height: 1.45;
  white-space: pre-wrap;
}

/* Composer */
.composer {
  margin-top: 10px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 14px;
  padding: 10px;
}

.reply-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 2px 2px 8px 2px;
}

.reply-title {
  font-weight: 900;
  color: #034750;
  font-size: 13px;
}

.hint {
  font-size: 12px;
  color: #707070;
}

.reply-box {
  width: 100%;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  color: #034750;
  padding: 10px 12px;
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
}

.send-btn {
  background: #00a5b5;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.send-btn:hover {
  background: #00909e;
}
.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty right */
.empty-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  color: #707070;
  font-size: 16px;
  text-align: center;
  padding: 20px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 50;
}

.modal {
  width: min(600px, 95vw);
  background: #f2f1f2;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e2e2e2;

  overflow: hidden;
  box-sizing: border-box;
}

.modal-title {
  font-size: 18px;
  font-weight: 900;
  color: #034750;
}

.field-label {
  margin-top: 10px;
  display: block;
  font-weight: 800;
  font-size: 13px;
  color: #034750;
}

.input,
.textarea {
  width: 100%;
  margin-top: 6px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  outline: none;

  box-sizing: border-box;
}

.textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

/* Responsive */
@media (max-width: 1000px) {
  .messages-container {
    grid-template-columns: 1fr;
  }
  .inbox-card,
  .conversation-card {
    min-height: auto;
  }
}
</style>
