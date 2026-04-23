<template>
  <div class="live-chat d-flex flex-column h-100">
    <div class="chat-header pa-4 border-b d-flex align-center gap-2">
      <v-icon color="primary" size="20">mdi-circle-medium</v-icon>
      <span class="text-subtitle-2 font-weight-bold">Chat en Vivo</span>
      <v-spacer />
      <span class="text-caption text-medium-emphasis">{{ messages.length }} mensajes</span>
    </div>

    <div ref="scrollContainer" class="chat-messages flex-grow-1 pa-4 overflow-y-auto">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-item mb-4"
        :class="{ 'message-item--own': msg.isOwn }"
      >
        <div class="d-flex gap-2" :class="{ 'flex-row-reverse': msg.isOwn }">
          <v-avatar size="28" class="mt-1 shadow-sm">
            <v-img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`" />
          </v-avatar>
          <div class="message-content">
            <div class="text-caption font-weight-bold mb-1" :class="msg.isOwn ? 'text-right' : 'text-left'">
              {{ msg.user }}
            </div>
            <div class="message-bubble pa-3 rounded-xl" :class="msg.isOwn ? 'bg-primary text-white' : 'bg-surface-variant text-body-2'">
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input pa-4 border-t bg-white">
      <v-text-field
        v-model="newMessage"
        placeholder="Escribe un mensaje..."
        variant="solo-filled"
        density="comfortable"
        hide-details
        rounded="pill"
        @keyup.enter="sendMessage"
      >
        <template #append-inner>
          <v-btn
            icon="mdi-send"
            variant="text"
            color="primary"
            size="small"
            @click="sendMessage"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
const messages = ref([
  { user: 'Sofi', text: '¡Me encanta esta canción! 😍', isOwn: false },
  { user: 'Marcos', text: 'El bajo suena increíble.', isOwn: false },
  { user: 'Tu', text: 'Concuerdo, es de mis favoritas del álbum.', isOwn: true },
])

const newMessage = ref('')
const scrollContainer = ref<HTMLElement | null>(null)

function sendMessage() {
  if (!newMessage.value.trim()) return
  
  messages.value.push({
    user: 'Tu',
    text: newMessage.value,
    isOwn: true
  })
  
  newMessage.value = ''
  scrollToBottom()
  
  // Simulación de respuesta automática
  setTimeout(() => {
    messages.value.push({
      user: 'Bot',
      text: '¡Genial! Gracias por compartir tu opinión.',
      isOwn: false
    })
    scrollToBottom()
  }, 1500)
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

onMounted(scrollToBottom)
</script>

<style scoped>
.live-chat {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.chat-messages {
  scrollbar-width: none;
}
.chat-messages::-webkit-scrollbar { display: none; }

.message-bubble {
  max-width: 200px;
  line-height: 1.4;
}

.bg-primary {
  background: linear-gradient(135deg, var(--color-primary), #ff75a0) !important;
}

.message-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
